import { petIllustration } from './pets.js';
import { platformBoard, applyReportStyles } from './reports.js';
import { configureSchool, teacherView, materialView, familyView, observatoryView, skillCards, collectChallenges } from './school.js';
import { learningBoard, tutorPanel, previewTask, previewCheck } from './learning.js';
import { configureWorld, childShell, worldHome, handleWorldAction, playSound, celebrate, showAvatarCloset, streakPanel } from './world.js';
const $ = selector => document.querySelector(selector);
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const names = { groups: 'Construye grupos', bridge: 'Une las sumas', market: 'Descubre el total', sequence:'Ordena el cuento', classify:'Detectives de la naturaleza' };
const themeNames = { forest: 'Bosque de los quetzales', lake: 'Lago de las luciérnagas', volcano: 'Valle de los volcanes' };
let state = { role: null, view: 'home', missions: [], progress: {}, status: {}, teacher: null, game: null, busy: false };

configureWorld({ getState: () => state, shell, bird, petIllustration, escape, speak, toast, render });
configureSchool({getState:()=>state,shell,escape,heading,metricCards,history,names,streakPanel});

async function api(url, body) {
  const response = await fetch(`/api/${url}`, body === undefined ? {} : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'No pudimos conectar con el servidor.');
  return data;
}
function toast(message) { $('#toast').textContent = message; $('#toast').classList.add('visible'); clearTimeout(toast.timer); toast.timer = setTimeout(() => $('#toast').classList.remove('visible'), 6000); }
function speak(text) {
  if (!('speechSynthesis' in window)) return toast('La narración no está disponible en este navegador. Puedes leer todas las instrucciones.');
  speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'es-GT'; utterance.rate = 0.85; speechSynthesis.speak(utterance);
}
function stopSpeech() { if ('speechSynthesis' in window) speechSynthesis.cancel(); }
function fruit(count) { return Array(count).fill('<span class="fruit" aria-hidden="true">●</span>').join(''); }
function bird(className = '') {
  const avatar=state.progress.avatar, accessory=avatar?.accessories.find(a=>a.id===avatar.equipped),pet=avatar?.pet||'quetzal';
  return `<span class="avatar-art pet-${pet} ${className}">${petIllustration(pet)}${accessory&&accessory.id!=='none'?`<span class="avatar-accessory accessory-${accessory.id}" aria-hidden="true">${accessory.icon}</span>`:''}</span>`;
}
function landscape(theme = 'forest', small = false) {
  return `<div class="landscape ${theme} ${small ? 'small' : ''}" aria-hidden="true"><div class="sun"></div><div class="cloud cloud-one"></div><div class="cloud cloud-two"></div><div class="mountain mountain-one"></div><div class="mountain mountain-two"></div><div class="hill hill-back"></div><div class="hill hill-front"></div><div class="tree tree-one"></div><div class="tree tree-two"></div><div class="river"></div><span class="spark spark-one">✦</span><span class="spark spark-two">✧</span>${bird('scene-bird')}<div class="scene-label">${theme === 'forest' ? 'UN BOSQUE POR DESCUBRIR' : theme === 'lake' ? 'CADA SUMA ABRE UN CAMINO' : 'UNA FERIA LLENA DE SORPRESAS'}</div></div>`;
}

