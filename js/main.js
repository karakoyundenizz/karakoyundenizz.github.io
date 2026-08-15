/* ════════════════════════════════════════════════════════════
   main.js — boot: pick a renderer, keep the stage scaled to fit,
   switch renderers when the viewport crosses the phone breakpoint.
   ════════════════════════════════════════════════════════════ */

(function () {
  var P = window.PORTFOLIO;
  var stageWrap = document.getElementById("stage-wrap");
  var stageRoot = document.getElementById("stage-root");
  var hint = document.getElementById("hero-hint");
  var phoneMq = window.matchMedia("(max-width: 767px)");
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
    /* never scale up past 1.05 — the cartoon strokes get soupy */
    scale = Math.min(scale, 1.05);
    stage.style.transform = "translateX(-50%) scale(" + scale.toFixed(4) + ")";
    stage.style.top = Math.max(0, (h - P.LAYOUT.STAGE_H * scale) / 2) + "px";
  }

  function updateHint(isPhone) {
    if (!hint) return;
    hint.hidden = false;
    hint.innerHTML = isPhone
      ? "psst — this portfolio is a <strong>tree</strong>. tap a branch to grow it"
      : "psst — this portfolio is a <strong>tree</strong>. hover the branches, click the leaves";
  }

  /* split the hero name into letter spans so each one can slap down
     like a sticker (CSS drives the animation). Screen readers keep
     the whole name via aria-label; the spans are decoration. */
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

  /* deep links: ?open=projects pre-expands a branch,
     ?open=products&item=guild also opens that card.
     Applied exactly once, and only for ids that actually exist. */
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

  /* hero chips jump into the tree: expand a branch, optionally open a card */
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
    stageRoot.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fitStage, 120);
  }

  /* clouds toggle a gentle rain — delegated, so it survives re-renders */
  document.addEventListener("click", function (e) {
    var cloud = e.target.closest && e.target.closest("button.cloud");
    if (!cloud) return;
    var on = document.documentElement.classList.toggle("raining");
    var clouds = document.querySelectorAll("button.cloud");
    for (var i = 0; i < clouds.length; i++) {
      clouds[i].setAttribute("aria-pressed", on ? "true" : "false");
    }
  });

  function boot() {
    splitHeroName();
    P.PANEL.init();
    render();
    if (!gameLinkDone) {
      gameLinkDone = true;
      applyGameLink();
    }

    var chipTargets = [
      ["chip-gpa", "education", "metu"],
      ["chip-products", "products", null],
      ["chip-now", "experience", "kuartis"],
    ];
    chipTargets.forEach(function (t) {
      var chip = document.getElementById(t[0]);
      if (chip) chip.addEventListener("click", function () { openTreeSection(t[1], t[2]); });
    });

    if (phoneMq.addEventListener) {
      phoneMq.addEventListener("change", render);
    } else if (phoneMq.addListener) {
      phoneMq.addListener(render); /* older Safari */
    }
    window.addEventListener("resize", onResize);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
