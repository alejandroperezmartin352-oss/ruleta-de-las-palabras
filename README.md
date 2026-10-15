# Ruleta de las Palabras

Juego de paneles de letras con ruleta para navegador. Creado por **Aledev Studios**. Proyecto independiente, sin relación con ningún programa de televisión: logotipo, sonidos y diseño son originales. Las cantidades son puntos de juego, no dinero real.

## Características (funcionan sin servidor)
- Modo individual y local de 1 a 4 jugadores en el mismo dispositivo, con nombres editables.
- Ruleta de 12 sectores (25, 50, 100, 150, 200, 500, 1.000 €, QUIEBRA y PIERDE TURNO) con aceleración y frenado; no admite giros simultáneos.
- Paneles con Ñ, tildes, espacios y puntuación; todas las apariciones de una letra se revelan con animación; las letras usadas se bloquean.
- Vocales a 50 € sin girar; consonantes: valor del sector × apariciones.
- Paneles normales o contrarreloj (30, 60 o 90 s) con aviso sonoro, pausa y reanudación.
- Panel final: se muestran R S T L N E, eliges exactamente 10 letras más y tienes 45 s para escribir la solución.
- Sonidos y música generados con Web Audio API (no hay archivos de audio). Nada suena hasta que pulsas «Entrar».
- Guardado en localStorage: sonido, categorías, mejor puntuación y estadísticas, con botón para borrarlo.
- Diseño adaptable a ordenador y móvil; respeta «reducir movimiento» del sistema.

## Cómo se juega
Gira la ruleta y elige una consonante. Las vocales se compran sin girar. QUIEBRA deja a cero tu saldo de la ronda y pasa el turno; PIERDE TURNO solo pasa el turno. Pulsa Resolver para escribir la frase (se ignoran mayúsculas y tildes; la Ñ cuenta como letra distinta).

**Dinero:** quien resuelve el panel suma su saldo de ronda a su total; los demás pierden el de esa ronda. Al terminar las rondas, el jugador con más total juega el panel final.

## Ejecutar en local
1. **Extrae el ZIP completo** (no abras `index.html` desde dentro del visor del ZIP: necesita la carpeta `data/`).
2. Abre `index.html` con doble clic. No hace falta instalar nada.

## Publicar en GitHub Pages
1. En github.com pulsa **New repository**, ponle nombre y créalo público.
2. Pulsa **uploading an existing file** y arrastra el CONTENIDO de la carpeta (`index.html`, `styles.css`, `script.js`, `README.md`, `LICENSE` y la carpeta `data`). Pulsa **Commit changes**.
3. En **Settings → Pages** elige la rama `main` y la carpeta `/ (root)`. Pulsa **Save**.
4. Tras uno o dos minutos estará en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPOSITORIO/`.

Todas las rutas son relativas, así que funciona en un repositorio que no sea la raíz del dominio.

## Archivos
- `index.html`: estructura y pantallas.
- `styles.css`: diseño.
- `script.js`: lógica del juego, ruleta, audio y guardado.
- `data/panels.js`: banco de paneles (separado del código).

## Añadir paneles
En `data/panels.js` añade filas `["Categoría","Pista","Solución"]` con una categoría existente en `CATEGORIES`, sin duplicar soluciones ni dejar espacios dobles.

## Limitaciones reales
- **Banco de paneles: 50 paneles reales.** No hay 900; la estructura permite ampliarlo.
- **Multijugador online: no implementado.** GitHub Pages solo aloja ficheros; las salas por código necesitan un servidor externo (por ejemplo Supabase, con nivel gratuito). Nunca pongas claves secretas en el código público.
- **El resultado de la ruleta se calcula en el navegador**, por lo que un usuario técnico podría manipularlo. Es inherente a un juego sin servidor.
- No hay niveles de dificultad.
- Probado automáticamente en Chromium; no se ha probado en Firefox, Safari ni en un móvil físico.
