# PROYECTO EDTECH — PLATAFORMA INTELIGENTE DE APRENDIZAJE ADAPTATIVO, GAMIFICACIÓN Y ANÁLISIS DE FORTALEZAS PARA ESTUDIANTES DE GUATEMALA

## DOCUMENTO MAESTRO DE VISIÓN, FUNCIONALIDADES Y DESARROLLO

**Proyecto:** Plataforma académica de aprendizaje adaptativo para educación primaria.

**Categoría:** EdTech — Build & Pitch Hackathon.

**País objetivo:** Guatemala.

**Público principal:** Estudiantes de primaria de escuelas públicas y colegios privados.

**Usuarios:** Estudiantes, docentes, padres o encargados y administradores institucionales.

**Proveedor principal de IA:** Google Gemini, mediante Gemini Developer API y una API key asociada a un proyecto de Google Cloud, administrada desde Google AI Studio.

**Prioridad de producto:** Los juegos deben ser divertidos por sus mecánicas, decisiones, exploración y respuestas visuales. Gemini será una pieza central para crear aventuras variadas y contextualizadas, dentro de reglas académicas verificables. La diversión y la comprensión deberán probarse con usuarios; no se darán por garantizadas por usar IA.

**Estado de este documento:** Especificación de producto e implementación. No implica que las funcionalidades descritas ya estén construidas.

**MVP disponible en este repositorio:** La aplicación local implementa un mapa de cursos y temas, cinco juegos de matemáticas, lectura y ciencias, avatar con accesorios por semillas, rachas, tutor posterior a las respuestas, carga de materiales TXT/PDF/DOCX, generación y revisión de aventuras Gemini, voz, adaptación básica y métricas separadas por explorador de demostración para docentes y familias. El [README](../README.md) detalla cómo ejecutarla, configurar Gemini y distinguir el alcance implementado de la visión completa que sigue. Los perfiles aún no son cuentas escolares verificadas.

**Objetivo principal:** Mejorar la comprensión y el dominio de competencias académicas fundamentales mediante juegos didácticos, inteligencia artificial, aprendizaje adaptativo y seguimiento educativo.

**Objetivo complementario:** Ayudar a los docentes a identificar dificultades, fortalezas e intereses de sus estudiantes para tomar mejores decisiones pedagógicas.

---

# 1. CONTEXTO Y PROBLEMA QUE QUEREMOS RESOLVER

Estamos participando en un Build & Pitch Hackathon dentro de la categoría EdTech.

El reto consiste en desarrollar una solución tecnológica que ayude a resolver una dificultad concreta relacionada con aprender o enseñar en Guatemala.

Nuestro proyecto surge de una preocupación importante: muchos estudiantes avanzan durante su educación sin haber comprendido correctamente los conocimientos fundamentales que necesitan para continuar aprendiendo.

Según las cifras presentadas en el reto del hackathon, los resultados atribuidos a PISA 2025 para Guatemala señalan que solamente:

- El 8 % de los estudiantes evaluados alcanzó el nivel mínimo en matemáticas.
- El 17 % alcanzó el nivel mínimo en lectura.
- El 21 % alcanzó el nivel mínimo en ciencias.

Estas cifras deben verificarse contra la publicación oficial de la OCDE antes de utilizarlas públicamente en el pitch.

PISA evalúa a estudiantes de aproximadamente 15 años. Nuestro proyecto no estará dirigido directamente a esos estudiantes, sino a niños de primaria, porque buscamos fortalecer las bases del aprendizaje desde edades más tempranas.

Nuestra hipótesis es que intervenir oportunamente durante la primaria puede contribuir a evitar que las dificultades fundamentales se acumulen en grados posteriores.

## Problemas identificados

### A. Estudiantes que se quedan atrás

Un niño puede no comprender un tema, pero el programa educativo continúa avanzando.

Por ejemplo, si un estudiante no comprende la multiplicación, tendrá mayores dificultades cuando comience a trabajar divisiones, fracciones y otros conceptos.

Necesitamos identificar las dificultades a tiempo y proporcionar actividades que permitan comprenderlas.

### B. Docentes con muchos estudiantes

Un docente puede tener grupos numerosos y contar con poco tiempo para ofrecer atención individualizada.

Aunque quiera ayudar a cada estudiante, resulta complicado identificar exactamente qué habilidades domina cada uno, cuáles necesita reforzar y cuáles son sus fortalezas.

### C. Práctica sin explicaciones

Muchas plataformas y actividades solamente muestran si una respuesta es correcta o incorrecta.

Esto no garantiza comprensión.

Queremos que los estudiantes entiendan por qué se equivocaron y puedan aprender de sus errores.

### D. Familias sin herramientas de seguimiento

Los padres y encargados desean ayudar desde casa, pero frecuentemente no cuentan con información sencilla sobre el progreso académico de sus hijos.

Necesitamos ofrecer herramientas que permitan acompañar el aprendizaje sin exigir conocimientos pedagógicos avanzados.

### E. Fortalezas y capacidades que pueden pasar desapercibidas

En un grupo numeroso puede resultar difícil identificar estudiantes con habilidades destacadas en determinadas áreas.

Algunos pueden mostrar facilidad para las matemáticas, otros para la música, la lectura, las ciencias, el arte, la creatividad o el razonamiento lógico.

Queremos proporcionar al docente métricas y observaciones educativas que le ayuden a reconocer estas fortalezas y ofrecer oportunidades para desarrollarlas.

El análisis de fortalezas será una herramienta interna del docente y no se mostrará directamente a los estudiantes.

---

# 2. VISIÓN GENERAL DEL PROYECTO

Queremos construir una plataforma académica inteligente que conecte el aprendizaje escolar con experiencias interactivas y atractivas para los niños.

La plataforma debe complementar a las escuelas y colegios, nunca sustituir al docente ni a la enseñanza presencial.

El docente será responsable de organizar los contenidos académicos, habilitar temas y supervisar las actividades.

El estudiante aprenderá mediante juegos educativos, explicaciones visuales, voz, texto y retroalimentación personalizada.

La familia podrá observar el progreso académico y recibir recomendaciones para apoyar el aprendizaje desde casa.

El sistema también recopilará evidencias educativas para que el docente pueda conocer mejor las dificultades y fortalezas de sus estudiantes.

## Nuestra filosofía

NO QUEREMOS QUE LOS ESTUDIANTES ENTREN A LA PLATAFORMA ÚNICAMENTE PORQUE EL DOCENTE LES ASIGNÓ UNA TAREA.

QUEREMOS QUE DISFRUTEN APRENDER Y QUE DESEEN REGRESAR POR INICIATIVA PROPIA.

Sin embargo, nunca debemos perder el carácter académico.

No estamos construyendo solamente un videojuego.

Estamos construyendo una herramienta educativa con experiencias de juego.

La diversión debe ser un medio para facilitar el aprendizaje, no un reemplazo de este.

Queremos que un niño termine una actividad pensando:

"Antes no entendía esto y ahora sí. ¡Quiero aprender algo nuevo!"

---

# 3. OBJETIVOS DEL PROYECTO

## Objetivo general

