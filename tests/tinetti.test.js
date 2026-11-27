/* Pruebas de integración sobre la API pública y el DOM real del navegador. */
(function () {
  'use strict';
  var root = document.querySelector('#fixture');
  var results = document.querySelector('#results');
  var summary = document.querySelector('#summary');
  var run = document.querySelector('#run');

  function assert(condition, message) {
    if (!condition) throw new Error(message);
  }
  function button(label) {
    var found = root.querySelector('button[aria-label="' + label + '"]');
    assert(found, 'No se encontró el botón: ' + label);
    return found;
  }
  function page() { return root.querySelector('[data-ngeq-pdf-count]').textContent; }
  function loadImage(image) {
    return new Promise(function (resolve, reject) {
      if (image.complete) return image.naturalWidth ? resolve() : reject(new Error('Imagen no disponible'));
      image.addEventListener('load', resolve, { once: true });
      image.addEventListener('error', function () { reject(new Error('Imagen no disponible')); }, { once: true });
    });
  }

  run.addEventListener('click', async function () {
    run.disabled = true;
    results.replaceChildren();
    var passed = 0, failed = 0;
    var app = NeuroGuia.Equilibrio.mount(root, { syncHash: false, assetsPath: '../assets/' });
    function navigate(tab, tool) { app.navigate({ view: 'tool', tool: tool || 'tinetti', tab: tab }); }
    async function test(name, fn) {
      var li = document.createElement('li');
      try { await fn(); passed += 1; li.textContent = 'OK · ' + name; }
      catch (error) { failed += 1; li.textContent = 'ERROR · ' + name + ': ' + error.message; }
      results.append(li);
    }
    try {
      await test('Pauta cerrada inicialmente; original disponible sin descarga obligatoria', function () {
        navigate('calculo');
        assert(!root.querySelector('details').open, 'La pauta debe comenzar cerrada');
        var link = root.querySelector('a[href="../assets/pauta-tinetti.pdf"][target="_blank"]');
        assert(link && !link.hasAttribute('download'), 'Falta enlace de consulta del original');
        assert(root.querySelector('a[download]'), 'Falta descarga alternativa');
      });
      await test('Abrir pauta y consultar las dos páginas con límites correctos', async function () {
        root.querySelector('summary').click();
        assert(root.querySelector('details').open, 'No abrió la pauta');
        await loadImage(root.querySelector('.ngeq-pdf__page'));
        assert(page() === 'Página 1 de 2' && button('Página anterior').disabled, 'Inicio incorrecto');
        button('Página siguiente').click();
        await loadImage(root.querySelector('.ngeq-pdf__page'));
        assert(page() === 'Página 2 de 2' && button('Página siguiente').disabled, 'Final incorrecto');
        assert(root.querySelector('.ngeq-pdf__page').alt.includes('marcha'), 'Descripción de página incorrecta');
        assert(root.querySelector('[data-ngeq-pdf-image-link]').href.endsWith('vista-2.jpg'), 'Ampliación desincronizada');
        button('Página anterior').click();
        assert(page() === 'Página 1 de 2', 'No regresó a equilibrio');
      });
      await test('Cambiar de sección y volver reinicia la consulta', function () {
        navigate('equipo');
        assert(!root.querySelector('.ngeq-pdf'), 'El visor apareció en Materiales');
        navigate('calculo');
        assert(page() === 'Página 1 de 2' && !root.querySelector('details').open, 'No reinició');
      });
      await test('El PDF original existe y conserva formato PDF', async function () {
        var response = await fetch('../assets/pauta-tinetti.pdf');
        assert(response.ok, 'PDF no disponible');
        var bytes = new Uint8Array(await response.arrayBuffer());
        assert(String.fromCharCode.apply(null, bytes.slice(0, 5)) === '%PDF-', 'Archivo inválido');
      });
      await test('YouTube no carga al abrir la ficha ni al elegir otro video', function () {
        navigate('descripcion');
        assert(!root.querySelector('iframe, img[src*="ytimg"]'), 'Se contactó YouTube antes de reproducir');
        var choices = root.querySelectorAll('button[data-ngeq-action="pick"]');
        assert(choices.length >= 2, 'Faltan videos');
        choices[1].click();
        assert(!root.querySelector('iframe'), 'La selección reprodujo automáticamente');
        assert(choices[1].getAttribute('aria-pressed') === 'true', 'Selección no anunciada');
        assert(root.querySelector('[data-ngeq-player-link]').href.includes('CAE_1MAIH0c'), 'Enlace alternativo incorrecto');
      });
      await test('Reproducir usa el video elegido; cambiarlo retira el reproductor', function () {
        var play = root.querySelector('button[data-ngeq-action="play"]');
        assert(play, 'Falta control de reproducción');
        play.click();
        var frame = root.querySelector('iframe');
        assert(frame && frame.src.startsWith('https://www.youtube-nocookie.com/embed/CAE_1MAIH0c'), 'Video incorrecto');
        root.querySelector('button[data-ngeq-action="pick"]').click();
        assert(!root.querySelector('iframe'), 'El video anterior sigue activo');
      });
      await test('Otras herramientas conservan su comportamiento y no reciben el visor', function () {
        navigate('descripcion', 'tis');
        assert(!root.querySelector('.ngeq-pdf, .ngeq-player--deferred'), 'Cambio fuera de Tinetti');
        assert(root.querySelector('img[src*="ytimg"]'), 'Cambió la portada de TIS');
      });
      await test('Desmontar elimina la interfaz y sus eventos', function () {
        app.destroy();
        assert(root.children.length === 0 && !root.classList.contains('ngeq'), 'Desmontaje incompleto');
      });
    } finally {
      app.destroy();
      summary.textContent = passed + ' pruebas correctas; ' + failed + ' fallidas';
      run.disabled = false;
    }
  });
})();
