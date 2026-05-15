(() => {
  /* ============ i18n ============ */
  const dict = window.I18N || {};
  const applyLang = (lang) => {
    if (!dict[lang]) return;
    document.documentElement.lang = lang;
    document.documentElement.dataset.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[lang][key]) el.textContent = dict[lang][key];
    });
    document.querySelectorAll('.lang-switch button').forEach(b => {
      b.classList.toggle('is-active', b.dataset.setLang === lang);
    });
    try { localStorage.setItem('nyamgerel-lang', lang); } catch(e) {}
  };
  const savedLang = (() => { try { return localStorage.getItem('nyamgerel-lang'); } catch(e) { return null; } })();
  const initialLang = savedLang || (navigator.language && navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en');
  applyLang(initialLang);
  document.querySelectorAll('.lang-switch button').forEach(b => {
    b.addEventListener('click', () => applyLang(b.dataset.setLang));
  });

  /* ============ Header scroll ============ */
  const header = document.getElementById('siteHeader');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ============ Mobile nav ============ */
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', false);
  }));

  /* ============ Year ============ */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ============ Gallery (masonry + lightbox) ============ */
  // Curated order — mix of orientations and contexts.
  const photos = [
    { src: 'assets/img/photo_15.webp', alt: 'B&W studio — handstand with bow', caption: 'Studio · Bow' },
    { src: 'assets/img/photo_13.webp', alt: 'OVO performance — purple smoke', caption: 'Cirque du Soleil · OVO' },
    { src: 'assets/img/photo_10.webp', alt: 'Duo studio pose in black', caption: 'Studio · Duo' },
    { src: 'assets/img/photo_07.webp', alt: 'Cirque du Soleil performance on apparatus', caption: 'Cirque du Soleil' },
    { src: 'assets/img/photo_01.webp', alt: 'Handstand on a coffee table — editorial', caption: 'Editorial · Interior' },
    { src: 'assets/img/photo_11.webp', alt: 'Studio duo — sculptural pose', caption: 'Studio · Duo' },
    { src: 'assets/img/photo_04.webp', alt: 'Handstand in luxury interior', caption: 'Editorial · Interior' },
    { src: 'assets/img/photo_14.webp', alt: 'Cirque du Soleil performance close-up', caption: 'Cirque du Soleil' },
    { src: 'assets/img/photo_17.webp', alt: 'Studio editorial — black bodysuit', caption: 'Studio · Editorial' },
    { src: 'assets/img/photo_12.webp', alt: 'Studio portrait — contortion pose', caption: 'Studio · Portrait' },
    { src: 'assets/img/photo_02.webp', alt: 'Editorial portrait', caption: 'Editorial' },
    { src: 'assets/img/photo_03.webp', alt: 'Editorial portrait — wide', caption: 'Editorial' },
    { src: 'assets/img/photo_06.webp', alt: 'Studio session', caption: 'Studio' },
    { src: 'assets/img/photo_08.webp', alt: 'Studio session — vertical', caption: 'Studio' },
    { src: 'assets/img/photo_09.webp', alt: 'Editorial wide shot', caption: 'Editorial' },
    { src: 'assets/img/photo_16.webp', alt: 'Studio close-up', caption: 'Studio' },
    { src: 'assets/img/photo_05.webp', alt: 'Editorial — interior wide', caption: 'Editorial · Interior' }
  ];

  const masonry = document.getElementById('masonry');
  photos.forEach((p, i) => {
    const fig = document.createElement('figure');
    fig.className = 'masonry-item';
    fig.dataset.index = i;
    fig.innerHTML = `<img src="${p.src}" alt="${p.alt}" loading="lazy" />`;
    masonry.appendChild(fig);
  });

  /* Lightbox */
  const lb = document.getElementById('lightbox');
  const lbImg = lb.querySelector('img');
  const lbCap = lb.querySelector('figcaption');
  let current = 0;

  const showLB = (i) => {
    current = (i + photos.length) % photos.length;
    lbImg.src = photos[current].src;
    lbImg.alt = photos[current].alt;
    lbCap.textContent = photos[current].caption;
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const hideLB = () => {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  masonry.addEventListener('click', (e) => {
    const item = e.target.closest('.masonry-item');
    if (item) showLB(+item.dataset.index);
  });
  lb.querySelector('.lb-close').addEventListener('click', hideLB);
  lb.querySelector('.lb-prev').addEventListener('click', () => showLB(current - 1));
  lb.querySelector('.lb-next').addEventListener('click', () => showLB(current + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb) hideLB(); });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') hideLB();
    if (e.key === 'ArrowRight') showLB(current + 1);
    if (e.key === 'ArrowLeft') showLB(current - 1);
  });

  /* ============ Reveal on scroll ============ */
  const targets = document.querySelectorAll('.about-body, .about-image, .section-head, .booking-intro, .booking-form, .stat, .contact-inner');
  targets.forEach(t => t.classList.add('reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  targets.forEach(t => io.observe(t));

  /* ============ Booking form ============ */
  const form = document.getElementById('bookingForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    if (!name || !email) {
      form.querySelector('input:invalid')?.focus();
      return;
    }
    const lang = document.documentElement.dataset.lang || 'en';
    const msg = (dict[lang] && dict[lang]['form.success']) || dict.en['form.success'];
    const div = document.createElement('div');
    div.className = 'form-success';
    div.textContent = msg;
    form.replaceWith(div);
    // In a real deploy: POST to a Formspree/Resend endpoint.
  });
})();
