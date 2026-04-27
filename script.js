/* ============================================================
   Harvey Jules D. Delfin — Portfolio interactions
   Edit constants below before deploying to Vercel.
   ============================================================ */

(() => {
  const $  = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  /* --- Intro reveal --- */
  window.addEventListener('load', () => {
    setTimeout(() => $('#intro')?.classList.add('is-done'), 1600);
  });

  /* --- Year --- */
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  /* --- Reviews marquee: duplicate track for seamless loop --- */
  $$('[data-marquee] .reviews__track').forEach(track => {
    track.innerHTML = track.innerHTML + track.innerHTML;
  });

  /* --- Theme toggle (persisted) --- */
  const root = document.documentElement;
  const saved = localStorage.getItem('hjd-theme');
  if (saved) root.dataset.theme = saved;
  $('#themeToggle')?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('hjd-theme', next);
  });

  /* --- Sticky nav state --- */
  const nav = $('#nav');
  const onScroll = () => {
    nav?.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* --- Active section tracking --- */
  const links = $$('.nav__links a[data-link], .mobile-panel a[data-link]');
  const sections = links
    .map(a => $(a.getAttribute('href')))
    .filter(Boolean);

  const setActive = (id) => {
    links.forEach(a => {
      const match = a.getAttribute('href') === '#' + id;
      a.classList.toggle('is-active', match);
    });
  };

  if ('IntersectionObserver' in window && sections.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) setActive(e.target.id);
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    sections.forEach(s => io.observe(s));
  }

  /* --- Mobile menu --- */
  const menuBtn = $('#menuBtn');
  const panel   = $('#mobilePanel');
  const toggleMenu = (open) => {
    const isOpen = open ?? !panel.classList.contains('is-open');
    panel.classList.toggle('is-open', isOpen);
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    panel.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };
  menuBtn?.addEventListener('click', () => toggleMenu());
  panel?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

  /* --- Reveal on scroll --- */
  if ('IntersectionObserver' in window) {
    const ro = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          ro.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach(el => ro.observe(el));
  } else {
    $$('.reveal').forEach(el => el.classList.add('is-in'));
  }

  /* --- Magnetic CTA hover --- */
  const magnets = $$('.magnetic');
  const strength = 14;
  magnets.forEach(el => {
    el.addEventListener('mousemove', (ev) => {
      const r = el.getBoundingClientRect();
      const x = ev.clientX - (r.left + r.width / 2);
      const y = ev.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x / r.width * strength}px, ${y / r.height * strength}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });

  /* --- Smooth-scroll for hash links (respects sticky nav) --- */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
