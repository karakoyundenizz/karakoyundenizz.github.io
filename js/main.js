/* boot dosyası. renderer'ı seçiyor sahneyi ekrana sığdırıyor
   telefon breakpointini geçince öbürüne geçiyor */

(function () {
  var P = window.PORTFOLIO;
  var stageWrap = document.getElementById("stage-wrap");
  var stageRoot = document.getElementById("stage-root");
  var hint = document.getElementById("hero-hint");
  // dikey duran dokunmatik tabletlere de vine gitsin
  // 0.48 ölçekli hover ağacı 7px yazıyla parmakla kullanılmıyor
  var phoneMq = window.matchMedia("(max-width: 767px), ((pointer: coarse) and (max-width: 1100px) and (orientation: portrait))");
  var reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  var resizeTimer = 0;
  var deepLinkDone = false;

  function findSection(id) {
    var match = null;
    P.CONTENT.sections.forEach(function (s) { if (s.id === id) match = s; });
    return match;
  }

  function findItem(section, id) {
    var match = null;
    if (section) section.items.forEach(function (it) { if (it.id === id) match = it; });
    return match;
  }

  function fitStage() {
    var stage = P.TREE.getStage();
    if (!stage || !document.contains(stage)) return;
    var w = stageWrap.clientWidth;
    var h = stageWrap.clientHeight;
    var scale = Math.min(w / P.LAYOUT.STAGE_W, h / P.LAYOUT.STAGE_H);
    // 1.2 denedim çizgiler dağıldı 1.05 iyi
    scale = Math.min(scale, 1.05);
    stage.style.transform = "translateX(-50%) scale(" + scale.toFixed(4) + ")";
    stage.style.top = Math.max(0, (h - P.LAYOUT.STAGE_H * scale) / 2) + "px";
  }

  function updateHint(isPhone) {
    if (!hint) return;
    hint.hidden = false;
    hint.innerHTML = isPhone
      ? "psst — this portfolio is a <strong>tree</strong>. tap a branch to grow it"
      : "psst — this portfolio is a <strong>tree</strong>. hover the branches, click the leaves — or Tab to a branch and press ↓";
  }

  var hintRetired = false;
  function retireHint() {
    if (hintRetired || !hint) return;
    hintRetired = true;
    hint.classList.add("retired");
  }

  // bütün cv düz liste halinde content.js'ten
  // ekranda görünmüyor ama print'te çıkıyor, crawlerlar da bunu okuyor
  // ağaç sonuçta bi sürü buton onlara bişey ifade etmiyor
  function buildTextMirror() {
    if (document.getElementById("cv-text")) return;
    var C = P.CONTENT;
    var sec = document.createElement("section");
    sec.id = "cv-text";
    sec.className = "sr-only";
    sec.setAttribute("aria-labelledby", "cv-text-h");
    var html = '<h2 id="cv-text-h">Deniz Karakoyun — CV as a list</h2>';
    function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
    function block(item) {
      var out = "<h3>" + esc(item.title) + (item.subtitle ? " <small>— " + esc(item.subtitle) + "</small>" : "") + "</h3>";
      if (item.summary) out += "<p>" + esc(item.summary) + "</p>";
      if (item.stats && item.stats.length) out += "<p>" + item.stats.map(function (s) { return esc(s.value) + " " + esc(s.label); }).join(" · ") + "</p>";
      if (item.bullets && item.bullets.length) out += "<ul>" + item.bullets.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + "</ul>";
      if (item.tags && item.tags.length) out += "<p>Tags: " + item.tags.map(function (t) { return esc(typeof t === "string" ? t : t.label); }).join(", ") + "</p>";
      if (item.links && item.links.length) out += "<p>" + item.links.map(function (l) { return '<a href="' + esc(l.href) + '">' + esc(l.label) + "</a>"; }).join(" · ") + "</p>";
      if (item.note) out += "<p><em>" + esc(item.note) + "</em></p>";
      return out;
    }
    if (C.about) html += block(C.about);
    C.sections.forEach(function (s) {
      html += "<h2>" + esc(s.label) + "</h2>";
      s.items.filter(function (i) { return !i.hidden; }).forEach(function (i) { html += block(i); });
    });
    sec.innerHTML = html;
    stageWrap.parentNode.insertBefore(sec, stageWrap.nextSibling);
  }

  // ismi harflere bölüyoruz tek tek düşsünler diye
  // spanlar süs, aria-label ismi bütün tutuyor
  function splitHeroName() {
    var h1 = document.querySelector(".hero-name");
    if (!h1 || h1.dataset.split) return;
    var name = h1.textContent.trim();
    if (!name) return;
    h1.dataset.split = "1";
    h1.setAttribute("aria-label", name);
    var frag = document.createDocumentFragment();
    var li = 0;
    var words = name.split(/\s+/);
    words.forEach(function (word, wi) {
      var w = document.createElement("span");
      w.className = "word";
      w.setAttribute("aria-hidden", "true");
      for (var i = 0; i < word.length; i++) {
        var s = document.createElement("span");
        s.className = "ltr";
        s.textContent = word.charAt(i);
        s.style.setProperty("--li", li);
        s.style.setProperty("--lr", ((li % 2 ? -1 : 1) * (2 + (li * 7) % 3)) + "deg");
        li++;
        w.appendChild(s);
      }
      frag.appendChild(w);
      if (wi < words.length - 1) frag.appendChild(document.createTextNode(" "));
    });
    h1.textContent = "";
    h1.appendChild(frag);
  }

  // ?open=projects dalı açıyor &item=guild kartı da açıyor
  // bir kere çalışıyor ve sadece var olan idler için
  function applyDeepLink(isPhone) {
    if (deepLinkDone) return;
    deepLinkDone = true;
    var params = new URLSearchParams(window.location.search);
    var section = findSection(params.get("open"));
    if (!section) return;
    if (isPhone) {
      P.MOBILE.render(stageRoot, section.id);
    } else {
      P.TREE.expand(section.id, true);
    }
    var item = findItem(section, params.get("item"));
    if (item) P.PANEL.open(item, section, null);
  }

  function applyGameLink() {
    var params = new URLSearchParams(window.location.search);
    if (params.get("game") && P.GAME) P.GAME.open(null);
  }

  function render() {
    var isPhone = phoneMq.matches;
    if (isPhone) {
      P.MOBILE.render(stageRoot);
    } else {
      P.TREE.render(stageRoot);
      fitStage();
    }
    updateHint(isPhone);
    applyDeepLink(isPhone);
    if (P.ATMOSPHERE) P.ATMOSPHERE.onRender();
  }

  var gameLinkDone = false;

  // yukardaki chipler ağaca atlıyor
  function openTreeSection(sectionId, itemId) {
    var section = findSection(sectionId);
    if (!section) return;
    if (phoneMq.matches) {
      P.MOBILE.render(stageRoot, sectionId);
    } else {
      P.TREE.expand(sectionId, true);
    }
    if (itemId) {
      var item = findItem(section, itemId);
      if (item) P.PANEL.open(item, section, null);
    }
    stageRoot.scrollIntoView({ behavior: reduceMq.matches ? "auto" : "smooth", block: "nearest" });
  }
  P.NAV = { openTreeSection: openTreeSection }; // panel.js de buradan gidiyor

  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fitStage, 120);
  }

  // buluta basınca yağmur. delegated yoksa her renderda kayboluyor
  document.addEventListener("click", function (e) {
    var cloud = e.target.closest && e.target.closest("button.cloud");
    if (!cloud) return;
    var on = document.documentElement.classList.toggle("raining");
    var clouds = document.querySelectorAll("button.cloud");
    for (var i = 0; i < clouds.length; i++) {
      clouds[i].setAttribute("aria-pressed", on ? "true" : "false");
    }
  });

  // bi dal açıldıysa ipucunun işi bitti
  stageRoot.addEventListener("click", function (e) {
    if (e.target.closest && e.target.closest(".node.branch, .vine-head")) retireHint();
  });
  stageRoot.addEventListener("mouseover", function (e) {
    if (e.target.closest && e.target.closest(".node.leaf")) retireHint();
  });

  function boot() {
    splitHeroName();
    P.PANEL.init();
    render();
    buildTextMirror();
    if (!gameLinkDone) {
      gameLinkDone = true;
      applyGameLink();
    }

    var chipTargets = [
      ["chip-gpa", "education", "metu"],
      ["chip-products", "products", null],
      ["chip-now", "experience", "kuartis"],
      ["chip-class", "education", "metu"],
    ];
    chipTargets.forEach(function (t) {
      var chip = document.getElementById(t[0]);
      if (chip) chip.addEventListener("click", function () { openTreeSection(t[1], t[2]); });
    });

    if (phoneMq.addEventListener) {
      phoneMq.addEventListener("change", render);
    } else if (phoneMq.addListener) {
      phoneMq.addListener(render); // eski safari
    }
    window.addEventListener("resize", onResize);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
