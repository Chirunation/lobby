//NAVEGACION DE JUEGOS
let currentIndex = 0;

const gameContainer = document.querySelector(
  ".game-viewport > .game-container",
);
const gameViewport = document.querySelector(".game-viewport");
const games = gameContainer ? gameContainer.querySelectorAll(".game-item") : [];
const totalGames = games.length;

// Evita el espacio vacío bajo los juegos más cortos (especialmente en móvil).
function ajustarAltoCarrusel() {
  const activo = games[currentIndex];
  if (!activo || !gameViewport) return;

  const estilos = getComputedStyle(activo);
  const margenSuperior = parseFloat(estilos.marginTop) || 0;
  const margenInferior = parseFloat(estilos.marginBottom) || 0;
  gameViewport.style.height = `${activo.offsetHeight + margenSuperior + margenInferior}px`;
}

if (totalGames > 0) {
  document
    .querySelector(".prev-button")
    ?.addEventListener("click", () => navigate(-1));
  document
    .querySelector(".next-button")
    ?.addEventListener("click", () => navigate(1));

  window.addEventListener("resize", ajustarAltoCarrusel);
  if (typeof ResizeObserver !== "undefined") {
    const observer = new ResizeObserver(ajustarAltoCarrusel);
    games.forEach((game) => observer.observe(game));
  }
  ajustarAltoCarrusel();
}

function navigate(direction) {
  if (totalGames === 0) return;

  currentIndex = (currentIndex + direction + totalGames) % totalGames;

  const offset = -currentIndex * 100;
  gameContainer.style.transform = `translateX(${offset}%)`;
  document.getElementById("game-counter").textContent =
    `${currentIndex + 1} / ${totalGames}`;
  ajustarAltoCarrusel();
}

