# Verificación de Tinetti · Persona 6

El proyecto es una aplicación estática con un módulo JavaScript, estilos
encapsulados bajo `.ngeq` y navegación interna. Estas pruebas respetan su API
pública (`mount`, `navigate`, `destroy`); no necesitan dependencias instaladas.

## Ejecutar

Desde la raíz del repositorio:

```sh
node --check neuroguia-equilibrio.js
node --check tests/tinetti.test.js
git diff --check
python -m http.server 8772 --bind 127.0.0.1
```

Abrir <http://127.0.0.1:8772/tests/tinetti.html> y pulsar **Ejecutar pruebas**.
El resultado esperado es **8 pruebas correctas; 0 fallidas**. La prueba de
reproducción crea y retira inmediatamente el reproductor de YouTube; puede
producir una solicitud de red. No comprueba disponibilidad o reproducción
efectiva del video externo, que depende de YouTube y de la conexión.

## Cobertura y alcance

- Pauta cerrada inicialmente, consulta y descarga del PDF original.
- Carga de las dos imágenes de página, avance, retroceso, límites y ampliación.
- Reinicio al salir de la sección y regresar.
- Disponibilidad y cabecera del archivo PDF original.
- Selección de videos sin iframe ni miniatura remota antes de reproducir.
- Reproductor del video seleccionado y retirada al elegir otro.
- Compatibilidad de la ficha de TIS y desmontaje del módulo.

Para revisión visual móvil, abrir
<http://127.0.0.1:8772/#/equilibrio/tool/tinetti/calculo> y comprobar a 430 px
de ancho que no haya desplazamiento horizontal, que el contador sea legible
y que se pueda ampliar la página. Revisar también «Cómo usar».

El PDF continúa siendo un documento de consulta. Las imágenes `pauta-tinetti-vista-1.jpg`
y `pauta-tinetti-vista-2.jpg` son representaciones de sus páginas para permitir
su lectura en navegadores móviles sin un visor PDF externo. Si cambia el PDF,
se deben regenerar ambas imágenes y repetir las pruebas. No se implementa
captura de pacientes, cálculo automático ni recomendaciones de tratamiento.

Los estilos nuevos utilizan los colores existentes del módulo. Los cambios
funcionales se activan en Tinetti; las demás herramientas conservan sus datos
y su modo previo de presentar videos.
