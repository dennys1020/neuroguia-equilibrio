/* ==========================================================================
   NeuroGuía · Módulo "Equilibrio y control postural" (Grupo 3)
   --------------------------------------------------------------------------
   Uso:
     const modulo = NeuroGuia.Equilibrio.mount(elemento, {
       assetsPath: 'modulos/equilibrio/assets/', // ruta a los íconos SVG
       syncHash:   true,      // refleja la navegación en location.hash (botón atrás)
       hashPrefix: 'equilibrio',
       onExit:     () => router.go('/motora') // regresar a la app anfitriona
     });
     modulo.navigate({ view: 'tool', tool: 'romberg', tab: 'descripcion' });
     modulo.destroy();

   Todo queda encapsulado en este IIFE; lo único que se expone es
   window.NeuroGuia.Equilibrio. El DOM generado usa clases `ngeq-*` (BEM).
   ========================================================================== */
(function (global) {
  'use strict';

  /* ------------------------------------------------------------------------
     1. Ruta por defecto de los assets: carpeta "assets/" junto a este script
     ------------------------------------------------------------------------ */
  var SCRIPT_SRC = (document.currentScript && document.currentScript.src) || '';
  var DEFAULT_ASSETS = SCRIPT_SRC ? SCRIPT_SRC.replace(/[^/]*$/, '') + 'assets/' : 'assets/';

  /* ------------------------------------------------------------------------
     2. CONTENIDO (transcrito del prototipo de Figma, Equipo 3)
     ------------------------------------------------------------------------ */

  /** Pestañas de la ficha de herramienta (contenido extenso), rejilla 3×2. */
  var TABS = [
    { key: 'proposito',   label: 'Qué evalúa',   icon: 'target' },
    { key: 'descripcion', label: 'Cómo usar',    icon: 'file-text' },
    { key: 'equipo',      label: 'Materiales',   icon: 'briefcase-medical' },
    { key: 'formacion',   label: 'Quién aplica', icon: 'graduation-cap' },
    { key: 'validacion',  label: 'Evidencia',    icon: 'shield-check' },
    { key: 'referencias', label: 'Fuentes',      icon: 'book-open' }
  ];

  var COSTO_PENDIENTE = 'Información de costos pendiente de confirmar.';

  /** Subáreas del área y las herramientas que contienen. */
  var SUBAREAS = [
    { key: 'tronco',   label: 'Control de tronco',  tools: ['tis', 'tct'],
      text: 'Equilibrio sentado, coordinación y transiciones del tronco. El documento incluye TIS y TCT para personas con daño neurológico.' },
    { key: 'estatico', label: 'Equilibrio estático', tools: ['unipodal', 'romberg'],
      text: 'Estabilidad postural y mantenimiento de una posición. Incluye la Estación Unipodal y la prueba de Romberg (ojos abiertos y cerrados).' },
    { key: 'dinamico', label: 'Equilibrio dinámico', tools: ['tinetti', 'tug'],
      text: 'Equilibrio y marcha durante acciones como levantarse, caminar, girar y volver a sentarse. El documento incluye Tinetti y Timed Up and Go.' }
  ];

  /** Fichas de herramientas. `titles` sobrescribe el título de la tarjeta por pestaña. */
  var TOOLS = {
    tis: {
      stats: [['17', 'ítems'], ['10–15', 'minutos'], ['Libre', 'sin licencia ni costo']],
      need: ['Camilla o silla sin apoyabrazos', 'Cronómetro', 'Pauta impresa'],
      keys: 'trunk impairment scale tronco sentado sedente coordinacion subescala acv accidente cerebrovascular neurorehabilitacion',
      short: 'TIS', name: 'Trunk Impairment Scale (TIS)', area: 'Control de tronco', subarea: 'tronco',
      video: { url: 'https://www.youtube.com/watch?v=-9tiR-V2UTM', label: 'YouTube · Ver demostración ↗' },
      content: {
        proposito: 'Valora equilibrio sentado, control selectivo y coordinación del tronco después de un accidente cerebrovascular (ACV).',
        costo: 'Libre: no requiere licencia ni pago.',
        poblacion: 'Estudiada inicialmente en personas con ACV. Para otras condiciones neurológicas, consultar la evidencia de esa población.',
        descripcion: 'Consta de 17 ítems.',
        equipo: 'Camilla o cama firme, sin respaldo ni apoyabrazos; altura que permita apoyar los pies. Cronómetro para ítems temporizados y hoja de puntuación. El evaluador permanece cerca para proteger al paciente.',
        tiempo: 'Menos de 20 minutos; el estudio original registró entre 2 y 18. La preparación y los descansos pueden ampliar la sesión.',
        formacion: 'Profesional de salud familiarizado con la pauta y la protección durante la sedestación. Leer el protocolo y practicar la puntuación; la base institucional no exige un curso certificado específico.',
        validacion: 'Verheyden et al. (2004): 28 pacientes con ACV. Fiabilidad total test-retest ICC 0.96 y entre observadores 0.99. Estos datos corresponden a esa muestra; no demuestran validación en todos los países.',
        referencias: 'Fuentes transcritas del documento proporcionado. Verheyden G et al. (2004). The Trunk Impairment Scale: a new tool to measure motor impairment of the trunk after stroke. Clinical Rehabilitation, 18(3), 326–334. DOI: 10.1191/0269215504cr733oa. Guía de materiales y aplicación: RehabMeasures, Shirley Ryan AbilityLab.'
      }
    },
    tct: {
      stats: [['4', 'ítems'], ['5–10', 'minutos'], ['—', 'costo por confirmar']],
      need: ['Camilla o cama estable', 'Cronómetro', 'Hoja de registro'],
      keys: 'trunk control test tronco giro supino sentado incorporacion transferencias',
      short: 'TCT', name: 'Trunk Control Test (TCT)', area: 'Control de tronco', subarea: 'tronco',
      video: { url: 'https://www.youtube.com/watch?v=KsfnHkm99eY', label: 'YouTube · Ver demostración ↗', sub: 'Physiotutors · Inglés' },
      content: {
        proposito: 'Observa cuatro movimientos básicos del tronco: girar hacia ambos lados, incorporarse desde acostado y mantener el equilibrio sentado.',
        costo: COSTO_PENDIENTE,
        poblacion: 'Principalmente adultos con secuelas de ACV. La evidencia depende del diagnóstico y del momento de evaluación.',
        descripcion: 'Cuatro ítems: giro al lado débil, giro al lado fuerte, equilibrio sentado e incorporación. Cada ítem admite 0, 12 o 25 puntos; total 0–100. Registrar la forma de ejecución y la ayuda utilizada.',
        equipo: 'Camilla o cama estable para giros e incorporación. Cronómetro para observar 30 segundos de equilibrio sentado; hoja de registro y bolígrafo. No requiere aparatos electrónicos de medición.',
        tiempo: 'Menos de 5 minutos de aplicación, según RehabMeasures. Añadir tiempo para explicar, colocar al paciente y permitir descansos.',
        formacion: 'Profesional que haya leído el artículo o manual, conozca los criterios 0/12/25 y pueda proteger al paciente durante los cambios de posición.',
        validacion: 'Collin y Wade (1990): estudio piloto de fiabilidad tras ACV. Es una medida breve; su evidencia y sensibilidad dependen de la población. Un total alto puede ocultar diferencias sutiles de control del tronco.',
        referencias: 'Fuentes transcritas del documento proporcionado. Collin C, Wade DT. (1990). Assessing motor impairment after stroke: a pilot reliability study. J Neurol Neurosurg Psychiatry, 53(7), 576–579. DOI: 10.1136/jnnp.53.7.576. Guía de aplicación: RehabMeasures, Shirley Ryan AbilityLab. https://pubmed.ncbi.nlm.nih.gov/2391521/'
      }
    },
    tinetti: {
      stats: [['16', 'ítems'], ['10–15', 'minutos'], ['—', 'costo por confirmar']],
      need: ['Silla firme sin apoyabrazos', 'Cronómetro', 'Cinta métrica', 'Pasillo de 8 m'],
      keys: 'marcha caidas caminar sedente bipedo dinamico gait pauta',
      short: 'Tinetti', name: 'Escala de Tinetti', area: 'Equilibrio estático y dinámico', subarea: 'dinamico',
      pdf: { file: 'pauta-tinetti.pdf', label: 'Descargar pauta (PDF)' }, // pauta imprimible
      video: { url: 'https://www.youtube.com/watch?v=HU34ofZqrIA', label: 'YouTube · Ver demostración ↗', sub: 'Physiotutors · Inglés',
               card: { title: 'Demostración de Tinetti', meta: 'YouTube · Physiotutors', small: 'Video en inglés · Enlace externo' } },
      titles: { validacion: 'Evidencia ECU–CHI–MÉX' },
      content: {
        proposito: 'Observa equilibrio y marcha durante tareas cotidianas: sentarse, levantarse, mantenerse de pie, girar y caminar. Permite registrar en qué tareas aparecen dificultades.',
        costo: COSTO_PENDIENTE,
        poblacion: 'Personas mayores.',
        descripcion: 'Pauta del curso: 16 ítems, con equilibrio hasta 16 puntos y marcha hasta 12; total hasta 28. Descarga la pauta en PDF para imprimirla y registrar cada respuesta y las observaciones. El análisis posterior corresponde al equipo evaluador.',
        equipo: 'Silla firme sin ruedas y sin apoyabrazos para la pauta aportada. Cronómetro, cinta métrica, hoja de registro y pasillo seguro de unos 8 m según el documento del curso. Mantener la misma versión al comparar resultados.',
        tiempo: 'Aproximadamente 10–15 minutos para equilibrio y marcha. Puede aumentar con explicaciones, descansos y medidas de protección.',
        formacion: 'Profesional familiarizado con la pauta. El documento del curso propone dos personas: una indica las tareas y otra protege al paciente. Conocer los criterios de cada respuesta antes de puntuar.',
        validacion: 'Tinetti (1986) desarrolló la evaluación. Rodríguez-Guevara y Lugo-Agudelo (2012) estudiaron una versión para población colombiana. Esto no confirma por sí solo validación en Ecuador, Chile y México.',
        referencias: 'Fuentes transcritas del documento proporcionado. Tinetti ME. (1986). Performance-oriented assessment of mobility problems in elderly patients. J Am Geriatr Soc, 34(2), 119–126. DOI: 10.1111/j.1532-5415.1986.tb05480.x. Rodríguez-Guevara C, Lugo-Agudelo LH. (2012). Validez y confiabilidad de la Escala de Tinetti para población colombiana. Rev Colomb Reumatol, 19(4), 218–233.'
      }
    },
    unipodal: {
      stats: [['1', 'prueba · 3 intentos por pierna'], ['≈5', 'minutos'], ['—', 'costo por confirmar']],
      need: ['Cronómetro', 'Espacio seguro, plano y sin obstáculos'],
      keys: 'una pierna apoyo pie unipodal estatico caidas efam single leg stance',
      short: 'Estación Unipodal', name: 'Estación Unipodal', area: 'Equilibrio estático', subarea: 'estatico',
      video: { url: 'https://www.youtube.com/watch?v=A9pi7_JRgwQ', label: 'Ver evaluación en YouTube ↗', sub: 'Physiotutors · Inglés' },
      // "Continuar lectura" en Cómo usar abre una segunda página de la tarjeta
      more: {
        descripcion: {
          title: 'Cómo usar · Continuación',
          label: 'Interpretación del documento',
          text: 'Un tiempo reducido de apoyo unipodal, particularmente inferior a 5 segundos, se asocia con mayor riesgo de caídas. El PDF no precisa la población ni el protocolo de referencia para este umbral.'
        }
      },
      content: {
        proposito: 'Mide cuánto tiempo se mantiene el apoyo sobre una pierna. Describe una tarea de equilibrio estático y permite comparar ambos lados bajo las mismas condiciones.',
        costo: COSTO_PENDIENTE,
        poblacion: 'Se ha estudiado en adultos de distintas edades. Los valores de referencia de Springer et al. corresponden a adultos sanos; no deben trasladarse automáticamente a pacientes neurológicos.',
        descripcion: 'Registrar lado, ojos abiertos o cerrados, posición de brazos, calzado, número de intentos y tiempo en segundos. No mezclar protocolos al comparar. Finalizar el intento al apoyar el pie o necesitar ayuda.',
        equipo: 'Cronómetro; suelo firme, plano y despejado; hoja para anotar cada pierna e intento. Evaluador al alcance del paciente para prevenir una caída. Una superficie de espuma corresponde a otra condición de prueba.',
        tiempo: 'Unos 5 minutos como organización de la sesión del curso. El tiempo máximo de cada intento depende del protocolo seleccionado y debe registrarse.',
        formacion: 'Profesional capaz de explicar y demostrar la posición, controlar el cronómetro y proteger ante pérdida de equilibrio. Documentar cualquier adaptación.',
        validacion: 'Springer et al. (2007): 549 adultos sanos, con desempeño dependiente de la edad. Fiabilidad entre evaluadores alta para el mejor de tres intentos. No usar 5 segundos como diagnóstico universal.',
        referencias: 'Fuentes transcritas del documento proporcionado. Springer BA, Marin R, Cyhan T, Roberts H, Gill NW. (2007). Normative values for the unipedal stance test with eyes open and closed. J Geriatr Phys Ther, 30(1), 8–15. DOI: 10.1519/00139143-200704000-00003. Guía: RehabMeasures, Single leg stance. https://pubmed.ncbi.nlm.nih.gov/19839175/'
      }
    },
    romberg: {
      stats: [['2', 'condiciones: ojos abiertos y cerrados'], ['≈30', 'segundos con ojos cerrados'], ['—', 'costo por confirmar']],
      need: ['Superficie firme y plana', 'Cronómetro', 'Hoja de observaciones'],
      keys: 'romberg ojos cerrados propiocepcion vestibular ataxia sensitiva cerebelosa pies juntos estatico',
      short: 'Prueba de Romberg', name: 'Prueba de Romberg', area: 'Equilibrio estático', subarea: 'estatico',
      video: { url: 'https://www.youtube.com/watch?v=AeItSsg2Pko', label: 'Ver maniobra en YouTube ↗', sub: 'iBCS · Español' },
      // Infografía mostrada en "Cómo usar"
      figure: { file: 'romberg-infografia.png', width: 506, height: 605,
                alt: 'Infografía de la prueba de Romberg: sistemas sensoriales del equilibrio, árbol de decisión con ojos abiertos y cerrados, causas de Romberg positivo y comparación entre resultado normal, ataxia cerebelosa y ataxia sensitiva.',
                caption: 'Infografía «Romberg Test: Assessment of Postural Stability» (en inglés).' },
      more: {
        descripcion: {
          title: 'Cómo usar · Interpretación',
          label: 'Tipo de ataxia según el resultado',
          text: 'Romberg positivo: orienta a ataxia sensitiva (propioceptiva) o vestibular, no cerebelosa. Romberg negativo con inestabilidad: en la ataxia cerebelosa la persona es inestable con ojos abiertos y cerrados. Causas frecuentes de Romberg positivo: déficit de vitamina B12 (degeneración combinada subaguda), tabes dorsal (neurosífilis), neuropatía periférica diabética, polineuropatía desmielinizante inflamatoria crónica (CIDP), neuropatías de fibra gruesa y trastornos vestibulares (p. ej., enfermedad de Ménière).'
        }
      },
      content: {
        proposito: 'Valora la estabilidad postural de pie. El equilibrio integra tres sistemas: visión, propiocepción (columnas dorsales y fibras periféricas gruesas) y función vestibular; se necesitan al menos dos intactos para mantener la postura. Al cerrar los ojos se retira la visión y se pone a prueba la propiocepción y el sistema vestibular.',
        costo: COSTO_PENDIENTE,
        poblacion: 'Personas que pueden mantenerse de pie con seguridad durante una exploración neurológica.',
        descripcion: 'Paciente de pie, pies juntos y brazos a los lados. Observar primero con ojos abiertos (los tres sistemas contribuyen) y después con ojos cerrados, siempre con protección. Negativo (normal): se mantiene estable con ojos cerrados unos 30 segundos sin apoyo. Positivo: estable con ojos abiertos, pero se vuelve inestable o cae al cerrarlos.',
        equipo: 'Superficie firme, plana y despejada. Cronómetro y hoja de observaciones. Profesional muy próximo para evitar caídas. La espuma corresponde a una variante, no al Romberg clásico.',
        tiempo: 'Breve: unos 30 segundos con ojos cerrados, más la observación con ojos abiertos.',
        formacion: 'Profesional formado en exploración neurológica y protección de pie. Debe distinguir la prueba clásica de sus variantes y describir la respuesta observada.',
        validacion: 'Prueba clínica cualitativa: el resultado es negativo (normal) o positivo, sin puntaje total. Un resultado positivo orienta a ataxia sensitiva o vestibular; requiere contexto clínico y otras pruebas para identificar la causa.',
        referencias: 'Romberg Test. StatPearls, NCBI Bookshelf: equipo, personal, preparación y técnica. Infografía «Romberg Test: Assessment of Postural Stability» aportada por el equipo. https://www.ncbi.nlm.nih.gov/books/NBK563187/'
      }
    },
    tug: {
      stats: [['1', 'recorrido de 3 m'], ['3–4', 'minutos'], ['—', 'costo por confirmar']],
      need: ['Silla con respaldo y apoyabrazos', 'Marca o cono a 3 m', 'Cronómetro'],
      keys: 'timed up and go levantate anda levantarse caminar marcha caidas silla 3 metros',
      short: 'Timed Up and Go', name: 'Timed Up and Go (TUG)', area: 'Equilibrio dinámico', subarea: 'dinamico',
      video: { url: 'https://www.youtube.com/watch?v=grrYoBucNPE', label: 'YouTube · Ver demostración ↗', sub: 'Physiotutors · Inglés' },
      titles: { validacion: 'Evidencia ECU–CHI–MÉX' },
      content: {
        proposito: 'Cuantifica movilidad funcional: levantarse de una silla, caminar 3 m, girar, regresar y sentarse. Se registra el tiempo y se observa la calidad del movimiento.',
        costo: COSTO_PENDIENTE,
        poblacion: 'Personas mayores.',
        descripcion: 'Desde una silla con apoyabrazos: levantarse, caminar 3 m a paso habitual, girar, volver y sentarse. Cronometrar desde la orden de inicio hasta sentarse de nuevo. Registrar segundos, ayuda de marcha y observaciones.',
        equipo: 'Silla estándar estable con apoyabrazos; cronómetro; cinta métrica y marca a 3 m; recorrido despejado. Calzado habitual y ayuda de marcha si se utiliza. El evaluador acompaña cerca para proteger.',
        tiempo: 'El documento del curso reserva 3–4 minutos para preparar y aplicar. El resultado del recorrido se expresa en segundos; no confundir ambos tiempos.',
        formacion: 'Profesional familiarizado con la pauta, el inicio y fin del cronometraje y la protección durante el giro. Mantener instrucciones y condiciones al repetir.',
        validacion: 'Podsiadlo y Richardson (1991) estudiaron fiabilidad y relación con otras medidas de movilidad en 60 personas mayores. Los puntos de corte dependen de población y protocolo; el análisis lo realiza el evaluador.',
        referencias: 'Fuentes transcritas del documento proporcionado. Podsiadlo D, Richardson S. (1991). The timed Up & Go: a test of basic functional mobility for frail elderly persons. J Am Geriatr Soc, 39(2), 142–148. DOI: 10.1111/j.1532-5415.1991.tb01616.x. Procedimiento y materiales: CDC STEADI, Assessment Timed Up & Go (2017). https://pubmed.ncbi.nlm.nih.gov/1991946/'
      }
    }
  };

  /** Glosario (del prototipo «App Médica», con términos agregados para Romberg). */
  var GLOSARIO = [
    { t: 'Ataxia', d: 'Falta de coordinación de los movimientos. Puede ser sensitiva (por falta de propiocepción), vestibular o cerebelosa.' },
    { t: 'Bípedo', d: 'De pie, con el apoyo de ambos pies.' },
    { t: 'Decúbito supino', d: 'Acostado boca arriba. Es la posición inicial del TCT.' },
    { t: 'EFAM', d: 'Examen Funcional del Adulto Mayor (Chile). De él viene el criterio de la estación unipodal: 5 segundos o más es normal.' },
    { t: 'Indemne', d: 'Sin daño; que se conserva completo. «Control de tronco indemne» es el puntaje máximo de la TIS.' },
    { t: 'Ítem', d: 'Cada tarea de una escala que recibe un puntaje. La TIS tiene 17 ítems agrupados en 3 subescalas.' },
    { t: 'Neurorehabilitación', d: 'Rehabilitación de personas con lesiones o enfermedades del sistema nervioso, como un accidente cerebrovascular.' },
    { t: 'Pauta', d: 'Hoja con las instrucciones y la forma de puntuar un instrumento.' },
    { t: 'Plano transversal', d: 'Giro del cuerpo alrededor de su eje vertical, como al rotar los hombros o la pelvis.' },
    { t: 'Propiocepción', d: 'Información que el cuerpo recibe sobre la posición de sus articulaciones; viaja por las columnas dorsales y las fibras periféricas gruesas.' },
    { t: 'Punto de corte', d: 'Puntaje que separa un resultado normal de uno alterado. En la TIS, menos de 14 a 16 puntos.' },
    { t: 'Romberg positivo', d: 'La persona está estable con ojos abiertos, pero se vuelve inestable o cae al cerrarlos. Orienta a ataxia sensitiva o vestibular.' },
    { t: 'Sedente', d: 'Sentado.' },
    { t: 'Subescala', d: 'Parte de una escala que evalúa un aspecto y tiene su propio puntaje. La suma de las subescalas da el total.' },
    { t: 'Transferencias', d: 'Cambios de posición o de superficie, como pasar de la cama a la silla.' },
    { t: 'Vestibular', d: 'Relativo al oído interno, que informa sobre la posición y el movimiento de la cabeza.' }
  ];

  var TAB_TITLES = { referencias: 'Fuentes' }; // títulos por defecto distintos de la etiqueta

  var HORAK = 'El equilibrio permite mantener la estabilidad al estar quietos y al movernos. Integra la visión, el sistema vestibular y la sensibilidad corporal para orientar el cuerpo y responder a cambios de apoyo. Fuente: Horak (2006).';

  var BIBLIO = [
    'Hospital Carlos Van Buren, & Universidad de Valparaíso. (s. f.). Timed Up and Go (TUG). Escuela de Kinesiología, Facultad de Medicina.',
    'Ministerio de Salud de Chile. (s. f.). Manual de aplicación del Examen de Medicina Preventiva del Adulto Mayor (EMPAM). División de Prevención y Control de Enfermedades, Subsecretaría de Salud Pública.',
    'Ozal, C., Ari, G., & Gunel, M. K. (2019). Inter-intra observer reliability and validity of the Turkish version of Trunk Control Measurement Scale in children with cerebral palsy.',
    'Rodríguez-Guevara, C., & Lugo-Agudelo, L. H. (2012). Validez y confiabilidad de la Escala de Tinetti para población colombiana. Revista Colombiana de Reumatología, 19(4), 218–233.',
    'Ramezani, K., Kalantari, M., Pashmdarfard, M., et al. (2025). Impacts of hippotherapy simulation on balance, postural control, and spasticity of thigh adductor muscles in children with spastic bilateral cerebral palsy: A single-blind clinical trial study.',
    'Santamaria, V., Rachwani, J., Saussez, G., et al. (2020). The Seated Postural & Reaching Control Test in cerebral palsy: A validation study.',
    'Van Wonterghem, E., Sandsjö, A. N., Vanmechelen, I., et al. (2026). Assessment of trunk movement and posture in spastic and dyskinetic cerebral palsy: A scoping review.',
    'Yamamoto, N., Igarashi, T., Sato, R., et al. (2025). Estimating the responsiveness and minimal important change of the Trunk Impairment Scale in inpatients with subacute stroke requiring dependent ambulation.'
  ];
  var BIBLIO_PER_PAGE = 2;
  var BIBLIO_PAGES = Math.ceil(BIBLIO.length / BIBLIO_PER_PAGE);

  /* ------------------------------------------------------------------------
     3. Utilidades
     ------------------------------------------------------------------------ */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  /** Convierte URLs del texto en enlaces (después de escapar). */
  function linkify(s) {
    return esc(s).replace(/https?:\/\/[^\s<]+/g, function (u) {
      return '<a class="ngeq-card__link" href="' + u + '" target="_blank" rel="noopener noreferrer">' + u + '</a>';
    });
  }
  /**
   * Búsqueda tolerante (adaptada del prototipo): sin acentos, palabras en
   * cualquier orden, sinónimos y una o dos letras distintas.
   */
  function normalizar(t) { return String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  var VACIAS = ['de', 'del', 'la', 'el', 'los', 'las', 'y', 'en', 'con', 'para', 'por', 'un', 'una', 'a'];
  function palabras(t) { return normalizar(t).split(/[^a-z0-9ñ]+/).filter(Boolean); }
  function distancia(a, b) {
    var fila = [], i, j;
    for (j = 0; j <= b.length; j++) fila[j] = j;
    for (i = 1; i <= a.length; i++) {
      var previo = fila[0];
      fila[0] = i;
      for (j = 1; j <= b.length; j++) {
        var tmp = fila[j];
        fila[j] = Math.min(fila[j] + 1, fila[j - 1] + 1, previo + (a[i - 1] === b[j - 1] ? 0 : 1));
        previo = tmp;
      }
    }
    return fila[b.length];
  }
  function parecida(p, tk) {
    if (tk.indexOf(p) === 0) return true;
    if (p.length < 4) return false;
    var tope = p.length >= 7 ? 2 : 1;
    return distancia(p, tk) <= tope || distancia(p, tk.slice(0, p.length)) <= tope;
  }
  /** ¿El texto `fuente` contiene todas las palabras de la consulta `q`? */
  function coincide(fuente, q) {
    var tokens = palabras(fuente);
    var ps = palabras(q).filter(function (x) { return VACIAS.indexOf(x) < 0; });
    if (!ps.length) ps = palabras(q);
    return ps.every(function (x) { return tokens.some(function (tk) { return parecida(x, tk); }); });
  }

  var uid = 0;
  function nextId(p) { uid += 1; return 'ngeq-' + p + '-' + uid; }

  /* ------------------------------------------------------------------------
     4. Clase del módulo
     ------------------------------------------------------------------------ */
  function EquilibrioModule(root, options) {
    this.root = root;
    this.o = Object.assign({ assetsPath: DEFAULT_ASSETS, syncHash: true, hashPrefix: 'equilibrio', onExit: null, onNavigate: null }, options || {});
    if (!/\/$/.test(this.o.assetsPath)) this.o.assetsPath += '/';
    this.state = { view: 'home' };
    this.ui = { accordions: {}, moreOpen: false, q: '', qGlos: '' };

    root.classList.add('ngeq');
    root.innerHTML =
      '<div class="ngeq-shell"></div>' +
      '<div class="ngeq-sr" aria-live="polite" data-ngeq-live></div>';
    this.shell = root.querySelector('.ngeq-shell');
    this.live = root.querySelector('[data-ngeq-live]');

    // Delegación de eventos: un solo listener por tipo en la raíz del módulo
    this._onClick = this.handleClick.bind(this);
    this._onKey = this.handleKey.bind(this);
    this._onInput = this.handleInput.bind(this);
    this._onHash = this.handleHash.bind(this);
    root.addEventListener('click', this._onClick);
    root.addEventListener('keydown', this._onKey);
    root.addEventListener('input', this._onInput);
    if (this.o.syncHash) global.addEventListener('hashchange', this._onHash);

    var fromHash = this.o.syncHash ? this.parseHash() : null;
    this.navigate(fromHash || { view: 'home' }, { replace: true });
  }

  var P = EquilibrioModule.prototype;

  /* ---------------- Router interno ---------------- */

  P.toHash = function (s) {
    var parts = [this.o.hashPrefix, s.view];
    if (s.view === 'tool') parts.push(s.tool, s.tab);
    if (s.view === 'biblio') parts.push(s.page);
    return '#/' + parts.join('/');
  };

  P.parseHash = function () {
    var h = (global.location.hash || '').replace(/^#\/?/, '').split('/');
    if (h[0] !== this.o.hashPrefix) return null;
    var s = { view: h[1] || 'home' };
    if (s.view === 'tool') { s.tool = h[2]; s.tab = h[3]; }
    if (s.view === 'biblio') s.page = parseInt(h[2], 10);
    return s;
  };

  /** Normaliza un estado: valores por defecto y protección contra rutas inválidas. */
  P.normalize = function (s) {
    var views = ['home', 'about', 'videos', 'biblio', 'tool', 'glosario'];
    s = Object.assign({}, s);
    if (views.indexOf(s.view) < 0) s.view = 'home';
    if (s.view === 'tool') {
      if (!TOOLS[s.tool]) s.tool = 'tis';
      if (!TABS.some(function (t) { return t.key === s.tab; })) s.tab = 'descripcion';
    }
    if (s.view === 'biblio') s.page = Math.min(Math.max(s.page || 1, 1), BIBLIO_PAGES);
    return s;
  };

  /**
   * Navega a un estado. Opciones: replace (no crea entrada de historial),
   * keepScroll (no sube al inicio).
   */
  P.navigate = function (s, opt) {
    opt = opt || {};
    var prev = this.state;
    this.state = this.normalize(s);
    if (this.state.view !== 'tool' || prev.tool !== this.state.tool || prev.tab !== this.state.tab) this.ui.moreOpen = false;
    this.render();
    if (this.o.syncHash) {
      var h = this.toHash(this.state);
      if (global.location.hash !== h) {
        if (opt.replace) global.history.replaceState(null, '', h);
        else global.history.pushState(null, '', h);
      }
    }
    if (!opt.keepScroll) {
      // Lleva el inicio del módulo a la vista sin mover la página si ya es visible
      var top = this.root.getBoundingClientRect().top;
      if (top < 0) global.scrollTo(0, top + global.scrollY);
    }
    if (!opt.keepFocus) {
      var h1 = this.shell.querySelector('h1');
      if (h1) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); }
    }
    this.emit('ngeq:navigate', this.state);
    if (typeof this.o.onNavigate === 'function') this.o.onNavigate(this.state);
  };

  P.handleHash = function () {
    var s = this.parseHash();
    if (s && this.toHash(this.normalize(s)) !== this.toHash(this.state)) this.navigate(s, { replace: true });
  };

  P.emit = function (name, detail) {
    this.root.dispatchEvent(new CustomEvent(name, { bubbles: true, detail: detail }));
  };

  P.exit = function () {
    this.emit('ngeq:exit', {});
    if (typeof this.o.onExit === 'function') this.o.onExit();
    else this.navigate({ view: 'home' });
  };

  /* ---------------- Fragmentos de UI reutilizables ---------------- */

  P.icon = function (name, size, extra) {
    return '<span class="ngeq-icon' + (size ? ' ngeq-icon--' + size : '') + (extra ? ' ' + extra : '') +
      '" style="--ngeq-icon:url(\'' + this.o.assetsPath + name + '.svg\')" aria-hidden="true"></span>';
  };

  P.header = function () {
    return '<header class="ngeq-header">' +
      (this.state.view === 'home'
        ? '<button type="button" class="ngeq-header__back" data-ngeq-action="exit" title="Volver a NeuroGuía">← <span>Motora</span></button>'
        : '<button type="button" class="ngeq-header__back" data-ngeq-action="home">← <span>Inicio</span></button>') +
      '<button type="button" class="ngeq-brand" data-ngeq-action="home" aria-label="NeuroGuía · Inicio del área">' +
        '<span class="ngeq-brand__symbol">' + this.icon('brain', 21) + '</span>' +
        '<span class="ngeq-brand__name">NeuroGuía</span></button>' +
    '</header>';
  };

  /** Acordeón accesible con estado guardado en this.ui.accordions */
  P.accordion = function (key, title, bodyHtml) {
    var open = !!this.ui.accordions[key];
    var pid = 'ngeq-acc-' + key;
    return '<section class="ngeq-accordion">' +
      '<button type="button" class="ngeq-accordion__trigger" data-ngeq-action="accordion" data-key="' + key + '" aria-expanded="' + open + '" aria-controls="' + pid + '">' +
        '<span>' + esc(title) + '</span>' + this.icon('chevron-down') + '</button>' +
      '<div class="ngeq-accordion__panel" id="' + pid + '"' + (open ? '' : ' hidden') + '>' + bodyHtml + '</div>' +
    '</section>';
  };

  P.videosEmptyCard = function () {
    return '<div class="ngeq-card">' + this.icon('video', 24, 'ngeq-icon--violet') +
      '<h2 class="ngeq-card__title ngeq-card__title--sm">Material audiovisual pendiente</h2>' +
      '<p>No se adjuntaron archivos ni enlaces de video para esta subárea. Aquí se incorporarán los recursos del grupo cuando estén disponibles.</p></div>';
  };

  /* ---------------- Vistas ---------------- */

  /** Inicio del área */
  P.viewHome = function () {
    return '<main class="ngeq-view">' +
      '<p class="ngeq-eyebrow">EQUILIBRIO Y CONTROL POSTURAL</p>' +
      '<h1 class="ngeq-title">Comprender el equilibrio. Observar el movimiento.</h1>' +
      '<p class="ngeq-eyebrow ngeq-eyebrow--teal">¿Qué es el equilibrio?</p>' +
      '<p class="ngeq-lead">' + esc(HORAK) + '</p>' +
      this.searchBox('tools', 'Buscar instrumento', 'Nombre, sigla o qué evalúa', this.ui.q) +
      '<div class="ngeq-results" data-ngeq-results="tools" aria-live="polite">' + this.toolResults() + '</div>' +
      '<figure class="ngeq-figure"><img src="' + this.o.assetsPath + 'balance-illustration.svg" width="350" height="190" ' +
        'alt="Esquema de una persona de pie: la visión, el sistema vestibular y la sensibilidad corporal se integran para dar estabilidad y movimiento."></figure>' +
      '<button type="button" class="ngeq-accordion ngeq-accordion__trigger" data-ngeq-action="go" data-view="about">' +
        '<span>Información del área</span>' + this.icon('chevron-right') + '</button>' +
      '<button type="button" class="ngeq-accordion ngeq-accordion__trigger" data-ngeq-action="go" data-view="glosario">' +
        '<span>Glosario</span>' + this.icon('chevron-right') + '</button>' +
      '<button type="button" class="ngeq-accordion ngeq-accordion__trigger" data-ngeq-action="go" data-view="biblio" data-page="1">' +
        '<span>Bibliografía</span>' + this.icon('chevron-right') + '</button>' +
    '</main>';
  };

  /** Sobre el área */
  P.viewAbout = function () {
    return '<main class="ngeq-view">' +
      '<p class="ngeq-eyebrow">GRUPO 3</p>' +
      '<h1 class="ngeq-title">Sobre el área</h1>' +
      '<h2 class="ngeq-subtitle">¿Qué es el equilibrio?</h2>' +
      '<p class="ngeq-lead">' + esc(HORAK) + '</p>' +
      '<section class="ngeq-card">' + SUBAREAS.map(function (a) {
        return '<div class="ngeq-card__section"><h3 class="ngeq-card__label">' + esc(a.label) + '</h3><p>' + esc(a.text) + '</p></div>';
      }).join('') + '</section>' +
      '<p class="ngeq-footnote">El equilibrio depende de la coordinación entre la información visual, vestibular y somatosensorial, las respuestas motoras y las demandas de la actividad. Fuente: Horak (2006), DOI: 10.1093/ageing/afl077.</p>' +
    '</main>';
  };

  /** Videos del área */
  P.viewVideos = function () {
    return '<main class="ngeq-view">' +
      '<p class="ngeq-eyebrow">RECURSOS · GRUPO 3</p>' +
      '<h1 class="ngeq-title">Videos del área</h1>' + this.videosEmptyCard() +
    '</main>';
  };

  /** Bibliografía paginada (2 fuentes por página) */
  P.viewBiblio = function () {
    var page = this.state.page, start = (page - 1) * BIBLIO_PER_PAGE;
    var items = BIBLIO.slice(start, start + BIBLIO_PER_PAGE).map(function (ref, i) {
      var n = start + i + 1;
      return '<li class="ngeq-card"><span class="ngeq-card__num">' + (n < 10 ? '0' + n : n) + '</span><p>' + esc(ref) + '</p></li>';
    }).join('');
    var last = page === BIBLIO_PAGES;
    var dots = '';
    for (var d = 1; d <= BIBLIO_PAGES; d++) dots += '<span class="ngeq-pager__dot' + (d === page ? ' ngeq-pager__dot--on' : '') + '"></span>';
    return '<main class="ngeq-view">' +
      '<p class="ngeq-eyebrow">DOCUMENTO DEL GRUPO 3</p>' +
      '<h1 class="ngeq-title">Bibliografía</h1>' +
      '<p class="ngeq-lead ngeq-lead--muted">Fuentes transcritas del documento proporcionado. El PDF no asigna una fuente individual a cada instrumento.</p>' +
      '<div class="ngeq-biblio__meta"><span>Bibliografía y referencias</span><strong aria-label="Página ' + page + ' de ' + BIBLIO_PAGES + '">' + page + ' / ' + BIBLIO_PAGES + '</strong></div>' +
      '<ol class="ngeq-biblio__list" start="' + (start + 1) + '">' + items + '</ol>' +
      (last
        ? '<button type="button" class="ngeq-btn ngeq-btn--soft" data-ngeq-action="home">Volver al inicio' + this.icon('arrow-right') + '</button>'
        : '<button type="button" class="ngeq-btn ngeq-btn--soft" data-ngeq-action="go" data-view="biblio" data-page="' + (page + 1) + '">Continuar bibliografía' + this.icon('arrow-right') + '</button>') +
      '<div class="ngeq-row">' +
        (page > 1 ? '<button type="button" class="ngeq-link ngeq-link--muted" data-ngeq-action="go" data-view="biblio" data-page="' + (page - 1) + '">← Página anterior</button>' : '<span></span>') +
        '<div class="ngeq-pager" aria-hidden="true">' + dots + '</div>' +
      '</div>' +
    '</main>';
  };

  /** Campo de búsqueda con ícono */
  P.searchBox = function (kind, label, placeholder, value) {
    var id = 'ngeq-q-' + kind;
    return '<div class="ngeq-search"><label class="ngeq-search__label" for="' + id + '">' + esc(label) + '</label>' +
      '<div class="ngeq-search__box">' + this.icon('search', 18) +
      '<input class="ngeq-search__input" id="' + id + '" type="search" inputmode="search" autocomplete="off" placeholder="' + esc(placeholder) + '"' +
      ' value="' + esc(value) + '" data-ngeq-search="' + kind + '"></div></div>';
  };

  /** Chip que abre la ficha de una herramienta */
  P.toolChip = function (k) {
    return '<button type="button" class="ngeq-chip" data-ngeq-action="go" data-view="tool" data-tool="' + k + '" data-tab="descripcion">' + esc(TOOLS[k].short) + '</button>';
  };

  /**
   * Inicio: sin búsqueda → tarjetas de subárea con sus instrumentos (chips);
   * con búsqueda → lista de instrumentos que coinciden.
   */
  P.toolResults = function () {
    var self = this, q = this.ui.q.trim();
    if (!q) {
      return SUBAREAS.map(function (a) {
        return '<section class="ngeq-area">' +
          '<h2 class="ngeq-area__title">' + esc(a.label) + '</h2>' +
          '<p class="ngeq-area__text">' + esc(a.text) + '</p>' +
          '<div class="ngeq-chips">' + a.tools.map(function (k) { return self.toolChip(k); }).join('') + '</div>' +
        '</section>';
      }).join('');
    }
    var hits = Object.keys(TOOLS).filter(function (k) {
      var t = TOOLS[k];
      return coincide([t.name, t.short, t.area, 'equilibrio', t.keys || '', t.content.proposito].join(' '), q);
    });
    if (!hits.length) return '<p class="ngeq-results__empty">Sin resultados para «' + esc(q) + '». Prueba con el nombre, la sigla o lo que evalúa (p. ej., «marcha» o «tronco»).</p>';
    return '<ul class="ngeq-hits">' + hits.map(function (k) {
      var t = TOOLS[k];
      return '<li><button type="button" class="ngeq-hit" data-ngeq-action="go" data-view="tool" data-tool="' + k + '" data-tab="descripcion">' +
        '<span><span class="ngeq-hit__name">' + esc(t.name) + '</span><span class="ngeq-hit__meta">' + esc(t.area) + ' · ' + esc(t.stats[1][0] + ' ' + t.stats[1][1]) + '</span></span>' +
        self.icon('chevron-right', 16) + '</button></li>';
    }).join('') + '</ul>';
  };

  /** Glosario con búsqueda */
  P.glosarioResults = function () {
    var q = this.ui.qGlos.trim();
    var list = GLOSARIO.filter(function (g) { return !q || coincide(g.t + ' ' + g.d, q); });
    if (!list.length) return '<p class="ngeq-results__empty">Sin términos para «' + esc(q) + '».</p>';
    return '<dl class="ngeq-glosario">' + list.map(function (g) {
      return '<div class="ngeq-glosario__item"><dt>' + esc(g.t) + '</dt><dd>' + esc(g.d) + '</dd></div>';
    }).join('') + '</dl>';
  };
  P.viewGlosario = function () {
    return '<main class="ngeq-view">' +
      '<p class="ngeq-eyebrow">AYUDA · GRUPO 3</p>' +
      '<h1 class="ngeq-title">Glosario</h1>' +
      '<p class="ngeq-lead ngeq-lead--muted">Términos que aparecen en las fichas, explicados en lenguaje simple.</p>' +
      this.searchBox('glosario', 'Buscar término', 'Ej.: propiocepción', this.ui.qGlos) +
      '<div data-ngeq-results="glosario" aria-live="polite">' + this.glosarioResults() + '</div>' +
    '</main>';
  };

  /** Casillas de datos grandes de la ficha (número + leyenda) */
  P.stats = function (list) {
    return '<dl class="ngeq-stats">' + list.map(function (x) {
      return '<div class="ngeq-stats__item"><dt class="ngeq-sr">' + esc(x[1]) + '</dt><dd class="ngeq-stats__value">' + esc(x[0]) + '</dd>' +
        '<dd class="ngeq-stats__label" aria-hidden="true">' + esc(x[1]) + '</dd></div>';
    }).join('') + '</dl>';
  };


  /** Ficha de herramienta: datos breves arriba + pestañas con el contenido extenso */
  P.viewTool = function () {
    var self = this, s = this.state, t = TOOLS[s.tool];
    var tab = TABS.filter(function (x) { return x.key === s.tab; })[0];
    var panelId = 'ngeq-panel';

    var tabs = TABS.map(function (x) {
      var sel = x.key === s.tab;
      return '<button type="button" role="tab" class="ngeq-tabs__tab" id="ngeq-tab-' + x.key + '" data-ngeq-action="tab" data-tab="' + x.key + '"' +
        ' aria-selected="' + sel + '" aria-controls="' + panelId + '" tabindex="' + (sel ? 0 : -1) + '">' +
        self.icon(x.icon, 17) + '<span>' + esc(x.label) + '</span></button>';
    }).join('');

    // Contenido de la tarjeta de lectura
    var title = (t.titles && t.titles[s.tab]) || TAB_TITLES[s.tab] || tab.label;
    var body = '<p>' + linkify(t.content[s.tab]) + '</p>';
    if (s.tab === 'proposito') {
      body += '<div class="ngeq-card__section"><p class="ngeq-card__label">Para quién</p><p>' + esc(t.content.poblacion) + '</p></div>';
    }
    if (s.tab === 'equipo') {
      body = '<div class="ngeq-card__section"><p class="ngeq-card__label">Qué se necesita</p><div class="ngeq-chips">' +
        t.need.map(function (n) { return '<span class="ngeq-chip ngeq-chip--static">' + esc(n) + '</span>'; }).join('') + '</div></div>' + body;
    }
    if (s.tab === 'descripcion') {
      body += '<div class="ngeq-card__section"><p class="ngeq-card__label">Duración</p><p>' + esc(t.content.tiempo) + '</p>' +
        '<p class="ngeq-footnote">Costo: ' + esc(t.content.costo) + '</p></div>';
    }
    var more = t.more && t.more[s.tab];

    if (more && this.ui.moreOpen) {
      title = more.title;
      body = '<div class="ngeq-card__section"><p class="ngeq-card__label">' + esc(more.label) + '</p><p>' + esc(more.text) + '</p></div>' +
        '<button type="button" class="ngeq-link ngeq-link--plain" data-ngeq-action="more" data-more="0">← Volver a Cómo usar</button>';
    } else {
      if (s.tab === 'descripcion' && t.figure) {
        body += '<figure class="ngeq-figure ngeq-figure--card"><a href="' + this.o.assetsPath + t.figure.file + '" target="_blank" rel="noopener">' +
          '<img src="' + this.o.assetsPath + t.figure.file + '" width="' + t.figure.width + '" height="' + t.figure.height + '" alt="' + esc(t.figure.alt) + '" loading="lazy"></a>' +
          '<figcaption class="ngeq-footnote">' + esc(t.figure.caption) + ' Toca la imagen para ampliarla.</figcaption></figure>';
      }
      if (s.tab === 'descripcion' && t.video) {
        body += '<a class="ngeq-card__link" href="' + t.video.url + '" target="_blank" rel="noopener noreferrer">' +
          esc(t.video.label) + (t.video.sub ? '<br>' + esc(t.video.sub) : '') + '<span class="ngeq-sr"> (se abre en una pestaña nueva)</span></a>';
        if (t.video.card) {
          body += '<a class="ngeq-video" href="' + t.video.url + '" target="_blank" rel="noopener noreferrer">' +
            '<span class="ngeq-video__thumb" aria-hidden="true"><img src="' + this.o.assetsPath + 'yt-bg.svg" width="66" height="48" alt="" style="inset:0">' +
            '<img src="' + this.o.assetsPath + 'yt-play.svg" width="20" height="24" alt="" style="left:26px;top:12px"></span>' +
            '<span><span class="ngeq-video__title">' + esc(t.video.card.title) + '</span><br>' +
            '<span class="ngeq-video__meta">' + esc(t.video.card.meta) + '</span><br>' +
            '<span class="ngeq-video__meta ngeq-video__meta--sm">' + esc(t.video.card.small) + '</span></span>' +
            '<span class="ngeq-video__hint">Abre el video desde el enlace de esta ficha.</span></a>';
        }
        if (more) body += '<button type="button" class="ngeq-link ngeq-link--plain" data-ngeq-action="more" data-more="1">Continuar lectura →</button>';
      }
      if (s.tab === 'referencias') {
        body += '<button type="button" class="ngeq-btn ngeq-btn--soft" data-ngeq-action="go" data-view="biblio" data-page="1">Bibliografía' + this.icon('arrow-right') + '</button>';
      }
    }

    return '<main class="ngeq-view ngeq-view--tight">' +
      '<p class="ngeq-eyebrow ngeq-eyebrow--teal">' + esc(t.area) + '</p>' +
      '<h1 class="ngeq-title">' + esc(t.name) + '</h1>' +
      '<div>' +
        '<button type="button" class="ngeq-link" data-ngeq-action="home">' + this.icon('arrow-left-right', 16) + 'Otras herramientas</button>' +
      '</div>' +
      this.stats(t.stats) +
      (t.pdf ? '<a class="ngeq-btn ngeq-btn--primary" href="' + this.o.assetsPath + t.pdf.file + '" download>' + esc(t.pdf.label) + this.icon('file-text') + '</a>' : '') +
      '<div class="ngeq-tabs" role="tablist" aria-label="Secciones de la ficha">' + tabs + '</div>' +
      '<section class="ngeq-card" role="tabpanel" id="' + panelId + '" aria-labelledby="ngeq-tab-' + s.tab + '">' +
        '<h2 class="ngeq-card__title">' + esc(title) + '</h2>' + body +
      '</section>' +
      (t.note ? '<aside class="ngeq-note"><p class="ngeq-note__title">Nota del documento</p><p>' + esc(t.note) + '</p></aside>' : '') +
    '</main>';
  };

  /* ---------------- Render principal ---------------- */

  P.render = function () {
    var v = this.state.view, html;
    if (v === 'about') html = this.viewAbout();
    else if (v === 'videos') html = this.viewVideos();
    else if (v === 'biblio') html = this.viewBiblio();
    else if (v === 'tool') html = this.viewTool();
    else if (v === 'glosario') html = this.viewGlosario();
    else html = this.viewHome();
    this.shell.innerHTML = this.header() + html;
  };

  /* ---------------- Eventos ---------------- */

  P.handleClick = function (e) {
    var el = e.target.closest('[data-ngeq-action]');
    if (!el || !this.root.contains(el)) return;
    var d = el.dataset, act = d.ngeqAction;
    switch (act) {
      case 'home': this.navigate({ view: 'home' }); break;
      case 'exit': this.exit(); break;
      case 'go':
        this.navigate({ view: d.view, tool: d.tool, tab: d.tab, page: d.page ? +d.page : undefined });
        break;
      case 'tab':
        this.navigate(Object.assign({}, this.state, { tab: d.tab }), { replace: true, keepScroll: true, keepFocus: true });
        var t = this.root.querySelector('#ngeq-tab-' + d.tab); if (t) t.focus();
        break;
      case 'more':
        this.ui.moreOpen = d.more === '1';
        this.render();
        break;
      case 'accordion':
        this.ui.accordions[d.key] = !this.ui.accordions[d.key];
        el.setAttribute('aria-expanded', String(this.ui.accordions[d.key]));
        var panel = this.root.querySelector('#' + el.getAttribute('aria-controls'));
        if (panel) panel.hidden = !this.ui.accordions[d.key];
        break;
    }
  };

  /** Búsquedas en vivo: solo se redibuja la lista de resultados (el campo conserva el foco). */
  P.handleInput = function (e) {
    var t = e.target;
    if (t.dataset.ngeqSearch === 'tools') {
      this.ui.q = t.value;
      this.root.querySelector('[data-ngeq-results="tools"]').innerHTML = this.toolResults();
    } else if (t.dataset.ngeqSearch === 'glosario') {
      this.ui.qGlos = t.value;
      this.root.querySelector('[data-ngeq-results="glosario"]').innerHTML = this.glosarioResults();
    }
  };

  P.handleKey = function (e) {
    // Flechas en la rejilla de pestañas
    var tab = e.target.closest && e.target.closest('[role="tab"]');
    if (tab && ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'].indexOf(e.key) >= 0) {
      e.preventDefault();
      var i = TABS.map(function (x) { return x.key; }).indexOf(tab.dataset.tab), n = TABS.length;
      var j = { ArrowRight: i + 1, ArrowLeft: i - 1, ArrowDown: i + 3, ArrowUp: i - 3, Home: 0, End: n - 1 }[e.key];
      j = (j + n) % n;
      this.handleClick({ target: this.root.querySelector('#ngeq-tab-' + TABS[j].key) });
    }
  };

  P.destroy = function () {
    this.root.removeEventListener('click', this._onClick);
    this.root.removeEventListener('keydown', this._onKey);
    this.root.removeEventListener('input', this._onInput);
    global.removeEventListener('hashchange', this._onHash);
    this.root.innerHTML = '';
    this.root.classList.remove('ngeq');
  };

  /* ------------------------------------------------------------------------
     5. API pública (único global expuesto)
     ------------------------------------------------------------------------ */
  function mount(el, options) {
    if (typeof el === 'string') el = document.querySelector(el);
    if (!el) throw new Error('NeuroGuia.Equilibrio: contenedor no encontrado');
    var m = new EquilibrioModule(el, options);
    return {
      navigate: function (s) { m.navigate(s); },
      getState: function () { return Object.assign({}, m.state); },
      destroy: function () { m.destroy(); }
    };
  }

  global.NeuroGuia = global.NeuroGuia || {};
  global.NeuroGuia.Equilibrio = { mount: mount, version: '1.1.0' };
})(window);