function shell(content) {
  if (state.role === 'student' && state.view !== 'login') return childShell(content);
  document.body.classList.remove('play-mode');
  const teacher = state.role === 'teacher', family = state.role === 'family';
  const nav = teacher ? [['teacher', '▦', 'Mi clase'], ['materials','▤','Material de clase'], ['observatory', '◉', 'Observatorio']] : family ? [['family', '⌂', 'En familia']] : [['home', '⌂', 'Mis aventuras'], ['progress', '✧', 'Mis descubrimientos']];
  $('#app').innerHTML = `<aside class="sidebar"><a class="brand" href="/" aria-label="Sabionautas, inicio">${bird()}<span>sabionautas<span class="brand-sub">APRENDE · EXPLORA · DESCUBRE</span></span></a><div class="class-label">TERCERO PRIMARIA <span>Aprendizaje · Guatemala</span></div><nav aria-label="Principal">${nav.map(([id, icon, label]) => `<button data-nav="${id}" class="nav-item ${state.view === id || id === 'home' && state.view === 'game' ? 'active' : ''}"><span aria-hidden="true">${icon}</span>${label}</button>`).join('')}</nav><div class="sidebar-note"><span class="leaf">✳</span><strong>A tu ritmo, a tu manera.</strong><p>Cada intento es una nueva oportunidad para descubrir.</p></div><div class="demo-label">DEMO DEL HACKATHON<span>Perfiles de demostración</span></div></aside><div class="page"><header class="topbar"><span class="breadcrumb">${teacher ? 'Espacio docente' : family ? 'Acompañamiento familiar' : 'Tu espacio para explorar'}</span><div class="profile-switch"><label for="role">Vista demo</label><select id="role" aria-label="Vista demo"><option value="student" ${!teacher && !family ? 'selected' : ''}>Estudiante</option><option value="teacher" ${teacher ? 'selected' : ''}>Docente</option><option value="family" ${family ? 'selected' : ''}>Familia</option></select><span class="avatar">${teacher ? 'D' : family ? 'F' : 'E'}</span></div></header><main id="main" tabindex="-1">${content}</main><footer>Hecho para aprender con curiosidad. <span>Sabionautas · Guatemala</span></footer></div>`;
}
function heading(kicker, title, description) { return `<div class="page-heading"><span class="eyebrow">${kicker}</span><h1>${title}</h1><p>${description}</p></div>`; }
function home() { worldHome(); }

