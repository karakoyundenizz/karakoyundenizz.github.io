/* sitedeki tek rAF döngüsü. üç iş yapıyor
     - fare paralaksı, .stage üstünde --par-x/--par-y kaydırıyor
       süs katmanları farklı derinliklerde geziyor, ağaç duruyor
     - rüzgar, her 20-40 saniyede --gust 0 dan 1 e ve geri gidiyor
       css bunu alıp bütün tacı sallıyor
     - düşen yapraklar, rüzgar başına birkaç tane, en fazla 5 tane canlı

   sadece masaüstünde, fine pointer varsa ve motion kapalı değilse çalışıyor
   hiçbir şey kıpırdamıyorsa döngü kendini park ediyor, boşta maliyeti yok */

window.PORTFOLIO = window.PORTFOLIO || {};

(function () {
  var MAX_LEAVES = 5;
  var LERP = 0.08;

  var enabled = false;
  var stageEl = null;
  var rafId = 0;
  var running = false;

  var targetX = 0, targetY = 0, curX = 0, curY = 0;
  var gustStart = 0, gustDur = 0;
  var gustTimer = 0, ambientTimer = 0;
  var liveLeaves = [];

  var reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  var phoneMq = window.matchMedia("(max-width: 767px)");
  var fineMq = window.matchMedia("(pointer: fine)");

  function ok() {
    return fineMq.matches && !phoneMq.matches && !reduceMq.matches;
  }

  // kart açıkken veya sekme arkadayken her şey duruyor
  function resting() {
    return document.hidden || document.body.classList.contains("panel-open");
  }

  function ensureLoop() {
    if (enabled && !running) {
      running = true;
      rafId = requestAnimationFrame(tick);
    }
  }

  function tick(now) {
    running = false;
    if (!enabled || !stageEl || !document.contains(stageEl)) return;
    // tamamen park et. resume() veya bi sonraki pointermove tekrar başlatır
    if (resting()) return;
    var busy = false;

    var dx = targetX - curX;
    var dy = targetY - curY;
    if (Math.abs(dx) > 0.0008 || Math.abs(dy) > 0.0008) {
      curX += dx * LERP;
      curY += dy * LERP;
      busy = true;
    } else {
      curX = targetX;
      curY = targetY;
    }
    stageEl.style.setProperty("--par-x", curX.toFixed(4));
    stageEl.style.setProperty("--par-y", curY.toFixed(4));

    if (gustDur) {
      var t = (now - gustStart) / gustDur;
      if (t >= 1) {
        gustDur = 0;
        stageEl.style.setProperty("--gust", "0");
      } else {
        stageEl.style.setProperty("--gust", Math.sin(Math.PI * t).toFixed(3));
        busy = true;
      }
    }

    if (busy) {
      running = true;
      rafId = requestAnimationFrame(tick);
    }
  }

  function scheduleGust() {
    clearTimeout(gustTimer);
    gustTimer = setTimeout(function () {
      if (enabled && !resting() && stageEl && document.contains(stageEl)) {
        gustStart = performance.now();
        gustDur = 2200 + Math.random() * 900;
        ensureLoop();
        var extra = 1 + Math.round(Math.random());
        for (var i = 0; i < extra; i++) spawnLeaf(600 + Math.random() * 700);
      }
      scheduleGust();
    }, 20000 + Math.random() * 20000);
  }

  function spawnLeaf(delay) {
    setTimeout(function () {
      if (!enabled || resting() || !stageEl || !document.contains(stageEl)) return;
      if (liveLeaves.length >= MAX_LEAVES) return;
      var sprite = window.PORTFOLIO.SPRITES && window.PORTFOLIO.SPRITES.leaf;
      if (!sprite || !("animate" in Element.prototype)) return;

      var leaf = document.createElement("div");
      leaf.className = "leaf-fall";
      leaf.setAttribute("aria-hidden", "true");
      leaf.innerHTML = sprite;
      var x = 380 + Math.random() * 850; // 1600lük sahnede kabaca taç kısmı
      var y = 170 + Math.random() * 240;
      leaf.style.left = x + "px";
      leaf.style.top = y + "px";
      stageEl.appendChild(leaf);

      var fall = 300 + Math.random() * 260;
      var drift = (Math.random() < 0.5 ? -1 : 1) * (60 + Math.random() * 90);
      var swing = 40 + Math.random() * 50;
      var spin = (Math.random() < 0.5 ? -1 : 1) * (240 + Math.random() * 200);
      var anim = leaf.animate([
        { transform: "translate(0,0) rotate(0deg)", opacity: 0 },
        { opacity: 0.95, offset: 0.08 },
        { transform: "translate(" + (drift * 0.35 - swing) + "px," + fall * 0.33 + "px) rotate(" + spin * 0.35 + "deg)", offset: 0.35 },
        { transform: "translate(" + (drift * 0.65 + swing) + "px," + fall * 0.66 + "px) rotate(" + spin * 0.7 + "deg)", offset: 0.68 },
        { opacity: 0.9, offset: 0.9 },
        { transform: "translate(" + drift + "px," + fall + "px) rotate(" + spin + "deg)", opacity: 0 },
      ], { duration: 4800 + Math.random() * 2400, easing: "cubic-bezier(0.4, 0.1, 0.6, 0.9)" });

      var entry = { el: leaf, anim: anim, endX: x + drift, cancelled: false };
      liveLeaves.push(entry);
      function done() {
        var i = liveLeaves.indexOf(entry);
        if (i > -1) liveLeaves.splice(i, 1);
        // iptal edilen yaprak zaten yere düşmedi köpeği tetiklemesin
        if (!entry.cancelled) maybeSnap(entry.endX);
        leaf.remove();
      }
      anim.finished.then(done, done);
    }, delay || 0);
  }

  // Ateş yanına düşen yaprağa atlıyor. gece uyuyor ona karışmıyoruz
  function maybeSnap(x) {
    if (document.documentElement.dataset.theme === "night") return;
    if (!stageEl || !document.contains(stageEl)) return;
    var dog = stageEl.querySelector(".dog");
    if (!dog) return;
    var dogX = parseFloat(dog.style.left);
    if (isNaN(dogX) || Math.abs(x - dogX) > 130) return;
    dog.classList.remove("barking");
    void dog.offsetWidth;
    dog.classList.add("barking");
  }

  function scheduleAmbient() {
    clearTimeout(ambientTimer);
    ambientTimer = setTimeout(function () {
      if (enabled && !resting()) spawnLeaf(0);
      scheduleAmbient();
    }, 14000 + Math.random() * 10000);
  }

  function onPointerMove(e) {
    if (!enabled || resting()) return;
    targetX = (e.clientX / window.innerWidth) * 2 - 1;
    targetY = (e.clientY / window.innerHeight) * 2 - 1;
    ensureLoop();
  }

  function clearLeaves() {
    liveLeaves.forEach(function (l) {
      l.cancelled = true;
      try { l.anim.cancel(); } catch (e) {}
      l.el.remove();
    });
    liveLeaves = [];
  }

  function onVisibility() {
    if (document.hidden) clearLeaves();
  }

  function start() {
    stageEl = window.PORTFOLIO.TREE && window.PORTFOLIO.TREE.getStage();
    if (!ok() || !stageEl) { stop(); return; }
    if (enabled) return;
    enabled = true;
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    scheduleGust();
    scheduleAmbient();
  }

  // dünyayı ortaya geri al
  // rüzgarın ortasında durdurulunca (mesela reduced motion açılınca)
  // katmanlar yamuk kalıyordu, olmadı aaa
  function resetProps() {
    if (stageEl && document.contains(stageEl)) {
      stageEl.style.setProperty("--par-x", "0");
      stageEl.style.setProperty("--par-y", "0");
      stageEl.style.setProperty("--gust", "0");
    }
    curX = curY = targetX = targetY = 0;
    gustDur = 0;
  }

  function stop() {
    if (!enabled) { stageEl = null; return; }
    enabled = false;
    clearTimeout(gustTimer);
    clearTimeout(ambientTimer);
    cancelAnimationFrame(rafId);
    running = false;
    window.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("visibilitychange", onVisibility);
    clearLeaves();
    resetProps();
    stageEl = null;
  }

  // bu ikisini panel.js çağırıyor. kart açıkken dünya nefesini tutuyor
  function pause() {
    clearLeaves();
  }
  function resume() {
    if (enabled) ensureLoop();
  }

  // main.js her renderdan sonra çağırıyor, sahne artık yepyeni bi dom
  function onRender() {
    clearLeaves();
    if (ok()) {
      stageEl = window.PORTFOLIO.TREE && window.PORTFOLIO.TREE.getStage();
      if (!stageEl) { stop(); return; }
      if (!enabled) start();
    } else {
      stop();
    }
  }

  // telefon genişliğine zoomlama, sistemin motion ayarını değiştirme falan
  function onEnvChange() { onRender(); }
  [reduceMq, phoneMq, fineMq].forEach(function (mq) {
    if (mq.addEventListener) mq.addEventListener("change", onEnvChange);
    else if (mq.addListener) mq.addListener(onEnvChange); // eski safari
  });

  window.PORTFOLIO.ATMOSPHERE = {
    start: start,
    stop: stop,
    onRender: onRender,
    pause: pause,
    resume: resume,
  };
})();
