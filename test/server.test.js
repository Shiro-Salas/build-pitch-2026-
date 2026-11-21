import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

test('recorrido HTTP: permisos, partida completa, pistas, publicación y persistencia', { timeout: 20000 }, async t => {
  const dir = await mkdtemp(path.join(tmpdir(), 'quetzal-test-'));
  const child = spawn(process.execPath, ['server/index.js'], { cwd: fileURLToPath(new URL('../', import.meta.url)), env: { ...process.env, PORT: '0', DATA_DIR: dir, TEACHER_PASSWORD: 'test-teacher', GEMINI_API_KEY: '', GEMINI_MODEL: '' }, stdio: ['ignore', 'pipe', 'pipe'] });
  t.after(() => child.kill());
  const base = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('El servidor no inició.')), 10000);
    child.stdout.on('data', chunk => { const match = chunk.toString().match(/http:\/\/127\.0\.0\.1:\d+/); if (match) { clearTimeout(timer); resolve(match[0]); } });
    child.on('error', error => { clearTimeout(timer); reject(error); });
    child.on('exit', code => { clearTimeout(timer); reject(new Error(`Servidor terminó con código ${code}`)); });
  });
  async function call(route, body, cookie = '', extraHeaders = {}) {
    const response = await fetch(`${base}/api/${route}`, { method: body === undefined ? 'GET' : 'POST', headers: { 'Content-Type': 'application/json', cookie, ...extraHeaders }, body: body === undefined ? undefined : JSON.stringify(body) });
    return { status: response.status, data: await response.json(), cookie: response.headers.get('set-cookie')?.split(';')[0] };
  }
  assert.equal((await call('teacher')).status, 401);
  const student = (await call('session', { role: 'student' })).cookie;
  assert.equal((await call('teacher', undefined, student)).status, 403);
  assert.equal((await call('generate', { mode: 'groups', theme: 'forest' }, student)).status, 403);
  assert.equal((await call('session', { role: 'teacher', password: 'wrong' })).status, 401);
  assert.equal((await call('session', { role: 'student' }, '', { origin: 'https://untrusted.example' })).status, 403);
  const teacher = (await call('session', { role: 'teacher', password: 'test-teacher' })).cookie;
  assert.equal((await call('generate', { mode: 'groups', theme: 'forest' }, teacher)).status, 503);
  const library = (await call('teacher', undefined, teacher)).data.missions;
  let started = (await call('start', { missionId: 'forest' }, student)).data;
  let task = started.task;
  assert.equal((await call('avatar', {accessory:'hat'},student)).status,403);
  assert.equal((await call('tutor',{runId:started.id,taskId:task.id,question:'¿Por qué?'},student)).status,409);
  const wrong = await call('answer', { runId: started.id, taskId: task.id, answer: Array(task.groups).fill(0) }, student);
  assert.equal(wrong.data.correct, false);
  assert.equal((await call('tutor',{runId:started.id,taskId:task.id,question:'¿Por qué?'},student)).data.source,'library');
  assert.equal((await call('hint', { runId: started.id, taskId: task.id }, student)).status, 200);
  for (let i = 0; i < 3; i++) {
    const result = await call('answer', { runId: started.id, taskId: task.id, answer: Array(task.groups).fill(task.each) }, student);
    assert.equal(result.data.correct, true);
    assert.equal((await call('answer', { runId: started.id, taskId: task.id, answer: Array(task.groups).fill(task.each) }, student)).status, 409);
    const next = await call('next', { runId: started.id, taskId: task.id }, student);
    if (i === 2) assert.equal(next.data.complete, true); else task = next.data.task;
  }
  const progress = (await call('progress', undefined, student)).data;
  assert.equal(progress.xp, 45); assert.equal(progress.total, 3); assert.equal(progress.independent, 2); assert.equal(progress.complete, 1);
  assert.equal((await call('avatar',{accessory:'hat'},student)).status,403);
  assert.equal((await call('avatar',{accessory:'none'},student)).data.avatar.equipped,'none');
  assert.equal((await call('pet',{pet:'panda',xp:200},student)).status,403);
  assert.equal((await call('pet',{pet:'quetzal'},student)).data.avatar.pet,'quetzal');
  assert.equal((await call('avatar',{accessory:'crown'},student)).status,403);
  const created=(await call('students',{name:'Otro explorador'},teacher)).data;
  const second=(await call('session',{role:'student',studentId:created.id})).cookie;
  assert.equal((await call('progress',undefined,second)).data.xp,0);
  assert.equal((await call('next',{runId:started.id,taskId:task.id},second)).status,404);
  assert.equal((await call('materials',{title:'Guía',subject:'math',topic:'multiplication',text:'La multiplicación representa una suma repetida de grupos con la misma cantidad.'},student)).status,403);
  assert.equal((await call('materials',{title:'Guía',subject:'math',topic:'multiplication',text:'La multiplicación representa una suma repetida de grupos con la misma cantidad.'},teacher)).status,201);
  assert.equal((await call('missions',undefined,student)).data.find(m=>m.mode==='sequence').challenges,undefined);
  const family = (await call('session', { role: 'family' })).cookie;
  assert.equal((await call('teacher', undefined, family)).status, 403);
  assert.equal((await call('start', { missionId: 'forest' }, family)).status, 403);
  assert.equal((await call('progress', undefined, family)).data.xp, 45);
  const paused = library[0];
  assert.equal((await call('mission', { ...paused, published: false }, student)).status, 403);
  assert.equal((await call('mission', { ...paused, published: false }, teacher)).status, 200);
  assert.equal((await call('start', { missionId: paused.id }, student)).status, 404);
  assert.ok(!(await call('missions', undefined, student)).data.some(m => m.id === paused.id));
  const persisted = JSON.parse(await readFile(path.join(dir, 'demo.json'), 'utf8'));
  assert.equal(persisted.xp, 45); assert.equal(persisted.attempts.length, 4);
  for (const asset of ['/', '/app.js', '/style.css', '/quetzal.svg','/world.js','/world.css','/world-map.png','/school.js','/learning.js','/reports.js','/reports.css','/pets.js','/collection.css']) assert.equal((await fetch(base + asset)).status, 200);
  assert.equal((await fetch(base + '/.env')).status, 404);
  assert.equal((await call('pet',{pet:'panda'},family)).status,403);
  for(let round=0;round<4;round++) {
    const run=(await call('start',{missionId:'volcano'},student)).data;let task=run.task;
    for(let i=0;i<3;i++) {
      await call('answer',{runId:run.id,taskId:task.id,answer:task.groups*task.each},student);
      const next=(await call('next',{runId:run.id,taskId:task.id},student)).data;
      if(!next.complete)task=next.task;
    }
  }
  assert.equal((await call('pet',{pet:'panda'},student)).data.avatar.pet,'panda');
  assert.equal((await call('avatar',{accessory:'bow'},student)).data.avatar.equipped,'bow');
  assert.equal((await call('progress',undefined,student)).data.xp,225);
  assert.equal((await call('pet',{pet:'fox'},student)).status,403);
  assert.equal((await call('pet',{pet:'panda'},second)).status,403);
  const saved=JSON.parse(await readFile(path.join(dir,'demo.json'),'utf8'));
  assert.equal(saved.students[0].pet,'panda');assert.equal(saved.students[0].accessory,'bow');
});
