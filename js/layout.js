/* 1600x880 sanal sahnede radyal ağaç yerleşimi
   saf matematik, dom yok. içerik girer koordinat ve svg path çıkar */

window.PORTFOLIO = window.PORTFOLIO || {};

(function () {
  var STAGE_W = 1600;
  var STAGE_H = 880;
  var ROOT = { x: 800, y: 806 };
  var TRUNK_TOP = { x: 800, y: 600 };

  // ekran koordinatı yani y aşağı. 270 tam yukarı
  var ARC_START = 185;
  var ARC_END = 355;
  var BRANCH_RADIUS = 300;
  var BRANCH_STAGGER = 60; // her ikinci dal biraz uzağa yoksa pilller iç içe giriyor
  var LEAF_RADIUS = 265;
  var LEAF_RADIUS_STAGGER = 112;
  var FLAGSHIP_EXTRA = 30;
  var PAD = 60; // kenar boşluğu

  // çakışma çözümü, merkezden merkeze minimum mesafeler
  // iki pill hem yatayda hem dikeyde bunlardan yakınsa çakışmış sayılıyor
  // ve sadece x'te itiliyorlar
  var LEAF_SEP_X = 118;
  var LEAF_SEP_Y = 56;
  var BRANCH_SEP_X = 140; // dal pilleri yapraklardan geniş
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

  // dik yönde bükülmüş quadratic bezier. organik duran şey bu
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
    var pending = []; // dalcıklar relaxtan sonra çiziliyor

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
      // iki yapraklılar daha açık çatal alıyor
      var gap = n > 1 ? Math.min(n === 2 ? 46 : 32, 190 / (n - 1)) : 0;
      var span = gap * (n - 1);
      var startAngle = centerAngle - span / 2;

      // dal ucundan ham offsetler
      var offsets = items.map(function (item, i) {
        var angle = startAngle + gap * i;
        var r = LEAF_RADIUS + (i % 2 === 1 ? LEAF_RADIUS_STAGGER : 0);
        if (item.flagship) r += FLAGSHIP_EXTRA;
        var p = polar(0, 0, angle, r);
        return { x: p.x, y: p.y, angle: angle };
      });

      // sonra bütün yelpazeyi uca doğru sıkıştırıp sahneye sığdırıyoruz
      // ilk halinde her yaprağı tek tek clamplıyordum, projects dalı
      // (neredeyse dik ve tepeye yakın) yapraklarının yarısını aynı
      // y = PAD çizgisine diziyordu, çamaşır ipi gibi olmuştu
      // böyle yelpazenin şekli bozulmuyor dalcıklar da düzgün gidiyor
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
          // dx/dy content.js'ten elle veriliyor
          // fitten sonra uyguluyoruz ki gerçekten işe yarasın
          // önceden clamplanıp uçuyordu, olmadı aaa
          x: bpos.x + o.x * kx + (item.dx || 0),
          y: bpos.y + o.y * ky + (item.dy || 0),
          angle: o.angle,
          path: "",
        };
        leaves.push(leaf);
        pending.push({ leaf: leaf, tip: bpos, bend: i % 2 === 0 ? 0.14 : -0.14 });
      });
    });

    // önce çakışanları ayır sonra dalcıkları nereye düştülerse oraya çiz
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

  // deterministik, random yok, aynı içerik hep aynı yere düşüyor
  // yapraklar hem aynı bölümdeki diğer yapraklardan (yarı yarıya)
  // hem de dal pillerinden itiliyor (dal sabit, yaprak hepsini yiyor)
  // 30 iterasyon fazla ama ucuz
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
          dir = dx >= 0 ? 1 : -1; // eşitse sonraki yaprak sağa gitsin
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
