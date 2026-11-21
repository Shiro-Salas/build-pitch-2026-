import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { extraLibrary, streak, localDay } from '../server/curriculum.js';
import { makeTask, evaluate, publicTask, stats, newState, observation } from '../server/game.js';
import { validateChallenges, explainDoubt, generateAdventure, geminiFailure } from '../server/gemini.js';
import { extractMaterial } from '../server/materials.js';

test('lectura y ciencias verifican cada tarjeta y no entregan respuestas en la tarea pública',()=>{
  for(const mission of extraLibrary){
    const t=makeTask(mission.mode,[],[],mission);
    assert.equal(publicTask(t).expected,undefined);
    assert.equal(evaluate(t,t.expected).correct,true);
    const wrong=t.expected.map((v,i)=>mission.mode==='sequence'?(v+1)%3:1-v);
    assert.equal(evaluate(t,wrong).correct,false);
    assert.throws(()=>evaluate(t,[]));
  }
  assert.throws(()=>validateChallenges('sequence',[{passage:'Cuento',options:['a','a','a']}]));
  assert.throws(()=>validateChallenges('classify',Array(3).fill({items:[{text:'Dato',category:5}]})));
});

test('racha usa días de Guatemala, no suma intentos del mismo día y respeta descansos',()=>{
  const now=new Date('2026-11-21T18:00:00Z');
  const attempts=['2026-11-19T20:00:00Z','2026-11-20T20:00:00Z','2026-11-21T01:00:00Z','2026-11-21T15:00:00Z'].map(at=>({at}));
  const r=streak(attempts,now);
  assert.equal(r.current,3);assert.equal(r.days,3);assert.equal(r.practicedToday,true);
  assert.equal(streak(attempts,new Date('2026-11-22T18:00:00Z')).current,3);
  const rested=streak(attempts,new Date('2026-11-23T18:00:00Z'));
  assert.equal(rested.current,0);assert.equal(rested.best,3);
  assert.equal(streak([],now).current,0);
});

test('las métricas y accesorios pertenecen al estudiante y solo a competencias practicadas',()=>{
  const s=newState();s.students.push({id:'second',name:'Segundo',xp:0,accessory:'none'});s.students[0].xp=500;
  s.attempts=Array.from({length:3},()=>({studentId:'demo',mode:'sequence',subject:'language',try:1,correct:true,hints:0}));
  const first=stats(s,'demo'),second=stats(s,'second');
  assert.equal(first.avatar.accessories.find(a=>a.id==='hat').unlocked,true);
  assert.equal(first.avatar.accessories.find(a=>a.id==='crown').unlocked,false);
  assert.equal(second.total,0);assert.equal(second.xp,0);
  assert.equal(first.skills.find(k=>k.subject==='language').strength,true);
  assert.equal(first.skills.find(k=>k.subject==='math').strength,false);
  assert.equal(first.avatar.pets.find(p=>p.id==='panda').unlocked,true);
  assert.equal(first.avatar.pets.find(p=>p.id==='fox').unlocked,false);
  assert.equal(second.avatar.pet,'quetzal');
  const today=new Date().toISOString();
  s.attempts=[{studentId:'demo',mode:'groups',try:1,correct:false,hints:0,at:today},{studentId:'demo',mode:'groups',try:2,correct:true,hints:0,at:today},{studentId:'second',mode:'groups',try:1,correct:true,hints:0,at:today}];
  const day=stats(s,'demo').weekly.find(d=>d.day===localDay());
  assert.equal(day.total,1); assert.equal(day.accuracy,0);
  assert.equal(stats(s,'demo').weekly.filter(d=>d.day!==localDay()).every(d=>d.accuracy===null),true);
});

test('el tutor recibe el ejercicio y la solución verificada; la ayuda local se identifica',async()=>{
  const task={mode:'market',groups:3,each:4};
  const local=await explainDoubt({task,question:'¿Por qué?'});
  assert.equal(local.source,'library');assert.match(local.answer,/12/);
  let sent;
  const result=await explainDoubt({task,question:'¿Por qué no siete?',apiKey:'fake',model:'test-model',fetchImpl:async(_,options)=>{
    sent=JSON.parse(options.body);
    return {ok:true,json:async()=>({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify({answer:'Cada grupo tiene cuatro frutas. Debes sumar cuatro tres veces.'})}]}}]})};
  }});
  assert.equal(result.source,'gemini');assert.match(sent.contents[0].parts[0].text,/12/);
  assert.ok(!sent.contents[0].parts[0].text.includes('studentId'));
});

