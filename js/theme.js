/* ════════════════════════════════════════════════════════════
   theme.js — day/night. The sun in the sky is the switch: click it
   and it sets while the moon rises. The page world darkens; the
   stickers stay lit. An inline <head> script applies the saved
   theme before first paint, so this file only owns the switching.
   ════════════════════════════════════════════════════════════ */

window.PORTFOLIO = window.PORTFOLIO || {};

(function () {
  var STORAGE_KEY = "theme";
  var COLORS = { day: "#FBF3E4", night: "#1B2233" };
  var systemMq = window.matchMedia("(prefers-color-scheme: dark)");

  function stored() {
    try {
      var t = localStorage.getItem(STORAGE_KEY);
      return t === "night" || t === "day" ? t : null;
    } catch (e) {
      return null;
    }
  }

  function current() {
    return document.documentElement.dataset.theme === "night" ? "night" : "day";
  }

  /* keep the browser chrome color + every sun button honest.
     Called again after each re-render (both renderers rebuild the sun). */
  function syncUi() {
    var theme = current();
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", COLORS[theme]);
    /* stable accessible name + toggling pressed state (a name that
       flips together with aria-pressed reads as two different buttons);
       the whimsy lives in the sighted-user tooltip instead */
    var toggles = document.querySelectorAll("button.sun-toggle, button.vine-sun");
    for (var i = 0; i < toggles.length; i++) {
      toggles[i].setAttribute("aria-label", "Night mode");
      toggles[i].setAttribute("aria-pressed", theme === "night" ? "true" : "false");
      toggles[i].title = theme === "night"
        ? "wake the sun — back to day"
        : "put the sun to sleep — switch to night";
    }
  }

  function apply(theme) {
    document.documentElement.dataset.theme = theme;
    syncUi();
  }

  /* No View Transition here on purpose: the sun/moon/hills/sky already
     crossfade via their own CSS transitions, and a whole-page snapshot
     on top of them double-animates (sun → moon → sun echo). */
  function set(theme, persist) {
    apply(theme);
    if (persist) {
      try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* private mode */ }
    }
  }

  function toggle() {
    set(current() === "night" ? "day" : "night", true);
  }

  /* follow the OS until the visitor makes an explicit choice */
  function onSystemChange(e) {
    if (!stored()) set(e.matches ? "night" : "day", false);
  }
  if (systemMq.addEventListener) systemMq.addEventListener("change", onSystemChange);
  else if (systemMq.addListener) systemMq.addListener(onSystemChange); /* older Safari */

  /* delegated click — survives full re-renders of either renderer */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest("button.sun-toggle, button.vine-sun");
    if (btn) toggle();
  });

  function boot() { syncUi(); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.PORTFOLIO.THEME = {
    current: current,
    set: set,
    toggle: toggle,
    syncUi: syncUi,
  };
})();