Desarrollar una plataforma académica accesible, interactiva y adaptativa que ayude a estudiantes de primaria de Guatemala a fortalecer competencias fundamentales mediante experiencias didácticas, retroalimentación personalizada y acompañamiento docente.

## Objetivos específicos

1. Mejorar la comprensión de conceptos académicos fundamentales.
2. Identificar dificultades de aprendizaje mediante evidencias concretas.
3. Proporcionar explicaciones adaptadas a los errores del estudiante.
4. Motivar el aprendizaje autónomo mediante experiencias interactivas.
5. Facilitar al docente la administración de contenidos y actividades.
6. Ofrecer métricas académicas para supervisar el progreso individual.
7. Permitir que las familias acompañen el aprendizaje desde casa.
8. Identificar fortalezas académicas e intereses observados para apoyar las decisiones pedagógicas del docente.
9. Favorecer el acceso educativo en contextos de conectividad limitada.
10. Diseñar una solución escalable que pueda llegar progresivamente a más instituciones de Guatemala.

---

# 4. PÚBLICO OBJETIVO

La plataforma estará dirigida principalmente a estudiantes de primero a sexto primaria.

Los usuarios principales serán:

### Estudiantes

Niños de aproximadamente 6 a 12 años que necesitan practicar, reforzar o desarrollar conocimientos académicos.

### Docentes

Maestros responsables de planificar, asignar y supervisar los contenidos educativos.

### Padres o encargados

Adultos responsables que desean consultar avances y apoyar el aprendizaje desde casa.

### Administradores institucionales

Personal autorizado de escuelas o colegios encargado de gestionar cuentas, docentes, clases y configuraciones institucionales.

La experiencia debe ajustarse a las necesidades de cada perfil.

---

# 5. ESTRUCTURA DE LA PLATAFORMA

La plataforma contará con cuatro áreas funcionales.

## A. Plataforma del estudiante

Será el espacio visual, interactivo y gamificado.

El niño podrá:

- Acceder a su clase.
- Consultar los temas habilitados.
- Realizar actividades asignadas.
- Jugar minijuegos académicos.
- Escuchar explicaciones.
- Leer instrucciones.
- Recibir pistas.
- Practicar conceptos difíciles.
- Desbloquear recompensas.
- Completar misiones.
- Personalizar su personaje.
- Revisar sus logros.
- Explorar actividades educativas complementarias permitidas.

El estudiante NO podrá consultar análisis internos de fortalezas, talento, aptitudes o posibles áreas profesionales.

## B. Plataforma del docente

Será el centro de administración académica.

El docente podrá:

- Crear clases.
- Registrar estudiantes.
- Organizar materias.
- Seleccionar competencias.
- Habilitar temas.
- Crear actividades.
- Subir materiales educativos.
- Asignar tareas.
- Establecer fechas.
- Consultar resultados.
- Identificar estudiantes con dificultades.
- Revisar errores comunes.
- Consultar gráficas académicas.
- Identificar fortalezas observadas.
- Analizar intereses registrados.
- Recibir recomendaciones pedagógicas.

## C. Plataforma de padres

Permitirá el acompañamiento desde casa.

Los padres podrán consultar:

- Actividades realizadas.
- Progreso académico.
- Temas dominados.
- Temas que necesitan refuerzo.
- Evolución semanal.
- Recomendaciones familiares.
- Actividades sencillas para realizar en casa.

No tendrán acceso directo al análisis interno de talentos y posibles trayectorias profesionales.

El docente podrá utilizar esa información para orientar conversaciones educativas con la familia cuando resulte apropiado.

## D. Administración institucional

Permitirá administrar:

- Instituciones.
- Docentes.
- Clases.
- Usuarios.
- Roles.
- Configuraciones.
- Permisos.
- Seguridad.
- Acceso a contenidos.

Los administradores no deberán obtener automáticamente acceso a informes pedagógicos sensibles cuando no sea necesario para su función.

---

# 6. FUNCIONAMIENTO ACADÉMICO

La plataforma debe mantener una estructura educativa formal.

El Currículo Nacional Base de Guatemala será nuestra principal referencia curricular.

El contenido deberá organizarse mediante:

- Institución.
- Grado.
- Materia.
- Unidad.
- Competencia.
- Indicador de logro.
- Tema.
- Subtema.
- Material educativo.
- Actividad.
- Evaluación.

Las actividades deberán alinearse con los conocimientos y habilidades correspondientes al grado.

## Ejemplo

El docente selecciona:

Grado: tercero primaria.

Materia: matemáticas.

Unidad: operaciones básicas.

Tema: multiplicación.

Objetivo: comprender la multiplicación como suma repetida.

El docente habilita las actividades relacionadas.

Los estudiantes pueden acceder a ellas desde sus cuentas.

La plataforma registra las respuestas y aplica mecanismos de retroalimentación y refuerzo.

El docente consulta posteriormente los resultados.

## Control académico

El docente tendrá control sobre los temas habilitados para su clase.

La plataforma podrá recomendar ejercicios de refuerzo relacionados con los contenidos asignados.

Los estudiantes podrán explorar otros contenidos educativos solamente dentro de las opciones permitidas por la institución o el docente.

La exploración libre nunca debe reemplazar la planificación académica.

---

# 7. CARGA DE MATERIAL DOCENTE Y GENERACIÓN DE ACTIVIDADES

La plataforma debe facilitar el trabajo de los maestros.

El docente podrá seleccionar contenidos existentes y, progresivamente, incorporar sus propios materiales.

Se contempla admitir:

- PDF.
- Documentos Word.
- Archivos de texto.
- Guías de trabajo.
- Preguntas creadas por el docente.
- Ejercicios.
- Explicaciones.
- Materiales de apoyo.

La inteligencia artificial podrá analizar los materiales y proponer:

- Preguntas.
- Ejercicios.
- Explicaciones.
- Actividades interactivas.
- Evaluaciones.
- Juegos didácticos.
- Recursos de refuerzo.

El docente deberá poder revisar, modificar, aprobar o rechazar el contenido propuesto antes de publicarlo.

No queremos que la IA genere contenidos académicos sin controles.

Para el MVP podemos comenzar con una biblioteca de actividades previamente diseñadas y posteriormente incorporar la generación automática desde documentos.

---

# 8. EXPERIENCIA DEL ESTUDIANTE: APRENDER JUGANDO

Esta será una de las características más importantes para generar motivación.

La interfaz deberá parecer una aventura educativa atractiva, manteniendo objetivos de aprendizaje claros.

Proponemos desarrollar un universo de aprendizaje con:

- Mundos.
- Mapas.
- Personajes.
- Mascotas.
- Historias.
- Misiones.
- Niveles.
- Retos.
- Logros.
- Insignias.
- Recompensas.
- Elementos personalizables.

Cada mundo podrá representar una materia o conjunto de competencias.

Por ejemplo:

**Mundo de los Números**

Matemáticas, operaciones, patrones y razonamiento lógico.

**Bosque de las Palabras**

Lectura, vocabulario, comprensión y escritura.

**Laboratorio de Descubrimientos**

Ciencias, observación y experimentación.

**Mundo Creativo**

Arte, música y actividades de exploración.

Estos mundos podrán incorporarse progresivamente.

