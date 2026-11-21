import { randomUUID, randomInt } from 'node:crypto';
import { pedagogicalInsights } from './pedagogy.js';

import { courses, accessories, pets, achievementList, extraLibrary, courseForMode, topicForMode, streak, localDay } from './curriculum.js';
export const modes = ['groups', 'bridge', 'market', 'sequence', 'classify'];
export const themes = ['forest', 'lake', 'volcano'];
export const library = [
  { id: 'forest', mode: 'groups', theme: 'forest', title: 'El picnic de los quetzales', intro: '¡El bosque tiene invitados! Ayuda a Kiki a preparar canastas de frutas para que todos compartan un picnic.', ending: 'Las canastas están listas. ¡El bosque celebra lo que aprendiste!', source: 'library', published: true },
  { id: 'lake', mode: 'bridge', theme: 'lake', title: 'Puentes sobre el lago', intro: 'Las luciérnagas quieren volver a su isla. Construye un camino de piedras usando sumas repetidas.', ending: 'Las luciérnagas llegaron a casa. ¡Tu camino iluminó el lago!', source: 'library', published: true },
  { id: 'volcano', mode: 'market', theme: 'volcano', title: 'El mercado del volcán', intro: 'La feria está por comenzar. Descubre cuántas frutas hay en los puestos y completa los pedidos de la comunidad.', ending: '¡La feria abrió sus puertas! Tus descubrimientos ayudaron a toda la comunidad.', source: 'library', published: true },
].map(mission => ({ ...mission, coachHint: 'Kiki te acompaña: observa los grupos y busca qué cantidad se repite en todos.' }));

export function newState() {
  return { missions: structuredClone([...library.map(m => ({...m, subject:'math', topic:'multiplication'})), ...extraLibrary]), runs: [], attempts: [], xp: 0, students: [{id:'demo',name:'Explorador',xp:0,accessory:'none'}], materials: [] }; 
}

export function makeTask(mode, recent = [], previous = [], mission = {}) {
  if (mode === 'sequence' || mode === 'classify') {
    const source = mission.challenges?.[previous.length % 3] || extraLibrary.find(m => m.mode === mode).challenges[previous.length % 3];
    const task = { id: randomUUID(), mode, hints:0, tries:0, solved:false, started:Date.now() };
    if (mode === 'sequence') {
      const indices = [0,1,2];
      for (let i=2;i>0;i--) { const j=randomInt(i+1); [indices[i],indices[j]]=[indices[j],indices[i]]; }
      if (indices.every((v,i) => v===i)) [indices[0],indices[2]]=[indices[2],indices[0]];
      return {...task, passage:source.passage, options:indices.map(i=>source.options[i]), expected:[0,1,2].map(i=>indices.indexOf(i))};
    }
    return {...task, categories:['Ser vivo','Objeto sin vida'], options:source.items.map(i=>i.text), expected:source.items.map(i=>i.category)};
  }
  const independent = recent.slice(-4).filter(a => a.correct && a.hints === 0).length;
  const needsSupport = recent.at(-1)?.correct === false || recent.at(-1)?.hints > 0;
  const max = independent >= 3 && !needsSupport ? 6 : 4;
  const fixed = mission.challenges?.[previous.length];
  if (fixed && Number.isInteger(fixed.groups) && Number.isInteger(fixed.each)) return {id:randomUUID(),mode,groups:fixed.groups,each:fixed.each,hints:0,tries:0,solved:false,started:Date.now()};
  let groups, each;
  do { groups = randomInt(2, max + 1); each = randomInt(2, max + 1); }
  while (previous.some(t => t.groups === groups && t.each === each));
  return { id: randomUUID(), mode, groups, each, hints: 0, tries: 0, solved: false, started: Date.now() };
}

export function publicTask(task) {
  const { id, mode, groups, each, hints, solved, passage, options, categories } = task;
  return { id, mode, groups, each, hints, solved, passage, options, categories };
}

export function evaluate(task, answer) {
  if (task.mode === 'sequence' || task.mode === 'classify') {
    if (!Array.isArray(answer) || answer.length !== task.expected.length || answer.some(n => !Number.isInteger(n) || n<0 || n >= (task.mode==='sequence' ? 3 : 2))) throw new Error('Completa todas las tarjetas antes de comprobar.');
    if (task.mode === 'sequence' && new Set(answer).size !== 3) throw new Error('Cada escena debe usarse una sola vez.');
    return {correct:answer.every((v,i)=>v===task.expected[i]),error:task.mode==='sequence'?'story_order':'living_classification'};
  }
  if (task.mode === 'groups') {
    if (!Array.isArray(answer) || answer.length !== task.groups || answer.some(n => !Number.isInteger(n) || n < 0 || n > 12)) throw new Error('Respuesta inválida.');
    return { correct: answer.every(n => n === task.each), error: 'unequal_groups' };
  }
  if (task.mode === 'bridge') {
    if (!Array.isArray(answer) || answer.length > 8 || answer.some(n => !Number.isInteger(n) || n < 1 || n > 12)) throw new Error('Respuesta inválida.');
    return { correct: answer.length === task.groups && answer.every(n => n === task.each), error: 'repeated_addition' };
  }
  if (!Number.isInteger(answer) || answer < 0 || answer > 200) throw new Error('Escribe un número entre 0 y 200.');
  return { correct: answer === task.groups * task.each, error: answer === task.groups + task.each ? 'added_factors' : 'counting' };
}

