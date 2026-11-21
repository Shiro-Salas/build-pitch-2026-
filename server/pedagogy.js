const interventions = {
  unequal_groups: ['Grupos con cantidades diferentes', 'Construyan dos canastas con la misma cantidad. Pide que compare una fruta de cada canasta antes de contar el total.'],
  repeated_addition: ['Construcción de sumas repetidas', 'Relacionen cada piedra con un grupo. Pide que diga cuánto añade cada paso y que escriba la suma completa.'],
  added_factors: ['Sumó los factores en lugar de multiplicarlos', 'Dibuja tres grupos de dos objetos. Contrasta contar los grupos con contar todos los objetos y construyan la suma dos más dos más dos.'],
  counting: ['Conteo del total', 'Marquen cada objeto una sola vez mientras cuentan. Después agrupen los objetos y comprueben el total con una suma repetida.'],
  story_order: ['Orden de acontecimientos', 'Relean un cuento breve y señalen primero, después y al final. Ordenen tres tarjetas y pidan explicar qué pista del texto ayuda a decidir.'],
  living_classification: ['Seres vivos y objetos', 'Comparen una planta con un juguete. Conversen sobre crecimiento y necesidades para vivir, sin usar solamente el movimiento como criterio.'],
};

export function pedagogicalInsights(skills, attempts) {
  return skills.filter(k=>k.total>0).map(k=>{
    const evidence=attempts.filter(a=>a.subject===k.subject);
    const first=evidence.filter(a=>a.try===1);
    const initialErrors=first.filter(a=>!a.correct);
    const hinted=first.filter(a=>a.correct&&a.hints>0).length;
    const recovered=initialErrors.filter(a=>a.taskId && evidence.some(later=>later.taskId===a.taskId&&later.runId===a.runId&&later.try>1&&later.correct)).length;
    const counts={};
    // Count each task's first error once; many retries do not magnify a difficulty.
    initialErrors.forEach(a=>{if(interventions[a.error])counts[a.error]=(counts[a.error]||0)+1;});
    const top=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];
    const parts=[`${k.independent} de ${k.total} retos resueltos sin ayuda al primer intento.`];
    if(hinted)parts.push(`${hinted} ${hinted===1?'reto se resolvió':'retos se resolvieron'} al primer intento después de consultar una pista.`);
    if(initialErrors.length)parts.push(`${initialErrors.length} ${initialErrors.length===1?'reto tuvo un error inicial':'retos tuvieron un error inicial'}${recovered?`; ${recovered} ${recovered===1?'se corrigió':'se corrigieron'} después`:'.'}`+(recovered?'.':''));
    if(top)parts.push(`En ${top[1]} ${top[1]===1?'reto se observó':'retos se observó'}: ${interventions[top[0]][0].toLowerCase()}.`);
    const action=top ? interventions[top[0]][1] : initialErrors.length||hinted ? k.home+' Modela un ejemplo y deja que intente otro con menos apoyo.' : `Pide que explique cómo resolvió el reto. ${k.home} Luego cambia el contexto para comprobar si aplica la misma idea.`;
    return {subject:k.subject,name:k.name,total:k.total,independent:k.independent,initialErrors:initialErrors.length,hinted,recovered,
      stage:k.total<3?'Lectura inicial · pocos datos':'Observación en desarrollo',
      signal:initialErrors.length||hinted?'Apoyo que conviene explorar':'Señal favorable inicial',
      evidence:parts.join(' '),action,
      followUp:k.total<3?'Proponer dos retos más de esta competencia y revisar si la señal se repite.':'Retomar esta competencia en otra sesión y comparar la forma de resolver.',
      caution:k.total<3?'Esta orientación parte de uno o dos retos; puede cambiar con la siguiente actividad.':'Describe las actividades registradas; no demuestra dominio ni retención.'};
  });
}