test('las metas de mascotas y accesorios respetan límites y los logros no se pierden al descansar',()=>{
  const s=newState();
  for(const [xp,panda,bow,hat,fox] of [[199,false,false,false,false],[200,true,true,false,false],[499,true,true,false,false],[500,true,true,true,false],[1000,true,true,true,true]]) {
    s.students[0].xp=xp;const p=stats(s);
    assert.equal(p.avatar.pets.find(p=>p.id==='panda').unlocked,panda);
    assert.equal(p.avatar.pets.find(p=>p.id==='fox').unlocked,fox);
    assert.equal(p.avatar.accessories.find(a=>a.id==='bow').unlocked,bow);
    assert.equal(p.avatar.accessories.find(a=>a.id==='hat').unlocked,hat);
  }
  s.students[0].xp=100;s.students[0].pet='panda';s.students[0].accessory='hat';
  assert.equal(stats(s).avatar.pet,'quetzal');assert.equal(stats(s).avatar.equipped,'none');
  s.attempts=['2025-01-01','2025-01-02','2025-01-03'].map(day=>({at:day+'T18:00:00Z',mode:'groups',try:1,correct:true,hints:0}));
  const p=stats(s);assert.equal(p.achievements.length,17);assert.equal(p.streak.current,0);
  assert.equal(p.achievements.find(a=>a.id==='streak3').unlocked,true);
  assert.equal(p.achievements.find(a=>a.id==='streak7').unlocked,false);
  assert.equal(p.achievements.find(a=>a.id==='first').current,1);
});

