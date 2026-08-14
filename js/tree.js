/* ════════════════════════════════════════════════════════════
   tree.js — desktop renderer. Real <button> nodes positioned on a
   1600×1000 stage over one SVG that draws the branches.
   ════════════════════════════════════════════════════════════ */

window.PORTFOLIO = window.PORTFOLIO || {};

/* shared cartoon sprites — used by the desktop stage AND the mobile ground scene */
window.PORTFOLIO.SPRITES = {
  dog:
    '<svg viewBox="0 0 90 84" aria-hidden="true">' +
    '<path class="dog-tail" d="M12 52 C 2 46, 2 34, 10 30" fill="none" stroke="#2B2119" stroke-width="5" stroke-linecap="round"/>' +
    '<ellipse cx="38" cy="58" rx="24" ry="17" fill="#C98A5B" stroke="#2B2119" stroke-width="3.4"/>' +
    '<circle cx="60" cy="38" r="17" fill="#C98A5B" stroke="#2B2119" stroke-width="3.4"/>' +
    '<path d="M48 26 C 44 16, 52 12, 55 22 Z" fill="#8C5A3C" stroke="#2B2119" stroke-width="3" stroke-linejoin="round"/>' +
    '<path d="M70 24 C 76 14, 82 20, 76 28 Z" fill="#8C5A3C" stroke="#2B2119" stroke-width="3" stroke-linejoin="round"/>' +
    '<circle class="dog-eye" cx="55" cy="36" r="2.6" fill="#2B2119"/>' +
    '<circle class="dog-eye" cx="68" cy="35" r="2.6" fill="#2B2119"/>' +
    '<ellipse cx="63" cy="45" rx="4.6" ry="3.4" fill="#2B2119"/>' +
    '<path d="M30 72 L30 66 M46 74 L46 67" stroke="#2B2119" stroke-width="4.4" stroke-linecap="round"/>' +
    "</svg>",
  robot:
    '<svg viewBox="0 0 110 120" aria-hidden="true">' +
    '<g class="robot-figure">' +
    '<path d="M55 6 L55 18" stroke="#2B2119" stroke-width="3.4" stroke-linecap="round"/>' +
    '<circle cx="55" cy="5" r="4.5" fill="#F4B942" stroke="#2B2119" stroke-width="2.6"/>' +
    '<rect x="30" y="18" width="50" height="46" rx="14" fill="#AEB6BD" stroke="#2B2119" stroke-width="3.4"/>' +
    '<rect x="36" y="28" width="38" height="17" rx="8.5" fill="#E8EDF0" stroke="#2B2119" stroke-width="2.8"/>' +
    '<circle cx="47" cy="36.5" r="4" fill="#2B2119"/>' +
    '<circle cx="63" cy="36.5" r="4" fill="#2B2119"/>' +
    '<circle cx="48.4" cy="35.2" r="1.3" fill="#fff"/>' +
    '<circle cx="64.4" cy="35.2" r="1.3" fill="#fff"/>' +
    '<path d="M44 52 H66 M49 52 V57 M55 52 V57 M61 52 V57" stroke="#2B2119" stroke-width="2.6" stroke-linecap="round"/>' +
    '<rect x="38" y="64" width="34" height="26" rx="8" fill="#8E979F" stroke="#2B2119" stroke-width="3.2"/>' +
    "</g>" +
    '<g class="robot-bush">' +
    '<ellipse cx="30" cy="102" rx="30" ry="19" fill="#5FA84E" stroke="#2B2119" stroke-width="3"/>' +
    '<ellipse cx="72" cy="106" rx="36" ry="17" fill="#7BB661" stroke="#2B2119" stroke-width="3"/>' +
    '<circle cx="52" cy="96" r="3.2" fill="#F4B942" stroke="#2B2119" stroke-width="1.8"/>' +
    '<circle cx="83" cy="100" r="2.8" fill="#F6D5DE" stroke="#2B2119" stroke-width="1.8"/>' +
    "</g>" +
    "</svg>",
  bike:
    '<svg viewBox="0 0 90 64" aria-hidden="true">' +
    '<circle cx="22" cy="46" r="14" fill="#FFFDF8" stroke="#2B2119" stroke-width="3.4"/>' +
    '<circle cx="68" cy="46" r="14" fill="#FFFDF8" stroke="#2B2119" stroke-width="3.4"/>' +
    '<path d="M22 46 L38 26 L58 26 L68 46 M38 26 L46 44 L58 26 M46 44 L22 46" fill="none" stroke="#12907E" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M62 20 L58 26 M60 16 L66 22" stroke="#2B2119" stroke-width="3.4" stroke-linecap="round"/>' +
    '<path d="M34 22 L38 26" stroke="#2B2119" stroke-width="3.4" stroke-linecap="round"/>' +
    "</svg>",
  sun:
    '<svg viewBox="0 0 120 120" aria-hidden="true">' +
    '<g class="sun-rays" fill="none" stroke="#E9A820" stroke-width="5" stroke-linecap="round">' +
    '<path d="M60 6 V22 M60 98 V114 M6 60 H22 M98 60 H114 M22 22 L33 33 M87 87 L98 98 M98 22 L87 33 M33 87 L22 98"/>' +
    "</g>" +
    '<circle cx="60" cy="60" r="26" fill="#FBD46D" stroke="#2B2119" stroke-width="4"/>' +
    '<circle cx="52" cy="56" r="2.6" fill="#2B2119"/><circle cx="68" cy="56" r="2.6" fill="#2B2119"/>' +
    '<path d="M52 66 C 56 70, 64 70, 68 66" fill="none" stroke="#2B2119" stroke-width="3" stroke-linecap="round"/>' +
    "</svg>",
};

