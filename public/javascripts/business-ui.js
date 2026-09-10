(function () {
  "use strict";

  function normalizePath(path) {
    if (!path) return "/";
    return path.length > 1 ? path.replace(/\/+$/, "") : path;
  }

  function markActiveMenu() {
    var currentPath = normalizePath(window.location.pathname);
    var links = document.querySelectorAll(
      "body.business-ui .header a[href^='/'], body.business-ui .sidebar a[href^='/'], body.business-ui .mobile-menu-body a[href^='/']"
    );

    links.forEach(function (link) {
      var targetPath = normalizePath(link.getAttribute("href"));
      var active = targetPath === currentPath;
      link.classList.toggle("active", active);
      if (active) {
        link.setAttribute("aria-current", "page");
        var parentItem = link.closest(".header .menu > li");
        if (parentItem) parentItem.classList.add("active");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function enableMenuKeyboard() {
    document.querySelectorAll("body.business-ui .header .has-arrow").forEach(function (trigger) {
      trigger.addEventListener("click", function (event) {
        event.preventDefault();
      });
    });

    document.querySelectorAll("body.business-ui .parent-menu").forEach(function (trigger) {
      trigger.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          trigger.click();
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    markActiveMenu();
    enableMenuKeyboard();
  });
})();
