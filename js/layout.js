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

  /* collision relaxation — minimum centre-to-centre distances (px).
     Two pills "collide" when they are closer than X horizontally AND Y
     vertically; they are then pushed apart along x only. */
  var LEAF_SEP_X = 118;            // leaf vs leaf (same section)
  var LEAF_SEP_Y = 56;
  var BRANCH_SEP_X = 140;          // leaf vs any branch pill (branch pills are wider)
  var BRANCH_SEP_Y = 64;
  var RELAX_ITERATIONS = 30;

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
    var pending = [];   // { leaf, tip, bend } — twig paths are drawn after relaxation

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

      /* 1. raw radial offsets from the branch tip */
      var offsets = items.map(function (item, i) {
        var angle = startAngle + gap * i;
        var r = LEAF_RADIUS + (i % 2 === 1 ? LEAF_RADIUS_STAGGER : 0);
        if (item.flagship) r += FLAGSHIP_EXTRA;
        var p = polar(0, 0, angle, r);
        return { x: p.x, y: p.y, angle: angle };
      });

      /* 2. fit the whole fan inside the padded stage by squashing it
         (uniformly, per axis) towards the branch tip.  A branch pointing
         nearly straight up near the top edge — "projects" — would
         otherwise have half its leaves clamped onto the same y = PAD
         line (a flat clothesline).  Squashing keeps the fan's shape and
         every twig still runs straight from tip to pill. */
      var kx = 1, ky = 1;
      offsets.forEach(function (o) {
        if (o.x < 0) kx = Math.min(kx, (bpos.x - PAD) / -o.x);
        if (o.x > 0) kx = Math.min(kx, (STAGE_W - PAD - bpos.x) / o.x);
        if (o.y < 0) ky = Math.min(ky, (bpos.y - PAD) / -o.y);
        if (o.y > 0) ky = Math.min(ky, (STAGE_H - PAD - bpos.y) / o.y);
      });
      kx = Math.max(kx, 0);
      ky = Math.max(ky, 0);

      items.forEach(function (item, i) {
        var o = offsets[i];
        var leaf = {
          section: section,
          item: item,
          /* dx/dy are hand nudges from content.js — applied AFTER the
             fit so they always move the pill (they used to be clamped away) */
          x: bpos.x + o.x * kx + (item.dx || 0),
          y: bpos.y + o.y * ky + (item.dy || 0),
          angle: o.angle,
          path: "",
        };
        leaves.push(leaf);
        pending.push({ leaf: leaf, tip: bpos, bend: i % 2 === 0 ? 0.14 : -0.14 });
      });
    });

    /* 3. push colliding pills apart along x, then 4. draw the twigs to
       wherever the pills finally ended up */
    relax(leaves, branches);
    pending.forEach(function (p) {
      p.leaf.path = curvePath(p.tip, p.leaf, p.bend);
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

  /* Deterministic collision relaxation.  Leaves are pushed apart along x
     from (a) other leaves of the same section (half the overlap each) and
     (b) every branch pill (branch pills stay put; the leaf takes the full
     overlap).  Positions are kept inside the padded stage width. */
  function relax(leaves, branches) {
    var i, j, k, a, b, dx, dy, overlap, dir;
    for (var iter = 0; iter < RELAX_ITERATIONS; iter++) {
      var moved = false;
      for (i = 0; i < leaves.length; i++) {
        a = leaves[i];
        for (k = 0; k < branches.length; k++) {
          b = branches[k];
          dy = Math.abs(a.y - b.y);
          if (dy >= BRANCH_SEP_Y) continue;
          dx = a.x - b.x;
          overlap = BRANCH_SEP_X - Math.abs(dx);
          if (overlap <= 0) continue;
          dir = dx > 0 || (dx === 0 && a.x >= STAGE_W / 2) ? 1 : -1;
          a.x = clamp(a.x + dir * overlap, PAD, STAGE_W - PAD);
          moved = true;
        }
        for (j = i + 1; j < leaves.length; j++) {
          b = leaves[j];
          if (b.section !== a.section) continue;
          dy = Math.abs(a.y - b.y);
          if (dy >= LEAF_SEP_Y) continue;
          dx = b.x - a.x;
          overlap = LEAF_SEP_X - Math.abs(dx);
          if (overlap <= 0) continue;
          dir = dx >= 0 ? 1 : -1;   // tie → later leaf goes right
          a.x = clamp(a.x - dir * overlap / 2, PAD, STAGE_W - PAD);
          b.x = clamp(b.x + dir * overlap / 2, PAD, STAGE_W - PAD);
          moved = true;
        }
      }
      if (!moved) break;
    }
  }

  window.PORTFOLIO.LAYOUT = {
    STAGE_W: STAGE_W,
    STAGE_H: STAGE_H,
    compute: compute,
  };
})();
