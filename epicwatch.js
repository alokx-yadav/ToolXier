function updateClock() {
  const now = new Date();
  let h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();
  const ampm = h >= 12 ? 'PM' : 'AM';

  h = h % 12 || 12;

  document.getElementById('hour').textContent = String(h).padStart(2, '0');
  document.getElementById('minute').textContent = String(m).padStart(2, '0');
  document.getElementById('second').textContent = String(s).padStart(2, '0');
  document.getElementById('ampm').textContent = ampm;


  const secondEl = document.getElementById('second');
  secondEl.classList.remove('animated-sec');
  void secondEl.offsetWidth;
  secondEl.classList.add('animated-sec');

}

function changeColor(color) {
  const clock = document.querySelector('.clock');
  clock.style.color = color;
  clock.style.textShadow = `0 0 20px ${color}`;
}

function toggleFullscreen() {
  const elem = document.documentElement;
  if (!document.fullscreenElement) {
    elem.requestFullscreen().catch(err => alert(`Error: ${err.message}`));
  } else {
    document.exitFullscreen();
  }
}

setInterval(updateClock, 1000);
updateClock(); 
