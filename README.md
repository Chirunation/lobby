# Chirunation ♡ lobby

Fan site de la Chirunation: celebrando los lazos entre Perú y Chile.
Página publicada en: **https://chirunation.github.io/lobby/**

---

## 📁 Cómo está organizada

```
lobby/
├── index.html          ← la estructura de la página (casi nunca se toca)
├── README.md           ← este manual
├── css/
│   └── estilos.css     ← colores, tamaños y diseño
├── js/
│   ├── contenido.js    ← ⭐ TODOS LOS TEXTOS Y LINKS (lo único que vas a editar)
│   ├── app.js          ← arma la página con lo que hay en contenido.js
│   └── juego.js        ← el juego de Perú y Chile en pixel
└── assets/
    └── img/            ← imágenes (foto de la playa, portada del libro...)
```

**Regla de oro:** para cambiar avisos, publicaciones, links, fechas o textos del juego,
**solo abre `js/contenido.js`**. No hace falta tocar nada más.

---

## ✏️ Cómo editar (sin instalar nada)

1. En GitHub, entra al repo → carpeta `js` → `contenido.js`.
2. Toca el lápiz ✏️ (**Edit this file**).
3. Cambia lo que necesites.
4. Abajo, **Commit changes**.
5. En 1–2 minutos la página se actualiza sola. (Si no ves el cambio: **Ctrl + Shift + R**.)

### Reglas para no romper nada

- Los textos van **entre comillas**: `titulo: "Hola",`
- Cada línea/bloque termina en **coma** `,`
- Si un texto necesita comillas adentro, usa comillas simples: `"Él dijo 'hola'"`
- Las líneas con `//` son notas, la página las ignora.
- **Para agregar** algo: copia un bloque completo `{ ... },`, pégalo y cambia los textos.
- **Para quitar** algo: borra el bloque completo `{ ... },`.

Si te equivocas, la página muestra un aviso rojo arriba: revisa la última línea que cambiaste
(casi siempre falta una coma o una comilla). En GitHub puedes volver a la versión anterior
desde **History**.

---

## 📌 Lo que más vas a cambiar

### Agregar una publicación en "Lo último de la ship"
En `contenido.js`, busca `ultimo: [` y pega una línea nueva **arriba de todo** (lo más nuevo va primero):

```js
{ tipo: "fic", titulo: "Nombre del fic", detalle: "por @autora", fecha: "20 nov", link: "https://..." },
```

- `tipo` cambia el color de la etiqueta: `fic`, `art`, `edit`, `video`, `musica`, `aviso`, `news`
- `detalle`, `fecha` y `link` son opcionales (déjalos en `""` si no aplican).
- Se muestran solo las primeras 5. Para mostrar más, cambia `maxUltimo: 5`.

### Abrir el concurso de escritura
En `concursos` → `botones`, cambia:

```js
{ texto: "Concurso de escritura", icono: "escritura", link: "", proximamente: true },
```
por:
```js
{ texto: "Concurso de escritura", icono: "escritura", link: "https://forms.gle/EL-LINK" },
```

Para cerrar un concurso, ponle `proximamente: true` o bórralo.
Para un aviso nuevo, cambia `titulo` y `texto` dentro de `concursos`.

### Cambiar la cita de la notita amarilla
En `cita`: cambia `texto` y `autor`.

### Agregar una fecha al calendario
En `calendario: [` agrega:

```js
{ dia: 15, mes: 3, pais: "ambos", titulo: "Aniversario de la Chirunation", texto: "¡Cumplimos un año!" },
```
- `mes` en número (1 = enero ... 12 = diciembre)
- `pais`: `"peru"` (rojo), `"chile"` (azul) o `"ambos"` (mitad y mitad)
- Se ordenan solas y la próxima fecha sale marcada con "¡la que viene!".

### Agregar un proyecto
En `proyectos: [` agrega (salen en el mismo orden en que los escribas, el primero arriba):

