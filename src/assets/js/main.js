/* =====================================================
   Main — Interactivity & Nav
   ===================================================== */
(function() {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Active nav highlighting on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // Sidebar card clicks → fly to map pin
  document.querySelectorAll('.sidebar-card').forEach(card => {
    card.addEventListener('click', () => {
      const index = parseInt(card.dataset.index, 10);
      if (typeof window.flyToInterview === 'function') {
        window.flyToInterview(index);
      }
    });
  });

  // Glossary scroll-reveal animation
  const glossaryCards = document.querySelectorAll('.glossary-card');
  if (glossaryCards.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    glossaryCards.forEach(function(card) { observer.observe(card); });
  } else {
    glossaryCards.forEach(function(card) { card.classList.add('visible'); });
  }

  // Form submission feedback
  const form = document.querySelector('.request-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      // Netlify handles the actual submission
      // Show a quick thank-you state
      setTimeout(() => {
        const btn = form.querySelector('.form-submit');
        if (btn) {
          btn.textContent = 'Sent! 🍎';
          btn.disabled = true;
        }
      }, 100);
    });
  }
})();
