/* ════════════════════════════════════════════════════════════
   mobile.js — the phone renderer (<768px): the tree becomes a
   vertical "growing vine" accordion. Same data, second renderer.
   ════════════════════════════════════════════════════════════ */

window.PORTFOLIO = window.PORTFOLIO || {};

(function () {
  var SVG_NS = "http://www.w3.org/2000/svg";

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

  /* openSectionId: optional — which section starts expanded (defaults to the first) */
  function render(rootEl, openSectionId) {
    var content = window.PORTFOLIO.CONTENT;
    var SPRITES = window.PORTFOLIO.SPRITES || {};
    rootEl.innerHTML = "";

    var vine = el("div", "vine", rootEl);

    /* little sky: sun + a drifting cloud */
    var deco = el("div", "vine-deco", vine);
    deco.setAttribute("aria-hidden", "true");
    deco.innerHTML = '<div class="vine-sun">' + (SPRITES.sun || "") + '</div><div class="cloud vine-cloud"></div>';

    /* "me!" root card — same about card as the desktop root node */
    var me = el("button", "vine-me", vine);
    me.type = "button";
    me.innerHTML =
      '<span class="vine-me-avatar">' +
      '<svg viewBox="0 0 120 120" aria-hidden="true">' +
      '<circle cx="60" cy="62" r="44" fill="#F8C79A" stroke="#2B2119" stroke-width="5"/>' +
      '<path d="M22 55 C18 26 40 12 60 12 C80 12 102 26 98 55 C94 42 86 36 60 36 C34 36 26 42 22 55 Z" fill="#3A2A1E" stroke="#2B2119" stroke-width="5" stroke-linejoin="round"/>' +
      '<circle cx="45" cy="60" r="5" fill="#2B2119"/><circle cx="75" cy="60" r="5" fill="#2B2119"/>' +
      '<path d="M46 80 C52 88 68 88 74 80" fill="none" stroke="#2B2119" stroke-width="4.4" stroke-linecap="round"/>' +
      "</svg>" +
      '<img src="assets/img/me.jpg" alt="" onerror="this.remove()">' +
      "</span>" +
      '<span class="vine-me-text"><strong>me!</strong><small>who planted this tree — tap for the story</small></span>';
    me.addEventListener("click", function () {
      if (window.PORTFOLIO.PANEL) window.PORTFOLIO.PANEL.openAbout(me);
    });

    var openSec = null;

    content.sections.forEach(function (section, si) {
      var items = section.items.filter(function (i) { return !i.hidden; });
      var sec = el("section", "vine-sec accent-" + section.accent, vine);

      var head = el("button", "vine-head", sec);
      head.type = "button";
      head.setAttribute("aria-expanded", "false");
      var listId = "vine-list-" + section.id;
      head.setAttribute("aria-controls", listId);
      head.appendChild(icon(section.icon, "vine-icon"));
      var label = el("span", "vine-label", head);
      label.textContent = section.label;
      var count = el("span", "vine-count", head);
      count.textContent = items.length;
      count.setAttribute("aria-hidden", "true");
      var caret = el("span", "vine-caret", head);
      caret.textContent = "▾";
      caret.setAttribute("aria-hidden", "true");

      var list = el("ul", "vine-list", sec);
      list.id = listId;

      items.forEach(function (item, ii) {
        var li = el("li", "", list);
        li.style.setProperty("--i", ii);
        var btn = el("button", "vine-item" + (item.flagship ? " flagship" : ""), li);
        btn.type = "button";
        if (item.flagship) {
          var star = el("span", "leaf-star", btn);
          star.textContent = "★";
          star.setAttribute("aria-hidden", "true");
        }
        btn.appendChild(icon(item.icon, "vine-item-icon"));
        var text = el("span", "vine-item-text", btn);
        var t = el("span", "vine-item-title", text);
        t.textContent = item.node || item.title;
        if (item.summary) {
          var s = el("span", "vine-item-sub", text);
          s.textContent = item.summary;
        }
        btn.addEventListener("click", function () {
          if (window.PORTFOLIO.PANEL) window.PORTFOLIO.PANEL.open(item, section, btn);
        });
      });

      head.addEventListener("click", function () {
        var isOpen = sec.classList.contains("open");
        if (openSec && openSec !== sec) {
          openSec.classList.remove("open");
          openSec.querySelector(".vine-head").setAttribute("aria-expanded", "false");
        }
        sec.classList.toggle("open", !isOpen);
        head.setAttribute("aria-expanded", String(!isOpen));
        openSec = isOpen ? null : sec;
      });

      /* sections start closed unless a deep link asks for one */
      var startOpen = openSectionId ? section.id === openSectionId : false;
      if (startOpen) {
        sec.classList.add("open");
        head.setAttribute("aria-expanded", "true");
        openSec = sec;
        if (openSectionId) {
          requestAnimationFrame(function () {
            sec.scrollIntoView({ behavior: "smooth", block: "start" });
          });
        }
      }
    });

    /* ground scene: the hill with Ateş and the robot, same friends as on desktop */
    var ground = el("div", "vine-ground", rootEl);
    var hill = el("div", "vine-hill", ground);
    hill.setAttribute("aria-hidden", "true");

    var dog = el("button", "dog vine-dog", ground);
    dog.type = "button";
    dog.setAttribute("aria-label", "Ateş the dog says woof");
    dog.innerHTML = '<span class="dog-bubble" aria-hidden="true">woof! hire my human</span>' + (SPRITES.dog || "");
    dog.addEventListener("click", function () {
      dog.classList.remove("barking");
      void dog.offsetWidth;
      dog.classList.add("barking");
    });

    var bike = el("button", "game-launch", ground);
    bike.type = "button";
    bike.setAttribute("aria-label", "Play Deniz's bike ride — a tiny jumping game");
    bike.innerHTML =
      (SPRITES.bike || "") +
      '<span class="game-launch-label" aria-hidden="true">play!</span>';
    bike.style.left = "44%";
    bike.style.bottom = "30px";
    bike.addEventListener("click", function () {
      if (window.PORTFOLIO.GAME) window.PORTFOLIO.GAME.open(bike);
    });

    var robot = el("button", "robot vine-robot", ground);
    robot.type = "button";
    robot.setAttribute("aria-label", "a little robot friend");
    robot.innerHTML = '<span class="robot-bubble" aria-hidden="true">good news, everyone!</span>' + (SPRITES.robot || "");
    robot.addEventListener("click", function () {
      robot.classList.remove("cheering");
      void robot.offsetWidth;
      robot.classList.add("cheering");
    });

    return vine;
  }

  window.PORTFOLIO.MOBILE = { render: render };
})();
