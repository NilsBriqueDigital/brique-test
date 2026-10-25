// Header: achtergrond zodra je scrolt
const header = document.querySelector('.site-header');

// Mobiel menu open/dicht
const toggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('nav');

toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});

nav.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', false);
  }
});

// Secties schuiven in zodra ze in beeld komen
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// De vier hero-vormen bouncen op en neer als je scrolt.
// Elke vorm is een veer: scrollen geeft een duw, de veer trekt hem terug.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const shapes = [...document.querySelectorAll('.shape')].map((el, i) => ({
  el,
  gain: parseFloat(el.dataset.gain),
  rot: parseFloat(el.dataset.rot),
  stiffness: 0.06 + i * 0.012,
  y: 0,
  v: 0,
  phase: i * 1.3,
}));

let lastScroll = window.scrollY;

window.addEventListener('scroll', () => {
  const delta = window.scrollY - lastScroll;
  lastScroll = window.scrollY;

  header.classList.toggle('scrolled', window.scrollY > 20);

  const push = Math.max(-40, Math.min(40, delta));
  shapes.forEach((s) => { s.v -= push * s.gain * 0.6; });
}, { passive: true });

function tick(time) {
  shapes.forEach((s) => {
    s.v += -s.stiffness * s.y;
    s.v *= 0.86;
    s.y = Math.max(-160, Math.min(160, s.y + s.v));

    // Klein zweven in rust, zodat de vormen nooit helemaal stil staan
    const idle = Math.sin(time / 900 + s.phase) * 6;
    const y = s.y + idle;
    s.el.style.transform = `translateY(${y}px) rotate(${y * s.rot}deg)`;
  });
  requestAnimationFrame(tick);
}

if (!reduceMotion) requestAnimationFrame(tick);
