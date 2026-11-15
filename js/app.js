/* HarvestRelay demo — app bootstrap and tab navigation. */
window.HR = window.HR || {};

(function () {
  function initTabs() {
    var tabButtons = document.querySelectorAll(".tab-btn");
    var views = document.querySelectorAll(".view");
    tabButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var target = btn.getAttribute("data-view");
        tabButtons.forEach(function (b) {
          b.classList.toggle("active", b === btn);
          b.setAttribute("aria-selected", b === btn ? "true" : "false");
        });
        views.forEach(function (v) {
          v.hidden = v.id !== target;
        });
      });
    });
  }

  function initResetButton() {
    var btn = document.getElementById("reset-demo-btn");
    if (!btn) return;
    btn.addEventListener("click", function () {
      HR.Store.reset();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTabs();
    initResetButton();

    HR.Store.load()
      .then(function () {
        HR.Phone.init();
        HR.Agent.init();
        HR.Provider.init();
      })
      .catch(function (err) {
        console.error(err);
        var main = document.querySelector("main");
        if (main) {
          main.innerHTML =
            "<p style='padding:2rem;color:#b00020;'>Could not load demo data (data/sample-data.json). " +
            "If you opened this file directly from disk, please serve the folder with a local server " +
            "instead (see README.md) &mdash; e.g. <code>python3 -m http.server</code>.</p>";
        }
      });
  });
})();
