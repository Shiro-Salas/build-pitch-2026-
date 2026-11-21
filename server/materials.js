import { fork } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { courses } from './curriculum.js';
export async function extractMaterial(body) {
  const course = courses.find(c => c.id === body.subject);
  if (!course || !course.topics.some(t => t.id === body.topic)) throw new Error('Selecciona una materia y un tema compatibles.');
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  if (title.length < 3 || title.length > 100) throw new Error('Escribe un título de entre tres y cien caracteres.');
  let text = typeof body.text === 'string' ? body.text.trim() : '';
  let filename = null;
  if (body.base64) {
    if (typeof body.base64 !== 'string' || !/^[A-Za-z0-9+/]*={0,2}$/.test(body.base64)) throw new Error('Archivo ilegible.');
    const bytes = Buffer.from(body.base64, 'base64');
    if (bytes.length > 2 * 1024 * 1024) throw new Error('El archivo debe pesar como máximo dos MB.');
    if (typeof body.filename !== 'string' || body.filename.length > 150) throw new Error('Nombre de archivo inválido.');
    filename = body.filename.replace(/[^\p{L}\p{N}._ -]/gu, '_');
    const extension = filename.split('.').at(-1).toLowerCase();
    if (!['txt', 'md', 'pdf', 'docx'].includes(extension)) throw new Error('Usa TXT, Markdown, PDF con texto o Word DOCX.');
    if (extension === 'pdf' && bytes.subarray(0,5).toString() !== '%PDF-') throw new Error('El archivo no es un PDF válido.');
    if (extension === 'docx' && bytes.subarray(0,2).toString() !== 'PK') throw new Error('El archivo no es un DOCX válido.');
    text = await new Promise((resolve, reject) => {
      const worker = fork(new URL('./material-worker.js', import.meta.url), [], { execArgv: ['--max-old-space-size=128'], stdio: ['ignore', 'ignore', 'ignore', 'ipc'], windowsHide: true });
      let received = false;
      const timer = setTimeout(() => { worker.kill(); reject(new Error('El documento tardó demasiado. Usa un archivo más pequeño.')); }, 12000);
      worker.once('message', result => { received = true; clearTimeout(timer); result.error ? reject(new Error(result.error)) : resolve(result.text); });
      worker.once('error', () => { clearTimeout(timer); reject(new Error('No se pudo leer el documento. Prueba con texto plano.')); });
      worker.once('exit', () => { clearTimeout(timer); if (!received) reject(new Error('No se pudo procesar este documento.')); });
      worker.send({ base64: bytes.toString('base64'), extension });
    });
  }
  if (text.length < 40 || text.length > 20000) throw new Error('El material debe contener entre cuarenta y veinte mil caracteres.');
  return { id:randomUUID(), title, subject:course.id, topic:body.topic, text, filename, createdAt:new Date().toISOString() };
}
