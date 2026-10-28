# Aetheria: Genesis Emergent

Prototipo jugable PC con terreno 3D WebGL, cámara isométrica, rotación y zoom.
Sin servicios de pago, sin dependencias remotas, sin datos personales ni seguimiento.

## Uso local

Servir la carpeta con un servidor HTTP estático y abrir index.html.
Por ejemplo: `python3 -m http.server 8080` y abrir http://localhost:8080.
Los módulos JS requieren HTTP, no abrir directamente con file://.

Ratón para los pinceles; 1/2 Hifas/Cianobacterias; 3 Corriente; 4 Purificar.
Espacio pausa, N un pulso, Q/E gira, +/− zoom. La guía está dentro del juego.

## Estado de desarrollo

- Probado: arranque estéril, intervenciones con coste, emergencia L2 y L3,
  depuración, colonización, estabilidad de invariantes y controles básicos.
- Pendiente: recorrido completo desde estado inicial hasta L4/victoria;
  guardado, audio, arte final, simulación GPU y balance de todos los sectores.
- No equivale todavía al GDD completo. El motor original UE5 se sustituyó por
  WebGL bajo la decisión del autor de usar un motor disponible y verificable.
- El núcleo C++ anterior se conserva como referencia separada; no se afirma
  paridad matemática con esta versión ajustada durante las pruebas de juego.

## Reglas provisionales de progresión

Dos Hifas y dos Cianobacterias sobre hormigón con Tox<0,2 originan Criptolíquen.
En suelo acondicionado ocho ciclos también se permite la receta.
Flora madura se diferencia por sustrato y éter, con una fracción retenida como
Criptolíquen. En esta versión el polinizador requiere tres precursoras de ambas
especies en radio dos y un pulso de Corriente, no el anillo estricto del GDD.
Es un ajuste explícito de accesibilidad del primer prototipo, pendiente de balance.

No hay licencia de reutilización añadida por defecto. La publicación como demo
no concede automáticamente una licencia del código.