```js
{
  titulo: "Nombre del proyecto",
  descripcion: "Una frase corta que cuente de qué se trata.",
  boton: "Ver el proyecto",
  link: "https://...",
  icono: "estrella",
  color: "ambos",
},
```
- `color`: `"peru"` (rojo), `"chile"` (azul) o `"ambos"` (mitad y mitad)
- `icono`: `calendario`, `corazon`, `slides`, `libro`, `estrella`, `musica` o `video`
- La tarjeta entera y el botón abren el `link` en otra pestaña.
- Si borras todos, la ventanita dice "Pronto habrá nuevos proyectos ♡".

### Cambiar el video del MAP o la playlist
Pega el link nuevo en `map.youtube` o `playlist.spotify`. Cualquier link de YouTube o Spotify
(playlist, álbum o canción) sirve: la página arma el reproductor sola.

### Cambiar las 3 burbujas del planeta
En `burbujas`: cada una tiene `texto`, `icono` y **una** de estas dos cosas:
- `abre: "calendario"`, `abre: "chiru"` o `abre: "proyectos"` → abre esa ventanita
- `link: "https://..."` → abre el link en otra pestaña

Iconos disponibles: `calendario`, `corazon`, `slides`, `libro`, `estrella`, `musica`, `video`.

### Editar "¿Qué es Chirú?"
En `queEsChiru`: cambia `intro` y los `puntos` (cada uno con `titulo` y `texto`).

### Redes sociales
En `enlaces`: cada red tiene `red`, `usuario` y `link`. Agrega o borra líneas.

### Cambiar una imagen
1. Sube la imagen nueva a `assets/img/` (en GitHub: **Add file → Upload files**).
2. En `contenido.js`, cambia la ruta: `imagen: "assets/img/nombre-nuevo.jpg"`.
3. Usa nombres sin espacios ni tildes (ej. `foto-lima-2026.jpg`) y fotos de menos de 1 MB.

---

## 🎮 El juego de Perú y Chile

- **Arrastrar** a uno hacia el otro → se dan un besito ♡
- **Flechas ‹ ›** → cambian el objeto de la mesita
- **Arrastrar el objeto** hacia ellos → reaccionan:

| Objeto     | Reacción  | Qué pasa                                   |
|------------|-----------|--------------------------------------------|
| `ceviche`  | `comer`   | comen juntos y quedan felices               |
| `empanada` | `comer`   | comen juntos y quedan felices               |
| `alfajor`  | `comer`   | comen juntos y quedan felices               |
| `flor`     | `amor`    | corazones y besito                          |
| `pisco`    | `pelear`  | discuten de quién es el pisco... y brindan  |
| `pelota`   | `futbol`  | juegan fútbol y terminan peleando por un penal |

Los **textos** de cada uno se cambian en `contenido.js` → `juego` (`peru:`, `chile:` y `final:`).
Puedes quitar objetos o cambiarles el orden. Para dibujar un objeto **nuevo** hay que agregar su
dibujito en `js/juego.js` (sección `SPRITES`: una cuadrícula de 12×12 con letras = colores).

También funciona con teclado: Tab hasta Perú, Chile o el objeto y **Enter**.

---

## 🎨 Cambiar colores o tamaños

En `css/estilos.css`, arriba de todo (`:root`) están los colores principales con su nombre
(`--rojo`, `--azul`, `--crema`...). Cambia el código de color y se actualiza en toda la página.

---

## 💻 Probar en tu compu antes de subir

Abre `index.html` con doble clic en el navegador. Todo funciona igual (el video y Spotify
necesitan internet).

---

## 🚀 Publicar con GitHub Pages (solo la primera vez)

1. El repo debe ser **público** (Settings → General → Danger Zone → Change visibility).
2. **Settings → Pages → Source: Deploy from a branch → `main` / `(root)` → Save**.
3. Listo: https://chirunation.github.io/lobby/

---

## 🆘 Problemas comunes

| Problema | Solución |
|----------|----------|
| Aviso rojo "hay un error en js/contenido.js" | Falta una coma o una comilla en lo último que cambiaste. Revisa esa línea o vuelve a la versión anterior en **History**. |
| No veo mis cambios | Espera 2 minutos y recarga con **Ctrl + Shift + R**. |
| Una imagen no aparece | Revisa que el nombre en `contenido.js` sea **exactamente** igual al del archivo (mayúsculas incluidas). |
| El video o la playlist no cargan | Revisa que el link sea público y copiado completo. |
