document.addEventListener("DOMContentLoaded", function () {

  if (window.__APP_LAYOUT_INIT__) return;
  window.__APP_LAYOUT_INIT__ = true;

  console.log("INIT APP LAYOUT");
  const body = document.body;

  const sidebar = document.getElementById("sidebarTree");
  const btnSidebarDesktop = document.getElementById("btnToggleSidebarTree");
  const btnSidebarMobile = document.getElementById("btnMobileSidebar");

  const mobileMenuDrawer = document.getElementById("mobileMenuDrawer");
  const btnMobileMenu = document.getElementById("btnMobileMenu");
  const btnCloseMobileMenu = document.getElementById("btnCloseMobileMenu");

  const btnLogoutDesktop = document.getElementById("logout");
  const btnLogoutMobile = document.getElementById("btnMobileLogout");

  const STORAGE_KEY = "sidebarTreeCollapsed";
  const MOBILE_BREAKPOINT = 1024;

  function isMobile() {
    return window.innerWidth < MOBILE_BREAKPOINT;
  }

  function setDesktopCollapsed(collapsed) {
    if (!sidebar) return;
    sidebar.classList.toggle("collapsed", collapsed);
    body.classList.toggle("sidebar-tree-collapsed", collapsed);
    localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
  }

  function openMobileSidebar() {
    if (!sidebar) return;
    sidebar.classList.add("mobile-open");
    body.classList.add("sidebar-mobile-backdrop");
  }

  function closeMobileSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove("mobile-open");
    body.classList.remove("sidebar-mobile-backdrop");
  }

  function toggleMobileSidebar() {
    if (!sidebar) return;
    const willOpen = !sidebar.classList.contains("mobile-open");
    if (willOpen) {
      openMobileSidebar();
      closeMobileMenu();
    } else {
      closeMobileSidebar();
    }
  }

  function openMobileMenu() {
    if (!mobileMenuDrawer) return;
    mobileMenuDrawer.classList.add("open");
    body.classList.add("mobile-right-backdrop");
  }

  function closeMobileMenu() {
    if (!mobileMenuDrawer) return;
    mobileMenuDrawer.classList.remove("open");
    body.classList.remove("mobile-right-backdrop");
  }

  function toggleMobileMenu() {
    if (!mobileMenuDrawer) return;
    const willOpen = !mobileMenuDrawer.classList.contains("open");
    if (willOpen) {
      openMobileMenu();
      closeMobileSidebar();
    } else {
      closeMobileMenu();
    }
  }

  function closeAllMobilePanels() {
    closeMobileSidebar();
    closeMobileMenu();
  }

  function handleLogout() {
    const ok = window.confirm("Đăng xuất khỏi hệ thống");
    if (!ok) return;

    localStorage.removeItem("us");
    localStorage.clear();
    window.location.href = "/login";
  }

  function syncOnLoad() {
    if (!sidebar) return;

    if (isMobile()) {
      body.classList.remove("sidebar-tree-collapsed");
      sidebar.classList.remove("collapsed");
      closeAllMobilePanels();
    } else {
      closeAllMobilePanels();
      const collapsed = localStorage.getItem(STORAGE_KEY) === "1";
      setDesktopCollapsed(collapsed);
    }
  }

  function onDesktopSidebarToggle(e) {
    e.preventDefault();
    if (!sidebar) return;

    if (isMobile()) {
      toggleMobileSidebar();
      return;
    }

    const collapsed = sidebar.classList.contains("collapsed");
    setDesktopCollapsed(!collapsed);

    setTimeout(function () {
      window.dispatchEvent(new Event("resize"));
    }, 260);
  }

  function onMobileSidebarToggle(e) {
    e.preventDefault();
    toggleMobileSidebar();
  }

  function onMobileMenuToggle(e) {
    e.preventDefault();
    toggleMobileMenu();
  }

  function onCloseMobileMenu(e) {
    e.preventDefault();
    closeMobileMenu();
  }

  document.addEventListener("click", function (e) {
    if (
      isMobile() &&
      sidebar &&
      sidebar.classList.contains("mobile-open") &&
      !e.target.closest("#sidebarTree") &&
      !e.target.closest("#btnMobileSidebar") &&
      !e.target.closest("#btnToggleSidebarTree")
    ) {
      closeMobileSidebar();
    }

    if (
      isMobile() &&
      mobileMenuDrawer &&
      mobileMenuDrawer.classList.contains("open") &&
      !e.target.closest("#mobileMenuDrawer") &&
      !e.target.closest("#btnMobileMenu")
    ) {
      closeMobileMenu();
    }
  });

  window.addEventListener("resize", function () {
    syncOnLoad();
  });

  if (btnSidebarDesktop) {
    btnSidebarDesktop.addEventListener("click", onDesktopSidebarToggle);
  }

  if (btnSidebarMobile) {
    btnSidebarMobile.addEventListener("click", onMobileSidebarToggle);
  }

  if (btnMobileMenu) {
    btnMobileMenu.addEventListener("click", onMobileMenuToggle);
  }

  if (btnCloseMobileMenu) {
    btnCloseMobileMenu.addEventListener("click", onCloseMobileMenu);
  }

  if (btnLogoutDesktop) {
    btnLogoutDesktop.addEventListener("click", handleLogout);
  }

  if (btnLogoutMobile) {
    btnLogoutMobile.addEventListener("click", handleLogout);
  }

  syncOnLoad();
});