function initializeTask(task, round) {
  Object.assign(state.game, { task, round, answer: task.mode === 'groups' ? Array(task.groups).fill(0) : ['bridge','sequence'].includes(task.mode) ? [] : task.mode==='classify' ? Array(task.options.length).fill(-1) : '', feedback: '', solved: false, hints: 0, counted: [], selectedItem:task.mode==='classify'?0:null, answered:false, tutorMessages:[] });
}
async function start(id) {
  if (!id) return;
  const run = await api('start', { missionId: id });
  state.game = { ...run, preview: false }; initializeTask(run.task, run.round); state.view = 'game'; render(); window.scrollTo(0, 0);
}
function instruction(t) {
  if(t.mode==='sequence') return '¿Qué pasó primero, después y al final?';
  if(t.mode==='classify') return '¿Es un ser vivo o un objeto sin vida?';
  if (t.mode === 'groups') return `Prepara ${t.groups} canastas con ${t.each} frutas en cada una.`;
  if (t.mode === 'bridge') return `Construye un puente con ${t.groups} piedras. Cada piedra debe sumar ${t.each}.`;
  return `Hay ${t.groups} puestos con ${t.each} frutas en cada uno. ¿Cuántas frutas hay en total?`;
}
function game() {
  const g = state.game, t = g.task;
  const question = instruction(t);
  let board;
  if (t.mode === 'groups') {
    board = `<div class="fruit-tray"><button class="fruit-source" data-fruit-source aria-label="Naranja para arrastrar a una canasta" ${g.solved ? 'disabled' : ''}><span aria-hidden="true">🍊</span></button><div><strong>¡Una naranja para cada amigo!</strong><span>Arrástrala a una canasta. También puedes tocar la canasta.</span></div></div><div class="baskets">${g.answer.map((n, i) => `<div class="basket-wrap"><span class="basket-label">Canasta ${i + 1}</span><button class="basket ${n === t.each ? 'basket-ready' : ''}" data-basket="${i}" data-add="${i}" aria-label="Poner una fruta en la canasta ${i + 1}" ${n >= 12 || g.solved ? 'disabled' : ''}><div class="fruits">${fruit(n)}</div><span class="basket-count" aria-label="${n} frutas">${n}</span></button><div class="counter"><button data-remove="${i}" aria-label="Quitar una fruta de la canasta ${i + 1}" ${n === 0 || g.solved ? 'disabled' : ''}>−</button><button data-add="${i}" aria-label="Añadir una fruta a la canasta ${i + 1}" ${n >= 12 || g.solved ? 'disabled' : ''}>+</button></div></div>`).join('')}</div><p class="board-help">Toca o arrastra para añadir. Usa − si quieres quitar una fruta.</p>`;
  } else if (t.mode === 'bridge') {
    board = platformBoard(g,bird);
  } else if (['sequence','classify'].includes(t.mode)) {
    board = learningBoard(g,escape);
  } else {
    board = `<div class="market-stalls">${Array.from({ length: t.groups }, (_, i) => `<div class="stall"><div class="awning"></div><span class="basket-label">Puesto ${i + 1}</span><div class="fruits">${Array.from({length:t.each}, (_,j) => `<button class="count-fruit ${g.counted.includes(`${i}-${j}`) ? 'counted' : ''}" data-count-fruit="${i}-${j}" aria-label="Contar fruta ${j+1} del puesto ${i+1}" aria-pressed="${g.counted.includes(`${i}-${j}`)}" ${g.solved ? 'disabled' : ''}><span aria-hidden="true">🍊</span>${g.counted.includes(`${i}-${j}`) ? '<span class="count-mark" aria-hidden="true">✓</span>' : ''}</button>`).join('')}</div></div>`).join('')}</div><p class="counting-help">Toca cada fruta para marcarla. <strong>${g.counted.length ? `Ya contaste ${g.counted.length}.` : '¡Que no se quede ninguna!'}</strong></p><label class="answer-label" for="total">En total hay <input id="total" type="number" inputmode="numeric" min="0" max="200" value="${escape(g.answer)}" ${g.solved ? 'disabled' : ''} autocomplete="off"> frutas.</label><div class="number-pad" aria-label="Teclado de números">${[1,2,3,4,5,6,7,8,9,0].map(n => `<button data-digit="${n}" ${g.solved ? 'disabled' : ''}>${n}</button>`).join('')}<button data-digit="erase" aria-label="Borrar último número" ${g.solved ? 'disabled' : ''}>⌫</button></div>`;
  }
  shell(`<div class="game-top"><button class="button subtle" data-nav="${g.preview ? 'teacher' : 'home'}">${g.preview ? 'Volver a la revisión' : 'Volver al mapa'}</button><span class="tag">${g.preview ? 'Vista previa docente · No registra progreso' : 'Tu aventura'} · Reto ${g.round} de 3</span><div class="round-progress" aria-label="Reto ${g.round} de 3">${[1, 2, 3].map(n => `<span class="${n < g.round || n === g.round && g.solved ? 'done' : ''}">★</span>`).join('')}</div></div><section class="game-card ${g.mission.theme}"><div class="game-title"><span class="eyebrow">${themeNames[g.mission.theme]} · ${names[t.mode]}</span><h1>${escape(g.mission.title)}</h1><p>${escape(g.mission.intro)}</p></div><div class="guide">${bird()}<div><span class="eyebrow">TU COMPAÑERO DICE</span><h2>${question}</h2></div><button class="audio-button" data-speak="${escape(question)}" aria-label="Escuchar instrucciones">♫</button></div><div class="game-board">${board}</div><div class="feedback ${g.solved ? 'success' : ''}" role="status" aria-live="polite">${escape(g.feedback || 'Prueba tus ideas. Si necesitas ayuda, Kiki tiene una pista para ti.')}</div>${tutorPanel(g,escape)}<div class="game-controls"><button class="button subtle" data-hint ${g.solved ? 'disabled' : ''}>✧ Dame una pista ${g.hints ? `(${g.hints})` : ''}</button>${g.solved ? '<button class="button primary" data-next>Continuar la aventura</button>' : '<button class="button primary" data-check>¡Listo, Kiki!</button>'}</div><p class="game-footnote">Cada reto completado suma 10 créditos. Las pistas te ayudan a aprender, sin quitarte recompensas.</p></section>`);
}
function completed() {
  shell(`<section class="completion"><div class="celebration">✦ ${bird()} ✧</div><span class="eyebrow">AVENTURA COMPLETADA</span><h1>¡Mira todo lo que descubriste!</h1><p>${escape(state.game.mission.ending)}</p><div class="reward">✦ +45 créditos <span>Por explorar y completar tus tres retos</span></div><p>${state.game.task.mode==='sequence'?'¡Cada historia tiene un principio, un después y un final!':state.game.task.mode==='classify'?'¡Observar nos ayuda a entender la naturaleza!':'Los grupos iguales se pueden contar con una suma repetida. ¡Eso es multiplicar!'}</p><button class="button primary" data-nav="${state.game.preview ? 'teacher' : 'home'}">${state.game.preview ? 'Volver a la revisión' : 'Volver a explorar'}</button></section>`);
}
function metricCards(p) {
  return `<div class="metrics"><article><span>Retos intentados</span><strong>${p.total}</strong><small>Una primera respuesta por reto</small></article><article><span>Sin ayuda, al primer intento</span><strong>${p.accuracy === null ? '—' : `${p.accuracy}%`}</strong><small>${p.independent} de ${p.total} retos</small></article><article><span>Aventuras completadas</span><strong>${p.complete}</strong><small>Tres retos por aventura</small></article></div>`;
}
function history(p) {
  return `<section class="panel"><h2>Los últimos descubrimientos</h2><p>Verde: respuesta correcta al primer intento y sin pistas. Ámbar: hubo errores o apoyo.</p><div class="history">${p.history?.length ? p.history.map((h, i) => `<div class="history-item"><div class="history-dot ${h.correct ? 'independent' : 'supported'}" aria-label="Reto ${i + 1}: ${h.correct ? 'sin ayuda' : 'con apoyo'}">${h.correct ? '✓' : '✧'}</div><small>${names[h.mode]}</small></div>`).join('') : '<p>Todavía no hay intentos. Completa una aventura para comenzar.</p>'}</div></section>`;
}
function progress() {
  shell(`${heading('PASO A PASO', 'Cada descubrimiento cuenta.', 'Aquí están los descubrimientos de tu explorador.')} ${metricCards(state.progress)}${history(state.progress)}<section class="panel soft"><h2>Tu colección de créditos</h2><div class="seed-total">✦ ${state.progress.xp}</div><p>10 créditos por reto completado y 15 al terminar una aventura. Equivocarte o pedir pistas no te quita créditos.</p></section>`);
}
function family() { familyView(); }

