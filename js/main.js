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
  }

  function openProducts() {
    if (phoneMq.matches) {
      P.MOBILE.render(stageRoot, "products");
    } else {
      P.TREE.expand("products", true);
    }
    stageRoot.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fitStage, 120);
  }

  function boot() {
    P.PANEL.init();
    render();

    var productsChip = document.getElementById("chip-products");
    if (productsChip) productsChip.addEventListener("click", openProducts);

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