(function () {
  var SVG_NS = "http://www.w3.org/2000/svg";
  var HOVER_INTENT_MS = 90;
  var COLLAPSE_GRACE_MS = 300;

  var stage = null;
  var layoutResult = null;
  var openSection = null;
  var pinnedSection = null;
  var expandTimer = 0;
  var collapseTimer = 0;
  var groups = {};      // sectionId → {branchBtn, leafGroup, edgeGroup, leafBtns}

  function el(tag, cls, parent) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (parent) parent.appendChild(node);
    return node;
  }

  function svgEl(tag, attrs, parent) {
    var node = document.createElementNS(SVG_NS, tag);
    for (var k in attrs) node.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(node);
    return node;
  }

  function icon(name, cls) {
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", cls || "node-icon");
    svg.setAttribute("aria-hidden", "true");
    var use = document.createElementNS(SVG_NS, "use");
    use.setAttribute("href", "#i-" + name);
    svg.appendChild(use);
    return svg;
  }

  /* tiny deterministic pseudo-random from a string — stable tilts per node */
  function tilt(id, range) {
    var h = 0;
    for (var i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 997;
    return ((h / 997) * 2 - 1) * range;
  }

  /* ── decorations ── */

  function buildDecorations(parent, layout) {
    var deco = el("div", "deco", parent);
    deco.setAttribute("aria-hidden", "true");

    var sun = el("div", "sun", deco);
    sun.innerHTML = window.PORTFOLIO.SPRITES.sun;

    el("div", "cloud cloud-1", deco);
    el("div", "cloud cloud-2", deco);

    el("div", "hill hill-back", deco);
    el("div", "hill hill-front", deco);

    for (var i = 0; i < 6; i++) {
      var p = el("div", "pollen pollen-" + (i + 1), deco);
      p.style.left = 12 + i * 15 + "%";
    }
  }

  function buildBee(parent, layout) {
    var expBranch = null;
    layout.branches.forEach(function (b) {
      if (b.section.id === "experience") expBranch = b;
    });
    var anchor = expBranch || layout.branches[0];
    if (!anchor) return;

    var beeWrap = el("div", "bee-orbit", parent);
    beeWrap.setAttribute("aria-hidden", "true");
    beeWrap.style.left = anchor.x + 30 + "px";
    beeWrap.style.top = anchor.y - 110 + "px";
    var bee = el("div", "bee", beeWrap);
    bee.innerHTML =
      '<svg viewBox="0 0 60 48">' +
      '<ellipse class="bee-wing bee-wing-l" cx="22" cy="12" rx="9" ry="6" fill="#CDEFF7" stroke="#2B2119" stroke-width="2.4"/>' +
      '<ellipse class="bee-wing bee-wing-r" cx="36" cy="11" rx="9" ry="6" fill="#E3F6FB" stroke="#2B2119" stroke-width="2.4"/>' +
      '<ellipse cx="30" cy="28" rx="16" ry="12" fill="#F4B942" stroke="#2B2119" stroke-width="3"/>' +
      '<path d="M25 17 V39 M33 16.5 V39.5" stroke="#2B2119" stroke-width="3.4"/>' +
      '<circle cx="43" cy="25" r="2.4" fill="#2B2119"/>' +
      '<path d="M46 28 L52 27" stroke="#2B2119" stroke-width="2.4" stroke-linecap="round"/>' +
      "</svg>";
  }

  function buildDog(parent, layout) {
    var dog = el("button", "dog", parent);
    dog.type = "button";
    dog.setAttribute("aria-label", "Ateş the dog says woof");
    dog.style.left = layout.root.x + 118 + "px";
    dog.style.top = layout.root.y - 26 + "px";
    dog.innerHTML =
      '<span class="dog-bubble" aria-hidden="true">woof! hire my human</span>' +
      window.PORTFOLIO.SPRITES.dog;
    dog.addEventListener("click", function () {
      dog.classList.remove("barking");
      void dog.offsetWidth; /* restart animation */
      dog.classList.add("barking");
    });
  }

  /* a little robot friend peeking from behind a bush — easter egg 🤖 */
  function buildRobot(parent, layout) {
    var robot = el("button", "robot", parent);
    robot.type = "button";
    robot.setAttribute("aria-label", "a little robot friend");
    robot.style.left = layout.stageW - 250 + "px";
    robot.style.top = layout.stageH - 64 + "px";
    robot.innerHTML =
      '<span class="robot-bubble" aria-hidden="true">good news, everyone!</span>' +
      window.PORTFOLIO.SPRITES.robot;
    robot.addEventListener("click", function () {
      robot.classList.remove("cheering");
      void robot.offsetWidth;
      robot.classList.add("cheering");
    });
  }

  /* the little bike sticker that opens the mini game */
  function buildBikeButton(parent, layout) {
    var btn = el("button", "game-launch", parent);
    btn.type = "button";
    btn.setAttribute("aria-label", "Play Deniz's bike ride — a tiny jumping game");
    btn.style.left = "440px";
    btn.style.top = layout.stageH - 52 + "px";
    btn.innerHTML =
      window.PORTFOLIO.SPRITES.bike +
      '<span class="game-launch-label" aria-hidden="true">play!</span>';
    btn.addEventListener("click", function () {
      if (window.PORTFOLIO.GAME) window.PORTFOLIO.GAME.open(btn);
    });
  }

  /* ── nodes ── */

  function buildRoot(parent, layout, content) {
    var btn = el("button", "node root", parent);
    btn.type = "button";
    btn.id = "node-root";
    btn.style.left = layout.root.x + "px";
    btn.style.top = layout.root.y - 46 + "px";
    btn.setAttribute("aria-label", "me! — about Deniz Karakoyun");
    btn.innerHTML =
      '<img class="root-photo" src="assets/img/me.jpg" alt="" onerror="this.remove()">' +
      '<svg viewBox="0 0 120 120" aria-hidden="true">' +
      '<circle cx="60" cy="62" r="44" fill="#F8C79A" stroke="#2B2119" stroke-width="5"/>' +
      '<path d="M22 55 C18 26 40 12 60 12 C80 12 102 26 98 55 C94 42 86 36 60 36 C34 36 26 42 22 55 Z" fill="#3A2A1E" stroke="#2B2119" stroke-width="5" stroke-linejoin="round"/>' +
      '<circle cx="45" cy="60" r="5" fill="#2B2119"/><circle cx="75" cy="60" r="5" fill="#2B2119"/>' +
      '<path d="M46 80 C52 88 68 88 74 80" fill="none" stroke="#2B2119" stroke-width="4.4" stroke-linecap="round"/>' +
      "</svg>" +
      '<span class="root-label">me!</span>';
    btn.addEventListener("click", function () {
      if (window.PORTFOLIO.PANEL) {
        window.PORTFOLIO.PANEL.openAbout(btn);
      }
    });
    return btn;
  }

  function buildBranch(parent, b) {
    var s = b.section;
    var btn = el("button", "node branch accent-" + s.accent, parent);
    btn.type = "button";
    btn.dataset.section = s.id;
    btn.id = "branch-" + s.id;
    btn.style.left = b.x + "px";
    btn.style.top = b.y + "px";
    btn.style.setProperty("--tilt", tilt(s.id, 2.5).toFixed(2) + "deg");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", "group-" + s.id);
    btn.appendChild(icon(s.icon));
    var label = el("span", "node-label", btn);
    label.textContent = s.label;
    var count = el("span", "node-count", btn);
    count.textContent = s.items.filter(function (i) { return !i.hidden; }).length;
    count.setAttribute("aria-hidden", "true");
    return btn;
  }

  function buildLeaf(parent, leaf, index) {
    var it = leaf.item;
    var btn = el("button", "node leaf accent-" + leaf.section.accent + (it.flagship ? " flagship" : ""), parent);
    btn.type = "button";
    btn.dataset.section = leaf.section.id;
    btn.dataset.item = it.id;
    btn.style.left = leaf.x + "px";
    btn.style.top = leaf.y + "px";
    btn.style.setProperty("--i", index);
    btn.style.setProperty("--tilt", tilt(it.id, 3.5).toFixed(2) + "deg");
    if (it.flagship) {
      var star = el("span", "leaf-star", btn);
      star.textContent = "★";
      star.setAttribute("aria-hidden", "true");
    }
    btn.appendChild(icon(it.icon, "node-icon leaf-icon"));
    var label = el("span", "node-label", btn);
    label.textContent = it.node || it.title;
    return btn;
  }

  /* ── expand / collapse ── */

  function setOpen(sectionId) {
    if (openSection === sectionId) return;
    openSection = sectionId;
    Object.keys(groups).forEach(function (sid) {
      var g = groups[sid];
      var on = sid === sectionId;
      g.branchBtn.classList.toggle("open", on);
      g.branchBtn.classList.toggle("dim", sectionId !== null && !on);
      g.branchBtn.setAttribute("aria-expanded", on ? "true" : "false");
      g.leafGroup.classList.toggle("open", on);
      g.edgeGroup.classList.toggle("open", on);
    });
    if (stage) stage.dataset.open = sectionId || "";
  }

  function expand(sectionId, pin) {
    clearTimeout(collapseTimer);
    if (pin) pinnedSection = sectionId;
    setOpen(sectionId);
  }

  function collapse(force) {
    if (pinnedSection && !force) return;
    pinnedSection = null;
    setOpen(null);
  }

  function scheduleExpand(sectionId) {
    clearTimeout(expandTimer);
    clearTimeout(collapseTimer);
    if (openSection === sectionId) return;
    expandTimer = setTimeout(function () {
      if (!pinnedSection) setOpen(sectionId);
    }, HOVER_INTENT_MS);
  }

  function scheduleCollapse() {
    clearTimeout(expandTimer);
    clearTimeout(collapseTimer);
    collapseTimer = setTimeout(function () { collapse(false); }, COLLAPSE_GRACE_MS);
  }

  /* ── keyboard navigation ── */

  function handleKeydown(e) {
    var t = e.target;
    if (!t.classList || !t.classList.contains("node")) return;
    var key = e.key;
    var branchBtns = layoutResult.branches.map(function (b) { return groups[b.section.id].branchBtn; });

    if (t.classList.contains("branch")) {
      var idx = branchBtns.indexOf(t);
      if (key === "ArrowRight" || key === "ArrowLeft") {
        e.preventDefault();
        var next = branchBtns[(idx + (key === "ArrowRight" ? 1 : branchBtns.length - 1)) % branchBtns.length];
        next.focus();
      } else if (key === "ArrowDown" || key === "ArrowUp") {
        e.preventDefault();
        expand(t.dataset.section, true);
        var leafBtns = groups[t.dataset.section].leafBtns;
        if (leafBtns.length) leafBtns[0].focus();
      } else if (key === "Escape") {
        collapse(true);
      }
    } else if (t.classList.contains("leaf")) {
      var sid = t.dataset.section;
      var leaves = groups[sid].leafBtns;
      var li = leaves.indexOf(t);
      if (key === "ArrowRight" || key === "ArrowLeft") {
        e.preventDefault();
        leaves[(li + (key === "ArrowRight" ? 1 : leaves.length - 1)) % leaves.length].focus();
      } else if (key === "ArrowUp") {
        e.preventDefault();
        groups[sid].branchBtn.focus();
      } else if (key === "Escape") {
        collapse(true);
        groups[sid].branchBtn.focus();
      }
    }
  }

  /* ── render ── */

  function render(rootEl) {
    var content = window.PORTFOLIO.CONTENT;
    layoutResult = window.PORTFOLIO.LAYOUT.compute(content);
    openSection = null;
    pinnedSection = null;
    groups = {};

    rootEl.innerHTML = "";
    stage = el("div", "stage", rootEl);
    stage.style.width = layoutResult.stageW + "px";
    stage.style.height = layoutResult.stageH + "px";
    stage.dataset.open = "";

    buildDecorations(stage, layoutResult);

    /* SVG underlay */
    var svg = svgEl("svg", {
      class: "stage-svg",
      viewBox: "0 0 " + layoutResult.stageW + " " + layoutResult.stageH,
      "aria-hidden": "true",
    }, stage);

    var wobbleG = svgEl("g", { filter: "url(#wobble)" }, svg);

    svgEl("path", { class: "trunk-path", d: layoutResult.trunkPath, pathLength: 1 }, wobbleG);

    layoutResult.branches.forEach(function (b, i) {
      var p = svgEl("path", {
        class: "branch-path",
        d: b.path,
        pathLength: 1,
      }, wobbleG);
      p.style.setProperty("--bi", i);
    });

    /* leaf edges live OUTSIDE the turbulence filter: filtering a group whose
       paths animate forces a full filter re-render every frame = jank */
    var edgeGroups = {};
    layoutResult.branches.forEach(function (b) {
      edgeGroups[b.section.id] = svgEl("g", { class: "edge-group", "data-section": b.section.id }, svg);
    });
    var leafIndexPerSection = {};
    layoutResult.leaves.forEach(function (leaf) {
      var sid = leaf.section.id;
      var i = leafIndexPerSection[sid] = (leafIndexPerSection[sid] || 0);
      var p = svgEl("path", { class: "leaf-path", d: leaf.path, pathLength: 1 }, edgeGroups[sid]);
      p.style.setProperty("--i", i);
      leafIndexPerSection[sid] = i + 1;
    });

    /* node layers — each branch button is immediately followed by its
       leaf group in the DOM, so keyboard tab order matches the
       disclosure pattern (expand a branch → Tab reaches its leaves) */
    buildRoot(stage, layoutResult, content);

    var leavesBySection = {};
    layoutResult.leaves.forEach(function (leaf) {
      var sid = leaf.section.id;
      (leavesBySection[sid] = leavesBySection[sid] || []).push(leaf);
    });

    layoutResult.branches.forEach(function (b, bi) {
      var btn = buildBranch(stage, b);
      btn.style.setProperty("--bi", bi);

      var g = el("div", "leaf-group", stage);
      g.id = "group-" + b.section.id;
      g.setAttribute("role", "group");
      g.setAttribute("aria-label", b.section.label);

      var leafBtns = [];
      (leavesBySection[b.section.id] || []).forEach(function (leaf, i) {
        leafBtns.push(buildLeaf(g, leaf, i));
      });

      groups[b.section.id] = {
        branchBtn: btn,
        leafGroup: g,
        edgeGroup: edgeGroups[b.section.id],
        leafBtns: leafBtns,
      };
    });

    buildBee(stage, layoutResult);
    buildDog(stage, layoutResult);
    buildRobot(stage, layoutResult);
    buildBikeButton(stage, layoutResult);

    /* ── events (delegated) ── */
    stage.addEventListener("mouseover", function (e) {
      var node = e.target.closest ? e.target.closest(".node") : null;
      if (!node) return;
      if (node.classList.contains("branch")) scheduleExpand(node.dataset.section);
      else if (node.classList.contains("leaf")) { clearTimeout(collapseTimer); clearTimeout(expandTimer); }
    });
    stage.addEventListener("mouseout", function (e) {
      var node = e.target.closest ? e.target.closest(".node") : null;
      if (!node || node.classList.contains("root")) return;
      var to = e.relatedTarget;
      if (to && to.closest && to.closest(".node.branch, .node.leaf")) return;
      if (openSection) scheduleCollapse();
      else clearTimeout(expandTimer);
    });
    stage.addEventListener("click", function (e) {
      var node = e.target.closest ? e.target.closest(".node") : null;
      if (!node) return;
      if (node.classList.contains("branch")) {
        var sid = node.dataset.section;
        if (pinnedSection === sid) { collapse(true); }
        else { expand(sid, true); }
      } else if (node.classList.contains("leaf")) {
        pinnedSection = node.dataset.section;
        var section = null, item = null;
        content.sections.forEach(function (s) {
          if (s.id === node.dataset.section) {
            section = s;
            s.items.forEach(function (it) { if (it.id === node.dataset.item) item = it; });
          }
        });
        if (item && window.PORTFOLIO.PANEL) window.PORTFOLIO.PANEL.open(item, section, node);
      }
    });
    stage.addEventListener("keydown", handleKeydown);

    /* grow-in on first paint */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { stage.classList.add("grown"); });
    });

    return stage;
  }

  window.PORTFOLIO.TREE = {
    render: render,
    expand: expand,
    collapse: collapse,
    getStage: function () { return stage; },
  };
})();