function login() {
  shell(`${heading('ESPACIO DOCENTE', 'Acompaña cada descubrimiento.', 'Revisa aventuras, habilita contenidos y observa evidencias de aprendizaje.')}<form class="panel login-form" id="login-form"><label for="password">Contraseña docente</label><input id="password" name="password" type="password" autocomplete="current-password" required><button class="button primary" type="submit">Entrar al espacio docente</button>${state.status.demoPassword ? '<p>Modo local de demostración. Contraseña: <code>quetzal-demo</code>. Configura TEACHER_PASSWORD en .env para cambiarla.</p>' : ''}<p>Solo el docente puede publicar aventuras y consultar el observatorio.</p></form>`);
}
function teacher() { teacherView(); }

function observatory() { observatoryView(); }

function render() {
  ({ home, game, completed, progress, family, login, teacher, observatory, materials:materialView }[state.view] || home)();
  applyReportStyles();
}
async function refresh() {
  const [missions,progress,roster] = await Promise.all([api('missions'),api('progress'),api('roster')]);
  Object.assign(state,{missions,progress,students:roster.students,courses:roster.courses});
  if (state.role === 'teacher') state.teacher = await api('teacher'+(state.selectedStudent?'?student='+encodeURIComponent(state.selectedStudent):''));
}
async function navigate(view) { stopSpeech(); if (!(view === 'teacher' && state.game?.preview && ['game', 'completed'].includes(state.view))) await refresh(); state.view = view; render(); $('#main').focus({ preventScroll: true }); window.scrollTo(0, 0); }

document.addEventListener('change', async event => {
  if(event.target.id==='generator-subject'){state.generatorSubject=event.target.value;return render();}
  if(event.target.id==='material-subject'){const course=state.courses.find(c=>c.id===event.target.value);$('#material-topic').innerHTML=course.topics.map(t=>`<option value="${t.id}">${escape(t.name)}</option>`).join('');return;}
  if(event.target.id==='teacher-student'){state.selectedStudent=event.target.value;try{await navigate('observatory');}catch(error){toast(error.message);}return;}
  if(event.target.id==='learner'){try{await api('session',{role:state.role,studentId:event.target.value});await navigate(state.role==='family'?'family':'home');}catch(error){toast(error.message);}return;}
  if (event.target.id !== 'role') return;
  try {
    if (event.target.value === 'teacher' && state.role !== 'teacher') { state.view = 'login'; render(); return; }
    if (event.target.value !== state.role) { const result = await api('session', { role: event.target.value }); state.role = result.role; }
    await navigate(state.role === 'teacher' ? 'teacher' : state.role === 'family' ? 'family' : 'home');
  } catch (error) { toast(error.message); }
});
document.addEventListener('input', event => { if (event.target.id === 'total') state.game.answer = event.target.value; });

