/* ════════════════════════════════════════════════════════════
   layout.js — radial tree layout in a fixed 1600×1000 virtual stage.
   Pure math: content tree in → node positions + SVG path strings out.
   ════════════════════════════════════════════════════════════ */

window.PORTFOLIO = window.PORTFOLIO || {};

(function () {
  var STAGE_W = 1600;
  var STAGE_H = 880;
  var ROOT = { x: 800, y: 806 };
  var TRUNK_TOP = { x: 800, y: 600 };

  var ARC_START = 185;        // degrees, screen coords (y down); 270° = straight up
  var ARC_END = 355;
  var BRANCH_RADIUS = 300;
  var BRANCH_STAGGER = 60;    // every other branch reaches farther, so pills interleave
  var LEAF_RADIUS = 265;
  var LEAF_RADIUS_STAGGER = 112;  // every other leaf sits farther out
  var FLAGSHIP_EXTRA = 30;
  var PAD = 60;                    // keep nodes inside the stage

  function rad(deg) { return (deg * Math.PI) / 180; }

  function polar(cx, cy, angleDeg, r) {
    return {
      x: cx + Math.cos(rad(angleDeg)) * r,
      y: cy + Math.sin(rad(angleDeg)) * r,
    };
  }

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  /* quadratic Bézier path with a perpendicular bend — the organic curve */
  function curvePath(a, b, bend) {
    var mx = (a.x + b.x) / 2;
    var my = (a.y + b.y) / 2;
    var dx = b.x - a.x;
    var dy = b.y - a.y;
    var len = Math.sqrt(dx * dx + dy * dy) || 1;
    var px = -dy / len;
    var py = dx / len;
    var cx = mx + px * bend * len;
    var cy = my + py * bend * len;
    return "M " + a.x.toFixed(1) + " " + a.y.toFixed(1) +
           " Q " + cx.toFixed(1) + " " + cy.toFixed(1) +
           " " + b.x.toFixed(1) + " " + b.y.toFixed(1);
  }

  function visibleItems(section) {
    return section.items.filter(function (it) { return !it.hidden; });
  }

  /* content → { root, trunkPath, branches: [...], leaves: [...] } */
  function compute(content) {
    var sections = content.sections;
    var totalWeight = 0;
    sections.forEach(function (s) {
      s._weight = Math.max(visibleItems(s).length, 2);
      totalWeight += s._weight;
    });

    var arc = ARC_END - ARC_START;
    var cursor = ARC_START;
    var branches = [];
    var leaves = [];

    sections.forEach(function (section, si) {
      var wedge = (arc * s_weight(section)) / totalWeight;
      var centerAngle = cursor + wedge / 2;
      cursor += wedge;

      var bRadius = BRANCH_RADIUS + (si % 2 === 1 ? BRANCH_STAGGER : 0);
      var bpos = polar(TRUNK_TOP.x, TRUNK_TOP.y, centerAngle, bRadius);
      bpos.x = clamp(bpos.x, PAD, STAGE_W - PAD);
      bpos.y = clamp(bpos.y, PAD, STAGE_H - PAD);

      branches.push({
        section: section,
        x: bpos.x,
        y: bpos.y,
        angle: centerAngle,
        path: curvePath(TRUNK_TOP, bpos, si % 2 === 0 ? 0.10 : -0.10),
      });

      var items = visibleItems(section);
      var n = items.length;
      /* two-leaf sections (the flagship "fruits") get a wider fork */
      var gap = n > 1 ? Math.min(n === 2 ? 46 : 32, 190 / (n - 1)) : 0;
      var span = gap * (n - 1);
      var startAngle = centerAngle - span / 2;

      items.forEach(function (item, i) {
        var angle = startAngle + gap * i;
        var r = LEAF_RADIUS + (i % 2 === 1 ? LEAF_RADIUS_STAGGER : 0);
        if (item.flagship) r += FLAGSHIP_EXTRA;
        var lpos = polar(bpos.x, bpos.y, angle, r);
        lpos.x = clamp(lpos.x + (item.dx || 0), PAD, STAGE_W - PAD);
        lpos.y = clamp(lpos.y + (item.dy || 0), PAD, STAGE_H - PAD);

        leaves.push({
          section: section,
          item: item,
          x: lpos.x,
          y: lpos.y,
          angle: angle,
          path: curvePath(bpos, lpos, i % 2 === 0 ? 0.14 : -0.14),
        });
      });
    });

    return {
      stageW: STAGE_W,
      stageH: STAGE_H,
      root: ROOT,
      trunkTop: TRUNK_TOP,
      trunkPath:
        "M " + ROOT.x + " " + ROOT.y +
        " C " + (ROOT.x - 26) + " " + (ROOT.y - 90) + ", " +
        (TRUNK_TOP.x + 24) + " " + (TRUNK_TOP.y + 90) + ", " +
        TRUNK_TOP.x + " " + TRUNK_TOP.y,
      branches: branches,
      leaves: leaves,
    };
  }

  function s_weight(section) { return section._weight; }

  window.PORTFOLIO.LAYOUT = {
    STAGE_W: STAGE_W,
    STAGE_H: STAGE_H,
    compute: compute,
  };
})();
