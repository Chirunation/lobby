/* =====================================================================
   ♡  CONTENIDO DE LA CHIRUNATION  ♡
   ---------------------------------------------------------------------
   Este es el ÚNICO archivo que necesitas tocar para cambiar textos,
   links, avisos, publicaciones, fechas del calendario y el juego.

   Reglas rápidas (lee el README para más detalle):
   • Los textos van entre comillas:  "así"
   • Cada elemento termina con una coma  ,
   • Las líneas que empiezan con  //  son notas: la página las ignora.
   • Para quitar algo, bórralo completo (desde { hasta },).
   • Para agregar algo, copia un bloque { ... }, pégalo y cámbialo.
   ===================================================================== */

window.CHIRU = {

  /* ---------- 1. DATOS GENERALES ---------- */
  sitio: {
    titulo: "Chirunation",
    subtitulo: "Celebrando los lazos entre Perú y Chile ♡",
    bienvenida: "¡Bienvenidx a la Chirunation! ♡",          // texto que pasa en la cinta de arriba
    pie: "Fan site sin fines de lucro ♡ hecho con amor chiruano",
  },

  // Botón de la barra de arriba (a la derecha de la cinta).
  // Para quitarlo, deja:  botonBarra: null,
  botonBarra: { texto: "Únete al canal de Whatsapp", link: "https://whatsapp.com/channel/0029VbDpPB8DJ6H9KE6eay0n" },


  /* ---------- 2. LAS 3 BURBUJAS SOBRE EL PLANETA ---------- */
  // abre: "calendario"  → abre la ventanita del calendario
  // abre: "chiru"       → abre la ventanita de ¿Qué es Chirú?
  // link: "https://..."  → abre ese link en otra pestaña
  // icono disponible: calendario, corazon, slides, libro, estrella, musica, video
  burbujas: [
    { texto: "Calendario",     icono: "calendario", abre: "calendario" },
    { texto: "¿Qué es Chirú?", icono: "corazon",    abre: "chiru" },
    { texto: "CC2025",         icono: "slides",     link: "https://drive.google.com/file/d/1cwRm8RrBGzPfCTTBt_qsNaXQ2iZcNwIi/view?usp=sharing", detalle: "slides" },
  ],


  /* ---------- 3. AVISO DE CONCURSOS (columna izquierda) ---------- */
  // Un botón con  proximamente: true  (o sin link) sale gris y no se puede tocar.
  // icono disponible: dibujo, escritura, estrella, video, musica, libro
  concursos: {
    etiqueta: "Nuevo aviso",
    titulo: "¡Participa en los concursos!",
    texto: "Dibuja o escribe algo de la ship y compártelo con la Chirunation. Las bases están dentro de cada formulario (fecha límite: 30 de diciembre de 2026).",
    botones: [
      { texto: "Concurso de dibujo",    icono: "dibujo",    link: "https://forms.gle/tH6Q79ND79LfpE8p7" },
      { texto: "Concurso de escritura", icono: "escritura", link: "", proximamente: true },
    ],
  },


  /* ---------- 4. VIDEO DEL MAP ---------- */
  // Pega cualquier link de YouTube (youtu.be/... o youtube.com/watch?v=...).
  map: {
    titulo: "Mira el MAP Chirú",
    youtube: "https://youtu.be/UL9O9xbVSrU",
  },


  /* ---------- 5. NOTITA CON CITA (columna izquierda) ---------- */
  cita: {
    texto: "Proclamamos nuestra voluntad de obrar decididamente para que Chile, Perú y todos los pueblos de América vivan siempre en paz y amistad y nunca vuelva a surgir entre nosotros una guerra",
    autor: "Declaración conjunta de Mario Vargas Llosa (Perú) y Jorge Edwards (Chile), publicada en La Tercera",
  },


  /* ---------- 6. ENLACES (pase a bordo, columna derecha) ---------- */
  enlaces: [
    { red: "X / Twitter", usuario: "@chipelovers", link: "https://x.com/chipelovers" },
    { red: "Instagram",   usuario: "@chirunation", link: "https://www.instagram.com/chirunation/" },
    { red: "TikTok",      usuario: "@chirunation", link: "https://www.tiktok.com/@chirunation" },
    { red: "WhatsApp",    usuario: "grupo",        link: "https://chat.whatsapp.com/ExWVOmNLF0mB06kdusrFja" },
    { red: "Discord",     usuario: "servidor",     link: "https://discord.gg/9dZywuHEe" },
  ],


  /* ---------- 7. LO ÚLTIMO DE LA SHIP (columna derecha) ---------- */
  // Lo más nuevo va ARRIBA. Se muestran solo las primeras 5 (cámbialo en  maxUltimo).
  // tipo disponible (cambia el color de la etiqueta): fic, art, edit, video, musica, aviso, news
  // link y fecha son opcionales: si los dejas "" no se muestran.
  maxUltimo: 5,
  ultimo: [
    { tipo: "aviso",  titulo: "¡Concurso de dibujo abierto!", detalle: "Inscríbete en el formulario", fecha: "", link: "https://forms.gle/tH6Q79ND79LfpE8p7" },
    { tipo: "video",  titulo: "Ya salió el MAP Chirú",        detalle: "Míralo en YouTube",           fecha: "", link: "https://youtu.be/UL9O9xbVSrU" },
    { tipo: "musica", titulo: "La playlist de la ship",       detalle: "Escúchala en Spotify",        fecha: "", link: "https://open.spotify.com/playlist/7C9DltlF1riOg3W5rhHQ4j" },
    { tipo: "news",   titulo: "Slides de la CC2025",          detalle: "Revívelas aquí",              fecha: "", link: "https://drive.google.com/file/d/1cwRm8RrBGzPfCTTBt_qsNaXQ2iZcNwIi/view?usp=sharing" },
  ],


  /* ---------- 8. SECCIÓN DE ABAJO: LIBRO, FOTO Y PLAYLIST ---------- */
  tituloSeccionAbajo: "Buen viaje ♡",

  libro: {
    titulo: "Las historias que nos unen",
    subtitulo: "Episodios positivos en las relaciones peruano-chilenas, siglos XIX y XX",
    autores: "Sergio González y Daniel Parodi (comps.)",
    portada: "assets/img/libro-portada.jpg",
    boton: "Leer el libro",
    link: "https://drive.google.com/file/d/1-5t81K1_EkI4-GSDxRdoMuafn1yoy57H/view",
  },

  foto: {
    imagen: "assets/img/chiru-playa.jpg",
    descripcion: "Peluches tejidos de Perú y Chile abrazados frente al mar",   // para lectores de pantalla
    pie: "juntitos frente al mismo mar ♡",
  },

  // Pega el link de Spotify (playlist, álbum o canción).
  playlist: {
    etiqueta: "Algunas de las tantas canciones que recuerdan a la ship",
    titulo: "Chiruplaylist",
    spotify: "https://open.spotify.com/playlist/7C9DltlF1riOg3W5rhHQ4j",
  },


  /* ---------- 9. CALENDARIO (ventanita de la burbuja "Calendario") ---------- */
  // dia y mes en números (mes: 1 = enero ... 12 = diciembre).
  // pais: "peru", "chile" o "ambos" (cambia el color de la fecha).
  // Se ordenan solos por fecha y se marca la próxima que viene.
  calendario: [
  // --- LO QUE QUEDA DE 2026 ---
  { dia: 30, mes: 12, anio: 2026, pais: "ambos", titulo: "Cierre de Concursos 2026", texto: "¡Último día del año para enviar sus fics y dibujos de la ship!" },

  // --- CALENDARIO 2027 ---
  { dia: 7, mes: 2, anio: 2027, pais: "ambos", titulo: "Día de la Amistad Peruano-Chilena", texto: "¡El día oficial de nuestra hermandad! Celebrando la unión histórica entre ambos países." },
  { dia: 14, mes: 2, anio: 2027, pais: "ambos", titulo: "San Valentín Chirú", texto: "Día de fanarts, fics y mucho amor para la ship." },
  { dia: 28, mes: 7, anio: 2027, pais: "peru", titulo: "Fiestas Patrias del Perú", texto: "28 y 29 de julio: ¡feliz cumple, Perú!" },
  { dia: 18, mes: 9, anio: 2027, pais: "chile", titulo: "Fiestas Patrias de Chile", texto: "18 y 19 de septiembre: ¡feliz dieciocho, Chile!" },
],

  /* ---------- 10. ¿QUÉ ES CHIRÚ? (ventanita de la burbuja del medio) ---------- */
  queEsChiru: {
    titulo: "¿Qué es Chirú?",
    intro: "Chirú / PeChi / ChiPe es el ship entre Chile y Perú. La Chirunation es la comunidad que lo celebra con fanarts, fics, edits, concursos y mucho cariño entre los dos países.",
    puntos: [
      { titulo: "¿Qué hacemos?",   texto: "Compartimos contenido de la ship y hacemos proyectos en comunidad, como el MAP Chirú. Actualmente estamos organizando concursos de dibujo y escritura," },
      { titulo: "¿Quién puede unirse?", texto: "¡Cualquier persona que ame este ship es súper bienvenida! Ya sea de Perú, Chile o cualquier otro hermoso rincón del mundo" },
      { titulo: "¿Cómo me uno?",   texto: "Entra a nuestro grupo de WhatsApp o síguenos en nuestras otras redes. Los links están en el pase a bordo." },
    ],
  },


  /* ---------- 11. EL JUEGO DE PERÚ Y CHILE ---------- */
  // Puedes cambiar los textos de cada uno. Las comidas/objetos disponibles son:
  // ceviche, empanada, alfajor, flor, pisco, pelota  (cada uno ya tiene su dibujito)
  // reaccion: "comer" (felices), "amor" (corazones), "pelear" (se enojan), "futbol" (juegan y se pelean)
  juego: {
    titulo: "Diviértete con Perú y Chile",
    instrucciones: "Arrastra a los PePo y haz click en los objetos. Los tonotos están en tus manos.",
    beso: { peru: "¡Mua!", chile: "♡ ♡ ♡" },
    items: [
      { id: "ceviche",  nombre: "Ceviche",          reaccion: "comer",  peru: "¡Prueba mi ceviche!", chile: "¡Riquísimo!" },
      { id: "empanada", nombre: "Empanada de pino", reaccion: "comer",  peru: "¡Qué rica!",          chile: "¡Te hice empanadas!" },
      { id: "alfajor",  nombre: "Alfajor",          reaccion: "comer",  peru: "¿Mitad y mitad?",      chile: "¡Ñam!" },
      { id: "flor",     nombre: "Flores",           reaccion: "amor",   peru: "¡Para mí!",            chile: "Para ti ♡" },
      { id: "pisco",    nombre: "Pisco",            reaccion: "pelear", peru: "¡El pisco es peruano!", chile: "¡No, es chileno!", final: "...¿salud?" },
      { id: "pelota",   nombre: "Pelota",           reaccion: "futbol", peru: "¡Fue offside!",        chile: "¡Fue penal!" },
    ],
  },

};
