/* =========================
   SIDEBAR + MENU
========================= */

document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');

    document.querySelectorAll('.parent-menu').forEach(function (menu) {
        function toggleMenu() {
            const group = this.closest('.menu-group');
            if (!group) return;

            if (sidebar && sidebar.classList.contains('collapsed')) {
                sidebar.classList.remove('collapsed');
            }

            group.classList.toggle('open');
            this.setAttribute('aria-expanded', String(group.classList.contains('open')));
        }

        menu.addEventListener('click', toggleMenu);
        menu.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleMenu.call(this);
            }
        });
    });

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', function () {
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('mobile-open');
            } else {
                sidebar.classList.toggle('collapsed');
            }
            const expanded = window.innerWidth <= 768
                ? sidebar.classList.contains('mobile-open')
                : !sidebar.classList.contains('collapsed');
            toggleBtn.setAttribute('aria-expanded', String(expanded));
        });
    }
});
