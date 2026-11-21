import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluate, makeTask, newState, stats, observation } from '../server/game.js';
import { generateAdventure, validateDraft } from '../server/gemini.js';

test('las tres mecánicas verifican cantidades, no una respuesta suministrada por IA', () => {
  assert.equal(evaluate({ mode: 'groups', groups: 3, each: 4 }, [4, 4, 4]).correct, true);
  assert.equal(evaluate({ mode: 'groups', groups: 3, each: 4 }, [3, 4, 5]).correct, false);
  assert.equal(evaluate({ mode: 'bridge', groups: 3, each: 4 }, [4, 4]).correct, false);
  assert.equal(evaluate({ mode: 'bridge', groups: 3, each: 4 }, [4, 4, 4]).correct, true);
  assert.deepEqual(evaluate({ mode: 'market', groups: 3, each: 4 }, 7), { correct: false, error: 'added_factors' });
  assert.equal(evaluate({ mode: 'market', groups: 3, each: 4 }, 12).correct, true);
  assert.throws(() => evaluate({ mode: 'market', groups: 3, each: 4 }, '12'));
  assert.throws(() => evaluate({ mode: 'groups', groups: 3, each: 4 }, [4, -1, 9]));
});

test('los errores y las pistas no se convierten en aciertos independientes al reintentar', () => {
  const s = newState();
  s.attempts = [
    { try: 1, correct: false, hints: 0, error: 'counting', mode: 'market' },
    { try: 2, correct: true, hints: 1, mode: 'market' },
    { try: 1, correct: true, hints: 1, mode: 'groups' },
    { try: 1, correct: true, hints: 0, mode: 'bridge' },
  ];
  assert.equal(stats(s).total, 3); assert.equal(stats(s).independent, 1); assert.equal(stats(s).accuracy, 33);
  assert.match(observation(s).observation, /3 retos registrados/);
  assert.equal(observation(s).insights[0].initialErrors,1);
  assert.equal(stats(newState()).accuracy, null);
});

test('la adaptación se mantiene dentro de los rangos y evita repetir pares en una partida', () => {
  const previous = [];
  for (let i = 0; i < 3; i++) {
    const t = makeTask('groups', [], previous);
    assert.ok(t.groups >= 2 && t.groups <= 4); assert.ok(t.each >= 2 && t.each <= 4);
    assert.ok(!previous.some(p => p.groups === t.groups && p.each === t.each)); previous.push(t);
  }
  for (let i = 0; i < 50; i++) { const t = makeTask('market', Array(4).fill({ correct: true, hints: 0 })); assert.ok(t.groups <= 6 && t.each <= 6); }
  for (let i = 0; i < 50; i++) {
    const t = makeTask('market', [...Array(3).fill({ correct: true, hints: 0 }), { correct: false, hints: 0 }]);
    assert.ok(t.groups <= 4 && t.each <= 4);
  }
});

const draft = { mode: 'groups', theme: 'forest', title: 'Un picnic en el bosque', intro: 'Kiki necesita preparar canastas de frutas para sus amigos del bosque.', ending: '¡Todos pueden compartir las frutas gracias a tu ayuda!', coachHint: 'Observa las canastas del picnic y busca que todas tengan la misma cantidad.' };
test('Gemini recibe una clave solo por encabezado y devuelve un borrador validado', async () => {
  let request;
  const generated = await generateAdventure({ mode: 'groups', theme: 'forest', apiKey: 'test-only-key', model: 'test-model', fetchImpl: async (url, options) => {
    request = { url, options }; return { ok: true, json: async () => ({ candidates: [{ finishReason: 'STOP', content: { parts: [{ text: JSON.stringify(draft) }] } }] }) };
  } });
  assert.equal(generated.published, false); assert.equal(generated.source, 'gemini');
  assert.equal(request.options.headers['x-goog-api-key'], 'test-only-key');
  assert.ok(!request.url.includes('test-only-key')); assert.ok(!request.options.body.includes('test-only-key'));
  assert.equal(JSON.parse(request.options.body).generationConfig.responseMimeType, 'application/json');
});

test('salidas inseguras, incompletas, mal formadas o de otro modo no se publican', async () => {
  assert.throws(() => validateDraft({ ...draft, intro: '<script>alert(1)</script>' }));
  assert.throws(() => validateDraft({ ...draft, mode: 'execute-code' }));
  assert.throws(() => validateDraft({ ...draft, title: 'Calcula 2 por 4' }));
  for (const response of [
    { candidates: [{ finishReason: 'MAX_TOKENS' }] },
    { promptFeedback: { blockReason: 'SAFETY' } },
    { candidates: [{ finishReason: 'STOP', content: { parts: [{ text: '{}' }] } }] },
    { candidates: [{ finishReason: 'STOP', content: { parts: [{ text: JSON.stringify({ ...draft, mode: 'market' }) }] } }] },
  ]) await assert.rejects(generateAdventure({ mode: 'groups', theme: 'forest', apiKey: 'test', model: 'test', fetchImpl: async () => ({ ok: true, json: async () => response }) }));
});

test('cuota y falta de configuración producen mensajes útiles sin filtrar la clave', async () => {
  await assert.rejects(generateAdventure({ mode: 'groups', theme: 'forest' }), /Configura/);
  await assert.rejects(generateAdventure({ mode: 'groups', theme: 'forest', apiKey: 'secret', model: 'test', fetchImpl: async () => ({ ok: false, status: 429 }) }), /cuota/);
});
