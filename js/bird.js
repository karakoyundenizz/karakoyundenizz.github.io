/* saka kuşu. fare hangi dala dokunursa oraya uçup konuyor

   kuş her zaman bi tüneğin çocuğu. uçacağı zaman önce yeni tüneğe
   taşınıyor, sonra transform ile eski yerine geri itiliyor ve o itme
   sıfıra iniyor. yani uçuş aslında "eski yerden kalan fark"ın erimesi.
   böyle yapınca tünek uçuş sırasında kaysa bile (telefonda akordeon
   açılırken kayıyor) kuş yine tam üstüne konuyor */

window.PORTFOLIO = window.PORTFOLIO || {};

(function () {
  var bird = null;
  var tilt = null;
  var perch = null;
  var rafId = 0;
  var introTimer = 0;
  var reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");

  function el(tag, cls, parent) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (parent) parent.appendChild(node);
    return node;
  }

  // tünek sıfır boyutlu bi nokta, kuşun ayakları tam oraya basıyor
  // face: konunca hangi yöne baksın ("left" | "right"), yoksa geldiği yöne
  function addPerch(parent, x, y, face) {
    var p = el("span", "perch", parent);
    p.setAttribute("aria-hidden", "true");
    if (x != null) p.style.left = x + "px";
    if (y != null) p.style.top = y + "px";
    if (face) p.dataset.face = face;
    return p;
  }

  function stop() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  }

  function settle() {
    stop();
    if (!bird) return;
    bird.style.transform = "";
    tilt.style.transform = "";
    if (bird.classList.contains("flying")) {
      bird.classList.remove("flying");
      // reflow, yoksa art arda konuşlarda iniş animasyonu baştan başlamıyor
      bird.classList.remove("landed");
      void bird.offsetWidth;
      bird.classList.add("landed");
    }
    if (perch && perch.dataset.face) {
      bird.classList.toggle("faces-left", perch.dataset.face === "left");
    }
  }

  function flyTo(target) {
    if (!bird || !target || target === perch || !document.contains(target)) return;
    clearTimeout(introTimer);

    var from = bird.getBoundingClientRect();
    stop();
    target.appendChild(bird);
    perch = target;
    bird.style.transform = "";
    var to = bird.getBoundingClientRect();
    // masaüstünde sahne ölçekli, ekran pikselini sahne birimine çeviriyoruz
    var scale = (to.width / bird.offsetWidth) || 1;
    var dx = (from.left - to.left) / scale;
    var dy = (from.top - to.top) / scale;
    var dist = Math.sqrt(dx * dx + dy * dy);

    if (reduceMq.matches || dist < 2) { settle(); return; }

    var dur = Math.max(420, Math.min(1050, dist * 1.5));
    var lift = Math.min(90, 24 + dist * 0.18);
    var dir = dx > 0 ? -1 : 1; // fark sağdaysa hedef solda
    bird.classList.remove("landed");
    bird.classList.add("flying");
    bird.classList.toggle("faces-left", dir < 0);

    var t0 = 0;
    function place(t) {
      var e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      var k = 1 - e;
      var arc = Math.sin(Math.PI * t) * lift;
      bird.style.transform = "translate(" + (dx * k).toFixed(1) + "px," + (dy * k - arc).toFixed(1) + "px)";
      // burnu gittiği yöne dönsün. hızın yönünü türevden alıyoruz
      var de = t < 0.5 ? 4 * t : 4 - 4 * t;
      var vx = -dx * de;
      var vy = -dy * de - lift * Math.PI * Math.cos(Math.PI * t);
      var ang = Math.atan2(vy, Math.abs(vx) + 60) * 180 / Math.PI;
      ang = Math.max(-30, Math.min(30, ang)) * dir;
      tilt.style.transform = "rotate(" + ang.toFixed(1) + "deg)";
    }
    function step(now) {
      if (!t0) t0 = now;
      var t = Math.min(1, (now - t0) / dur);
      place(t);
      if (t < 1) rafId = requestAnimationFrame(step);
      else settle();
    }
    place(0); // ilk kare gelene kadar yeni yerinde görünmesin
    rafId = requestAnimationFrame(step);
  }

  // home: ilk konacağı tünek. from verilirse oradan uçarak geliyor
  function mount(home, from) {
    stop();
    clearTimeout(introTimer);
    var sprite = (window.PORTFOLIO.SPRITES || {}).bird;
    if (!sprite || !home) { bird = null; return; }
    bird = el("span", "bird");
    bird.setAttribute("aria-hidden", "true");
    bird.innerHTML = '<span class="bird-tilt"><span class="bird-flip">' + sprite + "</span></span>";
    tilt = bird.firstChild;
    if (from && !reduceMq.matches) {
      perch = from;
      from.appendChild(bird);
      introTimer = setTimeout(function () { flyTo(home); }, 1700);
    } else {
      perch = home;
      home.appendChild(bird);
      settle();
    }
  }

  window.PORTFOLIO.BIRD = {
    addPerch: addPerch,
    mount: mount,
    flyTo: flyTo,
  };
})();