(() => {
  const overlayPersonaje = document.getElementById("snake-overlay-personaje");
  const peruSprite = document.getElementById("peru-sprite");

  const canvas = document.getElementById("snake-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  const scoreElement = document.getElementById("snake-score");
  const tiempoElement = document.getElementById("snake-tiempo");
  const overlay = document.getElementById("snake-overlay");
  const mensaje = document.getElementById("snake-mensaje");
  const detalle = document.getElementById("snake-detalle");
  const iniciar = document.getElementById("snake-iniciar");
  const reiniciar = document.getElementById("snake-reiniciar");

  // CONFIGURACIÓN
  const gridSize = 20;
  const tileCount = canvas.width / gridSize;
  const objetivo = 8;
  const tiempoMaximo = 45;
  const velocidad = 150;

  let snake;
  let food;
  let direction;
  let nextDirection;
  let score;
  let tiempo;
  let running = false;
  let timer = null;
  let deadline = 0;
  let puedeGirar = true;

  const rutasSprites = {
    cabeza: "assets/img/snake/snake_head.png",
    comiendo: "assets/img/snake/snake_eating.png",
    muerto: "assets/img/snake/snake_dead.png",
    recto: "assets/img/snake/body_straight.png",
    giro: "assets/img/snake/body_turn.png",
    cola: "assets/img/snake/tail.png",
  };

  const sprites = {};
  let spritesListos = false;
  let comiendoHasta = 0;
  let cabezaMuerta = false;

  ctx.imageSmoothingEnabled = false;

  Promise.all(
    Object.entries(rutasSprites).map(
      ([nombre, ruta]) =>
        new Promise((resolve, reject) => {
          const imagen = new Image();

          imagen.onload = () => {
            sprites[nombre] = imagen;
            resolve();
          };

          imagen.onerror = () => reject(new Error(`No se pudo cargar ${ruta}`));

          imagen.src = ruta;
        }),
    ),
  )
    .then(() => {
      spritesListos = true;
      if (snake) dibujar();
    })
    .catch(console.error);

  // INICIALIZAR JUEGO
  function resetGame() {
    clearInterval(timer);
    running = false;

    snake = [
      { x: 7, y: 8 },
      { x: 6, y: 8 },
      { x: 5, y: 8 },
    ];

    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };

    score = 0;
    tiempo = tiempoMaximo;
    puedeGirar = true;

    generarComida();
    actualizarMarcadores();
    dibujar();

    overlay.classList.remove("hidden");
    mensaje.textContent = "¿Listo para jugar?";
    detalle.textContent = "¡Consigue las 8 causitas!";
    iniciar.textContent = "¡Jugar!";
    if (overlayPersonaje) {
      overlayPersonaje.classList.add("hidden");
    }

    overlayPersonaje.classList.add("hidden");
    detalle.hidden = false;
  }
  function mostrarPeruOverlay(gano) {
    overlayPersonaje.classList.remove("hidden");

    if (gano) {
      peruSprite.src = "assets/img/peru-chef-feliz.png";
      peruSprite.alt = "Perú chef feliz";

      mensaje.textContent = "¡Estoy feliz de que te gustara mi comida! ♡";

      iniciar.textContent = "Jugar otra vez";
    } else {
      peruSprite.src = "assets/img/peru-chef-molesto.png";
      peruSprite.alt = "Perú chef molesto";

      mensaje.textContent = "¿Por las webas te cociné entonces?";

      iniciar.textContent = "Intentar otra vez";
    }

    // Ocultamos el mensaje genérico
    detalle.hidden = true;
  }
  // GENERAR CAUSITA EN UNA CASILLA VACÍA
  function generarComida() {
    const disponibles = [];

    for (let y = 0; y < tileCount; y++) {
      for (let x = 0; x < tileCount; x++) {
        if (!snake.some((p) => p.x === x && p.y === y)) {
          disponibles.push({ x, y });
        }
      }
    }

    if (disponibles.length === 0) {
      food = null;
      return;
    }

    food = disponibles[Math.floor(Math.random() * disponibles.length)];
  }

  function actualizarMarcadores() {
    scoreElement.textContent = `${score} / ${objetivo}`;
    tiempoElement.textContent = `${tiempo}s`;
  }

  // DIBUJAR EL TABLERO
  function dibujar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fondo pixelado
    for (let y = 0; y < tileCount; y++) {
      for (let x = 0; x < tileCount; x++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? "#ffe7ef" : "#ffdbe8";

        ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
      }
    }

    // Causita
    if (food) {
      const fx = food.x * gridSize;
      const fy = food.y * gridSize;

      ctx.fillStyle = "#a45b30";
      ctx.fillRect(fx + 3, fy + 5, 14, 12);

      ctx.fillStyle = "#ffd65a";
      ctx.fillRect(fx + 2, fy + 3, 16, 11);

      ctx.fillStyle = "#9cc76a";
      ctx.fillRect(fx + 7, fy + 1, 6, 4);
    }
    // DIBUJAR A CHILE
    // Chile
    dibujarChileSnake();
  }

  function pintarPieza(
    imagen,
    pieza,
    angulo,
    ancho,
    alto,
    anclaX = ancho / 2,
    anclaY = alto / 2,
  ) {
    ctx.save();

    ctx.translate((pieza.x + 0.5) * gridSize, (pieza.y + 0.5) * gridSize);

    ctx.rotate(angulo);
    ctx.drawImage(imagen, -anclaX, -anclaY, ancho, alto);
    ctx.restore();
  }

  function dibujarChileSnake() {
    if (!spritesListos || !snake || snake.length < 2) return;
    // CUERPO
    for (let i = snake.length - 2; i > 0; i--) {
      const anterior = snake[i - 1];
      const actual = snake[i];
      const siguiente = snake[i + 1];

      const horizontal = anterior.y === actual.y && siguiente.y === actual.y;

      const vertical = anterior.x === actual.x && siguiente.x === actual.x;

      if (horizontal || vertical) {
        pintarPieza(
          sprites.recto,
          actual,
          vertical ? Math.PI / 2 : 0,
          gridSize,
          gridSize,
        );
        continue;
      }
      // GIROS: sprite original conecta arriba y derecha
      const arriba = anterior.y < actual.y || siguiente.y < actual.y;
      const abajo = anterior.y > actual.y || siguiente.y > actual.y;
      const izquierda = anterior.x < actual.x || siguiente.x < actual.x;
      const derecha = anterior.x > actual.x || siguiente.x > actual.x;

      let angulo = 0;

      if (derecha && abajo) angulo = Math.PI / 2;
      else if (abajo && izquierda) angulo = Math.PI;
      else if (izquierda && arriba) angulo = -Math.PI / 2;

      pintarPieza(sprites.giro, actual, angulo, gridSize, gridSize);
    }
    // COLA
    const cola = snake[snake.length - 1];
    const antesCola = snake[snake.length - 2];

    const anguloCola = Math.atan2(cola.y - antesCola.y, cola.x - antesCola.x);
    pintarPieza(
      sprites.cola,
      cola,
      anguloCola,
      gridSize * 1.15,
      gridSize * 0.9,
      gridSize * 0.5,
      gridSize * 0.45,
    );
    // CABEZA
    const cabeza = snake[0];
    const cuello = snake[1];

    const anguloCabeza =
      Math.atan2(cabeza.y - cuello.y, cabeza.x - cuello.x) - Math.PI;

    const imagenCabeza = cabezaMuerta
      ? sprites.muerto
      : Date.now() < comiendoHasta
        ? sprites.comiendo
        : sprites.cabeza;

    const anchoBase = gridSize * 1.4;
    const altoBase = gridSize * 1.5;

    const ancho =
      imagenCabeza === sprites.comiendo ? anchoBase * (29 / 21) : anchoBase;

    pintarPieza(
      imagenCabeza,
      cabeza,
      anguloCabeza,
      ancho,
      altoBase,
      anchoBase / 2,
      altoBase / 2,
    );
  }

  // MOVIMIENTO PRINCIPAL
  function actualizar() {
    if (!running) return;

    tiempo = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));

    actualizarMarcadores();

    if (tiempo <= 0) {
      finalizar(false);
      return;
    }

    direction = { ...nextDirection };
    puedeGirar = true;

    const head = {
      x: snake[0].x + direction.x,
      y: snake[0].y + direction.y,
    };

    // Colisión con paredes
    if (
      head.x < 0 ||
      head.x >= tileCount ||
      head.y < 0 ||
      head.y >= tileCount
    ) {
      finalizar(false);
      return;
    }

    const comio = food && head.x === food.x && head.y === food.y;

    // Si no come, la cola se mueve y libera su casilla
    const cuerpo = comio ? snake : snake.slice(0, -1);

    // Colisión con el cuerpo
    if (cuerpo.some((p) => p.x === head.x && p.y === head.y)) {
      finalizar(false);
      return;
    }

    snake.unshift(head);

    if (comio) {
      comiendoHasta = Date.now() + 450;
      score++;
      actualizarMarcadores();

      if (score >= objetivo) {
        dibujar();
        finalizar(true);
        return;
      }

      generarComida();
    } else {
      snake.pop();
    }

    dibujar();
  }

  // CAMBIAR DIRECCIÓN
  function cambiarDireccion(nueva) {
    if (!running || !puedeGirar) return;

    const direcciones = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
    };

    const d = direcciones[nueva];
    if (!d) return;

    // Impedir girar directamente hacia atrás
    if (d.x === -direction.x && d.y === -direction.y) return;

    nextDirection = d;
    puedeGirar = false;
  }

  // INICIAR
  function empezar() {
    resetGame();

    running = true;
    deadline = Date.now() + tiempoMaximo * 1000;

    overlay.classList.add("hidden");

    timer = setInterval(actualizar, velocidad);
    comiendoHasta = 0;
    cabezaMuerta = false;
  }

  // FINALIZAR
  function finalizar(gano) {
    running = false;
    clearInterval(timer);

    mostrarPeruOverlay(gano);
    if (!gano) {
      cabezaMuerta = true;
      dibujar();
    }
    overlay.classList.remove("hidden");
  }

  // BOTONES
  reiniciar.addEventListener("click", resetGame);

  // CONTROLES TÁCTILES
  document.querySelectorAll(".snake-control").forEach((boton) => {
    boton.addEventListener("click", () => {
      cambiarDireccion(boton.dataset.direction);
    });
  });

  // TECLADO
  document.addEventListener("keydown", (event) => {
    if (!running) return;

    // Solo controlar Snake cuando su escenario está visible
    const viewport = document.querySelector(".game-viewport");
    const escenario = canvas.closest(".game-item");

    if (viewport && escenario) {
      const v = viewport.getBoundingClientRect();
      const r = escenario.getBoundingClientRect();

      if (r.left < v.left - 5 || r.right > v.right + 5) {
        return;
      }
    }

    const teclas = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
      w: "up",
      s: "down",
      a: "left",
      d: "right",
    };

    const direccion = teclas[event.key];

    if (direccion) {
      event.preventDefault();
      cambiarDireccion(direccion);
    }
  });

  // Pausar al salir del minijuego
  function pausar() {
    if (!running) return;

    running = false;
    clearInterval(timer);

    mensaje.textContent = "Juego pausado";
    detalle.textContent = "Puedes continuar jugando.";
    iniciar.textContent = "Continuar";

    tiempo = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));

    actualizarMarcadores();
    overlay.classList.remove("hidden");
  }

  // Permite iniciar, reiniciar o continuar después de una pausa.
  iniciar.addEventListener("click", () => {
    if (mensaje.textContent === "Juego pausado") {
      if (tiempo <= 0) {
        empezar();
        return;
      }

      running = true;
      deadline = Date.now() + tiempo * 1000;
      overlay.classList.add("hidden");
      timer = setInterval(actualizar, velocidad);
    } else {
      empezar();
    }
  });

  document.querySelectorAll(".prev-button, .next-button").forEach((boton) => {
    boton.addEventListener("click", pausar);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pausar();
  });

  resetGame();
})();