const content='Las plantas y los animales son seres vivos. Las piedras y las sillas son objetos sin vida.';
test('la observación ofrece orientación desde un acierto y no inventa datos sin intentos',()=>{
  const s=newState();const empty=observation(s);
  assert.deepEqual(empty.insights,[]);assert.match(empty.observation,/Todavía no hay respuestas/);
  s.attempts=[{studentId:'demo',mode:'sequence',taskId:'one',runId:'run',try:1,correct:true,hints:0}];
  const first=observation(s);
  assert.match(first.observation,/1 reto registrado/);assert.equal(first.insights.length,1);
  assert.equal(first.insights[0].stage,'Lectura inicial · pocos datos');
  assert.equal(first.insights[0].independent,1);assert.match(first.insights[0].action,/explique/);
  assert.equal(first.skills.find(k=>k.subject==='language').strength,false);
  assert.equal(first.skills.find(k=>k.subject==='language').emerging,true);
  assert.equal(first.insights.some(i=>i.subject==='math'),false);
});
test('la orientación distingue errores, pistas y correcciones sin duplicar retos ni mezclar alumnos',()=>{
  const s=newState();s.students.push({id:'other',name:'Otro',xp:0});
  s.attempts=[
    {studentId:'demo',mode:'market',taskId:'a',runId:'run',try:1,correct:false,hints:0,error:'added_factors'},
    {studentId:'demo',mode:'market',taskId:'a',runId:'run',try:2,correct:false,hints:1,error:'counting'},
    {studentId:'demo',mode:'market',taskId:'a',runId:'run',try:3,correct:true,hints:1},
    {studentId:'demo',mode:'market',taskId:'b',runId:'run',try:1,correct:true,hints:1},
    {studentId:'other',mode:'classify',taskId:'c',runId:'other',try:1,correct:false,hints:0,error:'living_classification'},
  ];
  const p=observation(s),i=p.insights[0];
  assert.equal(p.total,2);assert.equal(i.initialErrors,1);assert.equal(i.recovered,1);assert.equal(i.hinted,1);assert.equal(i.independent,0);
  assert.match(i.action,/tres grupos de dos/);assert.match(i.evidence,/1 se corrigió después/);
  assert.equal(p.insights.length,1);assert.equal(p.errors.living_classification,undefined);
});
test('los fallos del tutor distinguen permisos de cuota y nunca muestran mensajes crudos del proveedor',async()=>{
  for(const [status,code] of [[403,'ACCESS_DENIED'],[429,'QUOTA'],[404,'MODEL_UNAVAILABLE']]) {
    let caught;
    try {await explainDoubt({task:{mode:'market',groups:2,each:2},question:'¿Por qué?',apiKey:'secret-key',model:'test',fetchImpl:async()=>({ok:false,status,json:async()=>({error:{message:'secret-key'}})})});}catch(error){caught=error;}
    assert.equal(geminiFailure(caught).code,code);assert.ok(!geminiFailure(caught).message.includes('secret-key'));
  }
  assert.equal(geminiFailure(new Error('secret-key')).code,'UNAVAILABLE');
  assert.ok(!geminiFailure(new Error('secret-key')).message.includes('secret-key'));
});
test('Gemini recibe el material y genera retos revisables de la materia seleccionada',async()=>{
  const mission=extraLibrary.find(m=>m.mode==='sequence');
  let sent;
  const material={id:'guide',text:'Un cuento sobre una semilla que se convierte en planta.'};
  const draft=await generateAdventure({mode:mission.mode,theme:mission.theme,material,apiKey:'fake',model:'test-model',fetchImpl:async(_,options)=>{
    sent=JSON.parse(options.body);
    return {ok:true,json:async()=>({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify(mission)}]}}]})};
  }});
  assert.equal(draft.subject,'language');assert.equal(draft.materialId,'guide');assert.equal(draft.published,false);
  assert.equal(draft.challenges.length,3);
  assert.ok(sent.contents[0].parts[0].text.includes(material.text));
  assert.ok(sent.generationConfig.responseSchema.required.includes('challenges'));
});
test('materiales validan materia, límites y texto plano extraído',async()=>{
  const value=await extractMaterial({title:'Seres vivos',subject:'science',topic:'living',filename:'guia.txt',base64:Buffer.from(content).toString('base64')});
  assert.equal(value.text,content);assert.equal(value.subject,'science');
  await assert.rejects(extractMaterial({title:'Material',subject:'science',topic:'multiplication',text:content}));
  await assert.rejects(extractMaterial({title:'Material',subject:'science',topic:'living',filename:'script.exe',base64:'YWJj'}));
  await assert.rejects(extractMaterial({title:'Material',subject:'science',topic:'living',text:'Muy corto'}));
});

test('se extrae contenido académico de un DOCX real sin convertirlo a HTML',async()=>{
  const require=createRequire(import.meta.resolve('mammoth'));
  const JSZip=require('jszip'), zip=new JSZip();
  zip.file('[Content_Types].xml','<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>');
  zip.file('_rels/.rels','<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>');
  zip.file('word/document.xml',`<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>${content}</w:t></w:r></w:p></w:body></w:document>`);
  const bytes=await zip.generateAsync({type:'nodebuffer'});
  const parsed=await extractMaterial({title:'Guía Word',subject:'science',topic:'living',filename:'guia.docx',base64:bytes.toString('base64')});
  assert.match(parsed.text,/plantas y los animales/);
});

test('se extrae texto de un PDF real',async()=>{
  const stream='BT /F1 12 Tf 20 100 Td (Plants and animals are living things. Rocks and chairs are not living things.) Tj ET';
  const objects=['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 500 200] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`];
  let pdf='%PDF-1.4\n';const offsets=[0];
  objects.forEach((obj,i)=>{offsets.push(Buffer.byteLength(pdf));pdf+=`${i+1} 0 obj\n${obj}\nendobj\n`;});
  const xref=Buffer.byteLength(pdf);pdf+=`xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map(n=>String(n).padStart(10,'0')+' 00000 n ').join('\n')}\ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  const parsed=await extractMaterial({title:'Guía PDF',subject:'science',topic:'living',filename:'guia.pdf',base64:Buffer.from(pdf).toString('base64')});
  assert.match(parsed.text,/Plants and animals/);
});
