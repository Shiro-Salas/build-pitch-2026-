export function learningBoard(g, escape) {
  const t=g.task;
  if(t.mode==='sequence') return `<div class="story-book"><span aria-hidden="true">📖</span><p>${escape(t.passage)}</p><button class="button subtle" data-speak="${escape(t.passage)}">Escuchar el cuento ♫</button></div><p class="board-help">Toca las escenas en el orden del cuento.</p><div class="story-slots">${[0,1,2].map((_,i)=>`<div><strong>${['Primero','Después','Al final'][i]}</strong><span>${g.answer[i]===undefined?'?':escape(t.options[g.answer[i]])}</span></div>`).join('')}</div><div class="scene-cards">${t.options.map((text,i)=>`<button data-scene="${i}" ${g.answer.includes(i)||g.solved?'disabled':''}><span aria-hidden="true">${['🌼','🍃','✨'][i]}</span>${escape(text)}</button>`).join('')}</div><button class="button subtle reset-scenes" data-reset-scenes ${g.solved?'disabled':''}>Volver a ordenar</button>`;
  if(t.mode==='classify') return `<div class="nature-instruction"><span aria-hidden="true">🔎</span><p>Elige una tarjeta y toca el lugar al que pertenece.</p></div><div class="nature-cards">${t.options.map((text,i)=>`<button data-nature-item="${i}" class="${g.selectedItem===i?'selected':''} ${g.answer[i]>=0?'placed':''}" aria-pressed="${g.selectedItem===i}" ${g.solved?'disabled':''}>${escape(text)}${g.answer[i]>=0?`<small>${escape(t.categories[g.answer[i]])}</small>`:''}</button>`).join('')}</div><div class="nature-zones">${t.categories.map((category,i)=>`<button data-category="${i}" ${g.solved||g.selectedItem===null?'disabled':''}><span aria-hidden="true">${i===0?'🌱':'🧸'}</span><strong>${escape(category)}</strong><div>${g.answer.map((v,j)=>v===i?`<span>${escape(t.options[j])}</span>`:'').join('')||'<small>Toca aquí para colocar la tarjeta</small>'}</div></button>`).join('')}</div><p class="board-help">Puedes volver a elegir una tarjeta para cambiarla de lugar.</p>`;
  return '';
}
export function tutorPanel(g, escape) {
  if(!g.answered||g.preview) return '';
  return `<section class="tutor-panel"><div><span aria-hidden="true">🦜</span><h3>¿Te quedó alguna duda?</h3><p>Pregúntale a Kiki sobre este reto.</p></div><div class="doubt-shortcuts"><button data-doubt="¿Me explicas por qué esta es la respuesta?">Explícame por qué</button><button data-doubt="¿Puedes darme otro ejemplo parecido?">Dame otro ejemplo</button></div><form id="tutor-form"><label for="doubt">Mi pregunta</label><div><input id="doubt" name="question" minlength="3" maxlength="300" placeholder="¿Cómo puedo entenderlo mejor?" required><button class="button primary">Preguntar</button></div><small>Pregunta solo sobre el ejercicio. No escribas datos personales.</small></form><div class="tutor-messages" aria-live="polite">${(g.tutorMessages||[]).map(m=>`<article><strong>${escape(m.question)}</strong><p>${escape(m.answer)}</p><small>${m.source==='gemini'?'Respuesta de Gemini · Kiki puede equivocarse; consulta a tu docente si tienes dudas.':escape(m.notice||'Explicación preparada.')}</small><button class="text-button" data-speak="${escape(m.answer)}">Escuchar explicación ♫</button></article>`).join('')}</div></section>`;
}
export function previewTask(mission, round) {
  const c=mission.challenges?.[round-1];
  const base={id:`preview-${round}`,mode:mission.mode,hints:0,solved:false};
  if(mission.mode==='sequence') return {...base,passage:c.passage,options:[c.options[2],c.options[0],c.options[1]],expected:[1,2,0]};
  if(mission.mode==='classify') return {...base,options:c.items.map(i=>i.text),expected:c.items.map(i=>i.category),categories:['Ser vivo','Objeto sin vida']};
  return {...base,groups:c?.groups||round+2,each:c?.each||3};
}
export function previewCheck(t,answer) {
  const correct=t.expected?answer.length===t.expected.length&&answer.every((v,i)=>v===t.expected[i]):t.mode==='market'?answer===t.groups*t.each:answer.length===t.groups&&answer.every(n=>n===t.each);
  const feedback=t.mode==='sequence'?t.expected.map(i=>t.options[i]).join(' Después, '):t.mode==='classify'?t.options.map((v,i)=>v+': '+t.categories[t.expected[i]]).join('. '):`${t.groups} grupos de ${t.each} son ${t.groups*t.each}.`;
  return {correct,feedback:'Vista previa: '+feedback};
}
