/* gece gündüz. gökteki güneş düğme, tıklayınca batıyor ay çıkıyor
   kayıtlı tema head'deki inline scriptte uygulanıyor
   burası sadece geçişle uğraşıyor */

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

  // tarayıcı çubuğunun rengi ve bütün güneş butonları güncel kalsın
  // her renderdan sonra tekrar çağrılıyor ikisi de güneşi baştan kuruyor
  function syncUi() {
    var theme = current();
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", COLORS[theme]);
    // önce label da değişiyordu ekran okuyucu iki ayrı buton sanıyormuş
    // label sabit kaldı şaka title'a gitti
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

  // bilerek view transition yok. güneş ay tepeler zaten kendi css
  // geçişleriyle kayboluyor, üstüne bi de sayfa snapshotı binince
  // güneş > ay > yine güneş gibi bişey oluyordu çok kötüydü
  function set(theme, persist) {
    apply(theme);
    if (persist) {
      try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
    }
  }

  function toggle() {
    set(current() === "night" ? "day" : "night", true);
  }

  // kullanıcı bi seçim yapana kadar sistemi takip et
  function onSystemChange(e) {
    if (!stored()) set(e.matches ? "night" : "day", false);
  }
  if (systemMq.addEventListener) systemMq.addEventListener("change", onSystemChange);
  else if (systemMq.addListener) systemMq.addListener(onSystemChange); // eski safari

  // delegated. iki renderer da her şeyi baştan kuruyor
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
