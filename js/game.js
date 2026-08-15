/* ════════════════════════════════════════════════════════════
   game.js — "Deniz's Bike Ride", a tiny one-button runner.
   Tap / click / Space to jump the bike over rocks, logs, dogs and
   a mustachioed burger — and do NOT jump into the flying cat with
   the rainbow exhaust. Works with mouse and touch on both layouts.
   ════════════════════════════════════════════════════════════ */

window.PORTFOLIO = window.PORTFOLIO || {};

(function () {
  var GRAVITY = 2800;      // px/s²
  var JUMP_V = -880;       // px/s
  var START_SPEED = 280;   // px/s
  var MAX_SPEED = 580;
  var SPEED_RAMP = 12;     // px/s per second
  var GROUND = 46;         // ground strip height inside the scene
  var RIDER_W = 62;        // collision box
  var RIDER_H = 46;
  var PX_PER_M = 42;

  var overlay, scene, riderEl, msgEl, scoreEl, closeBtn;
  var opener = null;
  var isOpen = false;
  var state = "idle";      // idle | running | dead
  var rafId = 0;
  var lastT = 0;
  var riderY = 0;          // height above ground (px, >= 0)
  var vy = 0;
  var onGround = true;
  var speed = START_SPEED;
  var dist = 0;
  var lastSpawnDist = 0;
  var nextGap = 0;
  var obstacles = [];      // {el, x, w, h}
  var best = 0;
  try { best = parseInt(window.localStorage.getItem("deniz-bike-best") || "0", 10) || 0; } catch (e) { /* private mode */ }

  var OBSTACLE_TYPES = [
    {
      cls: "rock", w: 42, h: 32,
      svg: '<svg viewBox="0 0 42 32"><path d="M4 30 C 1 20, 8 8, 20 5 C 32 3, 41 12, 40 22 C 39.5 28, 34 31, 26 30.5 Z" fill="#B9AFA4" stroke="#2B2119" stroke-width="2.6" stroke-linejoin="round"/><path d="M14 14 L20 20 M26 11 L29 16" stroke="#2B2119" stroke-width="1.8" stroke-linecap="round" opacity="0.5"/></svg>',
    },
    {
      cls: "log", w: 64, h: 26,
      svg: '<svg viewBox="0 0 64 26"><rect x="6" y="4" width="56" height="20" rx="10" fill="#A9744F" stroke="#2B2119" stroke-width="2.6"/><ellipse cx="8" cy="14" rx="6" ry="10" fill="#D9A878" stroke="#2B2119" stroke-width="2.6"/><ellipse cx="8" cy="14" rx="2.4" ry="4.2" fill="none" stroke="#2B2119" stroke-width="1.6"/><path d="M26 8 H46 M30 19 H52" stroke="#2B2119" stroke-width="1.6" stroke-linecap="round" opacity="0.45"/></svg>',
    },
    {
      cls: "pinecone", w: 30, h: 36,
      svg: '<svg viewBox="0 0 30 36"><path d="M15 2 C 24 8, 28 20, 15 34 C 2 20, 6 8, 15 2 Z" fill="#8C5A3C" stroke="#2B2119" stroke-width="2.4" stroke-linejoin="round"/><path d="M8 14 H22 M6.5 21 H23.5 M9 27 H21" stroke="#2B2119" stroke-width="1.7" stroke-linecap="round" opacity="0.55"/></svg>',
    },
    {
      /* a stray dog trotting the other way — Ateş's cousin, probably */
      cls: "dog-ob", w: 58, h: 42,
      svg: '<svg viewBox="0 0 58 42">' +
        '<path d="M6 26 C 0 22, 2 14, 8 12" fill="none" stroke="#2B2119" stroke-width="3.4" stroke-linecap="round"/>' +
        '<ellipse cx="26" cy="26" rx="16" ry="11" fill="#D9A878" stroke="#2B2119" stroke-width="2.8"/>' +
        '<circle cx="43" cy="15" r="10" fill="#D9A878" stroke="#2B2119" stroke-width="2.8"/>' +
        '<path d="M36 8 C 33 1, 40 -1, 42 5 Z" fill="#A9744F" stroke="#2B2119" stroke-width="2.2" stroke-linejoin="round"/>' +
        '<path d="M49 6 C 53 0, 58 4, 54 9 Z" fill="#A9744F" stroke="#2B2119" stroke-width="2.2" stroke-linejoin="round"/>' +
        '<circle cx="41" cy="14" r="1.8" fill="#2B2119"/><circle cx="48" cy="13" r="1.8" fill="#2B2119"/>' +
        '<ellipse cx="45" cy="19" rx="3" ry="2.2" fill="#2B2119"/>' +
        '<path d="M16 36 L16 30 M25 38 L25 31 M33 38 L33 31 M40 36 L40 29" stroke="#2B2119" stroke-width="3.2" stroke-linecap="round"/>' +
        "</svg>",
    },
    {
      /* a walking burger with a mustache. any resemblance to a certain
         burger restaurant owner is a loving coincidence */
      cls: "burger", w: 46, h: 54,
      svg: '<svg viewBox="0 0 46 54">' +
        '<path d="M5 18 C 5 5, 41 5, 41 18 L41 21 H5 Z" fill="#F4B942" stroke="#2B2119" stroke-width="2.6" stroke-linejoin="round"/>' +
        '<circle cx="13" cy="10" r="1.2" fill="#2B2119" opacity="0.45"/><circle cx="23" cy="8" r="1.2" fill="#2B2119" opacity="0.45"/><circle cx="33" cy="10" r="1.2" fill="#2B2119" opacity="0.45"/>' +
        '<circle cx="17" cy="14" r="2" fill="#2B2119"/><circle cx="29" cy="14" r="2" fill="#2B2119"/>' +
        '<path d="M14 18.5 C 17 21.5, 20 21.5, 23 18.5 C 26 21.5, 29 21.5, 32 18.5" fill="none" stroke="#2B2119" stroke-width="2.4" stroke-linecap="round"/>' +
        '<path d="M4 21 L8 25 L12 21 L16 25 L20 21 L24 25 L28 21 L32 25 L36 21 L40 25 L42 21 L42 27 H4 Z" fill="#7BB661" stroke="#2B2119" stroke-width="2.2" stroke-linejoin="round"/>' +
        '<rect x="5" y="27" width="36" height="7" rx="3.5" fill="#8C5A3C" stroke="#2B2119" stroke-width="2.4"/>' +
        '<path d="M6 34 C 6 43, 40 43, 40 34 Z" fill="#F4B942" stroke="#2B2119" stroke-width="2.6" stroke-linejoin="round"/>' +
        '<path d="M17 43 V50 M29 43 V50" stroke="#2B2119" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M17 50 H22 M29 50 H34" stroke="#2B2119" stroke-width="3" stroke-linecap="round"/>' +
        "</svg>",
    },
    {
      /* the flying cat, rainbow issuing from exactly where you think.
         it flies at helmet height: do NOT jump into it */
      cls: "nyan", w: 84, h: 34, fly: 78,
      svg: '<svg viewBox="0 0 84 34">' +
        '<g fill="none" stroke-linecap="round" stroke-width="3.6" opacity="0.9">' +
        '<path d="M2 10 H35" stroke="#E96A6A"/>' +
        '<path d="M2 16 H35" stroke="#F4B942"/>' +
        '<path d="M2 22 H35" stroke="#7BB661"/>' +
        '<path d="M2 28 H35" stroke="#7EB8D9"/>' +
        "</g>" +
        '<rect x="33" y="7" width="34" height="24" rx="10" fill="#C9C2E6" stroke="#2B2119" stroke-width="2.8"/>' +
        '<path d="M57 9 L55 2 L61 6 Z" fill="#C9C2E6" stroke="#2B2119" stroke-width="2.2" stroke-linejoin="round"/>' +
        '<path d="M71 8 L75 1 L77 8 Z" fill="#C9C2E6" stroke="#2B2119" stroke-width="2.2" stroke-linejoin="round"/>' +
        '<circle cx="66" cy="19" r="11" fill="#C9C2E6" stroke="#2B2119" stroke-width="2.8"/>' +
        '<circle cx="62" cy="17" r="1.7" fill="#2B2119"/><circle cx="70" cy="17" r="1.7" fill="#2B2119"/>' +
        '<path d="M64 23 C 66 25, 68 25, 70 23" fill="none" stroke="#2B2119" stroke-width="2" stroke-linecap="round"/>' +
        '<path d="M54 21 H48 M54 24 L49 26" stroke="#2B2119" stroke-width="1.6" stroke-linecap="round" opacity="0.6"/>' +
        '<path d="M39 31 H45 M50 31 H56" stroke="#2B2119" stroke-width="3" stroke-linecap="round"/>' +
        "</svg>",
    },
  ];

  var RIDER_SVG =
    '<svg viewBox="0 0 120 92" aria-hidden="true">' +
    /* wheels (spokes spin via CSS on .running) */
    '<g class="wheel wheel-back"><circle cx="30" cy="70" r="17" fill="#FFFDF8" stroke="#2B2119" stroke-width="4"/><path d="M30 55 V85 M15 70 H45 M20 60 L40 80 M40 60 L20 80" stroke="#2B2119" stroke-width="1.8" opacity="0.6"/></g>' +
    '<g class="wheel wheel-front"><circle cx="92" cy="70" r="17" fill="#FFFDF8" stroke="#2B2119" stroke-width="4"/><path d="M92 55 V85 M77 70 H107 M82 60 L102 80 M102 60 L82 80" stroke="#2B2119" stroke-width="1.8" opacity="0.6"/></g>' +
    /* frame */
    '<path d="M30 70 L52 46 L78 46 L92 70 M52 46 L60 68 L78 46 M60 68 L30 70" fill="none" stroke="#12907E" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<circle cx="60" cy="68" r="4.4" fill="#2B2119"/>' +
    '<path d="M86 40 L78 46 M84 34 L90 42" stroke="#2B2119" stroke-width="4" stroke-linecap="round"/>' +
    '<path d="M46 42 L52 46" stroke="#2B2119" stroke-width="4" stroke-linecap="round"/>' +
    /* rider */
    '<path d="M49 42 C 52 28, 64 22, 74 28" fill="none" stroke="#8B1E3F" stroke-width="7" stroke-linecap="round"/>' +
    '<path d="M72 28 L84 37" stroke="#F8C79A" stroke-width="5" stroke-linecap="round"/>' +
    '<path d="M50 43 L56 56 L61 66" fill="none" stroke="#2B4A6B" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<circle cx="78" cy="18" r="9" fill="#F8C79A" stroke="#2B2119" stroke-width="3"/>' +
    '<path d="M68 15 C 70 6, 86 6, 88 15 Z" fill="#12907E" stroke="#2B2119" stroke-width="3" stroke-linejoin="round"/>' +
    "</svg>";

  function el(tag, cls, parent) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (parent) parent.appendChild(node);
    return node;
  }

  function build() {
    if (overlay) return;
    overlay = el("div", "game-overlay", document.body);
    overlay.id = "game";
    overlay.hidden = true;

    var frame = el("div", "game-frame", overlay);
    frame.setAttribute("role", "dialog");
    frame.setAttribute("aria-modal", "true");
    frame.setAttribute("aria-label", "Deniz's bike ride — a tiny jumping game");

    var bar = el("div", "game-bar", frame);
    var title = el("span", "game-title", bar);
    title.textContent = "Deniz's bike ride";
    closeBtn = el("button", "panel-close game-close", bar);
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "Close game");
    closeBtn.textContent = "×";
    closeBtn.addEventListener("click", close);

    scene = el("div", "game-scene", frame);
    scene.innerHTML =
      '<div class="game-cloud gc1"></div>' +
      '<div class="game-cloud gc2"></div>' +
      '<div class="game-sun">' + (window.PORTFOLIO.SPRITES ? window.PORTFOLIO.SPRITES.sun : "") + "</div>" +
      '<div class="game-ground"></div>';

    riderEl = el("div", "game-rider", scene);
    riderEl.innerHTML = RIDER_SVG;

    scoreEl = el("div", "game-score", scene);
    msgEl = el("div", "game-msg", scene);

    scene.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      tap();
    });

    updateScore(0);
    setMsg("tap or press space to ride");
  }

  function setMsg(text) {
    msgEl.textContent = text;
    msgEl.hidden = !text;
  }

  function updateScore(m) {
    scoreEl.textContent = m + " m · best " + best + " m";
  }

  function reset() {
    obstacles.forEach(function (o) { o.el.remove(); });
    obstacles = [];
    riderY = 0;
    vy = 0;
    onGround = true;
    speed = START_SPEED;
    dist = 0;
    lastSpawnDist = 0;
    nextGap = 420;
    riderEl.style.transform = "translateY(0px)";
    scene.classList.remove("running", "dead");
    updateScore(0);
  }

  function start() {
    reset();
    state = "running";
    scene.classList.add("running");
    setMsg("");
    lastT = 0;
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(tick);
  }

  function jump() {
    if (onGround) {
      vy = JUMP_V;
      onGround = false;
    }
  }

  function tap() {
    if (state === "idle") start();
    else if (state === "running") jump();
    else if (state === "dead") start();
  }

  function die() {
    state = "dead";
    scene.classList.remove("running");
    scene.classList.add("dead");
    var m = Math.floor(dist / PX_PER_M);
    if (m > best) {
      best = m;
      try { window.localStorage.setItem("deniz-bike-best", String(best)); } catch (e) { /* ok */ }
    }
    updateScore(m);
    setMsg("ouch! " + m + " m — tap to ride again");
  }

  function spawnObstacle(sceneW) {
    /* flyers only show up once the player has learned to jump */
    var pool = OBSTACLE_TYPES;
    if (dist < 900) {
      pool = OBSTACLE_TYPES.filter(function (t) { return !t.fly; });
    }
    var type = pool[Math.floor(Math.random() * pool.length)];
    var node = el("div", "game-obstacle " + type.cls, scene);
    node.innerHTML = type.svg;
    node.style.width = type.w + "px";
    node.style.height = type.h + "px";
    if (type.fly) node.style.bottom = 44 + type.fly + "px";
    var o = { el: node, x: sceneW + 40, w: type.w, h: type.h, fly: type.fly || 0 };
    node.style.transform = "translateX(" + o.x + "px)";
    obstacles.push(o);
  }

  function tick(t) {
    if (state !== "running") return;
    if (!lastT) lastT = t;
    var dt = Math.min((t - lastT) / 1000, 0.05);
    lastT = t;

    var rect = scene.getBoundingClientRect();
    var sceneW = rect.width;
    var riderX = sceneW * 0.16;

    /* rider physics — riderY is height above the ground, vy positive = falling */
    vy += GRAVITY * dt;
    riderY -= vy * dt;
    if (riderY <= 0) {
      riderY = 0;
      if (vy > 0) {
        vy = 0;
        onGround = true;
      }
    }
    riderEl.style.transform = "translateY(" + (-riderY).toFixed(1) + "px)";

    /* world scroll */
    speed = Math.min(MAX_SPEED, speed + SPEED_RAMP * dt);
    var step = speed * dt;
    dist += step;

    if (dist - lastSpawnDist > nextGap) {
      spawnObstacle(sceneW);
      lastSpawnDist = dist;
      nextGap = 300 + Math.random() * 340 + speed * 0.35;
    }

    for (var i = obstacles.length - 1; i >= 0; i--) {
      var o = obstacles[i];
      o.x -= step;
      if (o.x + o.w < -60) {
        o.el.remove();
        obstacles.splice(i, 1);
        continue;
      }
      o.el.style.transform = "translateX(" + o.x.toFixed(1) + "px)";

      /* collision: axis-aligned boxes, forgiving margins.
         Ground obstacles live at [0, h]; flyers at [fly, fly + h] —
         you jump the first kind and duck (stay down) for the second. */
      var rl = riderX - RIDER_W / 2 + 8;
      var rr = riderX + RIDER_W / 2 - 8;
      if (o.x < rr && o.x + o.w > rl &&
          riderY < o.fly + o.h - 6 && riderY + RIDER_H > o.fly + 6) {
        die();
        return;
      }
    }

    updateScore(Math.floor(dist / PX_PER_M));
    rafId = requestAnimationFrame(tick);
  }

  function onKeydown(e) {
    if (e.key === "Escape") {
      e.stopPropagation();
      close();
      return;
    }
    if (e.key === " " || e.key === "ArrowUp") {
      e.preventDefault();
      tap();
    }
  }

  function open(fromEl) {
    build();
    opener = fromEl || null;
    isOpen = true;
    overlay.hidden = false;
    requestAnimationFrame(function () { overlay.classList.add("show"); });
    state = "idle";
    reset();
    setMsg("tap or press space to ride");
    document.addEventListener("keydown", onKeydown, true);
    closeBtn.focus();
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    state = "idle";
    cancelAnimationFrame(rafId);
    overlay.classList.remove("show");
    document.removeEventListener("keydown", onKeydown, true);
    window.setTimeout(function () { if (!isOpen) overlay.hidden = true; }, 260);
    if (opener && document.contains(opener)) opener.focus();
    opener = null;
  }

  window.PORTFOLIO.GAME = { open: open, close: close };
})();
