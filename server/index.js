import http from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, renameSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { randomUUID, timingSafeEqual } from 'node:crypto';
import { newState, makeTask, publicTask, evaluate, explanation, stats, observation } from './game.js';
import { generateAdventure, validateDraft, explainDoubt, geminiFailure } from './gemini.js';
import { courses, accessories, pets, extraLibrary, courseForMode, topicForMode } from './curriculum.js';
import { extractMaterial } from './materials.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const dataDir = process.env.DATA_DIR || path.join(root, 'data');
mkdirSync(dataDir, { recursive: true });
const dataFile = path.join(dataDir, 'demo.json');
let state;
try { state = JSON.parse(readFileSync(dataFile, 'utf8')); }
catch (error) { if (error.code !== 'ENOENT') throw error; state = newState(); }
for (const mission of state.missions) mission.coachHint ||= 'Kiki te acompaña: observa los grupos y busca qué cantidad se repite en todos.';
state.students ||= [{id:'demo',name:'Explorador',xp:state.xp || 0,accessory:'none'}];
state.materials ||= [];
for (const m of state.missions) { m.subject ||= courseForMode(m.mode).id; m.topic ||= topicForMode(m.mode).id; }
for (const m of extraLibrary) if (!state.missions.some(v=>v.id===m.id)) state.missions.push(structuredClone(m));
const publicMission = ({challenges, ...mission}) => mission;
const tutorPending = new Set();
function save() { writeFileSync(`${dataFile}.tmp`, JSON.stringify(state)); renameSync(`${dataFile}.tmp`, dataFile); }
const sessions = new Map();
const limits = new Map();
let generating = false;
let geminiIssue = null;
const configuredPassword = process.env.TEACHER_PASSWORD;
const teacherPassword = configuredPassword || 'quetzal-demo';
const geminiConfigured = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_MODEL && configuredPassword);
const server = http.createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
  const send = (status, value) => { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(value)); };
  const fail = (status, message) => { const error = new Error(message); error.status = status; throw error; };
  try {
    const url = new URL(req.url, 'http://localhost');
    if (!url.pathname.startsWith('/api/')) {
      const files = { '/': ['index.html', 'text/html'], '/app.js': ['app.js', 'text/javascript'], '/style.css': ['style.css', 'text/css'], '/quetzal.svg': ['quetzal.svg', 'image/svg+xml'] };
      Object.assign(files, { '/world.js': ['world.js', 'text/javascript'], '/world.css': ['world.css', 'text/css'], '/world-map.png': ['world-map.png', 'image/png'] });
      Object.assign(files, { '/school.js': ['school.js', 'text/javascript'], '/learning.js': ['learning.js', 'text/javascript'] });
      Object.assign(files, { '/reports.js': ['reports.js', 'text/javascript'], '/reports.css': ['reports.css', 'text/css'] });
      Object.assign(files, { '/pets.js': ['pets.js', 'text/javascript'], '/collection.css': ['collection.css', 'text/css'] });
      const file = files[url.pathname];
      if (!file || req.method !== 'GET') return send(404, { error: 'No encontrado.' });
      res.writeHead(200, { 'Content-Type': `${file[1]}; charset=utf-8`, 'Cache-Control': 'no-cache' });
      return res.end(readFileSync(path.join(root, 'public', file[0])));
    }
    if (req.method === 'POST') {
      if (req.headers['sec-fetch-site'] === 'cross-site' || (req.headers.origin && req.headers.origin !== `http://${req.headers.host}`)) fail(403, 'Solicitud de otro origen no permitida.');
      if (!(req.headers['content-type'] || '').startsWith('application/json')) fail(415, 'Se requiere JSON.');
    }
    let body = {};
    if (req.method === 'POST') {
      let content = '';
      for await (const chunk of req) { content += chunk; if (Buffer.byteLength(content) > (url.pathname === '/api/materials' ? 3000000 : 50000)) fail(413, 'Solicitud demasiado grande.'); }
      try { body = JSON.parse(content || '{}'); } catch { fail(400, 'JSON inválido.'); }
      if (!body || typeof body !== 'object' || Array.isArray(body)) fail(400, 'Solicitud inválida.');
    }
    const cookie = (req.headers.cookie || '').split(';').find(v => v.trim().startsWith('session='))?.trim().slice(8);
    let session = sessions.get(cookie);
    if (session && session.expires < Date.now()) { sessions.delete(cookie); session = undefined; }
    function role(...allowed) { if (!session) fail(401, 'Inicia una sesión.'); if (!allowed.includes(session.role)) fail(403, 'Tu perfil no tiene acceso a esta función.'); }
    function rate(key, max, windowMs) {
      const now = Date.now();
      const used = (limits.get(key) || []).filter(t => now - t < windowMs);
      if (used.length >= max) fail(429, 'Espera un momento antes de volver a intentarlo.');
      limits.set(key, [...used, now]);
    }
    const route = `${req.method} ${url.pathname}`;
    if (route === 'GET /api/status') return send(200, { role: session?.role || null, studentId:session?.studentId || 'demo', geminiConfigured, demoPassword: !configuredPassword, demo: true });
    if (route === 'POST /api/session') {
      rate('login', 30, 60000);
      if (!['student', 'teacher', 'family'].includes(body.role)) fail(400, 'Perfil inválido.');
      if (body.role === 'teacher') {
        const actual = Buffer.from(typeof body.password === 'string' ? body.password : '');
        const expected = Buffer.from(teacherPassword);
        if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) fail(401, 'Contraseña incorrecta.');
      }
      const studentId = body.studentId || session?.studentId || 'demo';
      if (!state.students.some(s=>s.id===studentId)) fail(400,'Selecciona un estudiante válido.');
      if (cookie) sessions.delete(cookie);
      for (const [id, s] of sessions) if (s.expires < Date.now()) sessions.delete(id);
      const id = randomUUID();
      sessions.set(id, { role: body.role, studentId, expires: Date.now() + 8 * 3600000 });
      res.setHeader('Set-Cookie', `session=${id}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800`);
      return send(200, { role: body.role, studentId });
    }
    if (route === 'GET /api/missions') { role('student', 'teacher', 'family'); return send(200, state.missions.filter(m => m.published).map(publicMission)); }
    if (route === 'GET /api/progress') { role('student', 'teacher', 'family'); return send(200, stats(state, session.studentId)); }
    if (route === 'GET /api/roster') { role('student','teacher','family'); return send(200,{students:state.students.map(({id,name})=>({id,name})),courses}); }
    if (route === 'GET /api/teacher') { role('teacher'); const selected=url.searchParams.get('student')||session.studentId; if (!state.students.some(s=>s.id===selected)) fail(404,'Estudiante no encontrado.'); return send(200,{missions:state.missions,materials:state.materials,progress:observation(state,selected),students:state.students.map(s=>observation(state,s.id)),courses,geminiConfigured,geminiIssue}); }
    if (route === 'POST /api/students') {
      role('teacher'); if (typeof body.name!=='string'||body.name.trim().length<2||body.name.length>40) fail(400,'Usa un alias de dos a cuarenta caracteres.');
      if(state.students.length>=40) fail(409,'Esta demo admite hasta cuarenta exploradores.');
      const student={id:randomUUID(),name:body.name.trim(),xp:0,accessory:'none'};state.students.push(student);save();return send(201,{id:student.id,name:student.name});
    }
    if (route === 'POST /api/avatar') {
      role('student'); const student=state.students.find(s=>s.id===session.studentId), accessory=accessories.find(a=>a.id===body.accessory);
      if(!accessory) fail(400,'Accesorio inválido.'); if(student.xp<accessory.seeds) fail(403,'Este accesorio todavía no se ha desbloqueado.');
      student.accessory=accessory.id;save();return send(200,stats(state,student.id));
    }
    if (route === 'POST /api/pet') {
      role('student');const student=state.students.find(s=>s.id===session.studentId),pet=pets.find(p=>p.id===body.pet);
      if(!pet) fail(400,'Mascota inválida.');if(student.xp<pet.seeds)fail(403,'Esta mascota todavía no se ha desbloqueado.');
      student.pet=pet.id;save();return send(200,stats(state,student.id));
    }
    if (route === 'POST /api/materials') {
      role('teacher'); rate('uploads',5,60000); if(state.materials.length>=50) fail(409,'La biblioteca admite hasta cincuenta materiales.');
      try { const material=await extractMaterial(body);state.materials.push(material);save();return send(201,material); } catch(error){ fail(400,error.message); }
    }
    if (route === 'POST /api/generate') {
      role('teacher');
      if (!geminiConfigured) fail(503, 'Configura GEMINI_API_KEY, GEMINI_MODEL y TEACHER_PASSWORD en .env y reinicia el servidor.');
      rate('generation', 5, 60000); rate('daily-generation', 50, 86400000);
      if (generating) fail(429, 'Ya se está preparando una aventura.');
      if (state.missions.length >= 100) fail(409, 'La biblioteca demo alcanzó su límite de cien propuestas.');
      const material=body.materialId ? state.materials.find(m=>m.id===body.materialId) : null;
      if(body.materialId && !material) fail(404,'Material no encontrado.');
      if(material && (material.subject!==courseForMode(body.mode)?.id || material.topic!==topicForMode(body.mode)?.id)) fail(400,'El material y la mecánica deben pertenecer al mismo tema.');
      generating = true;
      try {
        const mission = await generateAdventure({ mode: body.mode, theme: body.theme, material, apiKey: process.env.GEMINI_API_KEY, model: process.env.GEMINI_MODEL });
        geminiIssue=null; state.missions.push(mission); save(); return send(201, mission);
      } catch (error) { geminiIssue={...geminiFailure(error),at:new Date().toISOString()};fail(502,geminiIssue.message); }
      finally { generating = false; }
    }
    if (route === 'POST /api/mission') {
      role('teacher');
      const mission = state.missions.find(m => m.id === body.id);
      if (!mission) fail(404, 'Aventura no encontrada.');
      if (typeof body.published !== 'boolean') fail(400, 'Estado de publicación inválido.');
      let content;
      try { content = validateDraft({ ...mission, ...body, challenges:body.challengeJson ? JSON.parse(body.challengeJson) : mission.challenges, mode: mission.mode, theme: mission.theme }); }
      catch (error) { fail(400, error.message); }
      Object.assign(mission, content, { published: body.published, reviewedAt: new Date().toISOString(), reviewedBy: 'docente-demo', version: (mission.version || 0) + 1 });
      save(); return send(200, mission);
    }
    if (route === 'POST /api/start') {
      role('student'); rate('start', 20, 60000);
      const mission = state.missions.find(m => m.id === body.missionId && m.published);
      if (!mission) fail(404, 'El docente todavía no ha habilitado esta aventura.');
      if (state.runs.length >= 2000) fail(409, 'La demostración alcanzó su límite de partidas.');
      const run = { id: randomUUID(), studentId:session.studentId, mission: structuredClone(mission), tasks: [makeTask(mission.mode, state.attempts.filter(a => a.try === 1 && (a.studentId||'demo')===session.studentId && a.mode===mission.mode), [], mission)], complete: false };
      state.runs.push(run); save(); return send(201, { id: run.id, mission: publicMission(run.mission), task: publicTask(run.tasks[0]), round: 1 });
    }
    if (['POST /api/answer', 'POST /api/hint', 'POST /api/next', 'POST /api/tutor'].includes(route)) {
      role('student');
      const run = state.runs.find(r => r.id === body.runId && (r.studentId||'demo')===session.studentId);
      if (!run) fail(404, 'Partida no encontrada.');
      if (!state.missions.some(m => m.id === run.mission.id && m.published)) fail(403, 'El docente ha pausado esta aventura.');
      const task = run.tasks.at(-1);
      if (body.taskId !== task.id) fail(409, 'Este reto ya cambió. Vuelve a abrir la aventura.');
      if (route === 'POST /api/tutor') {
        if(!task.tries) fail(409,'Primero intenta resolver el reto. Después puedes preguntar.');
        if(typeof body.question!=='string'||body.question.trim().length<3||body.question.length>300) fail(400,'Escribe una duda breve sobre este reto.');
        if(/@|\b\d{7,}\b/.test(body.question)) fail(400,'No escribas correos ni teléfonos. Pregunta solo sobre el ejercicio.');
        rate('tutor-'+session.studentId,8,60000);rate('tutor-day-'+session.studentId,40,86400000);rate('tutor-global',200,86400000);
        if(tutorPending.has(task.id)||tutorPending.size>=3) fail(429,'Kiki está respondiendo. Espera un momento.');
        if(!task.solved) task.hints=Math.max(task.hints,1);save();tutorPending.add(task.id);
        try { const result=await explainDoubt({task,question:body.question.trim(),material:state.materials.find(m=>m.id===run.mission.materialId),apiKey:geminiConfigured?process.env.GEMINI_API_KEY:'',model:process.env.GEMINI_MODEL}); if(result.source==='gemini')geminiIssue=null;return send(200,result); }
        catch(error) { geminiIssue={...geminiFailure(error),at:new Date().toISOString()};return send(200,{answer:explanation(task,true),source:'library',reasonCode:geminiIssue.code,notice:geminiIssue.message+' Esta es la explicación preparada del reto, no una respuesta de la IA a tu pregunta.'}); }
        finally { tutorPending.delete(task.id); }
      }
      if (route === 'POST /api/next') {
        if (!task.solved) fail(409, 'Completa primero este reto.');
        if (run.complete) return send(200, { complete: true, progress: stats(state,session.studentId), ending: run.mission.ending });
        run.tasks.push(makeTask(run.mission.mode, state.attempts.filter(a => a.try === 1 && (a.studentId||'demo')===session.studentId && a.mode===run.mission.mode), run.tasks, run.mission));
        save(); return send(200, { task: publicTask(run.tasks.at(-1)), round: run.tasks.length });
      }
      if (task.solved) fail(409, 'Este reto ya está completo. Continúa al siguiente.');
      if (route === 'POST /api/hint') {
        task.hints = Math.min(3, task.hints + 1); save();
        return send(200, { hint: `${run.mission.coachHint || ''} ${explanation(task, task.hints >= 2)}`.trim(), hints: task.hints });
      }
      let result;
      try { result = evaluate(task, body.answer); } catch (error) { fail(400, error.message); }
      if (task.tries >= 30) fail(409, 'Has practicado mucho este reto. Empieza una nueva aventura para continuar.');
      task.tries++;
      state.attempts.push({ studentId:session.studentId, subject:run.mission.subject || courseForMode(task.mode).id, topic:run.mission.topic || topicForMode(task.mode).id, runId: run.id, taskId: task.id, mode: task.mode, correct: result.correct, error: result.correct ? null : result.error, hints: task.hints, try: task.tries, at: new Date().toISOString(), durationMs: Date.now() - task.started });
      if (result.correct) {
        task.solved = true; state.xp += 10; state.students.find(s=>s.id===session.studentId).xp += 10;
        if (run.tasks.length === 3) { run.complete = true; state.xp += 15; state.students.find(s=>s.id===session.studentId).xp += 15; }
      }
      save();
      return send(200, { correct: result.correct, feedback: result.correct ? `¡Lo descubriste! ${explanation(task, true)}` : `${result.error === 'added_factors' ? 'Parece que sumaste los dos números. Vamos a ver los grupos. ' : '¡Probemos otra vez! '} ${explanation(task)}`, complete: run.complete, xp: state.students.find(s=>s.id===session.studentId).xp, progress:stats(state,session.studentId) });
    }
    send(404, { error: 'Ruta no encontrada.' });
  } catch (error) { send(error.status || 500, { error: error.status ? error.message : 'No pudimos completar la acción. Inténtalo de nuevo.' }); }
});
server.requestTimeout = 20000;
server.listen(Number(process.env.PORT || 3000), '127.0.0.1', () => console.log(`Sabionautas: http://127.0.0.1:${server.address().port}`));
