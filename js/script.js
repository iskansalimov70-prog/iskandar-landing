// Reveal-on-scroll for [data-reveal] elements
(function () {
  var els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  var reveal = function (el) {
    if (el.dataset.revealDone) return;
    el.dataset.revealDone = '1';
    el.classList.add('is-visible');
  };

  var revealInView = function () {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    els.forEach(function (el) {
      if (el.dataset.revealDone) return;
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.94 && r.bottom > 0) reveal(el);
    });
  };

  if (typeof IntersectionObserver !== 'undefined') {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          reveal(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  window.addEventListener('scroll', revealInView, { passive: true });
  window.addEventListener('resize', revealInView, { passive: true });
  requestAnimationFrame(revealInView);
  setTimeout(revealInView, 250);

  // Safety net: never leave content hidden
  setTimeout(function () {
    els.forEach(function (el) { reveal(el); });
  }, 1600);
})();

// Accordion (objections + FAQ) — single item open per group
(function () {
  var groups = document.querySelectorAll('[data-accordion]');
  groups.forEach(function (group) {
    var items = group.querySelectorAll('.acc-item');
    items.forEach(function (item) {
      var toggle = item.querySelector('.acc-toggle');
      var body = item.querySelector('.acc-body');

      toggle.addEventListener('click', function () {
        var isOpen = toggle.getAttribute('aria-expanded') === 'true';

        items.forEach(function (other) {
          var otherToggle = other.querySelector('.acc-toggle');
          var otherBody = other.querySelector('.acc-body');
          otherToggle.setAttribute('aria-expanded', 'false');
          otherBody.style.maxHeight = null;
          otherBody.style.opacity = '0';
        });

        if (!isOpen) {
          toggle.setAttribute('aria-expanded', 'true');
          body.style.maxHeight = body.scrollHeight + 'px';
          body.style.opacity = '1';
        }
      });
    });
  });

  window.addEventListener('resize', function () {
    document.querySelectorAll('.acc-toggle[aria-expanded="true"]').forEach(function (toggle) {
      var body = toggle.parentElement.querySelector('.acc-body');
      body.style.maxHeight = body.scrollHeight + 'px';
    });
  });
})();

// Social links — click bounce (hover reveal is pure CSS)
(function () {
  document.querySelectorAll('.social-link').forEach(function (link) {
    link.addEventListener('click', function () {
      var popup = link.querySelector('.social-link-popup');
      if (!popup) return;
      popup.classList.remove('is-bouncing');
      void popup.offsetWidth; // restart animation
      popup.classList.add('is-bouncing');
    });
  });
})();