export function explanation(task, reveal = false) {
  if (task.mode === 'sequence') return reveal ? 'El orden del cuento es: ' + task.expected.map(i=>task.options[i]).join(' Luego, ') : 'Vuelve a leer el cuento. Busca qué sucedió primero, después y al final.';
  if (task.mode === 'classify') return reveal ? task.options.map((v,i)=>v+': '+task.categories[task.expected[i]]).join('. ') : 'Los seres vivos crecen y necesitan condiciones para vivir. Una piedra o un juguete no están vivos.';
  const sum = Array(task.groups).fill(task.each).join(' + ');
  return reveal
    ? `${task.groups} grupos de ${task.each}: ${sum} = ${task.groups * task.each}. Multiplicar es sumar la misma cantidad varias veces.`
    : `Observa cada grupo: necesitamos ${task.groups} grupos y ${task.each} frutas en cada uno. Suma ${task.each} una vez por cada grupo.`;
}

export function stats(state, studentId = 'demo') {
  const attempts = state.attempts.filter(a => (a.studentId || 'demo') === studentId);
  const first = attempts.filter(a => a.try === 1);
  const independent = first.filter(a => a.correct && a.hints === 0).length;
  const complete = state.runs.filter(r => r.complete && (r.studentId || 'demo') === studentId).length;
  const student = state.students?.find(s => s.id === studentId);
  const xp = student?.xp ?? state.xp;
  const skills = courses.map(course => {
    const evidence = first.filter(a => (a.subject || courseForMode(a.mode)?.id) === course.id);
    const unaided = evidence.filter(a => a.correct && !a.hints).length;
    const rate = evidence.length ? Math.round(unaided/evidence.length*100) : null;
    const recent = evidence.slice(-3), initial = evidence.slice(0,3);
    const improvement = evidence.length >= 6 ? Math.round((recent.filter(a=>a.correct&&!a.hints).length-initial.filter(a=>a.correct&&!a.hints).length)/3*100) : null;
    return { subject:course.id,name:course.name,skill:course.topics[0].skill,total:evidence.length,independent:unaided,accuracy:rate,improvement,
      strength:evidence.length >= 3 && rate >= 80,
      emerging:evidence.length > 0 && evidence.length < 3 && unaided > 0,
      reinforce:evidence.length > 0 && rate < 70,
      home:course.topics[0].home };
  });
  const practice = streak(attempts);
  const weekly = practice.week.map(({day}) => {
    const entries = first.filter(a => a.at && localDay(new Date(a.at)) === day);
    const independent = entries.filter(a => a.correct && !a.hints).length;
    return { day, total:entries.length, independent, accuracy:entries.length ? Math.round(independent/entries.length*100) : null };
  });
  return { studentId, name:student?.name || 'Explorador', total:first.length, independent, weekly,
    accuracy:first.length?Math.round(independent/first.length*100):null,complete,xp,
    helped:first.filter(a=>!a.correct||a.hints>0).length,
    history:first.slice(-12).map(a=>({correct:a.correct&&a.hints===0,mode:a.mode,at:a.at})),
    skills, streak:practice,
    achievements:achievementList({xp,total:first.length,complete,independent,skills,practice}),
    avatar:{equipped:accessories.find(a=>a.id===student?.accessory&&xp>=a.seeds)?.id || 'none',pet:pets.find(p=>p.id===student?.pet&&xp>=p.seeds)?.id || 'quetzal',pets:pets.map(p=>({...p,unlocked:xp>=p.seeds})),accessories:accessories.map(a=>({...a,unlocked:xp>=a.seeds}))}
  };
}
export function observation(state, studentId = 'demo') {
  const s=stats(state,studentId), counts={};
  const attempts=state.attempts.filter(a=>(a.studentId||'demo')===studentId).map(a=>({...a,subject:a.subject||courseForMode(a.mode)?.id}));
  attempts.filter(a=>!a.correct).forEach(a=>{counts[a.error]=(counts[a.error]||0)+1;});
  const insights=pedagogicalInsights(s.skills,attempts);
  const focus=insights.find(i=>i.initialErrors>0)||insights.find(i=>i.hinted>0)||insights[0];
  return {...s,errors:counts,insights,
    observation:s.total ? `A partir de ${s.total} ${s.total===1?'reto registrado':'retos registrados'}: ${s.independent} ${s.independent===1?'resuelto':'resueltos'} sin ayuda y ${s.helped} con pistas o errores iniciales. ${s.total<3?'Ya hay una primera señal para orientar la próxima actividad.':'Podemos orientar el acompañamiento en las competencias practicadas.'}` : 'Todavía no hay respuestas registradas. El primer reto permitirá ofrecer una orientación inicial.',
    recommendation:focus ? `${focus.name}: ${focus.action}` : 'Invita al estudiante a resolver un reto y explicar su idea en voz alta. Después revisa aquí el resultado, las pistas y los reintentos.',
    evidenceNote:'Orientación local basada en los intentos, disponible sin Gemini. Las observaciones con uno o dos retos son preliminares; no son diagnósticos ni prueban dominio.'
  };
}