document.addEventListener('click', async event => {
  const button = event.target.closest('button');
  if (!button || button.disabled || state.busy) return;
  try {
    if (handleWorldAction(button)) return;
    if(button.dataset.pet){state.busy=true;state.progress=await api('pet',{pet:button.dataset.pet});render();showAvatarCloset(document.querySelector('[data-avatar]'));return;}
    if(button.dataset.equip){state.busy=true;state.progress=await api('avatar',{accessory:button.dataset.equip});render();showAvatarCloset(document.querySelector('[data-avatar]'));return;}
    if(button.dataset.inspectStudent){state.selectedStudent=button.dataset.inspectStudent;return await navigate('observatory');}
    if(button.dataset.useMaterial){state.generatorSubject=button.dataset.useMaterial;return await navigate('teacher');}
    if(button.dataset.doubt){return await askTutor(button.dataset.doubt);}
    if (button.dataset.speak !== undefined) return speak(button.dataset.speak);
    if (button.dataset.nav) return await navigate(button.dataset.nav);
    if (button.dataset.start) { state.busy = true; return await start(button.dataset.start); }
    if (button.dataset.preview) {
      const mission = state.teacher.missions.find(m => m.id === button.dataset.preview);
      const values = Object.fromEntries(new FormData(button.closest('form')));
      const challenges=collectChallenges(button.closest('form'),mission);
      Object.assign(mission, values, challenges?{challenges}:{});
      state.game = { mission: { ...mission }, preview: true };
      initializeTask(previewTask(mission,1), 1);
      state.view = 'game'; render(); window.scrollTo(0, 0); return;
    }
    if (state.view !== 'game') return;
    const g = state.game, t = g.task;
    const oldFocus = button.getAttribute('aria-label');
    let won = false;
    if (button.dataset.add !== undefined) g.answer[Number(button.dataset.add)]++;
    else if (button.dataset.remove !== undefined) g.answer[Number(button.dataset.remove)]--;
    else if (button.dataset.stone !== undefined) { g.answer.push(Number(button.dataset.stone)); g.hop=true; }
    else if (button.hasAttribute('data-undo')) g.answer.pop();
    else if (button.dataset.scene !== undefined) { if (!g.answer.includes(Number(button.dataset.scene))) g.answer.push(Number(button.dataset.scene)); }
    else if (button.hasAttribute('data-reset-scenes')) g.answer=[];
    else if (button.dataset.natureItem !== undefined) g.selectedItem=Number(button.dataset.natureItem);
    else if (button.dataset.category !== undefined) { if (g.selectedItem!==null) g.answer[g.selectedItem]=Number(button.dataset.category); const next=g.answer.indexOf(-1);g.selectedItem=next<0?null:next; }
    else if (button.dataset.countFruit !== undefined) { const id = button.dataset.countFruit; g.counted = g.counted.includes(id) ? g.counted.filter(x => x !== id) : [...g.counted, id]; }
    else if (button.dataset.digit !== undefined) { const value = String(g.answer); g.answer = button.dataset.digit === 'erase' ? value.slice(0, -1) : (value + button.dataset.digit).replace(/^0+(?=\d)/, '').slice(0, 3); }
    else if (button.hasAttribute('data-hint')) {
      state.busy = true;
      const hint = g.preview ? { hint: g.mission.coachHint+' '+previewCheck(t,g.answer).feedback, hints: g.hints + 1 } : await api('hint', { runId: g.id, taskId: t.id });
      g.feedback = hint.hint; g.hints = hint.hints;
    } else if (button.hasAttribute('data-check')) {
      if (t.mode === 'market' && (g.answer === '' || !Number.isInteger(Number(g.answer)))) return toast('Escribe un número entero para completar el pedido.');
      const answer = t.mode === 'market' ? Number(g.answer) : g.answer;
      state.busy = true;
      const result = g.preview ? previewCheck(t,answer) : await api('answer', { runId: g.id, taskId: t.id, answer });
      g.solved = result.correct; g.feedback = result.feedback; g.answered=true; won = result.correct;
      if(result.progress) state.progress=result.progress;
      if (typeof result.xp === 'number') state.progress.xp = result.xp;
    } else if (button.hasAttribute('data-next')) {
      state.busy = true;
      const next = g.preview ? (g.round >= 3 ? { complete: true } : { task: previewTask(g.mission,g.round+1), round: g.round + 1 }) : await api('next', { runId: g.id, taskId: t.id });
      if (next.complete) { won = true; state.view = 'completed'; if (!g.preview) await refresh(); window.scrollTo(0, 0); }
      else initializeTask(next.task, next.round);
    } else return;
    render();
    if (won) celebrate(); else playSound(button.hasAttribute('data-hint') ? 'hint' : 'tap');
    if (oldFocus) Array.from(document.querySelectorAll('button[aria-label]')).find(el => el.getAttribute('aria-label') === oldFocus)?.focus();
  } catch (error) { toast(error.message); }
  finally { state.busy = false; }
});

