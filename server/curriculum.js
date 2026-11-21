export const courses = [
  { id: 'math', name: 'Matemáticas', theme: 'forest', topics: [{ id: 'multiplication', name: 'Multiplicación', skill: 'Representar grupos iguales y sumas repetidas', modes: ['groups', 'bridge', 'market'], home: 'Agrupen semillas en platos y expliquen la suma repetida.' }] },
  { id: 'language', name: 'Comunicación y Lenguaje', theme: 'lake', topics: [{ id: 'sequence', name: 'Comprensión lectora', skill: 'Reconocer el orden de los acontecimientos de un relato', modes: ['sequence'], home: 'Lean un cuento y conversen sobre qué pasó primero, después y al final.' }] },
  { id: 'science', name: 'Ciencias Naturales', theme: 'volcano', topics: [{ id: 'living', name: 'Seres vivos y objetos', skill: 'Distinguir seres vivos de objetos sin vida', modes: ['classify'], home: 'Observen objetos y plantas de casa. Conversen sobre cuáles crecen y necesitan agua.' }] },
];
export const accessories = [
  { id: 'none', name: 'Sin accesorio', icon: '✨', seeds: 0 },
  { id: 'bow', name: 'Corbatín alegre', icon: '🎀', seeds: 200 },
  { id: 'hat', name: 'Sombrero de sol', icon: '👒', seeds: 500 },
  { id: 'glasses', name: 'Lentes de explorador', icon: '🕶️', seeds: 700 },
  { id: 'crown', name: 'Corona del saber', icon: '👑', seeds: 1000 },
  { id: 'wizard', name: 'Sombrero estelar', icon: '🧙', seeds: 1300 },
  { id: 'medal', name: 'Medalla de aventura', icon: '🏅', seeds: 1600 },
  { id: 'flower', name: 'Flor del bosque', icon: '🌸', seeds: 2000 },
  { id: 'astronaut', name: 'Casco sabionauta', icon: '🪐', seeds: 2500 },
];
export const pets = [
  {id:'quetzal',name:'Kiki',species:'Quetzal',seeds:0,color:'mint',description:'Tu primer compañero de descubrimientos.'},
  {id:'panda',name:'Bambú',species:'Panda',seeds:200,color:'lilac',description:'Pequeño, curioso y amante de los cuentos.'},
  {id:'fox',name:'Chispa',species:'Zorro',seeds:1000,color:'peach',description:'Siempre encuentra un camino nuevo.'},
  {id:'axolotl',name:'Burbuja',species:'Ajolote',seeds:1300,color:'rose',description:'Cada pregunta es una nueva aventura.'},
  {id:'owl',name:'Luna',species:'Búho',seeds:1600,color:'sky',description:'Observa con calma y descubre detalles.'},
  {id:'jaguar',name:'Sol',species:'Jaguar',seeds:2000,color:'gold',description:'Explora la selva con grandes ideas.'},
];
export function achievementList({xp,total,complete,independent,skills,practice}) {
  return [
    ['first','🌱','Primer descubrimiento','Responde tu primer reto.',total,1],
    ['journey','🧭','Una gran aventura','Completa una aventura.',complete,1],
    ['three','🌳','Bosque de ideas','Completa tres aventuras.',complete,3],
    ['ten','🏕️','Explorador constante','Completa diez aventuras.',complete,10],
    ['twenty','🗺️','Mapa de descubrimientos','Completa veinte aventuras.',complete,20],
    ['autonomy','💡','¡Lo pensé yo!','Resuelve diez retos sin ayuda.',independent,10],
    ['curiosity','🔎','Curiosidad sin fin','Responde cincuenta retos.',total,50],
    ['subjects','🌈','Todos los mundos','Practica las tres materias.',skills.filter(s=>s.total>0).length,3],
    ['math','🔢','Amigo de los números','Practica diez retos de matemáticas.',skills.find(s=>s.subject==='math')?.total||0,10],
    ['reading','📚','Coleccionista de cuentos','Practica diez retos de lectura.',skills.find(s=>s.subject==='language')?.total||0,10],
    ['science','🌿','Detective del jardín','Practica diez retos de ciencias.',skills.find(s=>s.subject==='science')?.total||0,10],
    ['streak3','🔥','Tres días de ideas','Alcanza una racha de tres días.',practice.best,3],
    ['streak7','🌞','Semana de descubrimientos','Alcanza una racha de siete días.',practice.best,7],
    ['streak14','🌟','Dos semanas brillando','Alcanza una racha de catorce días.',practice.best,14],
    ['credits200','🐼','Un nuevo amigo','Acumula doscientos créditos.',xp,200],
    ['credits1000','🚀','Sabionauta en marcha','Acumula mil créditos.',xp,1000],
    ['credits2500','🪐','Hasta las estrellas','Acumula dos mil quinientos créditos.',xp,2500],
  ].map(([id,icon,name,text,current,target])=>({id,icon,name,text,current:Math.min(current,target),target,unlocked:current>=target}));
}
export function courseForMode(mode) { return courses.find(c => c.topics.some(t => t.modes.includes(mode))); }
export function topicForMode(mode) { return courseForMode(mode)?.topics.find(t => t.modes.includes(mode)); }
export const extraLibrary = [
  { id: 'reading-garden', mode: 'sequence', theme: 'lake', subject: 'language', topic: 'sequence', title: 'El jardín de las historias', intro: 'Las páginas del cuento se mezclaron. Lee con Kiki y coloca cada escena en su lugar.', ending: '¡El cuento volvió a tener sentido! Descubriste cómo se conectan las ideas.', coachHint: 'Busca las palabras que cuentan qué ocurrió primero, después y al final.', source: 'library', published: true,
    challenges: [
      { passage: 'Ana encontró una semilla. La plantó en una maceta y la regó. Días después, apareció un brote.', options: ['Ana encontró una semilla.', 'Ana plantó y regó la semilla.', 'Apareció un brote.'] },
      { passage: 'Kiki recogió frutas en el bosque. Después las puso en una canasta. Al final, compartió las frutas con sus amigos.', options: ['Kiki recogió frutas.', 'Kiki llenó una canasta.', 'Kiki compartió con sus amigos.'] },
      { passage: 'Luis preparó su mochila. Caminó hacia la escuela con su familia. Al llegar, saludó a su maestra.', options: ['Luis preparó su mochila.', 'Luis caminó hacia la escuela.', 'Luis saludó a su maestra.'] },
    ] },
  { id: 'science-garden', mode: 'classify', theme: 'volcano', subject: 'science', topic: 'living', title: 'Detectives de la naturaleza', intro: 'El jardín está lleno de sorpresas. Ayuda a Kiki a separar los seres vivos de los objetos sin vida.', ending: '¡Gran observación! Los seres vivos crecen y necesitan condiciones para vivir.', coachHint: 'Piensa si puede crecer y necesita alimento o agua para vivir.', source: 'library', published: true,
    challenges: [
      { items: [{ text: '🌻 Girasol', category: 0 }, { text: '🪨 Piedra', category: 1 }, { text: '🦋 Mariposa', category: 0 }, { text: '🧸 Peluche', category: 1 }] },
      { items: [{ text: '🐱 Gato', category: 0 }, { text: '🪑 Silla', category: 1 }, { text: '🌳 Árbol', category: 0 }, { text: '⚽ Pelota', category: 1 }] },
      { items: [{ text: '🐟 Pez', category: 0 }, { text: '✏️ Lápiz', category: 1 }, { text: '🌵 Cactus', category: 0 }, { text: '🚲 Bicicleta', category: 1 }] },
    ] },
];

export function localDay(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Guatemala', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  return ['year', 'month', 'day'].map(type => parts.find(p => p.type === type).value).join('-');
}
export function streak(attempts, now = new Date()) {
  const days = [...new Set(attempts.filter(a => a.at).map(a => localDay(new Date(a.at))))].sort();
  const ordinal = day => Math.floor(Date.parse(`${day}T00:00:00Z`) / 86400000);
  const today = ordinal(localDay(now));
  const nums = days.map(ordinal).filter(d => d <= today);
  let best = 0, run = 0, previous;
  for (const day of nums) { run = day === previous + 1 ? run + 1 : 1; best = Math.max(best, run); previous = day; }
  return { current: nums.at(-1) >= today - 1 ? run : 0, best, practicedToday: nums.includes(today), days: days.length,
    week: Array.from({ length: 7 }, (_, i) => ({ day: new Date((today - 6 + i) * 86400000).toISOString().slice(0, 10), practiced: nums.includes(today - 6 + i) })) };
}
