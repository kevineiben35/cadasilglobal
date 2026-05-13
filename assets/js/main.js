/* CADASIL Global Foundation — Site Scripts */
(function () {
  'use strict';

  /* ---------- Sticky header shadow on scroll ---------- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 12) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile nav toggle ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');
  if (toggle && navList) {
    toggle.addEventListener('click', () => {
      const open = navList.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    navList.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navList.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    if (!btn) return;
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', () => {
      const isOpen = item.getAttribute('aria-expanded') === 'true';
      item.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    });
  });

  /* ---------- Active TOC highlight ---------- */
  const tocLinks = document.querySelectorAll('.article-toc a[href^="#"]');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    const targets = Array.from(tocLinks)
      .map(a => document.getElementById(a.getAttribute('href').slice(1)))
      .filter(Boolean);
    const tocIO = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          tocLinks.forEach(l => l.classList.remove('active'));
          const link = document.querySelector(`.article-toc a[href="#${entry.target.id}"]`);
          if (link) link.classList.add('active');
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    targets.forEach(t => tocIO.observe(t));
  }

  /* ---------- Animated stat counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const fmt = n => new Intl.NumberFormat('en-CA').format(Math.round(n));
    const animate = el => {
      const target = parseFloat(el.getAttribute('data-count'));
      const suffix = el.getAttribute('data-suffix') || '';
      const prefix = el.getAttribute('data-prefix') || '';
      const dur = 1400;
      const start = performance.now();
      const tick = now => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        const v = target * eased;
        el.textContent = prefix + fmt(v) + suffix;
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = prefix + fmt(target) + suffix;
      };
      requestAnimationFrame(tick);
    };
    const cIO = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(entry.target);
          cIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(c => cIO.observe(c));
  }

  /* ---------- Contact / get-involved form (no backend) ---------- */
  document.querySelectorAll('form[data-form]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const status = form.querySelector('.form-status');
      const data = new FormData(form);
      const subject = encodeURIComponent('Website inquiry — CADASIL Global Foundation');
      const lines = [];
      data.forEach((v, k) => {
        if (typeof v === 'string') lines.push(`${k}: ${v}`);
      });
      const body = encodeURIComponent(lines.join('\n'));
      window.location.href = `mailto:hello@cadasilglobal.org?subject=${subject}&body=${body}`;
      if (status) {
        status.classList.add('show');
        status.textContent = 'Thank you — your email client should open with your message ready to send. If not, please email hello@cadasilglobal.org directly.';
      }
      form.reset();
    });
  });

  /* ---------- Mark current nav link ---------- */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-list a, .footer-list a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html') || (path === '/' && href === 'index.html')) {
      a.setAttribute('aria-current', 'page');
    }
  });

  /* ---------- Year auto-update ---------- */
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Google Translate widget ---------- */
  if (header && !document.getElementById('google_translate_element')) {
    const bar = document.createElement('div');
    bar.className = 'lang-bar';
    bar.innerHTML = '<div class="lang-bar-inner"><span class="lang-bar-label">Translate:</span><div id="google_translate_element"></div></div>';
    header.insertAdjacentElement('afterend', bar);

    window.googleTranslateElementInit = function () {
      new google.translate.TranslateElement({
        pageLanguage: 'en',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, 'google_translate_element');
    };

    const s = document.createElement('script');
    s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.async = true;
    document.head.appendChild(s);
  }
})();