document.addEventListener('submit', async event => {
  event.preventDefault(); if (state.busy) return;
  const form = event.target, data = Object.fromEntries(new FormData(form));
  if(form.id==='tutor-form') return await askTutor(data.question);
  const button = event.submitter; const oldText = button?.textContent;
  try {
    state.busy = true;
    if (button) { button.disabled = true; button.textContent = form.id === 'generate-form' ? 'Gemini está creando tu aventura…' : 'Guardando…'; }
    if(form.id==='student-form'){await api('students',data);await navigate('teacher');toast('Explorador creado. Su progreso empieza en cero.');}
    else if(form.id==='material-form'){
      const file=data.file;delete data.file;
      if(file?.size){if(file.size>2*1024*1024)throw Error('El archivo no puede superar dos MB.');const bytes=new Uint8Array(await file.arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));data.base64=btoa(binary);data.filename=file.name;}
      await api('materials',data);await navigate('materials');toast('Material guardado. Revisa el texto extraído antes de crear el juego.');
    }
    else if (form.id === 'login-form') {
      await api('session', { role: 'teacher', password: data.password }); state.role = 'teacher'; await navigate('teacher');
    } else if (form.id === 'generate-form') {
      await api('generate', data); await navigate('teacher'); toast('Tu borrador está listo. Revísalo y prueba el juego antes de publicarlo.');
    } else if (form.dataset.missionForm) {
      const mission=state.teacher.missions.find(m=>m.id===form.dataset.missionForm);
      const challenges=collectChallenges(form,mission);
      await api('mission', { ...data, ...(challenges?{challengeJson:JSON.stringify(challenges)}:{}), id: form.dataset.missionForm, published: button.value === 'publish' });
      await navigate('teacher'); toast(button.value === 'publish' ? 'Aventura revisada y habilitada.' : 'Aventura guardada sin publicar.');
    }
  } catch (error) { toast(error.message); }
  finally { state.busy = false; if (button?.isConnected) { button.disabled = false; button.textContent = oldText; } }
});

async function init() {
  try {
    state.status = await api('status'); state.role = state.status.role;
    if (!state.role) { await api('session', { role: 'student' }); state.role = 'student'; }
    await navigate(state.role === 'teacher' ? 'teacher' : state.role === 'family' ? 'family' : 'home');
  } catch (error) { $('#app').innerHTML = `<main class="loading"><h1>No pudimos abrir la aventura.</h1><p>${escape(error.message)}</p><a href="/">Volver a intentar</a></main>`; }
}
init();

async function askTutor(question) {
  if(state.busy)return;
  const g=state.game;
  if(!g?.answered || g.preview)return;
  state.busy=true;
  const form=document.querySelector('#tutor-form');
  const controls=[...document.querySelectorAll('#tutor-form button, .doubt-shortcuts button')];controls.forEach(b=>b.disabled=true);
  const send=form?.querySelector('button');if(send)send.textContent='Kiki está pensando…';
  try { const answer=await api('tutor',{runId:g.id,taskId:g.task.id,question});g.tutorMessages.push({question,...answer});if(state.view==='game'&&state.game===g)render(); }
  catch(error){toast(error.message);}
  finally {state.busy=false;controls.forEach(b=>b.disabled=false);if(send?.isConnected)send.textContent='Preguntar';}
}
