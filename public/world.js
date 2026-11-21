// Presentation and tactile interactions. Academic validation remains on the server.
let ui;
let soundEnabled = false;
let audioContext;
let suppressClickUntil = 0;
try { soundEnabled = localStorage.getItem('quetzal-sound') === 'on'; } catch {}
const worlds = {
  forest: { subject:'math', name: 'Matemáticas', action: 'Números que cobran vida', icon: '🔢', color: 'green' },
  lake: { subject:'language', name: 'Comunicación', action: 'Historias por descubrir', icon: '📖', color: 'blue' },
  volcano: { subject:'science', name: 'Ciencias Naturales', action: 'Observa y experimenta', icon: '🌱', color: 'pink' },
};
export function configureWorld(dependencies) { ui = dependencies; setupDrag(); setupAvatarClick(); }
export function playSound(kind = 'tap') {
  if (!soundEnabled) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
    const notes = kind === 'win' ? [523.25, 659.25, 783.99, 1046.5] : kind === 'hint' ? [440, 587.33] : [660];
    notes.forEach((frequency, i) => {
      const oscillator = audioContext.createOscillator(), gain = audioContext.createGain();
      const time = audioContext.currentTime + i * .105;
      oscillator.type = 'sine'; oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0, time); gain.gain.linearRampToValueAtTime(.055, time + .012); gain.gain.exponentialRampToValueAtTime(.001, time + .25);
      oscillator.connect(gain); gain.connect(audioContext.destination); oscillator.start(time); oscillator.stop(time + .26);
    });
  } catch { /* Audio is optional; every action also has visual feedback. */ }
}
export function celebrate() {
  playSound('win');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const layer = document.createElement('div'); layer.className = 'confetti-layer'; layer.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 28; i++) {
    const piece = document.createElement('span'); piece.className = `confetti-piece confetti-color-${i % 4}`; piece.textContent = i % 3 ? '✦' : '●';
    piece.style.setProperty('--x', `${5 + Math.random() * 90}%`); piece.style.setProperty('--delay', `${Math.random() * .4}s`);
    piece.style.setProperty('--spin', `${Math.random() * 500 - 250}deg`); layer.append(piece);
  }
  document.body.append(layer); setTimeout(() => layer.remove(), 2300);
}
export function childShell(content) {
  const s = ui.getState();
  document.body.classList.add('play-mode');
  document.querySelector('#app').innerHTML = `<div class="play-app view-${s.view}"><header class="play-header"><button class="play-brand" data-nav="home" aria-label="Sabionautas, volver al mapa">${ui.bird()}<span>sabionautas<small>APRENDE JUGANDO</small></span></button><nav class="play-hud" aria-label="Mi aventura"><span class="seed-counter" aria-label="${s.progress.xp || 0} créditos ganados"><span aria-hidden="true">🌟</span><strong>${s.progress.xp || 0}</strong><small>créditos</small></span><button class="hud-button streak-button" data-streak aria-label="Ver mi racha de práctica"><span aria-hidden="true">🔥</span><strong>${s.progress.streak?.current || 0}</strong></button><button class="hud-button avatar-button" data-avatar aria-label="Personalizar mi avatar">${ui.bird()}<small>Mi mascota</small></button><button class="hud-button backpack-button" data-backpack aria-label="Abrir mi mochila de descubrimientos"><span aria-hidden="true">🎒</span><small>Mi mochila</small></button><button class="hud-button sound-button" data-sound aria-label="${soundEnabled ? 'Desactivar' : 'Activar'} sonidos" aria-pressed="${soundEnabled}"><span aria-hidden="true">${soundEnabled ? '🔊' : '🔇'}</span></button><div class="adult-switch"><label for="role">Espacio para adultos</label><select id="role" aria-label="Vista demo"><option value="student">Explorador</option><option value="teacher">Docente</option><option value="family">Familia</option></select></div></nav></header><div class="explorer-switch"><label for="learner">Explorador de demostración</label><select id="learner" aria-label="Explorador de demostración">${(s.students || []).map(student => `<option value="${ui.escape(student.id)}" ${student.id===s.progress.studentId ? 'selected' : ''}>${ui.escape(student.name)}</option>`).join('')}</select><span>Tu progreso se guarda por explorador</span></div><main id="main" class="play-main" tabindex="-1">${content}</main><div class="play-caption">Sin prisa. Sin perder vidas. Con muchas ganas de descubrir. <span>Demostración · Perfiles de práctica</span></div></div><dialog id="play-dialog" class="play-dialog"></dialog>`;
}
export function worldHome() {
  const s = ui.getState();
  ui.shell(`<section class="adventure-world" aria-label="Mapa de islas de aventuras"><div class="map-vignette"></div><div class="world-heading"><span class="world-kicker">UN MUNDO DE PEQUEÑOS GRANDES DESCUBRIMIENTOS</span><h1>¡La aventura te espera!</h1><p>Elige un curso, descubre un tema y ven a jugar.</p></div><div class="map-sparkles" aria-hidden="true">${Array.from({ length: 8 }, (_, i) => `<span class="map-sparkle spark-${i}">✦</span>`).join('')}</div><nav class="island-hotspots" aria-label="Elige una isla">${Object.entries(worlds).map(([id, w]) => {
    const count = s.missions.filter(m => m.subject === w.subject).length;
    return `<button class="island-hotspot island-${id} ${w.color}" data-island="${id}" ${!count ? 'disabled' : ''} aria-label="Explorar ${w.name}"><span class="island-pin" aria-hidden="true">${w.icon}</span><span class="island-plaque"><strong>${w.name}</strong><span>${count ? w.action : 'Tu docente la está preparando'}</span><span class="island-play" aria-hidden="true">▶</span></span><span class="island-stars" aria-hidden="true">✦ ✦ ✦</span></button>`;
  }).join('')}</nav><div class="kiki-dock"><button class="kiki-companion" data-companion aria-label="Hablar con ${ui.escape(s.progress.avatar?.pets.find(p=>p.id===s.progress.avatar.pet)?.name || 'Kiki')}">${ui.bird()}<span aria-hidden="true">♫</span></button><div class="kiki-bubble"><strong>¡Hola! Soy ${ui.escape(s.progress.avatar?.pets.find(p=>p.id===s.progress.avatar.pet)?.name || 'Kiki')}.</strong><p id="kiki-message">¿Jugamos? Toca una montaña para elegir tu curso.</p></div></div><div class="map-corner"><span>✧</span> Aprender es una aventura</div></section><section class="below-map"><span>🍃 Aprende a tu ritmo</span><span>🤲 Toca, mueve y descubre</span><button data-nav="progress">Ver mis descubrimientos ✦</button></section>`);
}
let dialogReturnFocus;
function openDialog(content, trigger) {
  const dialog = document.querySelector('#play-dialog');
  dialogReturnFocus = trigger;
  dialog.innerHTML = `<button class="dialog-close" data-close-dialog aria-label="Cerrar ventana">×</button>${content}`;
  dialog.showModal();
  dialog.addEventListener('close', () => { dialogReturnFocus?.focus({ preventScroll: true }); }, { once: true });
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); }, { once: false });
}
export function handleWorldAction(button) {
  if (Date.now() < suppressClickUntil) return true;
  const s = ui.getState();
  if (button.hasAttribute('data-close-dialog')) { button.closest('dialog').close(); return true; }
  if (button.hasAttribute('data-sound')) {
    soundEnabled = !soundEnabled;
    try { localStorage.setItem('quetzal-sound', soundEnabled ? 'on' : 'off'); } catch {}
    button.setAttribute('aria-pressed', String(soundEnabled)); button.setAttribute('aria-label', `${soundEnabled ? 'Desactivar' : 'Activar'} sonidos`);
    button.querySelector('span').textContent = soundEnabled ? '🔊' : '🔇'; playSound(); return true;
  }
  if (button.dataset.island) {
    const world=worlds[button.dataset.island], course=s.courses.find(c=>c.id===world.subject); playSound();
    openDialog(`<div class="dialog-world-icon">${world.icon}</div><span class="dialog-eyebrow">ELIGE UN TEMA</span><h2>${world.name}</h2><p>Cada tema es una nueva aventura.</p><div class="topic-choices">${course.topics.map(t=>`<button data-topic="${course.id}/${t.id}"><span>${world.icon}</span><strong>${ui.escape(t.name)}</strong><small>${s.missions.filter(m=>m.subject===course.id&&m.topic===t.id).length} juegos disponibles</small></button>`).join('')}</div>`,button); return true;
  }
  if(button.dataset.topic) {
    const [subject,topic]=button.dataset.topic.split('/'), course=s.courses.find(c=>c.id===subject), selected=course.topics.find(t=>t.id===topic);
    const missions=s.missions.filter(m=>m.subject===subject&&m.topic===topic);
    openDialog(`<span class="dialog-eyebrow">${ui.escape(course.name)}</span><h2>${ui.escape(selected.name)}</h2><p>Elige tu misión.</p><div class="mission-choices">${missions.map(m=>`<article><h3>${ui.escape(m.title)}</h3><p>${ui.escape(m.intro)}</p><div><button class="button sunshine" data-start="${ui.escape(m.id)}">¡Vamos a jugar! <span aria-hidden="true">▶</span></button><button class="mission-listen" data-speak="${ui.escape(m.intro)}" aria-label="Escuchar ${ui.escape(m.title)}">♫</button></div></article>`).join('') || '<p>Tu docente está preparando este tema.</p>'}</div>`,button);return true;
  }
  if(button.hasAttribute('data-avatar')) { showAvatarCloset(button);return true; }
  if(button.hasAttribute('data-streak')) { openDialog(streakPanel(s.progress),button);return true; }
  if (button.hasAttribute('data-backpack')) {
    playSound();
    const badges = s.progress.achievements || [];
    openDialog(`<div class="dialog-world-icon">🎒</div><span class="dialog-eyebrow">TU MOCHILA DE DESCUBRIMIENTOS</span><h2>Tu colección de logros</h2><p class="collection-count">${badges.filter(b=>b.unlocked).length} de ${badges.length} descubiertos</p><p>Los créditos celebran tu esfuerzo. Pedir ayuda también es aprender.</p><div class="backpack-total">🌟 ${s.progress.xp || 0} <small>créditos ganados</small></div><div class="badge-grid">${badges.map(b => `<article class="discovery-badge ${b.unlocked ? 'earned' : ''}"><span aria-hidden="true">${b.icon}</span><strong>${b.name}</strong><p>${b.text}</p><progress max="${b.target}" value="${b.current}" aria-label="${b.name}: ${b.current} de ${b.target}"></progress><small>${b.unlocked ? '¡Descubierto!' : `${b.current} / ${b.target}`}</small></article>`).join('')}</div><button class="button primary" data-nav="progress">Ver mis descubrimientos</button>`, button); return true;
  }
  if (button.hasAttribute('data-companion')) {
    const messages = ['¡Los errores son pistas para descubrir algo nuevo!', 'Un grupo, otro grupo… ¡juntos descubrimos el total!', 'Puedes pedir ayuda todas las veces que quieras.', '¡Elige una isla! Yo te acompaño.'];
    s.kikiMessage = ((s.kikiMessage ?? -1) + 1) % messages.length;
    const message = messages[s.kikiMessage]; document.querySelector('#kiki-message').textContent = message;
    playSound(); ui.speak(message); button.classList.remove('kiki-wiggle'); void button.offsetWidth; button.classList.add('kiki-wiggle'); return true;
  }
  if (button.hasAttribute('data-fruit-source')) { ui.toast('Arrastra una naranja a una canasta, o toca la canasta para añadirla.'); return true; }
  return false;
}

