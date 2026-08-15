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
        var img = el("img", "media-img", frame);
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
      });
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
        li.textContent = t;
      });
    }

    if (item.links && item.links.length) {
      var linkRow = el("div", "links-row", body);
      item.links.forEach(function (lnk) {
        var a = el("a", "btn card-link link-" + (lnk.kind || "web"), linkRow);
        a.href = lnk.href;
        if (lnk.kind !== "email" && lnk.download === undefined) {
          a.target = "_blank";
          a.rel = "noopener";
        }
        if (lnk.download) a.setAttribute("download", "");
        a.appendChild(icon(LINK_ICONS[lnk.kind] || "link"));
        a.appendChild(document.createTextNode(lnk.label));
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

  function open(item, section, opener) {
    if (!panel) return;
    openerEl = opener || null;
    var closeBtn = buildCard(item, section);
    backdrop.hidden = false;
    panel.hidden = false;
    document.body.classList.add("panel-open");
    if (window.PORTFOLIO.ATMOSPHERE) window.PORTFOLIO.ATMOSPHERE.pause();
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

  function close() {
    if (!isOpen) return;
    isOpen = false;
    panel.style.transitionDelay = "";
    panel.classList.remove("show");
    backdrop.classList.remove("show");
    document.body.classList.remove("panel-open");
    if (window.PORTFOLIO.ATMOSPHERE) window.PORTFOLIO.ATMOSPHERE.resume();
    document.removeEventListener("keydown", onKeydown, true);
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

  function onKeydown(e) {
    if (e.key === "Escape") {
      e.stopPropagation();
      close();
      return;
    }
    if (e.key !== "Tab") return;
    /* simple focus trap */
    var focusables = panel.querySelectorAll("a[href], button, [tabindex='0']");
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
    close: close,
    isOpen: function () { return isOpen; },
  };
})();
