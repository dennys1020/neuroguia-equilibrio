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
    { key: 'referencias', label: 'Fuentes',      icon: 'book-open' },
    // Opcional: solo aparece si la herramienta tiene `sections.calculo`
    { key: 'calculo',     label: 'Cómo calcular', icon: 'book-open', optional: true }
  ];

  /** Pestañas visibles de una herramienta (`hideTabs` oculta algunas; las opcionales requieren contenido). */
  function tabsDe(t) {
    var ocultas = (t && t.hideTabs) || [];
    return TABS.filter(function (x) {
      if (ocultas.indexOf(x.key) >= 0) return false;
      return !x.optional || !!(t && t.sections && t.sections[x.key]);
    });
  }

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
        referencias: 'Verheyden G et al. (2004). The Trunk Impairment Scale: a new tool to measure motor impairment of the trunk after stroke. Clinical Rehabilitation, 18(3), 326–334. DOI: 10.1191/0269215504cr733oa. Guía de materiales y aplicación: RehabMeasures, Shirley Ryan AbilityLab.'
      }
    },
    tct: {
      stats: [['4', 'tareas · 0 a 100 pts'], ['< 5', 'minutos'], ['Bajo', 'costo']],
      need: ['Cama o camilla', 'Hoja de registro y lápiz', 'Cronómetro (opcional)'],
      keys: 'trunk control test tronco giro girar supino decubito sentado sedestacion incorporarse incorporacion equilibrio sentado acv hemiparesia hemiplejia transferencias cama',
      short: 'TCT', name: 'Trunk Control Test (TCT)', area: 'Control de tronco', subarea: 'tronco',
      // Videos de demostración
      videos: [
        { url: 'https://www.youtube.com/watch?v=qBNrBeoU094', label: 'Test de control de tronco (Neuro)', sub: 'YouTube · Español' },
        { url: 'https://www.youtube.com/watch?v=KsfnHkm99eY', label: 'Trunk Control Test · Clinimetrics', sub: 'YouTube · Physiotutors · Inglés' },
        { url: 'https://www.youtube.com/watch?v=dUlkjy8XGVM', label: 'Test de Control de Tronco (TCT)', sub: 'YouTube · Español' },
        { url: 'https://www.youtube.com/results?search_query=Trunk+Control+Test+physiotherapy', label: 'Buscar más videos del TCT ↗', sub: 'Búsqueda en YouTube' }
      ],
      // Las 4 tareas evaluadas, con su imagen de referencia
      steps: {
        label: 'Tareas evaluadas',
        items: [
          { title: 'Girar hacia el lado afectado', text: 'Desde decúbito supino, rodar sobre la cama hacia el lado débil.',
            img: 'tct-giro.jpg', alt: 'Persona acostada de lado sobre una camilla después de girar desde boca arriba.' },
          { title: 'Girar hacia el lado no afectado', text: 'Desde decúbito supino, rodar hacia el lado fuerte.',
            img: 'tct-giro.jpg', flip: true, alt: 'Persona acostada de lado sobre una camilla; imagen reflejada para indicar el giro hacia el otro lado.' },
          { title: 'Incorporarse a sentado', text: 'Pasar de decúbito supino a sentado sobre la cama o camilla.',
            img: 'tct-supino.jpg', alt: 'Persona boca arriba sobre una camilla, con las rodillas flexionadas, en la posición inicial para incorporarse.' },
          { title: 'Equilibrio sentado', text: 'Sentado al borde de la cama, con los pies sin apoyo, mantener la postura.',
            img: 'tct-sentado.jpg', alt: 'Persona sentada al borde de una camilla, apoyando una mano sobre la superficie.' }
        ],
        caption: 'Imágenes tomadas del video «Trunk Control Test» de Physiotutors.'
      },
      // Escala de cada tarea: 0, 12 o 25 puntos (Collin y Wade, 1990)
      scoring: {
        label: 'Puntuación por tarea',
        items: [
          ['0', 'No puede realizar la tarea sin ayuda.'],
          ['12', 'La realiza con apoyo de los brazos o de forma anormal.'],
          ['25', 'La realiza normalmente.']
        ],
        total: 'Total de 0 a 100 (4 × 25). Una puntuación mayor indica mejor control del tronco.',
        note: 'Criterios de cada nivel según Collin y Wade (1990).'
      },
      titles: { validacion: 'Estandarización y países' },
      content: {
        proposito: 'Evalúa el control motor básico del tronco y la capacidad para realizar movimientos funcionales en cama y en sedestación.',
        costo: 'Bajo: requiere cama o camilla y materiales básicos.',
        poblacion: 'Principalmente adultos con ACV y hemiparesia o hemiplejia. También puede utilizarse para evaluar alteraciones neurológicas del control del tronco.',
        descripcion: 'Prueba clínica de cuatro ítems. La persona comienza en decúbito supino sobre la cama o camilla y realiza cada tarea; el evaluador la puntúa según su capacidad de ejecución.',
        equipo: 'Cama o camilla, hoja de registro y lápiz. Cronómetro si se requiere controlar el tiempo de sedestación (30 segundos en la versión original). No requiere aparatos electrónicos de medición.',
        tiempo: 'Generalmente menos de 5 minutos. Añadir tiempo para explicar, colocar al paciente y permitir descansos.',
        formacion: 'Profesional que haya leído el artículo o manual, conozca los criterios 0/12/25 y pueda proteger al paciente durante los giros y al incorporarse.',
        validacion: 'Instrumento estandarizado utilizado en rehabilitación neurológica y en estudios internacionales. Collin y Wade (1990) publicaron un estudio piloto de fiabilidad en personas tras un ACV.',
        referencias: 'Collin C, Wade DT. (1990). Assessing motor impairment after stroke: a pilot reliability study. J Neurol Neurosurg Psychiatry, 53(7), 576–579. DOI: 10.1136/jnnp.53.7.576. https://pubmed.ncbi.nlm.nih.gov/2391521/'
      }
    },
    tinetti: {
      // Contenido del documento del grupo (COIL): sección 2.1 (págs. 5–7) y sección 3.1 «Equilibrio dinámico»
      stats: [['16', 'ítems (9 + 7)'], ['10–15', 'minutos'], ['28', 'puntos máximo']],
      need: ['Silla firme (≈45–50 cm)', 'Cronómetro', 'Pasillo de 5–8 m', 'Hoja de registro y lápiz', 'Ayudas técnicas habituales'],
      keys: 'tinetti poma performance oriented mobility assessment marcha caidas caminar sedente bipedo bipedestacion dinamico gait pauta riesgo adulto mayor cribado fragilidad sarcopenia',
      short: 'Tinetti', name: 'Escala de Tinetti (POMA)', area: 'Equilibrio dinámico', subarea: 'dinamico',
      pdf: { file: 'pauta-tinetti.pdf', label: 'Descargar pauta (PDF)' }, // pauta imprimible
      videos: [
        { url: 'https://www.youtube.com/watch?v=_ou-b54pXbQ', label: 'Escala de Tinetti · Video 1', sub: 'YouTube' },
        { url: 'https://www.youtube.com/watch?v=CAE_1MAIH0c', label: 'Escala de Tinetti · Video 2', sub: 'YouTube' },
        { url: 'https://www.youtube.com/results?search_query=Escala+de+Tinetti+fisioterapia', label: 'Buscar más videos de Tinetti ↗', sub: 'Búsqueda en YouTube' }
      ],
      // Las dos subescalas
      steps: {
        label: 'Subescalas (se evalúan por separado y suman el total)',
        items: [
          { title: 'Equilibrio · 9 ítems · hasta 16 pts', text: 'Evalúa la estabilidad en sedestación, bipedestación, transferencias, giros y reacciones posturales ante perturbaciones. En algunas versiones tiene 13 ítems.' },
          { title: 'Marcha · 7 ítems · hasta 12 pts', text: 'Evalúa el inicio de la marcha, longitud y altura del paso, simetría, continuidad, trayectoria, tronco y base de sustentación. En algunas versiones tiene 9 ítems.' }
        ]
      },
      scoring: {
        label: 'Puntos de corte (total sobre 28)',
        items: [
          ['≤ 18', 'Riesgo alto de caídas.'],
          ['19–23', 'Riesgo moderado de caídas.'],
          ['≥ 24', 'Riesgo bajo de caídas.']
        ]
      },
      hideDuration: true, // la duración ya aparece en los datos de arriba (10–15 minutos)
      titles: { validacion: 'Estandarización y países' },
      hideTabs: ['referencias'], // sin pestaña «Fuentes»
      videosFirst: true,         // videos al abrir «Cómo usar»
      sections: {
        proposito: [
          { label: 'Equilibrio y calidad de la marcha',
            text: 'Evalúa el equilibrio estático y dinámico, así como la calidad de la marcha, en personas mayores. Su objetivo principal es identificar el riesgo de caídas y servir como herramienta de cribado y seguimiento funcional.' },
          { label: 'Población diana',
            text: 'Adultos mayores (generalmente ≥ 65 años), tanto sanos como frágiles, y personas con condiciones neurológicas (como Parkinson o secuelas de ictus).' },
          { label: 'Diagnóstico / evaluación',
            text: 'No es una prueba diagnóstica de una enfermedad específica, sino una herramienta de cribado funcional. Identifica el riesgo de caídas y permite monitorizar cambios en la movilidad a lo largo del tiempo o tras una intervención.' }
        ],
        descripcion: [
          { label: 'Formato',
            list: ['Equilibrio: permanecer sentado, levantarse, mantenerse de pie (con y sin ojos cerrados), girar 360°, recibir un empujón suave en el esternón y sentarse nuevamente.',
                   'Marcha: caminar a paso habitual por un pasillo, observando inicio, paso, simetría, etc.',
                   'Puntuación: se registra cada ítem en una hoja de registro; la suma de ambas subescalas da la puntuación total.'] }
        ],
        // Pestaña «Cómo calcular»: guías que explican el test parte por parte
        calculo: [
          { label: 'Test explicado parte por parte',
            links: [
              { url: 'https://fisiomayores.com/fisioterapia/test-de-tinetti-valoracion-del-equilibrio-y-la-marcha/', label: 'Fisiomayores · Test de Tinetti: valoración del equilibrio y la marcha' },
              { url: 'https://www.sspa.juntadeandalucia.es/servicioandaluzdesalud/sites/default/files/sincfiles/wsas-media-mediafile_sasdocumento/2019/PT4_EquilyMarcha.pdf', label: 'Servicio Andaluz de Salud · Escala de equilibrio y marcha (PDF)' }
            ] }
        ],
        equipo: [
          { label: 'Detalle del equipo',
            list: ['Silla: rígida, sin brazos o con brazos, de altura estándar (aproximadamente 45–50 cm).',
                   'Espacio: pasillo o espacio despejado de al menos 5 a 8 metros de longitud.',
                   'Hoja de registro y bolígrafo para anotar las puntuaciones.',
                   'Ayudas técnicas: las que el paciente use habitualmente (bastón, andador).'] }
        ],
        validacion: [
          { label: 'Estandarización y validez por países',
            text: 'Es una pauta estandarizada a nivel internacional. Ha sido traducida y validada en múltiples idiomas y contextos culturales, incluyendo versiones en coreano, turco, persa y gujarati, las cuales han demostrado propiedades psicométricas adecuadas (validez, fiabilidad y sensibilidad) para su uso clínico y de investigación.' },
          { label: 'Estándares médicos',
            text: 'La puntuación total máxima varía según la versión (comúnmente 28 puntos, con 16 para equilibrio y 12 para marcha). Los puntos de corte más aceptados para interpretar el riesgo de caídas son:',
            list: ['Riesgo bajo: 25 a 28 puntos (o ≥ 24 en algunos protocolos).',
                   'Riesgo moderado: 19 a 24 puntos (o 19–23).',
                   'Riesgo alto: < 19 puntos (o ≤ 18).'] },
          { label: 'Nota',
            text: 'Una puntuación baja en una subescala específica (por ejemplo, solo en equilibrio) también debe ser motivo de atención clínica, incluso si la puntuación total es alta, ya que puede indicar un déficit específico que incremente el riesgo de caídas.' }
        ]
      },
      content: {
        proposito: 'Identificar alteraciones del equilibrio y la marcha, y estimar el riesgo de caídas.',
        costo: 'Sin costo de licencia según la American Thoracic Society; se requiere material básico. La escala es de acceso libre y gratuito: no requiere la compra de software ni de equipos desechables, y el formulario está disponible en línea en diversas fuentes académicas y clínicas.',
        poblacion: 'Principalmente adultos mayores, especialmente personas con fragilidad, sarcopenia, antecedentes o riesgo de caídas, y alteraciones de movilidad.',
        descripcion: '', // sin párrafo inicial: «Cómo usar» abre con los videos
        equipo: 'Silla firme sin apoyabrazos, cronómetro, pasillo recto de aproximadamente 5 m, hoja de registro y lápiz.',
        tiempo: 'Aproximadamente 10–15 minutos.',
        formacion: 'Profesional familiarizado con la pauta. Conocer los criterios de cada respuesta antes de puntuar.',
        validacion: 'Instrumento estandarizado desarrollado por Mary Tinetti en Estados Unidos. Se encuentra disponible en varios idiomas y se utiliza internacionalmente; verificar la versión lingüística y sus propiedades en la población objetivo.',
        referencias: '',
        calculo: ''
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
        referencias: 'Springer BA, Marin R, Cyhan T, Roberts H, Gill NW. (2007). Normative values for the unipedal stance test with eyes open and closed. J Geriatr Phys Ther, 30(1), 8–15. DOI: 10.1519/00139143-200704000-00003. Guía: RehabMeasures, Single leg stance. https://pubmed.ncbi.nlm.nih.gov/19839175/'
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
        referencias: 'Podsiadlo D, Richardson S. (1991). The timed Up & Go: a test of basic functional mobility for frail elderly persons. J Am Geriatr Soc, 39(2), 142–148. DOI: 10.1111/j.1532-5415.1991.tb01616.x. Procedimiento y materiales: CDC STEADI, Assessment Timed Up & Go (2017). https://pubmed.ncbi.nlm.nih.gov/1991946/'
      }
    }
  };

  /** Glosario (del prototipo «App Médica», con términos agregados para Romberg). */
  var GLOSARIO = [
    { t: 'Ataxia', d: 'Falta de coordinación de los movimientos. Puede ser sensitiva (por falta de propiocepción), vestibular o cerebelosa.' },
    { t: 'Bípedo', d: 'De pie, con el apoyo de ambos pies.' },
    { t: 'Bipedestación', d: 'Posición de pie. La Escala de Tinetti la evalúa al levantarse, en los primeros 5 segundos y de forma mantenida.' },
    { t: 'Cribado', d: 'Evaluación breve para detectar a quienes necesitan una valoración más completa. La Escala de Tinetti se usa como cribado del riesgo de caídas.' },
    { t: 'Decúbito supino', d: 'Acostado boca arriba. Es la posición inicial del TCT.' },
    { t: 'EFAM', d: 'Examen Funcional del Adulto Mayor (Chile). De él viene el criterio de la estación unipodal: 5 segundos o más es normal.' },
    { t: 'Hemiparesia', d: 'Debilidad de un lado del cuerpo, frecuente después de un ACV.' },
    { t: 'Hemiplejia', d: 'Parálisis de un lado del cuerpo. Es más grave que la hemiparesia.' },
    { t: 'Indemne', d: 'Sin daño; que se conserva completo. «Control de tronco indemne» es el puntaje máximo de la TIS.' },
    { t: 'Ítem', d: 'Cada tarea de una escala que recibe un puntaje. La TIS tiene 17 ítems agrupados en 3 subescalas.' },
    { t: 'Neurorehabilitación', d: 'Rehabilitación de personas con lesiones o enfermedades del sistema nervioso, como un accidente cerebrovascular.' },
    { t: 'Pauta', d: 'Hoja con las instrucciones y la forma de puntuar un instrumento.' },
    { t: 'Plano transversal', d: 'Giro del cuerpo alrededor de su eje vertical, como al rotar los hombros o la pelvis.' },
    { t: 'POMA', d: 'Performance Oriented Mobility Assessment: nombre en inglés de la Escala de Tinetti (evaluación de la movilidad orientada al desempeño).' },
    { t: 'Propiocepción', d: 'Información que el cuerpo recibe sobre la posición de sus articulaciones; viaja por las columnas dorsales y las fibras periféricas gruesas.' },
    { t: 'Punto de corte', d: 'Puntaje que separa un resultado normal de uno alterado. En la TIS, menos de 14 a 16 puntos.' },
    { t: 'Romberg positivo', d: 'La persona está estable con ojos abiertos, pero se vuelve inestable o cae al cerrarlos. Orienta a ataxia sensitiva o vestibular.' },
    { t: 'Sarcopenia', d: 'Pérdida de masa y fuerza muscular asociada a la edad; aumenta el riesgo de caídas.' },
    { t: 'Sedente', d: 'Sentado.' },
    { t: 'Sedestación', d: 'Posición de sentado. El TCT evalúa el equilibrio en sedestación al borde de la cama.' },
    { t: 'Subescala', d: 'Parte de una escala que evalúa un aspecto y tiene su propio puntaje. La suma de las subescalas da el total.' },
    { t: 'Transferencias', d: 'Cambios de posición o de superficie, como pasar de la cama a la silla.' },
    { t: 'Vestibular', d: 'Relativo al oído interno, que informa sobre la posición y el movimiento de la cabeza.' }
  ];

  var TAB_TITLES = { referencias: 'Fuentes', calculo: 'Cómo calcular la puntuación' }; // títulos por defecto distintos de la etiqueta

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

  /** ID de un video de YouTube (watch?v=, youtu.be/ o /embed/); null si no es un video. */
  function ytId(url) {
    var m = /(?:[?&]v=|youtu\.be\/|\/embed\/)([\w-]{11})/.exec(url || '');
    return m ? m[1] : null;
  }
  function sinFlecha(t) { return String(t || '').replace(/\s*↗\s*$/, ''); }

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
      if (!tabsDe(TOOLS[s.tool]).some(function (t) { return t.key === s.tab; })) s.tab = 'descripcion';
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


  /** Tareas de una prueba, numeradas y con imagen de referencia */
  P.steps = function (st) {
    var self = this;
    return '<div class="ngeq-card__section"><p class="ngeq-card__label">' + esc(st.label) + '</p>' +
      '<ol class="ngeq-steps">' + st.items.map(function (x, i) {
        return '<li class="ngeq-steps__item">' +
          (x.img ? '<img class="ngeq-steps__img' + (x.flip ? ' ngeq-steps__img--flip' : '') + '" src="' + self.o.assetsPath + x.img + '" width="96" height="72" alt="' + esc(x.alt) + '" loading="lazy">' : '') +
          '<span class="ngeq-steps__body"><span class="ngeq-steps__num" aria-hidden="true">' + (i + 1) + '</span>' +
          '<span class="ngeq-steps__title">' + esc(x.title) + '</span>' +
          '<span class="ngeq-steps__text">' + esc(x.text) + '</span></span></li>';
      }).join('') + '</ol>' +
      (st.caption ? '<p class="ngeq-footnote">' + esc(st.caption) + '</p>' : '') + '</div>';
  };

  /** Niveles de puntuación (valor + significado) y total */
  P.scoring = function (sc) {
    return '<div class="ngeq-card__section"><p class="ngeq-card__label">' + esc(sc.label) + '</p>' +
      '<dl class="ngeq-score">' + sc.items.map(function (x) {
        return '<div class="ngeq-score__item"><dt class="ngeq-score__value">' + esc(x[0]) + '<span class="ngeq-sr"> puntos</span></dt>' +
          '<dd class="ngeq-score__text">' + esc(x[1]) + '</dd></div>';
      }).join('') + '</dl>' +
      (sc.total ? '<p class="ngeq-score__total">' + esc(sc.total) + '</p>' : '') +
      (sc.note ? '<p class="ngeq-footnote">' + esc(sc.note) + '</p>' : '') + '</div>';
  };

  /**
   * Reproductor de YouTube incrustado. Primero muestra la miniatura con un botón
   * de reproducir; al pulsarlo se carga el iframe (youtube-nocookie, sin cookies
   * hasta reproducir). Debajo queda el enlace para abrirlo en YouTube.
   */
  P.player = function (v, title) {
    var id = ytId(v.url);
    return '<div class="ngeq-player" data-ngeq-player>' + this.playerPoster(id, title) + '</div>' +
      '<p class="ngeq-player__caption"><span data-ngeq-player-title>' + esc(title) + '</span>' +
      '<a class="ngeq-card__link" data-ngeq-player-link href="' + esc(v.url) + '" target="_blank" rel="noopener noreferrer">Abrir en YouTube ↗' +
      '<span class="ngeq-sr"> (se abre en una pestaña nueva)</span></a></p>';
  };
  P.playerPoster = function (id, title) {
    return '<button type="button" class="ngeq-player__poster" data-ngeq-action="play" data-id="' + id + '" data-title="' + esc(title) + '"' +
      ' aria-label="Reproducir video: ' + esc(title) + '">' +
      '<img class="ngeq-player__thumb" src="https://i.ytimg.com/vi/' + id + '/hqdefault.jpg" alt="" loading="lazy" onerror="this.remove()">' +
      '<span class="ngeq-player__btn" aria-hidden="true"></span></button>';
  };
  P.playerFrame = function (id, title) {
    return '<iframe class="ngeq-player__frame" src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&playsinline=1"' +
      ' title="' + esc(title) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"' +
      ' referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
  };

  /** Varios videos: un reproductor arriba y la lista para elegir cuál ver. */
  P.videoList = function (list) {
    var self = this;
    var first = list.filter(function (v) { return ytId(v.url); })[0];
    return '<div class="ngeq-card__section"><p class="ngeq-card__label">Videos de demostración</p>' +
      (first ? this.player(first, sinFlecha(first.label)) : '') +
      '<ul class="ngeq-vlist">' + list.map(function (v) {
        var id = ytId(v.url), on = v === first;
        var inner = self.icon('video', 18) + '<span><span class="ngeq-vlist__title">' + esc(v.label) + '</span>' +
          (v.sub ? '<span class="ngeq-vlist__meta">' + esc(v.sub) + '</span>' : '') + '</span>';
        if (id) {
          return '<li><button type="button" class="ngeq-vlist__item' + (on ? ' ngeq-vlist__item--on' : '') + '" data-ngeq-action="pick"' +
            ' data-id="' + id + '" data-url="' + esc(v.url) + '" data-title="' + esc(sinFlecha(v.label)) + '" aria-pressed="' + on + '">' +
            inner + '</button></li>';
        }
        return '<li><a class="ngeq-vlist__item" href="' + esc(v.url) + '" target="_blank" rel="noopener noreferrer">' + inner +
          '<span class="ngeq-sr"> (se abre en una pestaña nueva)</span></a></li>';
      }).join('') + '</ul></div>';
  };

  /** Ficha de herramienta: datos breves arriba + pestañas con el contenido extenso */
  P.viewTool = function () {
    var self = this, s = this.state, t = TOOLS[s.tool];
    var visibles = tabsDe(t);
    var tab = visibles.filter(function (x) { return x.key === s.tab; })[0];
    var panelId = 'ngeq-panel';

    var tabs = visibles.map(function (x) {
      var sel = x.key === s.tab;
      return '<button type="button" role="tab" class="ngeq-tabs__tab" id="ngeq-tab-' + x.key + '" data-ngeq-action="tab" data-tab="' + x.key + '"' +
        ' aria-selected="' + sel + '" aria-controls="' + panelId + '" tabindex="' + (sel ? 0 : -1) + '">' +
        self.icon(x.icon, 17) + '<span>' + esc(x.label) + '</span></button>';
    }).join('');

    // Contenido de la tarjeta de lectura
    var title = (t.titles && t.titles[s.tab]) || TAB_TITLES[s.tab] || tab.label;
    var body = t.content[s.tab] ? '<p>' + linkify(t.content[s.tab]) + '</p>' : '';
    if (t.sections && t.sections[s.tab]) {
      body += t.sections[s.tab].map(function (x) {
        return '<div class="ngeq-card__section"><p class="ngeq-card__label">' + esc(x.label) + '</p>' +
          (x.text ? '<p>' + esc(x.text) + '</p>' : '') +
          (x.list ? '<ul class="ngeq-list">' + x.list.map(function (li) { return '<li>' + esc(li) + '</li>'; }).join('') + '</ul>' : '') +
          (x.links ? '<ul class="ngeq-list">' + x.links.map(function (l) {
            return '<li><a class="ngeq-card__link" href="' + esc(l.url) + '" target="_blank" rel="noopener noreferrer">' + esc(l.label) + ' ↗' +
              '<span class="ngeq-sr"> (se abre en una pestaña nueva)</span></a></li>';
          }).join('') + '</ul>' : '') + '</div>';
      }).join('');
    }
    if (s.tab === 'proposito') {
      body += '<div class="ngeq-card__section"><p class="ngeq-card__label">Para quién</p><p>' + esc(t.content.poblacion) + '</p></div>';
    }
    if (s.tab === 'equipo') {
      body = '<div class="ngeq-card__section"><p class="ngeq-card__label">Qué se necesita</p><div class="ngeq-chips">' +
        t.need.map(function (n) { return '<span class="ngeq-chip ngeq-chip--static">' + esc(n) + '</span>'; }).join('') + '</div></div>' + body;
    }
    if (s.tab === 'descripcion' && t.steps) body += this.steps(t.steps);
    if (s.tab === 'descripcion' && t.scoring) body += this.scoring(t.scoring);
    if (s.tab === 'descripcion') {
      body += '<div class="ngeq-card__section">' +
        (t.hideDuration ? '' : '<p class="ngeq-card__label">Duración</p><p>' + esc(t.content.tiempo) + '</p>') +
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
      if (s.tab === 'descripcion' && t.videos) {
        // `videosFirst`: los videos van al inicio de «Cómo usar», antes del texto
        if (t.videosFirst) body = this.videoList(t.videos) + body;
        else body += this.videoList(t.videos);
      }
      if (s.tab === 'descripcion' && t.video) {
        if (ytId(t.video.url)) {
          body += '<div class="ngeq-card__section"><p class="ngeq-card__label">Video de demostración</p>' +
            this.player(t.video, t.video.sub ? 'YouTube · ' + t.video.sub : 'YouTube') + '</div>';
        } else {
          body += '<a class="ngeq-card__link" href="' + t.video.url + '" target="_blank" rel="noopener noreferrer">' +
            esc(t.video.label) + (t.video.sub ? '<br>' + esc(t.video.sub) : '') + '<span class="ngeq-sr"> (se abre en una pestaña nueva)</span></a>';
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
      case 'play': {
        var box = el.closest('[data-ngeq-player]');
        if (box) box.innerHTML = this.playerFrame(d.id, d.title);
        break;
      }
      case 'pick': {
        var sec = el.closest('.ngeq-card__section');
        var player = sec && sec.querySelector('[data-ngeq-player]');
        if (!player) break;
        player.innerHTML = this.playerFrame(d.id, d.title);
        sec.querySelector('[data-ngeq-player-title]').textContent = d.title;
        sec.querySelector('[data-ngeq-player-link]').href = d.url;
        Array.prototype.forEach.call(sec.querySelectorAll('[data-ngeq-action="pick"]'), function (b) {
          var on = b === el;
          b.classList.toggle('ngeq-vlist__item--on', on);
          b.setAttribute('aria-pressed', String(on));
        });
        player.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        this.live.textContent = 'Reproduciendo: ' + d.title;
        break;
      }
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
      var lista = tabsDe(TOOLS[this.state.tool]);
      var i = lista.map(function (x) { return x.key; }).indexOf(tab.dataset.tab), n = lista.length;
      var j = { ArrowRight: i + 1, ArrowLeft: i - 1, ArrowDown: i + 3, ArrowUp: i - 3, Home: 0, End: n - 1 }[e.key];
      j = (j + n) % n;
      this.handleClick({ target: this.root.querySelector('#ngeq-tab-' + lista[j].key) });
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
  global.NeuroGuia.Equilibrio = { mount: mount, version: '1.2.0' };
})(window);
