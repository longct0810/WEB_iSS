'use strict';

const clock = document.getElementById('clock');
function updateClock() {
  if (!clock) return;
  clock.textContent = new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Ho_Chi_Minh'
  }).format(new Date());
}
updateClock();
window.setInterval(updateClock, 1000);

document.querySelectorAll('.nav-link.disabled').forEach(link => {
  link.addEventListener('click', event => event.preventDefault());
});
