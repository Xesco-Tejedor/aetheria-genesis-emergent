# Aetheria: Genesis Emergent

## El jardín que recuerda

Un prototipo amable sobre recuperar un territorio postapocalíptico. Empieza sin vida: un viaducto roto, un vagón abandonado, ruinas y una fuga química. Solo puedes introducir hongos y musgo. Las flores, los animales y los guardianes nacen de sus relaciones y de las condiciones del suelo.

### Jugar

Abre la demo de GitHub Pages del repositorio. No necesita cuenta, compras ni servicios externos. Necesita un navegador con WebGL. Funciona con ratón o pantalla táctil; la interfaz se ha comprobado a 320, 390 y 1280 px. No se ha probado todavía en un teléfono Android físico.

1. Pulsa **Escuchar al jardín** si quieres una sugerencia. Ilumina un lugar y elige una herramienta, pero tú decides si aplicarla.
2. Planta dos **Honguitos** y dos **Musgos de rocío** junto a las piedras. Los hongos limpian; el musgo comparte alimento.
3. Pulsa **Dejar crecer** o **Un latido** para observar los cambios. El hormigón necesita ocho latidos de cuidados. La colonización no es instantánea.
4. **♡** acerca una alianza real. Las gotas se mueven entre vecinos complementarios. Pulsa de nuevo para volver.
5. Cuando haya flores de minerales y néctar, **Brisa luminosa** puede invitar al polinizador. Las flores maduras también sostienen al quelonio.
6. Para detener la fuga, rodéala con seis honguitos. **Limpiar** ayuda con el veneno residual cercano a la flor madura.
7. Un guardián requiere polinizador, quelonio, liquen maduro, al menos doce lugares vivos y treinta latidos continuos sin veneno en su área. Su suelo queda protegido y permite una sucesión viva.

El jardín se guarda en este navegador. **Empezar de nuevo** pide confirmación antes de borrar ese progreso. No se sincroniza entre dispositivos. Las intervenciones gastan luz, que se regenera con la biodiversidad. Los botones de giro y zoom cambian la vista.

### Alcance del incremento del 28 de octubre de 2026

- Un sector jugable de 61 nodos bajo terreno continuo, geometría 3D WebGL propia, sin recursos gráficos remotos ni marcas ajenas.
- Inicio estéril y recorrido completo reproducido mediante acciones legales de la interfaz: L2, L3 y L4; victoria al latido 259 en la prueba de referencia, con 96,7% de vida, 100% de pureza, siete guardianes y cincuenta latidos de equilibrio sin intervención.
- Pruebas de invariantes con 6.000 pulsos aleatorios, costes de acciones inválidas, arranque estéril, guardado/recarga y tamaños de pantalla.
- HTML, CSS, simulación, interacción y render separados. `node test.mjs` ejecuta la regresión del núcleo. `legal-replay.json` conserva las acciones del recorrido de referencia.

### Diferencias y trabajo restante respecto al GDD

Esto no es el juego completo. Faltan arte y animación finales, sonido, mapas mayores y variados, simulación GPU, navegación y selección más precisas en pantallas pequeñas, accesibilidad no visual y pruebas amplias de balance. Las transiciones de altura todavía no condicionan el grafo y los animales se representan con animaciones locales, no rutas sobre todo su radio funcional.

El motor UE5 inicial se sustituyó por WebGL para entregar una versión verificable en navegador. Las reglas se ajustaron al prototipo: colonización de tres latidos, flora también sobre suelo acondicionado, diferenciación vegetal por sustrato y éter, convivencia L4 en radio de tres pasos. En suelo protegido, ocho latidos de cooperación con liquen maduro y ambos animales permiten sucesión microbiana a liquen. Un guardián no nace junto a otro. Se mantienen los umbrales de victoria: 85% de vida, 99% de pureza, cinco guardianes y cincuenta ciclos autosuficientes. No se afirma paridad exacta con el GDD ni con el núcleo C++ anterior, que se conserva por separado.

### Uso local

Sirve la carpeta con `python3 -m http.server 8080` y abre `http://localhost:8080`. Los módulos necesitan HTTP, no abrir directamente con `file://`.

No se ha añadido una licencia de reutilización. La demo pública no concede automáticamente una licencia del código.
