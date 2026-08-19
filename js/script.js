/* ============================================
   SATNAM SINGH — PORTFOLIO JAVASCRIPT
   ============================================ */

(function () {
  'use strict';

  /* ---------- DOM REFERENCES ---------- */
  const loader = document.getElementById('loader');
  const scrollProgress = document.getElementById('scrollProgress');
  const mainNav = document.getElementById('mainNav');
  const navToggler = document.getElementById('navToggler');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.navbar .nav-link');
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const backToTop = document.getElementById('backToTop');
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const downloadResume = document.getElementById('downloadResume');
  const heroCanvas = document.getElementById('heroCanvas');

  /* ---------- LOADER ---------- */
  window.addEventListener('load', function () {
    if (loader) {
      loader.classList.add('hidden');
    }
  });

  /* Fallback: hide loader after 3 seconds even if load event is delayed */
  setTimeout(function () {
    if (loader && !loader.classList.contains('hidden')) {
      loader.classList.add('hidden');
    }
  }, 3000);

  /* ---------- SCROLL PROGRESS BAR ---------- */
  function updateScrollProgress() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      var progress = (scrollTop / docHeight) * 100;
      scrollProgress.style.width = progress + '%';
    }
  }

  /* ---------- NAVBAR SCROLL BEHAVIOR ---------- */
  function handleNavScroll() {
    if (window.scrollY > 50) {
      mainNav.classList.add('scrolled');
    } else {
      mainNav.classList.remove('scrolled');
    }
  }

  /* ---------- BACK TO TOP VISIBILITY ---------- */
  function handleBackToTop() {
    if (window.scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  /* Combined scroll handler for performance */
  var scrollTicking = false;
  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      window.requestAnimationFrame(function () {
        updateScrollProgress();
        handleNavScroll();
        handleBackToTop();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  /* ---------- BACK TO TOP CLICK ---------- */
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- ACTIVE NAV LINK HIGHLIGHTING ---------- */
  var sections = document.querySelectorAll('section[id]');

  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute('id');
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  });

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });

  /* ---------- CLOSE MOBILE NAV ON LINK CLICK ---------- */
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (navMenu.classList.contains('show')) {
        var bsCollapse = bootstrap.Collapse.getInstance(navMenu);
        if (bsCollapse) {
          bsCollapse.hide();
        }
        navToggler.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* ---------- THEME TOGGLE ---------- */
  var currentTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(currentTheme);

  themeToggle.addEventListener('click', function () {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(currentTheme);
    localStorage.setItem('theme', currentTheme);
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      themeIcon.className = 'fas fa-sun';
    } else {
      themeIcon.className = 'fas fa-moon';
    }
  }

  /* ---------- DOWNLOAD RESUME (PLACEHOLDER) ---------- */
  downloadResume.addEventListener('click', function (e) {
    e.preventDefault();
    // Replace '#' with actual resume file path when available
    // Example: window.location.href = 'assets/resume.pdf';
    showToast('Resume will be available for download soon.');
  });

  /* ---------- SCROLL REVEAL ANIMATIONS ---------- */
  var revealElements = document.querySelectorAll('[data-reveal]');

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var delay = parseInt(entry.target.getAttribute('data-delay')) || 0;
        setTimeout(function () {
          entry.target.classList.add('revealed');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ---------- ANIMATED COUNTERS ---------- */
  var counters = document.querySelectorAll('.counter');
  var countersAnimated = false;

  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        animateCounters();
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  /* Observe the stats grid parent */
  var statsGrid = document.querySelector('.stats-grid');
  if (statsGrid) {
    counterObserver.observe(statsGrid);
  }

  function animateCounters() {
    counters.forEach(function (counter) {
      var target = parseInt(counter.getAttribute('data-target'));
      var duration = 2000;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        /* Ease-out cubic for smooth deceleration */
        var eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(eased * target);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          counter.textContent = target;
        }
      }

      window.requestAnimationFrame(step);
    });
  }

  /* ---------- CONTACT FORM VALIDATION ---------- */
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateForm()) {
        contactForm.hidden = true;
        formSuccess.hidden = false;
        contactForm.reset();
        clearValidation();
      }
    });

    /* Live validation on blur */
    var formInputs = contactForm.querySelectorAll('.form-input');
    formInputs.forEach(function (input) {
      input.addEventListener('blur', function () {
        validateField(input);
      });

      /* Clear error on input */
      input.addEventListener('input', function () {
        if (input.classList.contains('invalid')) {
          input.classList.remove('invalid');
          var errorEl = document.getElementById(input.name + 'Error');
          if (errorEl) errorEl.textContent = '';
        }
      });
    });
  }

  function validateForm() {
    var isValid = true;
    var nameInput = document.getElementById('formName');
    var emailInput = document.getElementById('formEmail');
    var subjectInput = document.getElementById('formSubject');
    var messageInput = document.getElementById('formMessage');

    if (!validateField(nameInput)) isValid = false;
    if (!validateField(emailInput)) isValid = false;
    if (!validateField(subjectInput)) isValid = false;
    if (!validateField(messageInput)) isValid = false;

    return isValid;
  }

  function validateField(input) {
    var errorEl = document.getElementById(input.name + 'Error');
    var value = input.value.trim();
    var errorMsg = '';

    if (input.required && !value) {
      errorMsg = 'This field is required.';
    } else if (input.type === 'email' && value) {
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMsg = 'Please enter a valid email address.';
      }
    } else if (input.minLength > 0 && value && value.length < input.minLength) {
      errorMsg = 'Minimum ' + input.minLength + ' characters required.';
    }

    if (errorMsg) {
      input.classList.add('invalid');
      if (errorEl) errorEl.textContent = errorMsg;
      return false;
    } else {
      input.classList.remove('invalid');
      if (errorEl) errorEl.textContent = '';
      return true;
    }
  }

  function clearValidation() {
    var inputs = contactForm.querySelectorAll('.form-input');
    inputs.forEach(function (input) {
      input.classList.remove('invalid');
    });
    var errors = contactForm.querySelectorAll('.form-error');
    errors.forEach(function (err) {
      err.textContent = '';
    });
  }

  /* ---------- TOAST NOTIFICATION ---------- */
  function showToast(message) {
    /* Remove existing toast if any */
    var existing = document.querySelector('.custom-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = message;
    toast.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(20px);' +
      'background:var(--bg-card);color:var(--text-primary);padding:14px 28px;border-radius:8px;' +
      'font-family:var(--font-display);font-size:0.85rem;font-weight:500;' +
      'border:1px solid var(--border-color-strong);box-shadow:0 8px 30px rgba(0,0,0,0.3);' +
      'z-index:10000;opacity:0;transition:opacity 0.3s ease, transform 0.3s ease;';

    document.body.appendChild(toast);

    /* Trigger animation */
    requestAnimationFrame(function () {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    /* Auto dismiss */
    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(function () {
        toast.remove();
      }, 300);
    }, 3000);
  }

  /* ---------- HERO CANVAS PARTICLES ---------- */
  if (heroCanvas) {
    var ctx = heroCanvas.getContext('2d');
    var particles = [];
    var particleCount = 30;
    var animationId = null;

    function resizeCanvas() {
      var section = heroCanvas.parentElement;
      heroCanvas.width = section.offsetWidth;
      heroCanvas.height = section.offsetHeight;
    }

    function createParticle() {
      return {
        x: Math.random() * heroCanvas.width,
        y: Math.random() * heroCanvas.height,
        radius: Math.max(0.5, Math.random() * 1.8),
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.1
      };
    }

    function initParticles() {
      particles = [];
      for (var i = 0; i < particleCount; i++) {
        particles.push(createParticle());
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);

      /* Determine accent color based on theme */
      var isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      var dotColor = isDark ? '0, 168, 232' : '0, 119, 182';

      particles.forEach(function (p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.radius), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + dotColor + ',' + p.opacity + ')';
        ctx.fill();

        /* Move particle */
        p.x += p.speedX;
        p.y += p.speedY;

        /* Wrap around edges */
        if (p.x < -10) p.x = heroCanvas.width + 10;
        if (p.x > heroCanvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = heroCanvas.height + 10;
        if (p.y > heroCanvas.height + 10) p.y = -10;
      });

      /* Draw connections between nearby particles */
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            var lineOpacity = (1 - dist / 150) * 0.08;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(' + dotColor + ',' + lineOpacity + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(drawParticles);
    }

    /* Check for reduced motion preference */
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function handleMotionPreference() {
      if (prefersReducedMotion.matches) {
        if (animationId) cancelAnimationFrame(animationId);
        ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
      } else {
        resizeCanvas();
        initParticles();
        drawParticles();
      }
    }

    prefersReducedMotion.addEventListener('change', handleMotionPreference);

    window.addEventListener('resize', function () {
      resizeCanvas();
    });

    handleMotionPreference();
  }

  /* ---------- SMOOTH SCROLL FOR ANCHOR LINKS (fallback) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId && targetId.length > 1) {
        var targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

})();
