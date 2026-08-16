/* ════════════════════════════════════════════════════════════
   panel.js — the detail card: slide-in side panel on desktop,
   bottom sheet on phones (styling switch lives in panel.css).
   ════════════════════════════════════════════════════════════ */

window.PORTFOLIO = window.PORTFOLIO || {};

(function () {
  var SVG_NS = "http://www.w3.org/2000/svg";
  var panel = null;
  var card = null;
  var backdrop = null;
  var openerEl = null;
  var isOpen = false;
  var currentItemId = null;
  var lightbox = null;   /* the enlarged-screenshot overlay, built lazily */
  var lightboxFrom = null;

  var LINK_ICONS = {
    web: "link",
    github: "github",
    appstore: "apple",
    playstore: "play",
    email: "mail",
    download: "download",
    linkedin: "linkedin",
  };

  function el(tag, cls, parent) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (parent) parent.appendChild(node);
    return node;
  }

  function icon(name, cls) {
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", cls || "ic");
    svg.setAttribute("aria-hidden", "true");
    var use = document.createElementNS(SVG_NS, "use");
    use.setAttribute("href", "#i-" + name);
    svg.appendChild(use);
    return svg;
  }

  function buildCard(item, section) {
    card.innerHTML = "";
    card.className = "card" +
      (section ? " accent-" + section.accent : " accent-teal") +
      (item.theme === "dark" ? " card-dark" : "");

    /* ── header ── */
    var header = el("div", "card-header", card);
    function headerIcon() {
      var iconWrap = el("span", "card-icon");
      iconWrap.appendChild(icon(item.icon || (section && section.icon) || "star", "ic-lg"));
      return iconWrap;
    }
    if (item.logo) {
      var logo = el("img", "card-logo", header);
      /* if the logo file is missing, fall back to the drawn icon */
      logo.onerror = function () { header.replaceChild(headerIcon(), logo); };
      logo.src = item.logo;
      logo.alt = "";
      logo.width = 56;
      logo.height = 56;
    } else {
      header.appendChild(headerIcon());
    }
    var headText = el("div", "card-head-text", header);
    var titleRow = el("div", "card-title-row", headText);
    var h2 = el("h2", "card-title", titleRow);
    h2.id = "panel-title";
    h2.textContent = item.title;
    if (item.live) {
      var live = el("span", "live-badge", titleRow);
      live.textContent = "LIVE";
    }
    if (item.subtitle) {
      var sub = el("p", "card-subtitle", headText);
      sub.textContent = item.subtitle;
    }
    var closeBtn = el("button", "panel-close", header);
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "Close details");
    closeBtn.textContent = "×";
    closeBtn.addEventListener("click", close);

    /* ── body ── */
    var body = el("div", "card-body", card);

    if (item.summary) {
      var summary = el("p", "card-summary", body);
      summary.textContent = item.summary;
    }

    if (item.media && item.media.length) {
      var strip = el("div", "media-strip", body);
      strip.setAttribute("tabindex", "0");
      strip.setAttribute("role", "region");
      strip.setAttribute("aria-label", item.title + " screenshots — scroll sideways");
      item.media.forEach(function (m) {
        var frame = el("div", "media-frame" + (m.wide ? " wide" : ""), strip);
        /* each shot is a button: click to enlarge (the evidence is legible only big) */
        var btn = el("button", "media-btn", frame);
        btn.type = "button";
        btn.setAttribute("aria-label", "Enlarge: " + (m.alt || "screenshot"));
        var img = el("img", "media-img", btn);
        /* photo slots may not be filled yet — vanish instead of showing a broken image */
        img.onerror = function () {
          frame.remove();
          if (!strip.childElementCount) strip.remove();
        };
        img.src = m.src;
        img.alt = m.alt || "";
        img.loading = "lazy";
        /* intrinsic size = zero layout shift while the photo loads */
        if (m.w && m.h) { img.width = m.w; img.height = m.h; }
        btn.addEventListener("click", function () { openLightbox(img, m); });
      });
      if (item.media.length > 1) {
        var cue = el("span", "media-cue", strip);
        cue.setAttribute("aria-hidden", "true");
        cue.textContent = "↔ swipe";
      }
    }

    if (item.stats && item.stats.length) {
      var stats = el("ul", "stats-row", body);
      item.stats.forEach(function (s) {
        var li = el("li", "stat", stats);
        var v = el("strong", "stat-value", li);
        v.textContent = s.value;
        var l = el("span", "stat-label", li);
        l.textContent = s.label;
      });
    }

    if (item.bullets && item.bullets.length) {
      var ul = el("ul", "card-bullets", body);
      item.bullets.forEach(function (b) {
        var li = el("li", "", ul);
        li.textContent = b;
      });
    }

    if (item.tags && item.tags.length) {
      var tagRow = el("ul", "tag-row", body);
      tagRow.setAttribute("aria-label", "Technologies");
      item.tags.forEach(function (t) {
        var li = el("li", "tag", tagRow);
        if (typeof t === "string") {
          li.textContent = t;
          return;
        }
        /* {label, section, item}: a chip that jumps to the leaf proving it */
        li.className = "tag tag-link";
        var b = el("button", "tag-btn", li);
        b.type = "button";
        b.textContent = t.label;
        b.setAttribute("aria-label", t.label + " — open the leaf that proves it");
        b.addEventListener("click", function () {
          close();
          if (window.PORTFOLIO.NAV) window.PORTFOLIO.NAV.openTreeSection(t.section, t.item);
        });
      });
    }

    if (item.links && item.links.length) {
      var linkRow = el("div", "links-row", body);
      item.links.forEach(function (lnk) {
        var a = el("a", "btn card-link link-" + (lnk.kind || "web"), linkRow);
        a.href = lnk.href;
        var newTab = lnk.kind !== "email" && lnk.download === undefined;
        if (newTab) {
          a.target = "_blank";
          a.rel = "noopener";
        }
        if (lnk.download) a.setAttribute("download", "");
        a.appendChild(icon(LINK_ICONS[lnk.kind] || "link"));
        a.appendChild(document.createTextNode(lnk.label));
        if (newTab) {
          var sr = el("span", "sr-only", a);
          sr.textContent = " (opens in a new tab)";
        }
      });
    }

    if (item.note) {
      var note = el("p", "card-note", body);
      note.textContent = item.note;
    }

    /* stagger index for the rise-in of each body block (panel.css) */
    for (var ci = 0; ci < body.children.length; ci++) {
      body.children[ci].style.setProperty("--ci", ci);
    }

    return closeBtn;
  }

  /* a colored "seed" flies from the clicked leaf to where the card
     lands — hand-rolled FLIP, ~340ms, WAAPI. Skipped for deep links
     (no opener), reduced motion, and browsers without .animate(). */
  function flySeed(opener) {
    if (!opener || !opener.getBoundingClientRect) return false;
    if (!("animate" in Element.prototype)) return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    var from = opener.getBoundingClientRect();
    if (!from.width || !from.height) return false;

    /* the panel's final box, without reading its (transformed) rect.
       clientWidth/Height, not innerWidth: fixed positioning excludes
       any classic scrollbar, and the two differ on Windows */
    var vw = document.documentElement.clientWidth;
    var vh = document.documentElement.clientHeight;
    var w = panel.offsetWidth;
    var h = panel.offsetHeight;
    var isPhone = window.matchMedia("(max-width: 767px)").matches;
    var toLeft = isPhone ? (vw - w) / 2 : vw - w;
    var toTop = isPhone ? vh - h : 0;

    var seed = document.createElement("div");
    seed.className = "panel-seed";
    var bg = window.getComputedStyle(opener).backgroundColor;
    if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") seed.style.background = bg;
    seed.style.left = from.left + "px";
    seed.style.top = from.top + "px";
    seed.style.width = from.width + "px";
    seed.style.height = from.height + "px";
    document.body.appendChild(seed);

    var anim = seed.animate([
      { transform: "translate(0, 0) scale(1, 1)", opacity: 0.95 },
      {
        transform: "translate(" + (toLeft - from.left) + "px, " + (toTop - from.top) + "px)" +
          " scale(" + (w / from.width).toFixed(4) + ", " + (h / from.height).toFixed(4) + ")",
        opacity: 0,
      },
    ], { duration: 340, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
    function cleanup() { seed.remove(); }
    anim.finished.then(cleanup, cleanup);
    return true;
  }

  /* ── traversal memory: which leaves have been read this session ── */
  var VISITED_KEY = "deniz-visited";
  function visitedSet() {
    try { return JSON.parse(sessionStorage.getItem(VISITED_KEY) || "[]"); } catch (e) { return []; }
  }
  function markVisited(id) {
    if (!id) return;
    var v = visitedSet();
    if (v.indexOf(id) === -1) {
      v.push(id);
      try { sessionStorage.setItem(VISITED_KEY, JSON.stringify(v)); } catch (e) { /* private mode */ }
    }
  }
  function isVisited(id) { return visitedSet().indexOf(id) !== -1; }

  function open(item, section, opener) {
    if (!panel) return;
    if (isOpen) closeLightbox();
    openerEl = opener || null;
    currentItemId = item.id || null;
    var closeBtn = buildCard(item, section);
    backdrop.hidden = false;
    panel.hidden = false;
    document.body.classList.add("panel-open");
    if (window.PORTFOLIO.ATMOSPHERE) window.PORTFOLIO.ATMOSPHERE.pause();
    /* the leaf whose card is up stays lit behind the backdrop */
    if (openerEl && openerEl.classList) openerEl.classList.add("is-open");
    /* the seed leads, the panel follows a beat behind it */
    var seeded = flySeed(openerEl);
    panel.style.transitionDelay = seeded ? "0.06s" : "";
    /* let display kick in before transitioning */
    requestAnimationFrame(function () {
      backdrop.classList.add("show");
      panel.classList.add("show");
    });
    isOpen = true;
    closeBtn.focus();
    document.addEventListener("keydown", onKeydown, true);
  }

  function openAbout(opener) {
    var about = window.PORTFOLIO.CONTENT.about;
    if (about) open(about, null, opener);
  }

  function openColophon(opener) {
    var c = window.PORTFOLIO.CONTENT.colophon;
    if (c) open(c, null, opener);
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    closeLightbox();
    panel.style.transitionDelay = "";
    panel.classList.remove("show");
    backdrop.classList.remove("show");
    document.body.classList.remove("panel-open");
    if (window.PORTFOLIO.ATMOSPHERE) window.PORTFOLIO.ATMOSPHERE.resume();
    document.removeEventListener("keydown", onKeydown, true);
    /* remember the visit: the leaf keeps a small "read" mark */
    if (openerEl && openerEl.classList) {
      openerEl.classList.remove("is-open");
      if (openerEl.classList.contains("leaf") || openerEl.classList.contains("vine-item")) {
        openerEl.classList.add("visited");
        markVisited(currentItemId);
      }
    }
    currentItemId = null;
    window.setTimeout(function () {
      if (!isOpen) { panel.hidden = true; backdrop.hidden = true; }
    }, 320);
    /* return focus somewhere sensible even when the opener is gone
       (deep links pass null; renderer switches replace the DOM) */
    if (openerEl && document.contains(openerEl)) {
      openerEl.focus();
    } else {
      var fallback = document.getElementById("node-root") ||
        document.querySelector(".vine-head") ||
        document.querySelector(".hero-actions a");
      if (fallback) fallback.focus();
    }
    openerEl = null;
  }

  /* ── lightbox: the evidence screenshots, legible ── */
  function buildLightbox() {
    if (lightbox) return;
    lightbox = el("div", "lightbox", document.body);
    lightbox.hidden = true;
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Enlarged screenshot");
    var fig = el("figure", "lightbox-figure", lightbox);
    var img = el("img", "lightbox-img", fig);
    img.alt = "";
    var cap = el("figcaption", "lightbox-cap", fig);
    var x = el("button", "panel-close lightbox-close", lightbox);
    x.type = "button";
    x.setAttribute("aria-label", "Close enlarged screenshot");
    x.textContent = "×";
    x.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox || e.target === fig) closeLightbox();
    });
    lightbox._img = img;
    lightbox._cap = cap;
    lightbox._close = x;
  }

  function openLightbox(thumb, m) {
    buildLightbox();
    lightboxFrom = thumb;
    var img = lightbox._img;
    img.src = m.src;
    img.alt = m.alt || "";
    if (m.w && m.h) { img.width = m.w; img.height = m.h; }
    lightbox._cap.textContent = m.alt || "";
    lightbox.hidden = false;
    requestAnimationFrame(function () { lightbox.classList.add("show"); });
    /* grow out of the thumbnail — same FLIP vocabulary as the seed */
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce && "animate" in Element.prototype && thumb && thumb.getBoundingClientRect) {
      var from = thumb.getBoundingClientRect();
      requestAnimationFrame(function () {
        var to = img.getBoundingClientRect();
        if (!from.width || !to.width) return;
        img.animate([
          { transform: "translate(" + (from.left - to.left) + "px," + (from.top - to.top) + "px) scale(" + (from.width / to.width).toFixed(4) + ")", opacity: 0.6 },
          { transform: "none", opacity: 1 },
        ], { duration: 320, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
      });
    }
    lightbox._close.focus();
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.classList.remove("show");
    var lb = lightbox;
    window.setTimeout(function () { if (!lb.classList.contains("show")) lb.hidden = true; }, 220);
    if (lightboxFrom && document.contains(lightboxFrom)) {
      var b = lightboxFrom.closest ? lightboxFrom.closest("button") : null;
      (b || lightboxFrom).focus();
    }
    lightboxFrom = null;
  }

  function onKeydown(e) {
    var lbOpen = lightbox && !lightbox.hidden;
    if (e.key === "Escape") {
      e.stopPropagation();
      if (lbOpen) closeLightbox(); else close();
      return;
    }
    if (e.key !== "Tab") return;
    /* simple focus trap (the lightbox, when up, is its own tiny trap) */
    var focusables = lbOpen
      ? lightbox.querySelectorAll("button")
      : panel.querySelectorAll("a[href], button, [tabindex='0']");
    if (!focusables.length) return;
    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  /* phone bottom sheet: drag the header down to dismiss */
  function initDrag() {
    var startY = 0;
    var delta = 0;
    var dragging = false;
    panel.addEventListener("touchstart", function (e) {
      if (!window.matchMedia("(max-width: 767px)").matches) return;
      if (!(e.target.closest && e.target.closest(".card-header"))) return;
      dragging = true;
      startY = e.touches[0].clientY;
      delta = 0;
      panel.style.transition = "none";
    }, { passive: true });
    panel.addEventListener("touchmove", function (e) {
      if (!dragging) return;
      delta = Math.max(0, e.touches[0].clientY - startY);
      panel.style.transform = "translateY(" + delta + "px)";
    }, { passive: true });
    panel.addEventListener("touchend", function () {
      if (!dragging) return;
      dragging = false;
      panel.style.transition = "";
      panel.style.transform = "";
      if (delta > 110) close();
    });
  }

  function init() {
    panel = document.getElementById("panel");
    card = document.getElementById("panel-card");
    backdrop = document.getElementById("backdrop");
    backdrop.addEventListener("click", close);
    initDrag();
  }

  window.PORTFOLIO.PANEL = {
    init: init,
    open: open,
    openAbout: openAbout,
    openColophon: openColophon,
    close: close,
    isOpen: function () { return isOpen; },
    isVisited: isVisited,
  };
})();
