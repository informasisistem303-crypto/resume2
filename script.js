// script.js — interaksi: nav toggle, typing effect, scroll fade-in, skill bars, form handling

document.addEventListener('DOMContentLoaded', function () {
  // Set year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // NAV TOGGLE (mobile)
  const btnNav = document.getElementById('btnNavToggle');
  const nav = document.getElementById('primary-nav');
  btnNav.addEventListener('click', () => {
    const expanded = btnNav.getAttribute('aria-expanded') === 'true';
    btnNav.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
    // focus first link when opening
    if (!expanded) {
      const firstLink = nav.querySelector('a');
      if (firstLink) firstLink.focus();
    }
  });

  // Smooth active link highlight
  const navLinks = Array.from(document.querySelectorAll('.primary-nav a'));
  const sections = navLinks.map(l => document.querySelector(l.getAttribute('href')));
  const observerOptions = { root: null, rootMargin: '0px 0px -40% 0px', threshold: 0 };
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const idx = sections.indexOf(entry.target);
      if (idx !== -1) {
        navLinks.forEach(a => a.classList.remove('active'));
        if (entry.isIntersecting) navLinks[idx].classList.add('active');
      }
    });
  }, observerOptions);
  sections.forEach(s => s && sectionObserver.observe(s));

  // Fade-in on scroll for sections (.fade-wrap)
  const fades = document.querySelectorAll('.fade-wrap');
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  fades.forEach(f => fadeObserver.observe(f));

  // Skill bars animation when visible
  const skillBars = document.querySelectorAll('.skill-bar');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target.querySelector('.skill-bar-fill');
        const pct = entry.target.getAttribute('data-percent') || '0';
        bar.style.width = pct + '%';
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });
  skillBars.forEach(s => skillObserver.observe(s));

  // Typing effect in hero (simple loop)
  const typedEl = document.querySelector('.typed');
  const typedTexts = [
    'Pengembang Web pemula • Pembelajar & Kreatif',
    'Menyukai UI/UX • Prototype dan Desain Antarmuka',
    'Terbuka untuk kolaborasi & proyek akademik'
  ];
  let tIdx = 0, cIdx = 0, deleting = false;
  const T_SPEED = 70, DELAY = 900;

  function tick() {
    const full = typedTexts[tIdx];
    if (!deleting) {
      cIdx++;
      typedEl.textContent = full.substring(0, cIdx);
      if (cIdx === full.length) {
        deleting = true;
        setTimeout(tick, DELAY);
        return;
      }
    } else {
      cIdx--;
      typedEl.textContent = full.substring(0, cIdx);
      if (cIdx === 0) {
        deleting = false;
        tIdx = (tIdx + 1) % typedTexts.length;
      }
    }
    setTimeout(tick, deleting ? T_SPEED / 1.6 : T_SPEED);
  }
  // Start typing with slight initial delay
  setTimeout(tick, 600);

  // Contact form (fake submit for demo)
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    // basic validation
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if (!name || !email || !message) {
      status.textContent = 'Mohon lengkapi semua kolom.';
      status.style.color = 'crimson';
      return;
    }
    // Simulate sending
    status.textContent = 'Mengirim...';
    status.style.color = 'var(--muted)';
    setTimeout(() => {
      status.textContent = 'Pesan berhasil dikirim. Terima kasih!';
      status.style.color = 'green';
      form.reset();
    }, 900);
  });

  // Close mobile nav after clicking a link
  nav.addEventListener('click', (ev) => {
    if (ev.target.tagName === 'A' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      btnNav.setAttribute('aria-expanded', 'false');
    }
  });

  // Reduce motion respect
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReduced.matches) {
    // disable animations by removing transitions
    document.documentElement.style.setProperty('--transition', '0ms');
  }
});