## Ejemplo de un juego

En lugar de preguntar:

"¿Cuánto es 3 × 4?"

La plataforma presenta una historia:

"Nuestro explorador necesita llevar provisiones a tres campamentos. Cada campamento necesita cuatro frutas. ¿Cuántas frutas debemos reunir?"

El estudiante observa tres grupos de cuatro frutas.

Puede agruparlas, contarlas o interactuar con ellas.

Si responde incorrectamente, la plataforma utiliza los objetos para explicar la operación.

Posteriormente presenta un ejercicio diferente para comprobar la comprensión.

El objetivo del juego es entender el concepto y aplicarlo.

---

# 9. GAMIFICACIÓN Y MOTIVACIÓN SALUDABLE

Queremos que el niño se motive a regresar.

Pero no buscamos crear dependencia de recompensas ni aumentar artificialmente el tiempo de uso.

La motivación debe desarrollarse mediante:

- Curiosidad.
- Descubrimiento.
- Autonomía.
- Sensación de progreso.
- Superación personal.
- Exploración.
- Narrativa.
- Reconocimiento del esfuerzo.

## Mecánicas propuestas

### Misiones educativas

Pequeños objetivos relacionados con competencias.

### Desbloqueo por conocimiento

Los nuevos niveles se habilitan cuando el estudiante demuestra comprensión.

### Personaje personalizable

El niño puede modificar elementos visuales de su personaje mediante recompensas educativas.

### Aventuras por capítulos

Las actividades forman parte de historias que generan continuidad.

### Insignias por competencias

Reconocimientos por conocimientos adquiridos.

### Retos de superación

El estudiante compara su progreso actual con sus propios resultados anteriores.

### Exploración educativa

Actividades complementarias que permiten descubrir conceptos nuevos.

## Reglas de diseño

No penalizar a estudiantes por equivocarse.

No castigar por dejar de conectarse.

No utilizar comparaciones públicas de rendimiento académico.

No priorizar la velocidad sobre la comprensión.

No diseñar recompensas manipulativas.

No convertir el aprendizaje en una competencia permanente entre compañeros.

---

# 10. APRENDIZAJE ADAPTATIVO

El aprendizaje adaptativo será uno de nuestros principales diferenciadores.

La plataforma debe identificar qué habilidades comprende el estudiante y cuáles necesitan refuerzo.

No todos los estudiantes deben recibir exactamente la misma explicación.

## Funcionamiento propuesto

1. El docente habilita una competencia.
2. El estudiante realiza una actividad inicial.
3. La plataforma analiza sus respuestas.
4. Identifica posibles errores conceptuales.
5. Selecciona una explicación apropiada.
6. Presenta un ejemplo visual, textual o auditivo.
7. Propone un ejercicio de refuerzo.
8. El estudiante vuelve a intentarlo.
9. Se presenta un problema nuevo para comprobar comprensión.
10. Se actualiza el progreso.
11. El docente puede revisar los resultados.

## Ejemplo

Dos estudiantes trabajan multiplicaciones.

El estudiante A comprende el concepto y resuelve correctamente diferentes problemas.

La plataforma le permite avanzar hacia actividades de aplicación.

El estudiante B confunde la multiplicación con la suma de dos números.

La plataforma le muestra grupos de objetos, sumas repetidas y ejemplos cotidianos.

Posteriormente realiza una nueva comprobación.

Ambos trabajan la misma competencia, pero reciben apoyos diferentes.

## Requisito pedagógico

Una única respuesta correcta no demuestra dominio.

Las métricas deben considerar varios ejercicios, distintos contextos, nivel de ayuda recibido y comprobaciones posteriores.

---

# 11. INTELIGENCIA ARTIFICIAL

## 11.1 Integración obligatoria con Google Gemini

Google Gemini será el proveedor principal de inteligencia artificial. Se integrará mediante Gemini Developer API desde el backend. La API key se creará en Google AI Studio para el proyecto de Google Cloud correspondiente.

No se asumirá que cualquier clave de Google Cloud sirve para Gemini. Se utilizará una clave autorizada para Gemini API y un modelo disponible para ese proyecto. Vertex AI será una alternativa futura con configuración y autenticación propias; no se intercambiarán sus endpoints o credenciales automáticamente.

La integración debe ser real y demostrable: generar una propuesta, revisarla como docente, aprobarla y jugar el contenido aprobado. Una respuesta fija no se presentará como una generación en vivo.

## 11.2 Gemini como diseñador de aventuras educativas

Gemini tendrá responsabilidades concretas:

- Crear pequeños arcos narrativos con inicio, objetivo y cierre.
- Proponer misiones vinculadas a una competencia habilitada por el docente.
- Variar personajes, situaciones y objetivos usando escenarios respetuosos del contexto de Guatemala.
- Proponer retos dentro de plantillas de juego implementadas y verificadas.
- Crear pistas progresivas que primero orienten y después expliquen con objetos y sumas repetidas.
- Preparar explicaciones para errores conocidos, como sumar los factores en lugar de multiplicarlos.
- Proponer un nuevo reto de transferencia que compruebe el mismo concepto en otro contexto.
- Redactar mensajes breves para narración y recomendaciones pedagógicas basadas en evidencias.

No habrá un chat abierto de temas arbitrarios para menores. El estudiante elegirá entre opciones aprobadas; esas decisiones podrán cambiar la aventura sin alterar la competencia asignada.

Gemini producirá datos de contenido, nunca código JavaScript, HTML ejecutable ni reglas de puntuación que el cliente ejecute. El motor de juegos interpretará exclusivamente estructuras validadas.

## 11.3 Motor híbrido: creatividad y verificación

El motor determinista será responsable de calcular respuestas, comprobar cantidades, detectar errores conocidos, seleccionar la dificultad, registrar intentos, calcular métricas y asignar recompensas.

Gemini será responsable de proponer narrativa, variaciones de contexto, pistas y explicaciones. Una salida estructurada no garantiza que el contenido sea correcto: el backend validará los datos y el docente revisará el contenido antes de publicarlo.

Para multiplicación, el servidor calculará `respuesta = grupos × elementosPorGrupo`. No confiará en un resultado calculado por Gemini ni enviado por el navegador. Los límites de factores dependerán del grado y de la configuración docente.

La dificultad se modificará con reglas explícitas: ante errores, menos objetos y más apoyo visual; ante varios aciertos sin pistas en contextos diferentes, retos de transferencia. Una sola respuesta correcta no acreditará dominio.

## 11.4 Ciclo de generación y aprobación

1. El docente selecciona grado, competencia, plantilla de juego y rango de dificultad.
2. El backend envía a Gemini únicamente esos parámetros y un resumen pedagógico sin datos personales.
3. Gemini devuelve una propuesta en JSON según un esquema definido por el servidor.
4. El backend valida estructura, longitudes, plantillas, recursos permitidos y coherencia matemática. Rechaza respuestas incompletas, bloqueadas o incompatibles.
5. El docente previsualiza el juego, corrige el contenido y lo aprueba o rechaza.
6. Se guarda una versión aprobada junto con su autor de revisión, fecha y parámetros académicos.
7. El estudiante juega esa versión; el motor adapta los retos usando las variantes y pistas aprobadas.
8. Las nuevas propuestas de Gemini quedan como borradores hasta su revisión. La aprobación de una versión no aprueba futuras generaciones.

