document.addEventListener('DOMContentLoaded', function () {
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');

  function setNavOpen(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('nav-open', open);
  }

  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setNavOpen(!nav.classList.contains('open'));
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setNavOpen(false);
      });
    });

    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') setNavOpen(false);
    });

    document.addEventListener('click', function (ev) {
      if (!nav.classList.contains('open')) return;
      if (header && header.contains(ev.target)) return;
      setNavOpen(false);
    });
  }

  var revealEls = document.querySelectorAll('.section-head, .about-grid, .photo-pair, .photo-banner, .photo-break, .pillar-grid, .preview-grid, .explore-layout, .cred-row, .approach-list, .principle-list, .values-list, .stat-grid, .milestone-rail, .outcome-grid, .report-grid, .contact-form, .contact-cta, .side-panel, .quote-stack, .partner-grid, .role-grid, .doc-list, .news-card, .step-list');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealEls.forEach(function (el) { el.classList.add('reveal'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  // Privacy-friendly analytics: only after consent.
  // Set window.WORD_ANALYTICS_SRC to your Plausible/Umami/etc. script URL when ready.
  function loadAnalytics() {
    if (!window.WORD_ANALYTICS_SRC || document.getElementById('word-analytics')) return;
    var s = document.createElement('script');
    s.id = 'word-analytics';
    s.defer = true;
    s.src = window.WORD_ANALYTICS_SRC;
    if (window.WORD_ANALYTICS_DOMAIN) s.setAttribute('data-domain', window.WORD_ANALYTICS_DOMAIN);
    document.head.appendChild(s);
  }

  function setupConsent() {
    var key = 'word-analytics-consent';
    var privacyHref = 'privacy.html';
    var existing = null;
    try { existing = localStorage.getItem(key); } catch (e) {}
    if (existing === 'yes') { loadAnalytics(); return; }
    if (existing === 'no') return;

    var banner = document.createElement('div');
    banner.className = 'consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Analytics consent');
    banner.innerHTML = '<div class="consent-inner"><p>We use optional privacy-friendly analytics to understand which pages help people find WORD. No ads. No sale of data. See our <a href="' + privacyHref + '" style="color:var(--gold)">privacy policy</a>.</p><div class="consent-actions"><button type="button" class="consent-accept">Accept</button><button type="button" class="consent-decline">Decline</button></div></div>';
    document.body.appendChild(banner);
    requestAnimationFrame(function () { banner.classList.add('is-visible'); });

    banner.querySelector('.consent-accept').addEventListener('click', function () {
      try { localStorage.setItem(key, 'yes'); } catch (e) {}
      banner.classList.remove('is-visible');
      loadAnalytics();
      setTimeout(function () { banner.remove(); }, 400);
    });
    banner.querySelector('.consent-decline').addEventListener('click', function () {
      try { localStorage.setItem(key, 'no'); } catch (e) {}
      banner.classList.remove('is-visible');
      setTimeout(function () { banner.remove(); }, 400);
    });
  }
  setupConsent();

  var contactForm = document.querySelector('.contact-form');
  if (!contactForm) return;

  function showFieldError(field, message) {
    var id = field.id ? field.id + '-error' : null;
    if (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = message || '';
      field.setAttribute('aria-describedby', id);
    }
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
  }

  function clearFieldError(field) {
    var id = field.id ? field.id + '-error' : null;
    if (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = '';
    }
    field.classList.remove('error');
    field.removeAttribute('aria-invalid');
  }

  function clearAllErrors(form) {
    form.querySelectorAll('input,select,textarea').forEach(function (f) {
      clearFieldError(f);
    });
  }

  contactForm.setAttribute('novalidate', '');

  contactForm.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var statusEl = document.getElementById('form-status');
    var submitBtn = contactForm.querySelector('[type="submit"]');

    if (statusEl) {
      statusEl.textContent = 'Sending…';
      statusEl.classList.remove('error', 'success');
    }

    clearAllErrors(contactForm);

    var elements = Array.from(contactForm.querySelectorAll('input,select,textarea'))
      .filter(function (el) { return el.willValidate; });
    var firstInvalid = null;
    elements.forEach(function (el) {
      if (!el.checkValidity()) {
        if (!firstInvalid) firstInvalid = el;
        var msg = el.validationMessage;
        if (el.tagName === 'SELECT' && !el.value) msg = 'Please select a topic.';
        showFieldError(el, msg);
      }
    });

    if (firstInvalid) {
      if (statusEl) {
        statusEl.textContent = 'Please correct the highlighted fields.';
        statusEl.classList.add('error');
      }
      firstInvalid.focus();
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('is-loading');
      submitBtn.dataset.label = submitBtn.textContent;
      submitBtn.textContent = 'Sending…';
    }

    fetch(contactForm.action, {
      method: contactForm.method || 'POST',
      body: new FormData(contactForm),
      headers: { Accept: 'application/json' }
    }).then(function (resp) {
      if (resp.ok) return resp.json().catch(function () { return {}; });
      return resp.text().then(function (text) {
        throw new Error(text || resp.statusText);
      });
    }).then(function () {
      if (statusEl) {
        statusEl.textContent = 'Thanks — your message was sent.';
        statusEl.classList.add('success');
      }
      contactForm.reset();
      window.location.href = 'thanks.html';
    }).catch(function (err) {
      if (statusEl) {
        statusEl.textContent = 'Sorry — there was a problem sending your message. Please try again or email word94091@gmail.com.';
        statusEl.classList.add('error');
      }
      console.error('Form submit error:', err);
    }).finally(function () {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('is-loading');
        if (submitBtn.dataset.label) submitBtn.textContent = submitBtn.dataset.label;
      }
    });
  });

  contactForm.addEventListener('input', function (ev) {
    var t = ev.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT')) {
      clearFieldError(t);
    }
  });
});
