/* =========================================================
   SAiMON VISION — Home — funcionalidad interactiva
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) { try { window.lucide.createIcons(); } catch (e) {} }

  /* ---------- barra de progreso de scroll ---------- */
  (function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    function update() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = Math.min(100, pct).toFixed(2) + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  })();

  /* ---------- word-by-word reveal (hero title + cualquier [data-word-reveal]) ---------- */
  function applyWordReveal(el, { threshold = 0.12, fallbackMs = 0 } = {}) {
    if (!el) return;
    const rawHtml = el.innerHTML;
    const lines   = rawHtml.split(/<br\s*\/?>/i);
    let wordIndex = 0;

    el.innerHTML = lines.map((line, li) => {
      const words   = line.trim().split(/\s+/);
      const wrapped = words.map(word => {
        const span = `<span class="title-word" style="--wi:${wordIndex}"><span class="title-word-inner">${word}</span></span>`;
        wordIndex++;
        return span;
      }).join(' ');
      return li < lines.length - 1 ? wrapped + '<br>' : wrapped;
    }).join('');

    el.classList.remove('reveal', 'reveal-d1', 'reveal-d2', 'reveal-d3');

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.classList.add('words-visible'); io.disconnect(); }
    }, { threshold });
    io.observe(el);

    if (fallbackMs) setTimeout(() => el.classList.add('words-visible'), fallbackMs);
  }

  // Hero title (ya visible al cargar → fallback rápido)
  applyWordReveal(document.querySelector('.hero__title'), { fallbackMs: 600 });

  // Títulos con data-word-reveal (activados por scroll)
  document.querySelectorAll('[data-word-reveal]').forEach(el => applyWordReveal(el));

  /* ---------- hero cards: stagger al cargar ---------- */
  (function initHeroCardsStagger() {
    const cards = document.querySelector('[data-cards-stagger]');
    if (!cards) return;
    // Activar tras un breve delay para que la página haya pintado
    setTimeout(() => cards.classList.add('cards-active'), 300);
  })();

  /* ---------- contadores animados ---------- */
  (function initCounters() {
    const els = document.querySelectorAll('[data-counter]');
    if (!els.length) return;

    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

    function animateCounter(el) {
      const target   = parseFloat(el.getAttribute('data-counter'));
      const prefix   = el.getAttribute('data-counter-prefix')  || '';
      const suffix   = el.getAttribute('data-counter-suffix')  || '';
      const duration = 2000;
      const start    = performance.now();

      el.classList.add('counting');

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const value    = Math.floor(easeOutCubic(progress) * target);
        el.textContent = prefix + value.toLocaleString('es-MX') + suffix;
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = prefix + target.toLocaleString('es-MX') + suffix;
          el.classList.remove('counting');
        }
      }
      requestAnimationFrame(tick);
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    els.forEach(el => io.observe(el));
  })();

  /* ---------- header: smart scroll (hide↓ / float pill↑) ---------- */
  const header = document.querySelector('.header');
  const navLinks = [...document.querySelectorAll('.header__nav a[href^="#"]')];
  const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  let lastScrollY  = window.scrollY;
  let ticking      = false;

  const FLOAT_START = 80;   // px: a partir de aquí → pill flotante visible

  // HIDE_START = borde inferior del bloque de stats (188 / 22M+ / 340+)
  // Se recalcula al resize para que funcione en cualquier resolución
  let HIDE_START = 480;
  function calcHideStart() {
    const stats = document.querySelector('.stats');
    if (stats) {
      HIDE_START = stats.getBoundingClientRect().bottom + window.scrollY + 40;
    }
  }
  calcHideStart();
  window.addEventListener('resize', calcHideStart);

  function updateHeader() {
    const y         = window.scrollY;
    const delta     = y - lastScrollY;
    const goingDown = delta > 2;
    const goingUp   = delta < -2;

    // active nav link
    let activeIdx = 0;
    sections.forEach((s, i) => { if (s.getBoundingClientRect().top <= 80) activeIdx = i; });
    navLinks.forEach((a, i) => a.classList.toggle('is-active', i === activeIdx));

    if (y <= FLOAT_START) {
      // FASE 1 — al tope: header normal
      header.classList.remove('header--scrolled', 'header--hidden', 'header--floating');

    } else if (y > FLOAT_START && y <= HIDE_START) {
      // FASE 2 — zona media: pill flotante siempre visible
      header.classList.remove('header--hidden');
      header.classList.add('header--floating', 'header--scrolled');

    } else {
      // FASE 3 — zona profunda (> HIDE_START)
      if (goingDown) {
        // scroll↓: ocultar pill
        header.classList.add('header--hidden');
        header.classList.remove('header--floating');
      } else if (goingUp) {
        // scroll↑: reaparece como pill
        header.classList.remove('header--hidden');
        header.classList.add('header--floating', 'header--scrolled');
      }
    }

    lastScrollY = y;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateHeader); ticking = true; }
  }, { passive: true });
  updateHeader();

  /* ---------- reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }
  // safety: nothing should stay invisible
  setTimeout(() => revealEls.forEach((el) => el.classList.add('visible')), 1600);

  /* ---------- parallax suavizado con lerp ---------- */
  const parallaxEls = [...document.querySelectorAll('[data-parallax]')].map((el) => ({
    el,
    s:       parseFloat(el.getAttribute('data-parallax')) || 0,
    current: 0,
    target:  0,
  }));

  function calcParallaxTarget(el, s) {
    const r   = el.getBoundingClientRect();
    const off = r.top + r.height / 2 - window.innerHeight / 2;
    return -off * s;
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  let rafId = null;
  function parallaxLoop() {
    let needsUpdate = false;
    parallaxEls.forEach(item => {
      item.target  = calcParallaxTarget(item.el, item.s);
      item.current = lerp(item.current, item.target, 0.09);
      if (Math.abs(item.current - item.target) > 0.05) needsUpdate = true;
      const scale = (1 + Math.abs(item.s) * 0.9).toFixed(3);
      item.el.style.transform = `translate3d(0,${item.current.toFixed(2)}px,0) scale(${scale})`;
    });
    rafId = requestAnimationFrame(parallaxLoop);
  }
  parallaxLoop();

  /* ---------- ecosistema tecnológico: sticky scroll storytelling ---------- */
  (function initEcoScrollStory() {
    const track = document.querySelector('[data-eco-scroll-track]');
    if (!track) return;

    const panels  = [...track.querySelectorAll('[data-eco-panel]')];
    const dots    = [...track.querySelectorAll('[data-eco-dot]')];
    const fillEl  = track.querySelector('[data-eco-fill]');
    const STEPS   = panels.length;
    let currentStep = -1;

    function activate(step) {
      if (step === currentStep) return;
      currentStep = step;

      panels.forEach((el, i) => el.classList.toggle('is-active', i === step));

      dots.forEach((el, i) => {
        el.classList.toggle('is-active', i === step);
        el.classList.toggle('is-passed', i < step);
      });

      if (fillEl) fillEl.style.width = (STEPS > 1 ? (step / (STEPS - 1)) * 100 : 100).toFixed(1) + '%';

      // Play video activo, pausa los demás
      panels.forEach((panel, i) => {
        const video = panel.querySelector('video');
        if (!video) return;
        if (i === step) { video.play().catch(() => {}); }
        else { video.pause(); }
      });
    }

    function onScroll() {
      const rect       = track.getBoundingClientRect();
      const scrolled   = -rect.top;
      const scrollable = track.offsetHeight - window.innerHeight;

      if (scrolled <= 0)          { activate(0);         return; }
      if (scrolled >= scrollable) { activate(STEPS - 1); return; }

      const step = Math.min(STEPS - 1, Math.floor((scrolled / scrollable) * STEPS));
      activate(step);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Click en dot → scroll suave al paso correspondiente
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        const scrollable = track.offsetHeight - window.innerHeight;
        const trackTop   = track.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: trackTop + (idx / STEPS) * scrollable, behavior: 'smooth' });
      });
    });
  })();

  /* ---------- generic autoplay carousel (text + progress bar + optional bg) ---------- */
  function initTextCarousel({ rootSelector, items, intervalMs }) {
    const root = document.querySelector(rootSelector);
    if (!root) return;
    const titleEl = root.querySelector('[data-carousel-title]');
    const bodyEl  = root.querySelector('[data-carousel-body]');
    const countEl = root.querySelector('[data-carousel-count]');
    const fillEl  = root.querySelector('[data-carousel-fill]');

    // Busca fondo dinámico vinculado por el mismo nombre de carrusel
    const carouselName = root.getAttribute('data-carousel');
    const bgStack = document.querySelector(`[data-carousel-bg="${carouselName}"]`);
    const bgSlides = bgStack ? [...bgStack.querySelectorAll('.split-panel__bg-slide')] : [];

    let i = 0;
    function render() {
      const item = items[i];
      titleEl.textContent = item.name;
      bodyEl.textContent  = item.body;
      countEl.textContent = `${i + 1} / ${items.length}`;
      fillEl.style.width  = `${((i + 1) / items.length) * 100}%`;
      bgSlides.forEach((el, idx) => el.classList.toggle('is-active', idx === i));
    }
    render();
    setInterval(() => { i = (i + 1) % items.length; render(); }, intervalMs);
  }

  initTextCarousel({
    rootSelector: '[data-carousel="soluciones"]',
    intervalMs: 4500,
    items: [
      { name: 'Seguridad física', body: 'Videovigilancia inteligente, control de accesos y protección perimetral con detección proactiva por IA para resguardar personas y activos.' },
      { name: 'Inteligencia de datos', body: 'Business Intelligence que convierte cada evento en métricas accionables: afluencia, dwell-time y mermas evitadas, en tiempo real.' },
      { name: 'Gestión tecnológica', body: 'Integración y operación de infraestructura C4/C5 y robótica, orquestando dron, despacho y respuesta como un solo sistema.' }
    ]
  });

  initTextCarousel({
    rootSelector: '[data-carousel="privado"]',
    intervalMs: 4200,
    items: [
      { name: 'Empresas', body: 'Seguridad corporativa integral: control de accesos, videovigilancia inteligente y monitoreo continuo de instalaciones.' },
      { name: 'Residencial', body: 'Gestión residencial inteligente con detección proactiva y respuesta coordinada para fraccionamientos y condominios.' },
      { name: 'Industria', body: 'Monitoreo industrial y robótica aplicada para proteger plantas, almacenes y líneas de producción.' }
    ]
  });

  initTextCarousel({
    rootSelector: '[data-carousel="gobierno"]',
    intervalMs: 4800,
    items: [
      { name: 'Seguridad pública', body: 'Plataformas de videovigilancia e inteligencia para la prevención y respuesta ante incidentes en el espacio público.' },
      { name: 'Municipios', body: 'Infraestructura tecnológica municipal integrada a centros de comando para una gestión urbana más segura.' },
      { name: 'Movilidad urbana y penitenciario', body: 'Sistemas de monitoreo para movilidad urbana y seguridad en instalaciones penitenciarias.' }
    ]
  });

  /* ---------- modal de contacto ---------- */
  (function initContactModal() {
    const modal     = document.getElementById('contactModal');
    const form      = document.getElementById('contactForm');
    const submitBtn = document.getElementById('cfSubmit');
    const successEl = document.getElementById('cfSuccess');
    if (!modal || !form) return;

    /* — abrir / cerrar — */
    function openModal() {
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      // re-render lucide dentro del modal
      if (window.lucide) window.lucide.createIcons();
      // foco al primer campo
      setTimeout(() => {
        const first = modal.querySelector('input, textarea, button');
        if (first) first.focus();
      }, 120);
    }
    function closeModal() {
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    // triggers de apertura: botón "Contacto" en header + cualquier [data-modal-open="contact"]
    document.querySelectorAll('[data-modal-open="contact"]').forEach(el => {
      el.addEventListener('click', e => { e.preventDefault(); openModal(); });
    });

    // triggers de cierre: backdrop y botón X
    document.querySelectorAll('[data-modal-close]').forEach(el => {
      el.addEventListener('click', closeModal);
    });

    // tecla Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
    });

    /* — validación de campos — */
    function getError(input) {
      const val = input.value.trim();
      if (input.required && !val) return 'Este campo es requerido.';
      if (input.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
        return 'Ingresa un correo electrónico válido.';
      if (input.type === 'tel' && val) {
        const digits = val.replace(/\D/g, '');
        if (digits.length < 10 || digits.length > 15)
          return 'El teléfono debe tener entre 10 y 15 dígitos.';
      }
      return '';
    }

    function validateField(input) {
      const msg     = getError(input);
      const errorEl = input.closest('.contact-form__field').querySelector('.contact-form__error');
      if (errorEl) errorEl.textContent = msg;
      input.classList.toggle('is-error', !!msg);
      return !msg;
    }

    function validateAll() {
      const fields = [...form.querySelectorAll('input, textarea')];
      return fields.map(f => (f.required || f.value.trim()) ? validateField(f) : true)
                   .every(Boolean);
    }

    // validación en tiempo real
    form.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('is-error')) validateField(input);
      });
    });

    /* — envío — */
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!validateAll()) return;

      // estado loading
      submitBtn.setAttribute('data-loading', 'true');
      submitBtn.disabled = true;
      successEl.textContent = '';

      // simulación de llamada API (reemplazar por fetch real)
      await new Promise(r => setTimeout(r, 1800));

      // éxito
      submitBtn.removeAttribute('data-loading');
      submitBtn.disabled = false;
      form.reset();
      successEl.textContent = '✓ ¡Solicitud enviada! Te contactaremos en menos de 24 horas.';
      setTimeout(() => { successEl.textContent = ''; }, 6000);
    });
  })();

  /* ---------- robótica: reveal al entrar en viewport ---------- */
  (function initRoboticaReveal() {
    const section = document.querySelector('.robotica');
    if (!section) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        section.classList.add('in-view');
        io.disconnect();
      }
    }, { threshold: 0.08 });
    io.observe(section);
    // fallback
    setTimeout(() => section.classList.add('in-view'), 2000);
  })();

  /* ---------- robótica: parallax de fondo ---------- */
  (function initRoboticaParallax() {
    const stack = document.querySelector('[data-robo-parallax]');
    if (!stack) return;
    const STRENGTH = 0.13;   // qué tan pronunciado es el efecto
    let current = 0;
    let target  = 0;

    function lerp(a, b, t) { return a + (b - a) * t; }

    function update() {
      const rect   = stack.parentElement.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      target  = center * STRENGTH;
      current = lerp(current, target, 0.07);
      stack.style.transform = `translate3d(0, ${current.toFixed(2)}px, 0)`;
      requestAnimationFrame(update);
    }
    update();
  })();

  /* ---------- robótica: carousel with background swap + card stack + dots/arrows ---------- */
  (function initRoboticaCarousel() {
    const section = document.querySelector('.robotica');
    if (!section) return;
    const bgSlides = [...section.querySelectorAll('.robotica__bg-slide')];
    const cards = [...section.querySelectorAll('.robotica__card')];
    const dots = [...section.querySelectorAll('.robotica__dot')];
    const prevBtn = section.querySelector('[data-robo-prev]');
    const nextBtn = section.querySelector('[data-robo-next]');
    const count = cards.length;
    let i = 0;
    let iv = null;

    function render() {
      bgSlides.forEach((el, idx) => el.classList.toggle('is-active', idx === i));
      cards.forEach((el, idx) => el.classList.toggle('is-active', idx === i));
      dots.forEach((el, idx) => el.classList.toggle('is-active', idx === i));
    }
    function go(newIndex) {
      i = (newIndex + count) % count;
      render();
    }
    function startAutoplay() {
      clearInterval(iv);
      iv = setInterval(() => go(i + 1), 4300);
    }
    function restart(newIndex) {
      go(newIndex);
      startAutoplay();
    }

    prevBtn && prevBtn.addEventListener('click', () => restart(i - 1));
    nextBtn && nextBtn.addEventListener('click', () => restart(i + 1));
    dots.forEach((dot, idx) => dot.addEventListener('click', () => restart(idx)));

    render();
    startAutoplay();
  })();
});