Durante una partida no se esperará una llamada a Gemini para cada clic. Los paquetes aprobados incluirán suficiente contenido para mantener una experiencia fluida y permitir refuerzos inmediatos.

## 11.5 API key, configuración y límites

Variables de entorno previstas, exclusivamente del servidor:

```dotenv
GEMINI_API_KEY=CONFIGURAR_EN_EL_SERVIDOR
GEMINI_MODEL=MODELO_GEMINI_DISPONIBLE_EN_TU_PROYECTO
GEMINI_TIMEOUT_MS=15000
GEMINI_MAX_OUTPUT_TOKENS=3000
```

Estos nombres definen el contrato de configuración del proyecto; deberán implementarse al construir el backend. El modelo se elegirá comprobando disponibilidad, calidad en español, latencia y coste. No se fijará un nombre de modelo sin verificarlo.

La clave nunca se incluirá en el frontend, variables `VITE_*`, repositorio, almacenamiento del navegador, respuestas API ni registros. En desarrollo se usará un `.env` ignorado por Git; en despliegue, el gestor de secretos del entorno.

El backend aplicará autenticación, autorización docente, límites de generación por usuario e institución, límite de concurrencia, tiempo máximo de espera y presupuesto de uso. Los errores de cuota, autenticación, contenido bloqueado y conectividad se mostrarán al docente con mensajes útiles sin revelar secretos.

Se permitirá como máximo un reintento para errores transitorios, respetando las indicaciones de espera del servicio y el presupuesto. No se reintentará automáticamente una clave inválida. La configuración concreta de límites deberá verificarse con pruebas.

Se almacenarán paquetes aprobados para reutilizarlos. Si Gemini no está configurado o falla, el estudiante continuará con una biblioteca revisada. La interfaz docente distinguirá claramente entre generación Gemini, contenido reutilizado y biblioteca local.

## 11.6 Privacidad y contenido adecuado

No se enviarán nombres, correos, identificadores de estudiantes, grabaciones de voz ni historiales identificables. Se usarán parámetros como grado, competencia, tipo de error y nivel de apoyo, sin un identificador persistente del menor.

Las instrucciones de generación exigirán español claro, textos breves, contenido apropiado para primaria y ausencia de humillación, violencia o estereotipos. Se configurarán los controles de seguridad disponibles del proveedor y se mantendrá la revisión docente.

Los materiales subidos serán tratados como contenido para analizar, no como instrucciones que puedan modificar permisos o reglas del sistema. Ninguna salida de Gemini concederá acceso a información privada o herramientas externas.

## 11.7 Referencias oficiales de implementación

