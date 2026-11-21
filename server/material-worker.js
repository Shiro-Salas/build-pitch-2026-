process.once('message', async workerData => {
let result;
try {
  const buffer = Buffer.from(workerData.base64, 'base64');
  let text;
  if (workerData.extension === 'pdf') {
    const { PDFParse } = await import('pdf-parse');
    const parser = new PDFParse({ data: buffer });
    try {
      const info = await parser.getInfo();
      if (info.total > 30) throw new Error('Usa un PDF de hasta treinta páginas.');
      text = (await parser.getText()).text;
    } finally { await parser.destroy(); }
  } else if (workerData.extension === 'docx') {
    const mammoth = await import('mammoth');
    text = (await mammoth.default.extractRawText({ buffer })).value;
  } else text = new TextDecoder('utf-8', { fatal: true }).decode(buffer);
  text = text.replace(/\u0000/g, '').trim();
  if (text.length < 40) throw new Error('No se encontró suficiente texto. Para un documento escaneado, pega una transcripción.');
  if (text.length > 20000) throw new Error('El material supera veinte mil caracteres. Sube un fragmento más corto.');
  result = { text };
} catch (error) { result = { error: error.message }; }
process.send(result, () => process.disconnect());
});
