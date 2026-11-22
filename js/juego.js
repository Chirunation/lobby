(function () {
  "use strict";
  var J = window.CHIRU && window.CHIRU.juego;
  var esc = document.getElementById("escenario");
  if (!J || !esc) return;

  document.getElementById("juego-titulo").textContent = J.titulo || "";
  document.getElementById("juego-instrucciones").textContent = J.instrucciones || "";
  var lector = document.getElementById("juego-estado");
  var nombreItem = document.getElementById("item-nombre");

  var cacheRGB = {};
  function rgb(h) {
    if (!cacheRGB[h]) cacheRGB[h] = [parseInt(h.substr(1, 2), 16), parseInt(h.substr(3, 2), 16), parseInt(h.substr(5, 2), 16)];
    return cacheRGB[h];
  }
  var PAL = {
    k: "#23264a", w: "#ffffff", g: "#cfe9f5", r: "#d6334f", y: "#f2b552", o: "#c98a2e", d: "#b86f1f",
    l: "#5aa84a", p: "#8e4fb8", O: "#ff9a3c", b: "#dbe8ff", c: "#e8c08a", m: "#a0612c", Y: "#ffd84a"
  };
  var SPRITES = {
    pisco: [
      "............", ".....kkk....", ".....kgk....", ".....kgk....", "....kgggk...", "...kgggggk..",
      "...kgwwwgk..", "...kwrwrwk..", "...kgwwwgk..", "...kgggggk..", "...kkkkkkk..", "............"],
    pelota: [
      "....kkkk....", "..kkwwwwkk..", ".kwwwkkwwwk.", ".kwwkkkkwwk.", "kwwwwkkwwwwk", "kkwwwwwwwwkk",
      "kkkwwwwwwkkk", "kwwwwkkwwwwk", ".kwwkkkkwwk.", ".kwwwkkwwwk.", "..kkwwwwkk..", "....kkkk...."],
    empanada: [
      "............", "............", "............", "....kkkk....", "..kkyyyykk..", ".kyyyyyyyyk.",
      "kyyoyyoyyoyk", "kyyyyyyyyyyk", "kddddddddddk", ".kdkdkdkdkk.", "..kkkkkkkk..", "............"],
    ceviche: [
      "............", "............", "............", "....l...p...", "..OwlwpwOw..", ".kwOwpwlwOk.",
      ".kbbbbbbbbk.", "..kbbbbbbk..", "...kkkkkk...", "............", "............", "............"],
    alfajor: [
      "............", "............", "............", "...kkkkkk...", ".kkwwwwwwkk.", "kwwwwwwwwwwk",
      "kcccccccccck", "kmmmmmmmmmmk", "kcccccccccck", ".kkcccccckk.", "...kkkkkk...", "............"],
    flor: [
      "............", "....kkkk....", "...krrrrk...", "..krrYYrrk..", "..krYYYYrk..", "..krrYYrrk..",
      "...krrrrk...", ".....l......", "..lll.l.....", ".....l.lll..", ".....l......", "............"]
  };
  function dibujarSprite(ctx, id) {
    var filas = SPRITES[id] || SPRITES.flor, img = ctx.createImageData(12, 12);
    for (var y = 0; y < 12; y++) for (var x = 0; x < 12; x++) {
      var ch = filas[y].charAt(x); if (ch === "." || !PAL[ch]) continue;
      var c = rgb(PAL[ch]), i = (y * 12 + x) * 4;
      img.data[i] = c[0]; img.data[i + 1] = c[1]; img.data[i + 2] = c[2]; img.data[i + 3] = 255;
    }
    ctx.clearRect(0, 0, 12, 12); ctx.putImageData(img, 0, 0);
  }

  var N = 24;
  function dibujarBola(p, ahora) {
    var img = p.ctx.createImageData(N, N), d = img.data;
    function px(x, y, col) {
      if (x < 0 || y < 0 || x >= N || y >= N) return;
      var c = rgb(col), i = (y * N + x) * 4; d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = 255;
    }
    var cx = 12, cy = 12.5, R = 10.8, x, y;
    for (y = 0; y < N; y++) for (x = 0; x < N; x++) {
      var dx = x + 0.5 - cx, dy = y + 0.5 - cy, dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > R) continue;
      if (dist > R - 1.3) { px(x, y, "#23264a"); continue; }
      var col;
      if (p.tipo === "peru") {
        var t = (x + 0.5 - (cx - R)) / (2 * R);
        col = (t < 1 / 3 || t > 2 / 3) ? "#D91023" : "#ffffff";
      } else {
        col = (y + 0.5 < cy) ? ((x + 0.5 < cx - R + 2 * R * 0.42) ? "#0039A6" : "#ffffff") : "#D52B1E";
      }
      if (dx + dy > 8.5) { var c = rgb(col); col = "#" + c.map(function (v) { return ("0" + Math.round(v * 0.86).toString(16)).slice(-2); }).join(""); }
      px(x, y, col);
    }
    if (p.tipo === "chile") {
      [[7, 4], [5, 5], [6, 5], [7, 5], [8, 5], [9, 5], [6, 6], [7, 6], [8, 6], [6, 7], [8, 7]].forEach(function (q) { px(q[0], q[1], "#ffffff"); });
    }
    var f = p.mira, e1 = Math.round(12 + f * 2.5 - 3.5), ey = 11, K = "#23264a";
    var animo = p.animo, parpadea = p.parpadeo > ahora;
    [e1, e1 + 6].forEach(function (ex, i) {
      var feliz = animo === "feliz" || animo === "amor" || animo === "beso" || animo === "comiendo";
      if (feliz) {
        px(ex - 1, ey, "#ffffff"); px(ex, ey - 1, "#ffffff"); px(ex, ey, "#ffffff"); px(ex + 1, ey, "#ffffff");
        px(ex - 2, ey, K); px(ex - 1, ey - 1, K); px(ex, ey - 2, K); px(ex + 1, ey - 1, K); px(ex + 2, ey, K);
      } else if (parpadea && animo === "normal") {
        for (var a = -2; a <= 2; a++) px(ex + a, ey, K);
      } else {
        for (var yy = ey - 3; yy <= ey + 2; yy++) for (var xx = ex - 2; xx <= ex + 2; xx++) {
          var borde = xx === ex - 2 || xx === ex + 2 || yy === ey - 3 || yy === ey + 2;
          var esquina = (xx === ex - 2 || xx === ex + 2) && (yy === ey - 3 || yy === ey + 2);
          if (esquina) continue;
          px(xx, yy, borde ? K : "#ffffff");
        }
        if (animo === "enojado") {
          var s = i === 0 ? 1 : -1;
          px(ex - 2 * s, ey - 4, K); px(ex - s, ey - 4, K); px(ex, ey - 3, K); px(ex + s, ey - 2, K); px(ex + 2 * s, ey - 2, K);
        }
      }
      if (animo === "amor" || animo === "beso") { px(ex - 1, ey + 2, "#ff8fa2"); px(ex, ey + 2, "#ff8fa2"); }
    });
    var mx = 12 + f * 4;
    if (animo === "comiendo") {
      if (Math.floor(ahora / 160) % 2) { px(mx, 15, K); px(mx + 1, 15, K); px(mx, 16, K); px(mx + 1, 16, K); }
      else { px(mx, 16, K); px(mx + 1, 16, K); }
    }
    if (animo === "sorpresa") { px(mx, 15, K); px(mx + 1, 15, K); px(mx, 16, K); px(mx + 1, 16, K); }
    if (animo === "beso") { px(12 + f * 8, 15, "#ff5c74"); px(12 + f * 8, 16, "#ff5c74"); }
    if (animo === "enojado") {
      var ax = f > 0 ? 15 : 6, ay = 2, rojo = "#ff2e55";
      px(ax, ay, rojo); px(ax + 2, ay, rojo); px(ax + 1, ay + 1, rojo); px(ax, ay + 2, rojo); px(ax + 2, ay + 2, rojo);
    }
    p.ctx.putImageData(img, 0, 0);
  }

  function Personaje(tipo, nombre) {
    this.tipo = tipo;
    this.cv = document.createElement("canvas");
    this.cv.width = N; this.cv.height = N;
    this.cv.className = "personaje";
    this.cv.tabIndex = 0;
    this.cv.setAttribute("role", "img");
    this.cv.setAttribute("aria-label", nombre + ": arrástralo hacia el otro, o presiona Enter para juntarlos");
    this.ctx = this.cv.getContext("2d");
    this.globo = document.createElement("div");
    this.globo.className = "dialogo";
    esc.appendChild(this.cv); esc.appendChild(this.globo);
    this.x = 0; this.y = 0; this.vy = 0; this.objX = null;
    this.animo = "normal"; this.parpadeo = 0; this.proxParpadeo = 0;
    this.inclinar = 0; this.temblor = false; this.salto = 0; this.mira = tipo === "peru" ? 1 : -1;
    this.arrastrando = false;
  }

  var peru = new Personaje("peru", "Perú"), chile = new Personaje("chile", "Chile");
  var ambos = [peru, chile];

  var obj = document.createElement("canvas");
  obj.width = 12; obj.height = 12; obj.className = "objeto"; obj.tabIndex = 0;
  esc.appendChild(obj);
  var octx = obj.getContext("2d");
  var item = { x: 0, y: 0, objX: null, objY: null, escala: 1, arrastrando: false, arco: null, giro: 0 };
  var idx = 0, ITEMS = (J.items || []).filter(function (it) { return SPRITES[it.id]; });

  function elegirItem(n) {
    if (!ITEMS.length) return;
    idx = (n + ITEMS.length) % ITEMS.length;
    var it = ITEMS[idx];
    dibujarSprite(octx, it.id);
    nombreItem.textContent = it.nombre;
    obj.setAttribute("aria-label", it.nombre + ": arrástralo hacia Perú o Chile, o presiona Enter para dárselo");
    item.escala = 0.5;
  }
  document.getElementById("item-ant").addEventListener("click", function () { cancelar(); elegirItem(idx - 1); aLaMesa(); });
  document.getElementById("item-sig").addEventListener("click", function () { cancelar(); elegirItem(idx + 1); aLaMesa(); });

  var W, H, S, I, suelo;
  function medir(primeraVez) {
    var viejoW = W;
    W = esc.clientWidth; H = esc.clientHeight;
    S = Math.round(Math.min(100, Math.max(64, W * 0.2)));
    I = Math.round(S * 0.62);
    suelo = Math.round(H * 0.7);
    if (primeraVez) {
      peru.x = W * 0.22; chile.x = W * 0.78;
      peru.y = chile.y = suelo;
    } else if (viejoW) {
      ambos.forEach(function (p) { p.x = p.x / viejoW * W; p.y = Math.min(p.y, suelo); if (!p.arrastrando) p.y = suelo; });
    }
    if (!item.arrastrando && !item.arco) aLaMesa(true);
  }
  function posMesa() { return { x: W / 2, y: H - 80 - I / 2 + 3 }; }
  function aLaMesa(inmediato) {
    var m = posMesa(); item.arco = null; item.giro = 0;
    if (inmediato) { item.x = m.x; item.y = m.y; item.objX = null; }
    else { item.objX = m.x; item.objY = m.y; }
  }

  function decir(p, texto, enojo) {
    if (!texto) return;
    p.globo.textContent = texto;
    p.globo.classList.toggle("enojo", !!enojo);
    p.globo.classList.add("ver");
  }
  function callar() { ambos.forEach(function (p) { p.globo.classList.remove("ver"); }); }
  function corazones(x, y, n) {
    for (var i = 0; i < n; i++) (function (i) {
      setTimeout(function () {
        var c = document.createElement("span");
        c.className = "corazon-flota";
        c.style.left = (x + (Math.random() - 0.5) * S * 0.6) + "px";
        c.style.top = y + "px";
        c.style.setProperty("--dx", ((Math.random() - 0.5) * 40) + "px");
        var t = 16 + Math.round(Math.random() * 12);
        c.innerHTML = '<svg width="' + t + '" height="' + t + '" viewBox="0 0 24 24"><path d="M12 21 4.5 13.6A4.8 4.8 0 0 1 12 7.4a4.8 4.8 0 0 1 7.5 6.2z" fill="' + (i % 2 ? "#ff5c74" : "#ff8fa2") + '" stroke="#fff" stroke-width="2"/></svg>';
        esc.appendChild(c);
        setTimeout(function () { c.remove(); }, 1700);
      }, i * 180);
    })(i);
  }
  function anunciar(t) { lector.textContent = t; }

  var reac = 0, ocupado = false;
  function luego(id, ms, fn) { setTimeout(function () { if (id === reac) fn(); }, ms); }
  function cancelar() {
    reac++; ocupado = false; callar();
    ambos.forEach(function (p) { p.animo = "normal"; p.inclinar = 0; p.temblor = false; p.objX = null; });
    item.arco = null;
    if (!item.arrastrando) { item.escala = 1; aLaMesa(); }
  }
  function izqDer() { return peru.x <= chile.x ? [peru, chile] : [chile, peru]; }
  function centro() { return Math.max(S * 1.2, Math.min(W - S * 1.2, (peru.x + chile.x) / 2)); }
  function terminar(id, ms, devolverItem) {
    luego(id, ms, function () {
      callar(); ambos.forEach(function (p) { p.animo = "normal"; p.inclinar = 0; p.temblor = false; });
      if (devolverItem) { item.escala = 0.4; aLaMesa(true); item.escala = 0.4; }
      ocupado = false;
    });
  }

  function beso(textos, conItem) {
    cancelar(); ocupado = true; var id = reac;
    var m = centro(), lr = izqDer();
    lr[0].objX = m - S * 0.4; lr[1].objX = m + S * 0.4;
    ambos.forEach(function (p) { p.animo = "amor"; });
    if (conItem) { item.objX = m; item.objY = suelo - S * 1.25; }
    else { item.objX = null; }
    luego(id, 550, function () {
      lr[0].inclinar = 9; lr[1].inclinar = -9;
      ambos.forEach(function (p) { p.animo = "beso"; });
      decir(peru, textos.peru); decir(chile, textos.chile);
      corazones(m, suelo - S * 1.1, 9);
      anunciar("¡Perú y Chile se dieron un besito!");
    });
    luego(id, 3000, function () { ambos.forEach(function (p) { p.inclinar = 0; p.animo = "feliz"; }); callar(); });
    terminar(id, 3800, conItem);
  }

  function comer(it) {
    cancelar(); ocupado = true; var id = reac;
    var m = centro(), lr = izqDer();
    lr[0].objX = m - S * 0.78; lr[1].objX = m + S * 0.78;
    item.objX = m; item.objY = suelo - I * 0.55;
    ambos.forEach(function (p) { p.animo = "comiendo"; });
    luego(id, 250, function () { decir(peru, it.peru); });
    luego(id, 900, function () { decir(chile, it.chile); });
    luego(id, 1900, function () { item.escala = 0; });
    luego(id, 2500, function () { ambos.forEach(function (p) { p.animo = "feliz"; }); corazones(m, suelo - S, 4); anunciar("¡Comieron " + it.nombre + " y están felices!"); });
    terminar(id, 3800, true);
  }

  function pelear(it) {
    cancelar(); ocupado = true; var id = reac;
    var m = centro(), lr = izqDer();
    lr[0].objX = m - S * 0.95; lr[1].objX = m + S * 0.95;
    item.objX = m; item.objY = suelo - I * 0.55;
    luego(id, 300, function () {
      ambos.forEach(function (p) { p.animo = "enojado"; p.temblor = true; });
      decir(peru, it.peru, true); anunciar("¡Perú y Chile discuten por el " + it.nombre + "!");
    });
    luego(id, 1200, function () { decir(chile, it.chile, true); });
    luego(id, 3000, function () {
      ambos.forEach(function (p) { p.animo = "feliz"; p.temblor = false; });
      callar(); decir(peru, it.final); decir(chile, it.final); corazones(m, suelo - S, 3);
    });
    terminar(id, 4600, true);
  }

  function futbol(it) {
    cancelar(); ocupado = true; var id = reac;
    var lr = izqDer();
    lr[0].objX = W * 0.2; lr[1].objX = W * 0.8;
    ambos.forEach(function (p) { p.animo = "feliz"; });
    anunciar("¡Perú y Chile juegan fútbol!");
    var pases = 4, dur = 760;
    function pase(n) {
      luego(id, 600 + n * dur, function () {
        var de = n % 2 ? lr[1] : lr[0], a = n % 2 ? lr[0] : lr[1];
        de.salto = performance.now();
        item.objX = null;
        item.arco = { x0: de.x + (a.x > de.x ? 1 : -1) * S * 0.45, y0: suelo - I / 2, x1: a.x - (a.x > de.x ? 1 : -1) * S * 0.45, y1: suelo - I / 2, t0: performance.now(), dur: dur, h: S * 1.1 };
      });
    }
    for (var n = 0; n < pases; n++) pase(n);
    luego(id, 600 + pases * dur + 100, function () {
      item.arco = null; item.objX = (lr[0].x + lr[1].x) / 2; item.objY = suelo - I / 2;
      ambos.forEach(function (p) { p.animo = "enojado"; p.temblor = true; });
      decir(chile, it.chile, true); anunciar("¡Se pelearon por el partido!");
    });
    luego(id, 600 + pases * dur + 800, function () { decir(peru, it.peru, true); });
    terminar(id, 600 + pases * dur + 2900, true);
  }

  function reaccionar(it) {
    if (!it) return;
    if (it.reaccion === "comer") comer(it);
    else if (it.reaccion === "pelear") pelear(it);
    else if (it.reaccion === "futbol") futbol(it);
    else beso({ peru: it.peru, chile: it.chile }, true);
  }

  function puntero(ev) {
    var r = esc.getBoundingClientRect();
    return { x: ev.clientX - r.left, y: ev.clientY - r.top };
  }
  function limitar(v, a, b) { return Math.max(a, Math.min(b, v)); }

  ambos.forEach(function (p) {
    p.cv.addEventListener("pointerdown", function (ev) {
      ev.preventDefault(); cancelar();
      p.arrastrando = true; p.cv.classList.add("arrastrando"); p.cv.setPointerCapture(ev.pointerId);
      p.animo = "sorpresa"; p.objX = null; p.vy = 0;
    });
    p.cv.addEventListener("pointermove", function (ev) {
      if (!p.arrastrando) return;
      var q = puntero(ev);
      p.x = limitar(q.x, S / 2, W - S / 2);
      p.y = limitar(q.y + S / 2, S, suelo);
    });
    function soltar() {
      if (!p.arrastrando) return;
      p.arrastrando = false; p.cv.classList.remove("arrastrando"); p.animo = "normal";
      var otro = p === peru ? chile : peru;
      if (Math.abs(p.x - otro.x) < S * 1.3) beso(J.beso || {}, false);
    }
    p.cv.addEventListener("pointerup", soltar);
    p.cv.addEventListener("pointercancel", soltar);
    p.cv.addEventListener("keydown", function (ev) { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); beso(J.beso || {}, false); } });
  });

  obj.addEventListener("pointerdown", function (ev) {
    ev.preventDefault(); cancelar();
    item.arrastrando = true; item.objX = null; item.escala = 1.15;
    obj.setPointerCapture(ev.pointerId);
  });
  obj.addEventListener("pointermove", function (ev) {
    if (!item.arrastrando) return;
    var q = puntero(ev);
    item.x = limitar(q.x, I / 2, W - I / 2); item.y = limitar(q.y, I / 2, H - I / 2);
  });
  function soltarItem() {
    if (!item.arrastrando) return;
    item.arrastrando = false; item.escala = 1;
    var cerca = ambos.filter(function (p) {
      return Math.abs(item.x - p.x) < S * 0.85 && Math.abs(item.y - (p.y - S / 2)) < S * 0.95;
    });
    if (cerca.length) reaccionar(ITEMS[idx]); else aLaMesa();
  }
  obj.addEventListener("pointerup", soltarItem);
  obj.addEventListener("pointercancel", soltarItem);
  obj.addEventListener("keydown", function (ev) { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); reaccionar(ITEMS[idx]); } });

  document.getElementById("juego-reiniciar").addEventListener("click", function () {
    cancelar(); peru.x = W * 0.22; chile.x = W * 0.78; peru.y = chile.y = suelo; elegirItem(0); aLaMesa(true);
    anunciar("Juego reiniciado");
  });

  var antes = performance.now();
  function cuadro(ahora) {
    var dt = Math.min(3, (ahora - antes) / 16.7); antes = ahora;
    ambos.forEach(function (p) {
      var otro = p === peru ? chile : peru;
      if (Math.abs(otro.x - p.x) > 4) p.mira = otro.x > p.x ? 1 : -1;
      var saltito = 0;
      if (!p.arrastrando) {
        if (p.objX != null) {
          var falta = p.objX - p.x;
          p.x += falta * Math.min(1, 0.1 * dt);
          if (Math.abs(falta) > 3) saltito = Math.abs(Math.sin(ahora / 85)) * S * 0.09;
          else p.objX = null;
        }
        if (p.y < suelo) { p.vy += 0.9 * dt; p.y = Math.min(suelo, p.y + p.vy * dt); } else p.vy = 0;
      }
      if (p.salto && ahora - p.salto < 300) saltito = Math.sin((ahora - p.salto) / 300 * Math.PI) * S * 0.25;
      if (ahora > p.proxParpadeo) { p.parpadeo = ahora + 140; p.proxParpadeo = ahora + 1800 + Math.random() * 2600; }
      var respira = p.animo === "normal" && !p.arrastrando ? Math.sin(ahora / 420 + (p.tipo === "peru" ? 0 : 1.7)) * 1.5 : 0;
      var tiembla = p.temblor ? (Math.random() - 0.5) * 5 : 0;
      var top = p.y - S - saltito + respira;
      p.cv.style.width = p.cv.style.height = S + "px";
      p.cv.style.left = (p.x - S / 2 + tiembla) + "px";
      p.cv.style.top = top + "px";
      p.cv.style.transform = "rotate(" + p.inclinar + "deg)";
      p.globo.style.left = p.x + "px";
      var junto = Math.abs(otro.x - p.x) < S * 2.2 && p.tipo === "chile";
      p.globo.style.top = (top - 8 - (junto ? 36 : 0)) + "px";
      dibujarBola(p, ahora);
    });

    if (!item.arrastrando) {
      if (item.arco) {
        var a = item.arco, t = Math.min(1, (ahora - a.t0) / a.dur);
        item.x = a.x0 + (a.x1 - a.x0) * t;
        item.y = a.y0 + (a.y1 - a.y0) * t - a.h * 4 * t * (1 - t);
        item.giro += 14 * dt * (a.x1 > a.x0 ? 1 : -1);
      } else if (item.objX != null) {
        item.x += (item.objX - item.x) * Math.min(1, 0.14 * dt);
        item.y += (item.objY - item.y) * Math.min(1, 0.14 * dt);
      }
    }
    var objetivo = item.escala, actual = parseFloat(obj.dataset.esc || "1");
    actual += (objetivo - actual) * Math.min(1, 0.2 * dt);
    if (item.escala < 1 && objetivo !== 0 && Math.abs(actual - objetivo) < 0.05) item.escala = 1;
    obj.dataset.esc = actual;
    obj.style.width = obj.style.height = I + "px";
    obj.style.left = (item.x - I / 2) + "px";
    obj.style.top = (item.y - I / 2) + "px";
    obj.style.transform = "scale(" + actual.toFixed(3) + ") rotate(" + (item.giro % 360) + "deg)";
    obj.style.visibility = actual < 0.05 ? "hidden" : "visible";
    requestAnimationFrame(cuadro);
  }

  medir(true);
  elegirItem(0);
  aLaMesa(true);
  window.addEventListener("resize", function () { medir(false); });
  requestAnimationFrame(cuadro);
})();