function setupDrag() {
  let drag;
  const clean = () => {
    drag?.ghost?.remove(); document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over')); drag = null;
  };
  document.addEventListener('pointerdown', event => {
    const source = event.target.closest('[data-fruit-source], [data-stone]');
    const g = ui.getState().game;
    if (!source || source.disabled || !g || g.solved || event.button !== 0 || ui.getState().busy) return;
    drag = { source, pointerId: event.pointerId, x: event.clientX, y: event.clientY, taskId: g.task.id, type: source.hasAttribute('data-fruit-source') ? 'fruit' : 'stone', value: Number(source.dataset.stone) };
    source.setPointerCapture(event.pointerId);
  });
  document.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    if (!drag.ghost && Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < 8) return;
    if (!drag.ghost) {
      drag.ghost = document.createElement('div'); drag.ghost.className = 'drag-ghost'; drag.ghost.setAttribute('aria-hidden', 'true');
      drag.ghost.textContent = drag.type === 'fruit' ? '🍊' : `+${drag.value}`; document.body.append(drag.ghost);
    }
    event.preventDefault(); drag.ghost.style.left = `${event.clientX}px`; drag.ghost.style.top = `${event.clientY}px`;
    document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    const target = document.elementFromPoint(event.clientX, event.clientY)?.closest(drag.type === 'fruit' ? '[data-basket]' : '[data-bridge-drop]');
    target?.classList.add('drag-over');
  }, { passive: false });
  document.addEventListener('pointerup', event => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    if (!drag.ghost) { clean(); return; }
    const g = ui.getState().game;
    const target = document.elementFromPoint(event.clientX, event.clientY)?.closest(drag.type === 'fruit' ? '[data-basket]' : '[data-bridge-drop]');
    const valid = ui.getState().view === 'game' && g?.task.id === drag.taskId && !g.solved && !ui.getState().busy;
    if (target && valid) {
      if (drag.type === 'fruit') { const index = Number(target.dataset.basket); if (g.answer[index] < 12) g.answer[index]++; }
      else if (g.answer.length < g.task.groups) { g.answer.push(drag.value); g.hop=true; }
      playSound();
    }
    suppressClickUntil = Date.now() + 350; clean(); if (valid) ui.render();
  });
  document.addEventListener('pointercancel', clean);
  window.addEventListener('blur', clean);
}

