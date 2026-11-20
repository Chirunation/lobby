/* =====================================================================
   app.js — dibuja la página con lo que hay en js/contenido.js
   (Normalmente NO necesitas tocar este archivo.)
   ===================================================================== */
(function () {
  "use strict";
  var D = window.CHIRU;
  if (!D) {
    document.body.insertAdjacentHTML("afterbegin",
      '<p style="background:#ffe1e1;color:#a8203a;padding:14px;margin:0;font-weight:800;text-align:center">' +
      "Ups: hay un error en js/contenido.js (revisa comas y comillas). Mira la sección de problemas en el README.</p>");
    return;
  }

  /* ---------- utilidades ---------- */
  function esc(t) {
    return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function $(id) { return document.getElementById(id); }
  function externo(link) { return /^https?:\/\//.test(link || "") ? ' target="_blank" rel="noopener"' : ""; }
  function poner(id, html) { var el = $(id); if (el) el.innerHTML = html; }

  var ICONOS = {
    dibujo: '<path d="M12 21a9 9 0 1 1 9-9c0 2-1.5 3-3 3h-2.5a2 2 0 0 0-1.5 3.3A1.6 1.6 0 0 1 12 21z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10.5" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
    escritura: '<path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/>',
    libro: '<path d="M2 5h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2z"/><path d="M22 5h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z"/>',
    calendario: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/><path d="M12 17.5 9.6 15.2a1.5 1.5 0 0 1 2.4-1.9 1.5 1.5 0 0 1 2.4 1.9z" fill="currentColor"/>',
    corazon: '<path d="M12 21 4.5 13.6A4.8 4.8 0 0 1 12 7.4a4.8 4.8 0 0 1 7.5 6.2z"/>',
    slides: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M12 16v4M8 20h8"/><path d="M10 8v4l3.5-2z" fill="currentColor"/>',
    estrella: '<path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6-4.5-4.2 6.1-.7z"/>',
    musica: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    video: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9 5 3-5 3z" fill="currentColor"/>',
    spotify: '<circle cx="12" cy="12" r="10"/><path d="M7 9.5c3.5-1 7.5-.7 10.5 1M7.8 12.8c3-.8 6-.5 8.5.9M8.5 15.8c2.4-.5 4.6-.3 6.6.7"/>'
  };
  function icono(nombre, tam, color) {
    var p = ICONOS[nombre]; if (!p) return "";
    return '<svg width="' + (tam || 20) + '" height="' + (tam || 20) + '" viewBox="0 0 24 24" fill="none" stroke="' + (color || "currentColor") +
      '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + "</svg>";
  }
  var CORAZON = '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path class="latido" d="M12 21 4.5 13.6A4.8 4.8 0 0 1 12 7.4a4.8 4.8 0 0 1 7.5 6.2z" fill="#ff5c74"/></svg>';

  function idYoutube(url) {
    var m = String(url || "").match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
    return m ? m[1] : "";
  }
  function embedSpotify(url) {
    var m = String(url || "").match(/open\.spotify\.com\/(?:intl-\w+\/)?(playlist|album|track|artist|show|episode)\/([A-Za-z0-9]+)/);
    return m ? "https://open.spotify.com/embed/" + m[1] + "/" + m[2] + "?utm_source=generator" : "";
  }

  /* ---------- 1. generales ---------- */
  var S = D.sitio || {};
  document.querySelectorAll(".t-main").forEach(function (el) { el.textContent = S.titulo || "Chirunation"; });
  if ($("t-sub")) $("t-sub").textContent = S.subtitulo || "";
  if ($("titulo-sr")) $("titulo-sr").textContent = (S.titulo || "") + " — " + (S.subtitulo || "");
  var frase = "✿ " + (S.bienvenida || "") + " ";
  poner("cinta", esc(new Array(9).join(frase)));
  poner("pie", esc(S.pie || ""));
  if (D.botonBarra && D.botonBarra.link) {
    poner("boton-barra", '<a class="btn btn-azul btn-chico" href="' + esc(D.botonBarra.link) + '"' + externo(D.botonBarra.link) + ">" + esc(D.botonBarra.texto) + "</a>");
  }

  /* ---------- 2. burbujas ---------- */
  var POS = [[20, 15], [50, 7], [80, 15]];
  var ANILLOS = ["#b9d0ff", "#ffb3c1", "#f6d39c"];
  var COLOR_ICONO = ["#3a64e0", "#d6334f", "#b36b1a"];
  poner("burbujas", (D.burbujas || []).slice(0, 3).map(function (b, i) {
    var estilo = ' style="left:' + POS[i][0] + "%;top:" + POS[i][1] + "%;--anillo:" + ANILLOS[i] + '"';
    var dentro = icono(b.icono, 30, COLOR_ICONO[i]) + "<span>" + esc(b.texto) + "</span>" + (b.detalle ? "<small>" + esc(b.detalle) + "</small>" : "");
    if (b.abre) return '<button type="button" class="burbuja" data-abre="' + esc(b.abre) + '"' + estilo + ">" + dentro + "</button>";
    return '<a class="burbuja" href="' + esc(b.link || "#") + '"' + externo(b.link) + estilo + ">" + dentro + "</a>";
  }).join(""));

  /* ---------- 3. concursos ---------- */
  var K = D.concursos;
  if (K) {
    poner("concursos",
      (K.etiqueta ? '<span class="etiqueta">' + CORAZON + esc(K.etiqueta) + "</span>" : "") +
      "<h2>" + esc(K.titulo) + "</h2><p>" + esc(K.texto) + '</p><div class="botones">' +
      (K.botones || []).map(function (b, i) {
        var off = b.proximamente || !b.link;
        if (off) return '<div class="btn btn-off" aria-disabled="true">' + icono(b.icono) + esc(b.texto) + ' <span class="badge">próximamente</span></div>';
        return '<a class="btn ' + (i % 2 ? "btn-azul" : "btn-rojo") + '" href="' + esc(b.link) + '"' + externo(b.link) + ">" + icono(b.icono) + esc(b.texto) + "</a>";
      }).join("") + "</div>");
  } else { $("concursos").remove(); }

  /* ---------- 4. MAP ---------- */
  var yt = D.map && idYoutube(D.map.youtube);
  if (yt) {
    poner("map", "<h2>" + esc(D.map.titulo) + '</h2><div class="video"><iframe src="https://www.youtube-nocookie.com/embed/' + yt +
      '" title="' + esc(D.map.titulo) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="lazy"></iframe></div>' +
      '<a class="btn btn-azul" href="https://youtu.be/' + yt + '" target="_blank" rel="noopener">Ver en YouTube ' + icono("video", 18) + "</a>");
  } else { $("map").remove(); }

  /* ---------- 5. cita ---------- */
  if (D.cita && D.cita.texto) {
    poner("cita", '<span class="comillas" aria-hidden="true">“</span><blockquote>' + esc(D.cita.texto) + "</blockquote>" +
      (D.cita.autor ? "<figcaption>— " + esc(D.cita.autor) + "</figcaption>" : ""));
  } else { $("cita").remove(); }

  /* ---------- 6. enlaces ---------- */
  poner("enlaces", (D.enlaces || []).map(function (e) {
    return '<a class="enlace" href="' + esc(e.link) + '"' + externo(e.link) + "><span>" + esc(e.red) +
      (e.usuario ? " <small>" + esc(e.usuario) + "</small>" : "") + '</span><span class="cor" aria-hidden="true">♡</span></a>';
  }).join(""));

  /* ---------- 7. lo último ---------- */
  var ult = (D.ultimo || []).slice(0, D.maxUltimo || 5);
  if (ult.length) {
    poner("ultimo", '<h2 id="ultimo-titulo">Lo último de la ship ✿</h2><ul class="lista-ultimo">' + ult.map(function (u) {
      var tipo = esc((u.tipo || "news").toLowerCase());
      var meta = [u.detalle, u.fecha].filter(Boolean).map(esc).join(" · ");
      var dentro = '<span class="tipo tipo-' + tipo + '">' + tipo + '</span><span class="txt">' + esc(u.titulo) + (meta ? "<small>" + meta + "</small>" : "") + "</span>";
      return "<li>" + (u.link ? '<a class="item-ultimo" href="' + esc(u.link) + '"' + externo(u.link) + ">" + dentro + "</a>" : '<div class="item-ultimo">' + dentro + "</div>") + "</li>";
    }).join("") + "</ul>");
  } else { $("ultimo").remove(); }

  /* ---------- 8. abajo ---------- */
  poner("abajo-titulo", esc(D.tituloSeccionAbajo || ""));
  var L = D.libro;
  if (L) {
    poner("libro", (L.portada ? '<img src="' + esc(L.portada) + '" alt="Portada del libro ' + esc(L.titulo) + '">' : "") +
      "<h3>" + esc(L.titulo) + "</h3>" + (L.subtitulo ? '<p class="sub">' + esc(L.subtitulo) + "</p>" : "") +
      (L.autores ? '<p class="autores">' + esc(L.autores) + "</p>" : "") +
      (L.link ? '<a class="btn btn-rojo" href="' + esc(L.link) + '"' + externo(L.link) + ">" + icono("libro") + esc(L.boton || "Leer") + "</a>" : ""));
  } else { $("libro").remove(); }
  var F = D.foto;
  if (F && F.imagen) {
    poner("foto", '<img src="' + esc(F.imagen) + '" alt="' + esc(F.descripcion || "") + '" loading="lazy">' + (F.pie ? "<figcaption>" + esc(F.pie) + "</figcaption>" : ""));
  } else { $("foto").remove(); }
  var P = D.playlist, sp = P && embedSpotify(P.spotify);
  if (sp) {
    poner("playlist", '<span class="pre">' + esc(P.etiqueta || "") + "</span><h2>" + esc(P.titulo) + "</h2>" +
      '<iframe src="' + sp + '" title="' + esc(P.titulo) + ' en Spotify" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>' +
      '<a class="btn btn-verde" href="' + esc(P.spotify) + '" target="_blank" rel="noopener">' + icono("spotify") + "Abrir en Spotify</a>");
  } else { $("playlist").remove(); }

  /* ---------- 9. calendario ---------- */
  var MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  var hoy = new Date(), hoyN = (hoy.getMonth() + 1) * 100 + hoy.getDate();
  var fechas = (D.calendario || []).filter(function (f) { return f.dia && f.mes; })
    .sort(function (a, b) { return (a.mes * 100 + a.dia) - (b.mes * 100 + b.dia); });
  var prox = fechas.filter(function (f) { return f.mes * 100 + f.dia >= hoyN; })[0] || fechas[0];
  poner("fechas", fechas.map(function (f) {
    var es = f === prox;
    return '<li class="fecha' + (es ? " proxima" : "") + '"><div class="fecha-dia ' + esc(f.pais || "ambos") + '"><b>' + f.dia + "</b><small>" + MESES[f.mes - 1] + "</small></div>" +
      "<div><h3>" + esc(f.titulo) + (es ? '<span class="badge">¡la que viene!</span>' : "") + "</h3>" + (f.texto ? "<p>" + esc(f.texto) + "</p>" : "") + "</div></li>";
  }).join("") || "<li>Pronto agregaremos fechas ♡</li>");

  /* ---------- 10. ¿qué es Chirú? ---------- */
  var Q = D.queEsChiru || {};
  poner("chiru-contenido", '<h2 id="chiru-titulo">' + esc(Q.titulo || "¿Qué es Chirú?") + "</h2>" +
    (Q.intro ? '<p class="chiru-intro">' + esc(Q.intro) + "</p>" : "") +
    '<div class="chiru-puntos">' + (Q.puntos || []).map(function (p) {
      return '<div class="chiru-punto"><h3>' + esc(p.titulo) + "</h3><p>" + esc(p.texto) + "</p></div>";
    }).join("") + "</div>");

  /* ---------- ventanitas ---------- */
  var VENTANAS = { calendario: "ventana-calendario", chiru: "ventana-chiru" };
  document.addEventListener("click", function (ev) {
    var abre = ev.target.closest("[data-abre]");
    if (abre) {
      var v = $(VENTANAS[abre.getAttribute("data-abre")]);
      if (v && v.showModal) v.showModal();
      return;
    }
    if (ev.target.closest("[data-cerrar]")) { ev.target.closest("dialog").close(); return; }
    if (ev.target.tagName === "DIALOG") ev.target.close(); // clic fuera de la ventanita
  });
})();