- [Claves y proyectos de Gemini API](https://ai.google.dev/gemini-api/docs/api-key).
- [Respuestas estructuradas y esquemas](https://ai.google.dev/gemini-api/docs/structured-output).
- [API de generación de contenido](https://ai.google.dev/api/generate-content).
- [SDK oficial de JavaScript y TypeScript](https://github.com/googleapis/js-genai).

Consultar estas referencias al implementar para confirmar los modelos y contratos vigentes.

---

# 12. VOZ, TEXTO E INTERACCIÓN VISUAL

La plataforma debe facilitar diferentes formas de aprender.

## Aprendizaje mediante voz

El personaje podrá:

- Leer preguntas.
- Explicar conceptos.
- Narrar historias.
- Dar pistas.
- Ofrecer retroalimentación.
- Felicitar el esfuerzo.

## Aprendizaje mediante texto

La interfaz mostrará:

- Instrucciones sencillas.
- Preguntas.
- Explicaciones breves.
- Ejemplos.
- Retroalimentación.
- Recomendaciones educativas.

## Aprendizaje visual e interactivo

Incluir actividades como:

- Arrastrar objetos.
- Contar elementos.
- Construir figuras.
- Ordenar secuencias.
- Agrupar conceptos.
- Resolver rompecabezas.
- Completar patrones.
- Interactuar con simulaciones.

## Reconocimiento de voz

En etapas posteriores, el estudiante podrá responder oralmente o explicar su razonamiento mediante un micrófono.

Esta función será opcional.

La plataforma deberá mantener alternativas de texto e interacción táctil para estudiantes que no puedan o no quieran utilizar voz.

---

# 13. MÉTRICAS ACADÉMICAS

Queremos comprobar si el estudiante realmente aprende.

No debemos medir únicamente cuántos juegos completa.

El sistema registrará evidencias relacionadas con:

### Rendimiento

- Respuestas correctas.
- Respuestas incorrectas.
- Desempeño por competencia.
- Dificultad de los ejercicios.
- Errores recurrentes.

### Comprensión

- Problemas resueltos sin pistas.
- Problemas resueltos después de una explicación.
- Aplicación del concepto en situaciones diferentes.
- Evaluaciones de comprobación.

### Evolución

- Resultado inicial.
- Resultado posterior.
- Cambio en el desempeño.
- Progreso durante diferentes sesiones.

### Retención

- Resultados de actividades posteriores.
- Capacidad de recordar conocimientos.
- Aplicación de habilidades después de varios días.

### Participación

- Actividades completadas.
- Frecuencia de participación.
- Actividades elegidas voluntariamente.
- Tiempo de práctica.

La participación no deberá confundirse con aprendizaje.

## Indicadores

El sistema podrá mostrar:

- Dominio estimado por competencia.
- Temas pendientes.
- Necesidades de refuerzo.
- Evolución académica.
- Actividades completadas.
- Mejora respecto a evaluaciones anteriores.

Los porcentajes deberán calcularse mediante criterios transparentes.

No debemos presentar estadísticas falsas ni afirmar mejoras sin evidencias suficientes.

---

# 14. MÓDULO EXCLUSIVO DOCENTE: OBSERVATORIO DE FORTALEZAS Y DESARROLLO ESTUDIANTIL

Esta es una funcionalidad diferenciadora muy importante.

Además de identificar las dificultades académicas, queremos ayudar al docente a conocer mejor las fortalezas e intereses que sus estudiantes van demostrando.

El objetivo será identificar oportunidades de desarrollo educativo que podrían pasar desapercibidas.

## REGLA FUNDAMENTAL

**EL OBSERVATORIO DE FORTALEZAS SERÁ EXCLUSIVO DEL PERFIL DOCENTE.**

El estudiante NO tendrá acceso a este módulo.

La familia NO tendrá acceso directo al análisis interno completo.

La herramienta será utilizada por docentes autorizados para apoyar decisiones pedagógicas.

No se deberá incluir el módulo de fortalezas en el menú, dashboard o perfil del estudiante.

Tampoco se deberán enviar al estudiante notificaciones que revelen clasificaciones internas de talento o posibles trayectorias profesionales.

## 14.1 ¿Qué analizará el observatorio?

El sistema podrá analizar progresivamente diferentes áreas:

- Matemáticas.
- Pensamiento lógico.
- Comprensión lectora.
- Escritura.
- Comunicación.
- Ciencias.
- Pensamiento espacial.
- Música.
- Arte.
- Creatividad.
- Pensamiento computacional.
- Resolución de problemas.
- Colaboración.

Cada dimensión deberá contar con actividades específicas y evidencias suficientes para poder evaluarla.

No debemos inferir talento musical si no hemos realizado actividades relacionadas con música.

No debemos inferir creatividad únicamente por una calificación de matemáticas.

## 14.2 Dimensiones de análisis

El observatorio deberá diferenciar varias dimensiones.

### Dominio académico

Qué competencias demuestra comprender el estudiante.

### Evolución individual

Cuánto ha mejorado respecto a sus resultados anteriores.

### Facilidad observada

Qué habilidades consigue aplicar de manera consistente y con menor necesidad de apoyo, teniendo en cuenta sus conocimientos previos.

### Intereses

Qué actividades el estudiante manifiesta disfrutar o selecciona voluntariamente.

### Retención

Qué conocimientos conserva después de cierto tiempo.

### Aplicación

Qué tan bien utiliza conocimientos en problemas nuevos.

### Participación

Cómo interactúa con las actividades educativas.

Estas dimensiones deberán presentarse de forma diferenciada.

La velocidad no deberá interpretarse como una medida de inteligencia.

El desempeño no deberá considerarse un indicador fijo de talento innato.

## 14.3 Ejemplo: fortalezas matemáticas

Un estudiante presenta:

- Buenos resultados en patrones numéricos.
- Comprensión consistente de operaciones.
- Buen desempeño en razonamiento lógico.
- Mejoras sostenidas en problemas matemáticos.

El sistema podrá mostrar al docente:

**Fortaleza observada: razonamiento lógico-matemático.**

Evidencias:

- Buen desempeño en diferentes ejercicios.
- Consistencia en problemas nuevos.
- Aplicación de conocimientos.
- Progreso sostenido.

Recomendaciones:

- Problemas de lógica.
- Construcción.
- Rompecabezas.
- Programación inicial.
- Robótica educativa.
- Experimentos científicos.

Posibles campos para explorar a largo plazo:

- Ingeniería.
- Ciencias.
- Matemáticas.
- Tecnología.
- Informática.

Estas áreas deben presentarse como referencias educativas, nunca como predicciones profesionales.

## 14.4 Ejemplo: fortalezas musicales

Un estudiante participa en actividades de ritmo, escucha y patrones musicales.

Demuestra interés constante y mejora en diferentes ejercicios.

El sistema podrá mostrar al docente:

**Interés y habilidad musical observados.**

Evidencias:

- Identificación de patrones rítmicos.
- Participación voluntaria.
- Evolución en ejercicios musicales.
- Aplicación de conceptos.

Recomendaciones:

- Actividades de ritmo.
- Exploración de instrumentos.
- Composición sencilla.
- Juegos musicales.
- Proyectos creativos.

Posibles áreas para explorar:

- Música.
- Composición.
- Educación musical.
- Producción musical.
- Tecnología del sonido.

La plataforma no deberá afirmar que el estudiante necesariamente será músico.

## 14.5 Otras áreas de exploración

Matemáticas y lógica pueden relacionarse con ingeniería, informática y ciencias.

Lectura y comunicación pueden relacionarse con escritura, literatura, docencia y comunicación.

Ciencias pueden relacionarse con biología, investigación, salud y medioambiente.

Arte y creatividad pueden relacionarse con diseño, animación, arquitectura y artes visuales.

Las relaciones entre competencias y campos profesionales serán orientativas.

Nunca deben limitar las oportunidades educativas del estudiante.

## 14.6 Mapa visual de fortalezas

El docente podrá consultar gráficos que representen:

- Desempeño por materia.
- Dominio por competencia.
- Evolución individual.
- Áreas con mejores resultados.
- Intereses registrados.
- Recomendaciones pedagógicas.

Se pueden utilizar:

- Gráficos de barras.
- Gráficos de evolución.
- Mapas de competencias.
- Indicadores por nivel.
- Gráficos radiales cuando existan mediciones comparables.

Los resultados deberán contar con explicaciones y evidencias.

Si no existe información suficiente, el sistema deberá mostrar:

"Información insuficiente para identificar una tendencia".

Nunca deberá inventar porcentajes de talento o probabilidades de éxito profesional.

## 14.7 Uso pedagógico

El observatorio debe ayudar al docente a:

- Identificar estudiantes que podrían beneficiarse de actividades avanzadas.
- Reconocer intereses que requieren oportunidades de exploración.
- Diseñar actividades de enriquecimiento.
- Detectar fortalezas que no siempre aparecen en las calificaciones.
- Equilibrar refuerzo académico y desarrollo de capacidades.
- Conocer mejor las necesidades de su grupo.

El docente tendrá la última palabra.

La IA solamente proporcionará observaciones orientativas basadas en evidencias.

---

# 15. RESTRICCIONES DE VISIBILIDAD DEL OBSERVATORIO

Este punto es obligatorio en el diseño de la plataforma.

## ESTUDIANTE

Puede consultar:

- Sus misiones.
- Sus actividades.
- Sus logros.
- Sus recompensas.
- Su progreso en juegos.
- Sus contenidos habilitados.
- Sus habilidades académicas completadas.
- Sus próximas actividades.

NO puede consultar:

- Mapa de fortalezas.
- Análisis de talentos.
- Inferencias sobre aptitudes.
- Comparaciones con compañeros.
- Posibles carreras.
- Recomendaciones vocacionales internas.
- Informes pedagógicos privados.

## DOCENTE

Puede consultar:

- Resultados de sus estudiantes.
- Dificultades académicas.
- Evolución de competencias.
- Fortalezas observadas.
- Intereses registrados.
- Evidencias de aprendizaje.
- Recomendaciones pedagógicas.
- Posibles áreas de exploración.

Únicamente podrá acceder a estudiantes bajo su responsabilidad y autorización.

## PADRE O ENCARGADO

Puede consultar:

- Resultados académicos.
- Progreso.
- Actividades.
- Necesidades de refuerzo.
- Recomendaciones para casa.

No puede consultar directamente:

- Clasificaciones de talento.
- Mapa interno de fortalezas.
- Inferencias vocacionales.
- Informes docentes privados.

El docente podrá compartir observaciones relevantes mediante comunicación apropiada y supervisada.

## ADMINISTRADOR

Podrá gestionar usuarios, instituciones, clases y permisos.

No deberá tener acceso irrestricto al observatorio por el simple hecho de administrar la plataforma.

## REQUISITO TÉCNICO

Las restricciones deben implementarse tanto en frontend como en backend.

No basta con ocultar botones.

Las rutas, servicios y endpoints deberán comprobar permisos.

La base de datos deberá garantizar que un estudiante no pueda acceder a información reservada para docentes.

---

# 16. DASHBOARD DOCENTE

El docente tendrá una interfaz profesional y fácil de utilizar.

## Vista general

Deberá incluir:

- Clases activas.
- Número de estudiantes.
- Actividades pendientes.
- Actividades completadas.
- Rendimiento general.
- Competencias trabajadas.
- Alertas educativas.

## Vista por clase

Permitirá identificar:

- Estudiantes que necesitan refuerzo.
- Competencias con mayores dificultades.
- Temas dominados.
- Avances del grupo.
- Recomendaciones de intervención.

## Vista individual

Permitirá consultar:

- Historial académico.
- Resultados por competencia.
- Errores recurrentes.
- Evolución.
- Actividades realizadas.
- Necesidades de refuerzo.

## Observatorio de fortalezas

Sección privada que incluirá:

- Fortalezas observadas.
- Evidencias.
- Intereses.
- Evolución por área.
- Recomendaciones de enriquecimiento.
- Posibles áreas educativas para explorar.

El docente podrá utilizar esta información para diseñar experiencias de aprendizaje más apropiadas.

---

# 17. DASHBOARD DE PADRES

El panel familiar deberá ser sencillo y comprensible.

La familia podrá conocer:

- Qué temas estudió su hijo.
- Cuántas actividades completó.
- Qué habilidades ha mejorado.
- Qué temas necesita practicar.
- Cómo evoluciona su aprendizaje.
- Qué actividades puede realizar en casa.

## Ejemplo de informe familiar

"Esta semana se trabajaron las multiplicaciones como suma repetida."

"Tu hijo ha mejorado al resolver problemas con grupos de objetos."

"Todavía necesita reforzar algunas operaciones."

"Recomendamos practicar agrupando objetos cotidianos en casa."

El objetivo será acompañar el aprendizaje y no presionar al estudiante.

El panel familiar no mostrará análisis vocacionales ni clasificaciones internas de talento.

---

# 18. EXPERIENCIA EN CASA Y EN LA ESCUELA

La plataforma funcionará en dos contextos.

## En la escuela

1. El docente habilita contenidos.
2. Los estudiantes realizan actividades.
3. La plataforma identifica dificultades.
4. Se ofrecen explicaciones.
5. Los estudiantes practican.
6. Se registran avances.
7. El docente consulta resultados y fortalezas observadas.

## En casa

1. El estudiante ingresa a sus actividades.
2. Continúa practicando.
3. Realiza juegos de refuerzo.
4. Explora actividades permitidas.
5. Recibe retroalimentación.
6. Sus padres consultan el progreso académico.

La experiencia en casa debe complementar la planificación del docente.

---

# 19. ACCESIBILIDAD Y CONTEXTO DE GUATEMALA

Queremos llegar a la mayor cantidad posible de estudiantes.

Por lo tanto, debemos diseñar considerando:

- Teléfonos Android de gama baja.
- Pantallas pequeñas.
- Conexiones lentas.
- Acceso intermitente a internet.
- Dispositivos compartidos.
- Limitaciones económicas.
- Diferentes niveles de lectura.
- Diferentes necesidades de accesibilidad.

## Requisitos

- Diseño mobile-first.
- Interfaz ligera.
- Bajo consumo de datos.
- Carga rápida.
- Optimización de imágenes.
- Opciones de audio descargado o previamente almacenado.
- Actividades disponibles sin conexión cuando sea viable.
- Almacenamiento local temporal.
- Sincronización posterior.
- Navegación sencilla.
- Botones grandes.
- Explicaciones claras.

El uso de IA en línea deberá contar con alternativas cuando no exista conectividad.

Podemos utilizar explicaciones y actividades previamente preparadas para mantener funciones educativas básicas sin internet.

En futuras etapas se podrán incorporar idiomas mayas, mediante traducciones revisadas por personas competentes y especialistas educativos.

---

# 20. PRIVACIDAD, SEGURIDAD Y RESPONSABILIDAD EDUCATIVA

La plataforma trabajará con menores de edad.

La privacidad y seguridad deben formar parte del diseño desde el principio.

## Requisitos

- Autenticación segura.
- Autorización por roles.
- Protección de información personal.
- Separación de información por institución.
- Acceso restringido a datos académicos.
- Consentimiento de responsables cuando corresponda.
- Minimización de datos personales.
- Protección de información de voz.
- Control de acceso al observatorio docente.
- Prevención de exposición de datos entre estudiantes.
- Eliminación y retención controlada de información.
- Revisión de las obligaciones legales aplicables.

La IA no deberá elaborar diagnósticos psicológicos ni determinar de forma definitiva las capacidades o el futuro de un menor.

La identificación de fortalezas no deberá producir etiquetas permanentes, discriminación ni restricciones académicas.

Las recomendaciones deberán ser revisables y estar acompañadas de evidencias.

---

# 21. EXPERIENCIA VISUAL Y DISEÑO UX/UI

La plataforma deberá mantener una identidad gráfica propia.

## Estudiante

Interfaz:

- Colorida.
- Amigable.
- Dinámica.
- Ilustrada.
- Interactiva.
- Con personajes.
- Con animaciones moderadas.
- Con navegación intuitiva.

Debe parecer una aventura educativa, no una página tradicional de tareas.

## Docente

Interfaz:

- Profesional.
- Moderna.
- Clara.
- Organizada.
- Con dashboards.
- Con gráficas.
- Con herramientas de administración académica.

Debe permitir comprender la situación de una clase sin navegar por demasiadas pantallas.

## Padres

Interfaz:

- Sencilla.
- Comprensible.
- Visual.
- Con información relevante.
- Con recomendaciones prácticas.

## Identidad unificada

Aunque cada perfil tenga una experiencia diferente, todos deben pertenecer visualmente al mismo producto.

La plataforma debe transmitir:

- Educación.
- Innovación.
- Confianza.
- Curiosidad.
- Accesibilidad.
- Progreso.
- Descubrimiento.

---

# 22. ARQUITECTURA TECNOLÓGICA PROPUESTA

La arquitectura debe ser modular, segura y escalable.

## Frontend

Tecnologías sugeridas:

- React.
- TypeScript.
- Vite.
- Tailwind CSS.
- Componentes reutilizables.
- PWA para mejorar el soporte sin conexión.

## Backend

Tecnologías sugeridas:

- Node.js.
- Express o NestJS.
- API REST.
- Autenticación.
- Autorización por roles.
- Servicios modulares.

## Base de datos

Se propone PostgreSQL.

Entidades principales:

- Institución.
- Usuario.
- Rol.
- Estudiante.
- Docente.
- Padre o encargado.
- Relación familiar.
- Clase.
- Inscripción.
- Materia.
- Unidad.
- Competencia.
- Tema.
- Material educativo.
- Actividad.
- Pregunta.
- Respuesta.
- Intento.
- Evaluación.
- Resultado.
- Progreso.
- Error identificado.
- Refuerzo asignado.
- Recompensa.
- Logro.
- Interés observado.
- Fortaleza observada.
- Evidencia de fortaleza.
- Recomendación pedagógica.

## Servicios

La solución podrá organizarse en:

1. Servicio de autenticación y autorización.
2. Gestión de instituciones.
3. Gestión académica.
4. Gestión de clases.
5. Biblioteca de contenidos.
6. Motor de actividades.
7. Motor de juegos.
8. Motor de evaluación.
9. Motor de aprendizaje adaptativo.
10. Sistema de gamificación.
11. Analítica académica.
12. Observatorio docente de fortalezas.
13. Recomendaciones pedagógicas.
14. Integración con IA.
15. Servicio de voz.
16. Sincronización de actividades.

No es necesario desplegar cada componente como un microservicio independiente.

Para el hackathon se recomienda comenzar con una arquitectura modular sencilla que pueda crecer posteriormente.

## Seguridad

Toda operación sensible deberá verificar identidad, rol e institución.

Los endpoints privados del observatorio nunca deberán devolver datos a estudiantes ni familias.

---

# 23. ALCANCE DEL MVP DEL HACKATHON

Nuestro principal objetivo es demostrar una experiencia educativa completa.

No intentaremos desarrollar todos los grados, materias y funcionalidades simultáneamente.

## Propuesta inicial

Comenzar con:

**Grado:** tercero primaria.

**Materia:** matemáticas.

**Tema:** multiplicación como suma repetida.

**Competencia:** comprender y aplicar la multiplicación mediante agrupaciones y problemas cotidianos.

Esta selección es una propuesta inicial y deberá validarse según los contenidos del CNB y las necesidades educativas identificadas.

## Funcionalidades indispensables

### Docente

- Inicio de sesión.
- Panel básico.
- Creación o selección de clase.
- Selección de tema.
- Habilitación de actividad.
- Consulta de resultados.

### Estudiante

- Acceso a actividad.
- Personaje educativo.
- Juego interactivo.
- Explicación en texto.
- Explicación mediante voz.
- Retroalimentación.
- Refuerzo adaptativo.
- Progreso y recompensas.

### Familia

- Consulta básica del progreso.
- Recomendaciones para casa.

### Sistema

- Registro de respuestas.
- Detección de errores conocidos.
- Selección de refuerzo.
- Evaluación posterior.
- Actualización de métricas.

### Observatorio docente

Durante el MVP, incluir una versión limitada y funcional.

Podrá mostrar:

- Desempeño matemático.
- Dominio de competencias evaluadas.
- Evolución.
- Fortalezas observadas dentro de esa materia.
- Recomendaciones de enriquecimiento.

No mostrará indicadores musicales, artísticos o científicos si todavía no existen actividades que permitan medirlos.

El observatorio completo y multidisciplinario será una funcionalidad de expansión.

---

# 24. DEMOSTRACIÓN PRINCIPAL PARA EL JURADO

La demostración deberá contar una historia educativa.

## Escenario

Un docente trabaja con una clase de tercero primaria.

Está enseñando multiplicaciones.

Uno de sus estudiantes tiene dificultades para comprender el concepto.

### Paso 1: El docente habilita la actividad

Ingresa al panel académico.

Selecciona matemáticas y multiplicaciones.

Habilita el juego.

### Paso 2: El estudiante comienza una aventura

Ingresa a su cuenta.

Su personaje le presenta una misión.

Debe resolver un problema de multiplicación para ayudar a completar un objetivo dentro del juego.

### Paso 3: El estudiante comete un error

Selecciona una respuesta incorrecta.

La plataforma identifica una dificultad relacionada con el concepto.

### Paso 4: Recibe retroalimentación

El personaje explica el problema mediante voz, texto y objetos visuales.

El estudiante puede interactuar con los elementos.

### Paso 5: Practica nuevamente

La plataforma presenta un ejercicio de refuerzo enfocado en la dificultad identificada.

### Paso 6: Demuestra comprensión

El estudiante resuelve otro problema que evalúa la misma competencia en un contexto diferente.

### Paso 7: Se actualiza el progreso

El sistema registra la actividad, el resultado, las pistas utilizadas y la evolución del estudiante.

### Paso 8: El docente revisa las métricas

Puede identificar qué dificultades presentó el estudiante y qué avances consiguió.

### Paso 9: Observatorio de fortalezas

En una sección exclusiva, el docente puede consultar las fortalezas observadas y recomendaciones basadas en las actividades disponibles.

Los datos deben distinguirse claramente entre resultados reales de la demostración y datos ficticios de ejemplo.

### Paso 10: La familia consulta el avance

El encargado observa qué competencia trabajó el estudiante y qué puede practicar en casa.

## Resultado esperado

El jurado observa un ciclo completo:

Docente → Actividad → Juego → Error → Explicación → Refuerzo → Comprobación → Métricas → Intervención educativa.

No se debe depender de pantallas estáticas para simular el funcionamiento principal.

---

# 25. MÉTRICAS PARA DEMOSTRAR IMPACTO

El hackathon valorará el impacto.

Debemos demostrar que la plataforma hace algo más que entretener.

## Indicadores principales

- Cambio entre evaluación inicial y posterior.
- Porcentaje de ejercicios resueltos sin ayuda.
- Reducción de errores conceptuales.
- Cantidad de refuerzos necesarios.
- Capacidad de resolver problemas diferentes.
- Tiempo de práctica, como indicador contextual y no como resultado educativo principal.

## Validación

Si es posible, realizar una prueba pequeña con estudiantes, mediante autorización de los responsables y supervisión docente.

Se puede aplicar:

1. Evaluación inicial.
2. Actividad educativa.
3. Ejercicios de refuerzo.
4. Evaluación posterior.

Si el tiempo lo permite, realizar otra comprobación días después para observar retención.

No debemos afirmar que la plataforma produjo mejoras de aprendizaje sin contar con evidencias adecuadas.

Los datos de demostración deberán identificarse claramente cuando sean ficticios.

---

# 26. DIFERENCIADORES COMPETITIVOS

Nuestro proyecto debe destacar por cinco razones principales.

## 1. Enfoque académico real

No es una aplicación educativa desconectada de las escuelas.

El docente habilita contenidos y supervisa el aprendizaje.

## 2. Aprendizaje adaptativo

La plataforma no solamente califica.

Identifica dificultades y presenta actividades apropiadas.

## 3. Experiencia atractiva

Los niños aprenden mediante misiones, historias, voz, texto y juegos.

## 4. Acompañamiento educativo

Docentes y familias pueden consultar métricas para comprender el progreso.

## 5. Observatorio de fortalezas

El docente cuenta con información adicional para identificar capacidades observadas y oportunidades de desarrollo que podrían pasar desapercibidas.

Este módulo no clasifica definitivamente a los estudiantes ni predice su profesión.

Ofrece evidencias y recomendaciones pedagógicas.

---

# 27. ESTRATEGIA PARA GANAR EL BUILD & PITCH HACKATHON

Queremos maximizar nuestras oportunidades en originalidad, impacto y calidad de demostración.

## Originalidad

Mostrar una solución que conecta:

- Control académico docente.
- Juegos interactivos.
- Aprendizaje adaptativo.
- Explicaciones con IA.
- Voz y texto.
- Analítica de progreso.
- Observatorio de fortalezas exclusivo para docentes.

## Impacto

Demostrar un problema educativo concreto y cómo el producto ayuda a resolverlo.

El impacto principal debe centrarse en la comprensión del estudiante.

El observatorio será un valor agregado, no una distracción respecto al problema principal.

## Calidad del demo

El jurado debe poder interactuar con una experiencia real.

Debe observar:

- Una actividad habilitada.
- Un estudiante practicando.
- Una dificultad detectada.
- Una explicación útil.
- Una segunda oportunidad.
- Métricas actualizadas.
- Un docente tomando una decisión.

## Escalabilidad

Explicar cómo la solución puede extenderse a:

- Más competencias.
- Más materias.
- Más grados.
- Más instituciones.
- Más idiomas.
- Más tipos de actividades.
- Más herramientas docentes.

El producto debe demostrar una visión de largo plazo sin intentar implementarlo todo durante el hackathon.

---

# 28. VISIÓN A LARGO PLAZO

Nuestra meta es llegar progresivamente a la mayor cantidad posible de estudiantes de primaria de Guatemala.

Queremos ayudar a fortalecer conocimientos fundamentales.

También queremos dar a los docentes herramientas para reconocer oportunidades de desarrollo académico y personal.

En futuras etapas se podrán incorporar:

- Todos los grados de primaria.
- Matemáticas.
- Comprensión lectora.
- Ciencias.
- Arte.
- Música.
- Programación inicial.
- Actividades de creatividad.
- Experiencias de descubrimiento.
- Analítica educativa avanzada.
- Integración institucional.
- Actividades sin internet.
- Recursos en idiomas mayas.

El proyecto podrá explorar alianzas con escuelas, colegios, organizaciones educativas y otros actores interesados.

No debemos prometer que una sola plataforma mejorará directamente el puntaje nacional de PISA.

Nuestra contribución será fortalecer competencias fundamentales, permitir intervenciones tempranas y generar evidencia sobre el aprendizaje.

---

# 29. PRINCIPIOS OBLIGATORIOS DEL PROYECTO

Estos principios nunca deben perderse.

1. El estudiante es nuestra prioridad principal.
2. La plataforma mantiene un enfoque académico.
3. El docente conserva el control de los contenidos.
4. El aprendizaje se relaciona con el currículo.
5. Los juegos están al servicio de la comprensión.
6. Los errores se convierten en oportunidades de aprendizaje.
7. El progreso debe basarse en evidencias.
8. La IA debe tener funciones educativas concretas.
9. La motivación debe ser saludable.
10. La plataforma debe resultar atractiva para los niños.
11. El docente necesita herramientas prácticas.
12. Las familias deben poder acompañar el aprendizaje.
13. La plataforma debe considerar la realidad tecnológica de Guatemala.
14. El análisis de fortalezas será exclusivo del docente.
15. Los estudiantes no podrán acceder a los informes internos de talentos.
16. Las familias no tendrán acceso directo al observatorio docente.
17. Ningún algoritmo debe decidir qué profesión tendrá un niño.
18. Las recomendaciones deben ser orientativas y basadas en evidencias.
19. Todos los estudiantes deben conservar oportunidades para explorar cualquier área.
20. Las fortalezas pueden evolucionar con el tiempo.
21. Los resultados no deben utilizarse para etiquetar permanentemente a los estudiantes.
22. La privacidad de los menores debe protegerse.
23. El MVP debe centrarse en una experiencia educativa funcional.
24. No debemos sacrificar calidad por acumular funcionalidades.
25. El impacto educativo debe ser más importante que las métricas de interacción.

---

# 30. INSTRUCCIONES FINALES PARA LA IA O EL EQUIPO QUE UTILICE ESTE DOCUMENTO

Analiza integralmente todo el proyecto antes de comenzar a desarrollarlo.

No reduzcas la solución a:

- Un chatbot educativo genérico.
- Una aplicación de preguntas y respuestas.
- Un sistema de tareas tradicional.
- Un videojuego sin objetivos académicos.
- Una plataforma de estadísticas sin intervención educativa.

Queremos una solución integral que conecte la planificación del docente, las experiencias del estudiante y el seguimiento académico.

## Prioridades de desarrollo

**PRIORIDAD 1 — INDISPENSABLE**

- Gestión de usuarios y roles.
- Clases y contenidos habilitados por docentes.
- Juego educativo funcional.
- Detección de errores.
- Retroalimentación explicativa.
- Refuerzo adaptativo.
- Registro de progreso.

**PRIORIDAD 2 — MUY IMPORTANTE**

- Narración mediante voz.
- Gamificación.
- Dashboard docente.
- Seguimiento familiar.
- Métricas por competencia.
- Observatorio docente básico basado en evidencias.

**PRIORIDAD 3 — EXPANSIÓN**

- Generación de actividades desde documentos.
- Más juegos y materias.
- Exploración musical y artística.
- Mapas multidisciplinarios de fortalezas.
- Reconocimiento de voz.
- Funciones avanzadas sin conexión.
- Analítica educativa longitudinal.
- Más recursos de accesibilidad.

## Antes de escribir código

Se debe definir:

1. El problema educativo exacto del MVP.
2. Los perfiles y permisos.
3. Los flujos principales.
4. Las pantallas necesarias.
5. Las reglas de aprendizaje.
6. Las métricas de evaluación.
7. La estructura de datos.
8. Los módulos del backend.
9. Los componentes del frontend.
10. Las integraciones con IA y voz.
11. El alcance de la demostración.
12. Los criterios para determinar si el MVP cumple su propósito.

Todas las decisiones deberán conservar la visión educativa.

## Pregunta que debe guiar cada funcionalidad

"¿Esta característica ayuda a que un niño aprenda mejor, comprenda un concepto, supere una dificultad o permite que su docente tome una mejor decisión educativa?"

Si la respuesta es no, no debe formar parte de las prioridades iniciales.

---

# 31. PROPUESTA DE VALOR DEFINITIVA

Somos una plataforma académica inteligente para escuelas y colegios de Guatemala que transforma los contenidos habilitados por los docentes en experiencias interactivas de aprendizaje.

Mediante juegos educativos, explicaciones en voz y texto, inteligencia artificial y actividades adaptativas, ayudamos a los estudiantes a comprender conceptos, aprender de sus errores y desarrollar competencias fundamentales.

Ofrecemos a los docentes herramientas para identificar dificultades, medir el progreso y descubrir fortalezas observadas que pueden orientar mejores oportunidades de aprendizaje.

Además, permitimos a las familias acompañar el desarrollo académico desde casa.

Nuestra visión es contribuir a una educación más personalizada, motivadora y accesible para los niños de Guatemala.

---

# 32. FRASE CENTRAL DEL PROYECTO

"No queremos que los niños aprendan solamente para ganar un juego. Queremos que jueguen, descubran, comprendan y desarrollen sus capacidades hasta darse cuenta de todo lo que pueden lograr."

## FRASE SOBRE EL OBSERVATORIO DOCENTE

"No queremos decirles a los niños qué pueden llegar a ser. Queremos darles a sus maestros mejores herramientas para descubrir y desarrollar todo su potencial."

## VISIÓN FINAL

Construir una plataforma donde el estudiante encuentre una aventura educativa, el docente encuentre un aliado inteligente y la familia encuentre una forma sencilla de acompañar el aprendizaje.

Una herramienta que no solamente ayude a superar dificultades, sino que permita reconocer oportunidades de desarrollo, sin limitar el futuro de ningún estudiante.

Nuestro objetivo es comenzar resolviendo un problema educativo concreto, demostrar resultados reales durante el hackathon y establecer las bases de una solución capaz de generar un impacto educativo positivo y duradero en Guatemala.