export function showAvatarCloset(trigger) {
  const p=ui.getState().progress;
  const selected=p.avatar?.pets.find(pet=>pet.id===p.avatar.pet);
  openDialog(`<span class="dialog-eyebrow">TU CLUB DE COMPAÑEROS</span><h2>¡Juntos, hasta las estrellas!</h2><div class="closet-hero"><div class="closet-avatar">${ui.bird()}</div><div><strong>${ui.escape(selected?.name||'Kiki')}</strong><span>${p.xp} créditos acumulados</span><p>Practica, desbloquea y elige tu compañero. Tus créditos no se gastan al equipar.</p></div></div><h3 class="collection-title">Elige tu mascota <span>6 amigos por descubrir</span></h3><div class="pet-collection">${(p.avatar?.pets||[]).map(pet=>`<button class="pet-card ${pet.color} ${pet.unlocked?'unlocked':'locked'} ${p.avatar.pet===pet.id?'equipped':''}" data-pet="${pet.id}" ${!pet.unlocked?'disabled':''}><span class="pet-preview">${ui.petIllustration(pet.id)}</span><strong>${pet.name}</strong><span>${pet.species}</span><small>${p.avatar.pet===pet.id?'✓ Tu compañero':pet.unlocked?'Elegir compañero':`🔒 ${pet.seeds} créditos`}</small><span class="pet-description">${pet.description}</span>${!pet.unlocked?`<progress max="${pet.seeds}" value="${p.xp}" aria-label="${pet.name}: ${p.xp} de ${pet.seeds} créditos"></progress><span class="remaining-credits">Faltan ${pet.seeds-p.xp}</span>`:''}</button>`).join('')}</div><h3 class="collection-title">Un toque muy tuyo <span>Accesorios para todas las mascotas</span></h3><div class="accessory-grid">${(p.avatar?.accessories||[]).map(a=>`<button class="accessory-item ${a.unlocked?'unlocked':''} ${p.avatar.equipped===a.id?'equipped':''}" data-equip="${a.id}" ${!a.unlocked?'disabled':''}><span>${a.icon}</span><strong>${a.name}</strong><small>${p.avatar.equipped===a.id?'✓ Puesto':a.unlocked?'¡Usar!':a.seeds+' créditos'}</small>${!a.unlocked?`<span class="remaining-credits">Faltan ${a.seeds-p.xp}</span>`:''}</button>`).join('')}</div>`,trigger);
}
export function streakPanel(p) {
  const r=p.streak || {current:0,best:0,week:[],practicedToday:false};
  return `<div class="dialog-world-icon">🔥</div><span class="dialog-eyebrow">TU RACHA DE PRÁCTICA</span><h2>${r.current} ${r.current===1?'día':'días'} descubriendo</h2><p>${r.practicedToday?'¡Hoy ya practicaste! Cada pequeño paso cuenta.':'Un reto hoy puede ser un nuevo descubrimiento.'}</p><div class="practice-week">${r.week.map(d=>`<div class="${d.practiced?'practiced':''}"><span>${d.practiced?'✓':'·'}</span><small>${d.day.slice(8)}/${d.day.slice(5,7)}</small></div>`).join('')}</div><p>Tu mejor racha: <strong>${r.best} días</strong>. Si descansas, tus créditos y accesorios siguen contigo.</p><small>Un día cuenta al responder un reto. Horario de Guatemala.</small>`;
}
function setupAvatarClick() {
  document.addEventListener('click',event=>{
    const button=event.target.closest('button');
    if(!button||button.disabled||!document.body.classList.contains('play-mode')||Date.now()<suppressClickUntil) return;
    document.querySelector('.avatar-tap')?.remove();
    const rect=button.getBoundingClientRect(), visual=document.createElement('div');
    visual.className='avatar-tap';visual.setAttribute('aria-hidden','true');visual.innerHTML=ui.bird()+'<span class="tap-ring"></span>';
    visual.style.left=Math.min(window.innerWidth-65,Math.max(0,rect.left+rect.width/2-30))+'px';
    visual.style.top=Math.min(window.innerHeight-90,Math.max(0,rect.top-35))+'px';
    document.body.append(visual);setTimeout(()=>visual.remove(),650);
  },true);
}
