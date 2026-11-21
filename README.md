# Sabionautas

MVP local para primaria en Guatemala. Un mapa ilustrado organiza Matemáticas, Comunicación y Ciencias Naturales en montañas: curso → tema → juego. Kiki, un quetzal personalizable, acompaña cinco mecánicas. Gemini crea aventuras a partir del material docente y responde dudas después de cada respuesta.

## Ejecutar

Requiere Node.js 22.13 o posterior. Incluye `mammoth` y `pdf-parse` para extraer texto de documentos.

```powershell
npm install
npm start
```

Abre [Sabionautas](http://127.0.0.1:3000). También puedes usar `npm run dev` para reiniciar el servidor al editar sus archivos. Recarga el navegador para ver cambios del frontend.

El selector **Vista demo** permite probar Estudiante, Docente y Familia. Sin configuración, la contraseña docente es `quetzal-demo`. La app escucha exclusivamente en la interfaz local `127.0.0.1`.

## Activar Gemini

1. Crea una clave de Gemini en [Google AI Studio](https://aistudio.google.com/apikey), asociada a tu proyecto Google Cloud. No se admite automáticamente cualquier clave de otro servicio de Google Cloud; esta integración utiliza Gemini Developer API, no Vertex AI.
2. Copia `.env.example` como `.env` en la raíz del proyecto.
3. Define `GEMINI_API_KEY`, `GEMINI_MODEL` con un modelo disponible en tu proyecto que admita salida estructurada, y una contraseña propia en `TEACHER_PASSWORD`.
4. Reinicia `npm start`, entra como Docente y selecciona **Crear borrador con Gemini**.
5. Revisa y edita la historia y los retos con sus respuestas; usa **Probar juego** y después **Aprobar y habilitar**. El borrador no aparece en el espacio del estudiante hasta su aprobación.

La clave solo se utiliza desde el servidor, mediante el encabezado `x-goog-api-key`. No se envía al navegador ni se almacena en el repositorio. `.env` y `data/` están ignorados por Git. Consulta la [documentación oficial de claves](https://ai.google.dev/gemini-api/docs/api-key) y [salidas estructuradas](https://ai.google.dev/gemini-api/docs/structured-output).

No se incluye una clave ni un modelo supuesto. Sin configuración, los cinco juegos de la biblioteca funcionan completamente. El tutor muestra ayuda preparada identificada como tal. Los errores de cuota, modelo, autenticación, seguridad y tiempo de espera se muestran al docente; no se presentan respuestas locales como generaciones de Gemini. La generación tiene un tiempo máximo de 15 segundos, una llamada concurrente, cinco intentos por minuto y cincuenta por día por proceso. El tutor admite tres llamadas simultáneas, ocho consultas por minuto y cuarenta al día por estudiante, hasta doscientas diarias en total. Los contadores se reinician al reiniciar el servidor; no sustituyen controles de presupuesto del proveedor.

## Qué puedes jugar

- **El picnic de los quetzales:** agregar y quitar frutas hasta construir grupos iguales.
- **Puentes sobre el lago:** colocar piedras que representan sumandos y hacer saltar a Kiki entre plataformas sobre una cascada animada.
- **El mercado del volcán:** contar frutas agrupadas y completar un pedido.
- **El jardín de las historias:** leer un cuento y ordenar sus tres acontecimientos.
- **Detectives de la naturaleza:** clasificar seres vivos y objetos sin vida.

Cada aventura contiene tres retos. En matemáticas, las primeras actividades usan factores entre dos y cuatro; varios aciertos sin ayuda permiten factores hasta seis. Las frutas y piedras se pueden arrastrar, con alternativas por clic y teclado. Los errores reciben explicaciones verificadas por las reglas del juego. Después de responder aparece un espacio para consultar dudas sobre ese ejercicio. La voz usa la síntesis del navegador cuando está disponible, sin grabar al estudiante; los sonidos se activan voluntariamente.

Se obtienen diez créditos al resolver cada reto y quince al completar la aventura. Las pistas y los errores no restan recompensas. No hay temporizadores de presión, pérdida de vidas ni clasificación pública.

**Mi mascota** reúne seis compañeros y ocho accesorios. Se desbloquean por créditos acumulados, sin gastarlos al equipar:

| Mascota | Créditos |
| --- | ---: |
| Kiki, quetzal inicial | 0 |
| Bambú, panda | 200 |
| Chispa, zorro | 1000 |
| Burbuja, ajolote | 1300 |
| Luna, búho | 1600 |
| Sol, jaguar | 2000 |

| Accesorio | Créditos |
| --- | ---: |
| Corbatín | 200 |
| Sombrero de sol | 500 |
| Lentes de explorador | 700 |
| Corona del saber | 1000 |
| Sombrero estelar | 1300 |
| Medalla de aventura | 1600 |
| Flor del bosque | 2000 |
| Casco sabionauta | 2500 |

Las mascotas tienen ilustraciones vectoriales propias y aparecen en el mapa, los clics y las plataformas. Los cambios de mascota y accesorio se validan en el servidor y se guardan por explorador. Si un accesorio equipado con los umbrales anteriores ya no cumple el nuevo mínimo, se muestra sin accesorio hasta alcanzar su meta; los créditos existentes se conservan.

La mochila contiene 17 logros con progreso: primeros retos, aventuras completadas, autonomía, materias, rachas de 3/7/14 días y metas de créditos. Los logros de racha usan la mejor racha histórica, por lo que no se pierden al descansar. La racha diaria usa el horario de Guatemala. Las animaciones respetan la preferencia de movimiento reducido.

## Material docente

Desde **Docente → Subir material de clase**, selecciona materia y tema y pega texto o carga TXT, Markdown, PDF con texto o DOCX. Límite: 2 MB, 30 páginas PDF y 20.000 caracteres extraídos; mínimo 40 caracteres. Los escaneos requieren transcripción. La extracción se ejecuta en un proceso aislado con tiempo máximo de 12 segundos. Se guarda solo el texto, que puedes revisar antes de usarlo.

Elige ese material en el estudio de aventuras. Al generar, se envía a Gemini su texto académico; subirlo por sí solo no lo envía al proveedor. Las materias y temas están acotados a multiplicación, secuencias narrativas y seres vivos. Los retos generados se validan, se pueden editar y requieren publicación docente. Las preguntas al tutor no se guardan en el archivo de progreso.

Gemini produce contenido dentro de mecánicas programadas: no genera código ejecutable. El servidor calcula y verifica todas las respuestas, conserva una copia de la aventura al iniciar la partida y comprueba que siga habilitada. Una edición publicada se aplica a nuevas partidas.

## Evidencias y permisos

El progreso se guarda en `data/demo.json`, mediante sustitución atómica del archivo. El porcentaje sin ayuda utiliza solo la primera respuesta de cada reto: corregir un error después no lo convierte en un acierto independiente. Las métricas distinguen pistas, errores y aventuras terminadas. El observatorio requiere rol docente en el servidor; estudiantes y familias reciben únicamente métricas académicas generales.

El docente puede crear **varios exploradores de demostración**, con créditos, accesorios, intentos y rachas separados. La tabla de clase muestra competencias destacadas y sugerencias de refuerzo; el detalle muestra errores y evolución por materia. Familia presenta actividades practicadas, autonomía y propuestas para acompañar en casa. Las señales se basan en intentos observados, no prueban retención ni constituyen diagnósticos.

El panel docente presenta una cabecera ilustrada, tarjetas de habilidades por materia e indicadores de clase, una gráfica de los últimos siete días, distribución de necesidades de acompañamiento y un próximo paso sugerido. El reporte familiar presenta autonomía en un anillo, barras por materia y evolución semanal. Las gráficas utilizan primeras respuestas reales, dejan vacíos los días sin actividad y ofrecen una tabla accesible. No representan porcentajes de currículo completado.

Estudiante y Familia son accesos de demostración con un selector de perfiles; no autentican personas ni representan relaciones familiares reales. El docente utiliza una contraseña de servidor y una sesión con cookie HttpOnly/SameSite. No se deben cargar datos personales de menores en esta demo.

Pendiente para uso institucional: autenticación individual, administración de instituciones y clases, vinculación familiar, base de datos multiusuario, HTTPS, límites distribuidos, gestión de consentimientos, evaluación curricular y pedagógica, accesibilidad con usuarios, sincronización sin conexión y respaldo de datos. El servidor local debe permanecer accesible para jugar; la biblioteca permite jugar sin conexión a Gemini, pero no es una PWA sin conexión.

## Verificación

```powershell
npm test
```

Las 19 pruebas cubren cinco mecánicas, errores, adaptación, métricas por estudiante, desbloqueos, rachas, tutor y generación con Gemini simulado, extracción real de TXT/DOCX/PDF, permisos HTTP, publicación, finalización de partidas y persistencia. Para verificar Gemini real se necesita una clave y un modelo configurados.

Recorrido recomendado para la demo: juega una misión, provoca un error, solicita una pista, corrige la respuesta y completa los tres retos. Después consulta Docente → Observatorio y la vista Familia. Si Gemini está configurado, crea y aprueba una nueva aventura, vuelve a Estudiante y juégala.

## Archivos

- `server/index.js`: servidor HTTP, sesiones, autorización, almacenamiento y endpoints.
- `server/game.js` y `server/curriculum.js`: mecánicas, cursos, adaptación, rachas y métricas.
- `server/gemini.js`: generación, tutor contextual y validación de contenido.
- `server/materials.js` y `server/material-worker.js`: extracción aislada de documentos.
- `public/`: mapa ilustrado, mascotas SVG, colecciones, juegos y vistas docente/familiar adaptables.
- `test/`: pruebas con el runner nativo de Node.js.
- [Documento maestro adaptado a Gemini](docs/PROYECTO_EDTECH_GEMINI.md): visión completa y especificación de expansión. Sus requisitos futuros exceden lo implementado en este MVP; este README describe el alcance actual.


## Orientación desde los primeros intentos

El observatorio analiza desde un reto registrado: distingue autonomía, pistas, errores iniciales y correcciones posteriores. Cada materia practicada muestra lo observado, una acción concreta y una próxima comprobación. Con uno o dos retos se etiqueta como lectura inicial; no se presenta como dominio consolidado. Sin respuestas no se inventan conclusiones. El análisis es local y funciona aunque Gemini no esté disponible.

Los errores del tutor distinguen permisos (403), cuota (429), modelo no disponible (404) y tiempo de espera. Si Gemini falla, se identifica la explicación preparada y se muestra al docente el último error sanitizado, sin claves ni respuestas crudas del proveedor. El último error es temporal y se borra al recibir una respuesta correcta del servicio o reiniciar el servidor.

Si aparece 403, comprueba en Google AI Studio el acceso del proyecto y en Google Cloud las restricciones de la clave y la disponibilidad de Generative Language API. Un error genérico de acceso no permite identificar por sí solo qué restricción concreta lo causa. No es lo mismo que agotar una cuota de solicitudes (429).
