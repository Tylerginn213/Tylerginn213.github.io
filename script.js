/**
 * ALEX CARTER — DIGITAL PORTFOLIO
 * script.js
 *
 * Features:
 *  1. Navigation — scroll state, active link highlighting, smooth scroll
 *  2. Hamburger menu — toggle mobile nav
 *  3. Scroll reveal — fade-in elements as they enter the viewport
 *  4. Skill bar animation — animate widths when About section is in view
 *  5. Contact form validation — client-side with accessible error messages
 *  6. Active section detection — highlights current nav link
 */

/* ============================================================
   1. NAVIGATION — SCROLL STATE
   ============================================================ */

const navbar = document.getElementById('navbar');

/**
 * Add/remove the .is-scrolled class based on scroll position.
 * This triggers the glassmorphism nav background.
 */
function handleNavScroll() {
  if (window.scrollY > 20) {
    navbar.classList.add('is-scrolled');
  } else {
    navbar.classList.remove('is-scrolled');
  }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll(); // Run on load in case page is already scrolled

/* ============================================================
   2. HAMBURGER MENU — MOBILE NAV TOGGLE
   ============================================================ */

const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.nav__mobile-link');

/**
 * Toggle the mobile menu open/closed.
 * Also manages ARIA attributes for accessibility.
 */
function toggleMenu(isOpen) {
  hamburger.classList.toggle('is-open', isOpen);
  mobileMenu.classList.toggle('is-open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));

  // Prevent body scroll when menu is open
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

hamburger.addEventListener('click', () => {
  const isCurrentlyOpen = hamburger.classList.contains('is-open');
  toggleMenu(!isCurrentlyOpen);
});

// Close menu when a mobile nav link is clicked
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    toggleMenu(false);
  });
});

// Close menu on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && hamburger.classList.contains('is-open')) {
    toggleMenu(false);
    hamburger.focus();
  }
});

/* ============================================================
   3. SCROLL REVEAL — INTERSECTION OBSERVER
   ============================================================ */

/**
 * IntersectionObserver watches all .reveal-up elements.
 * When they enter the viewport (threshold 15%), .is-visible is added,
 * which triggers the CSS fade-up transition.
 */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Unobserve once revealed — no need to watch it again
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,   // Trigger when 12% of element is visible
    rootMargin: '0px 0px -40px 0px'  // Slight bottom offset for natural feel
  }
);

// Observe all elements with the reveal-up class
document.querySelectorAll('.reveal-up').forEach(el => {
  revealObserver.observe(el);
});

/* ============================================================
   4. SKILL BAR ANIMATION
   ============================================================ */

/**
 * The skill bars start at width: 0 (set in CSS).
 * When the skills section enters the viewport, we apply
 * the target width via a CSS custom property, triggering
 * the CSS transition animation.
 */
const skillBars = document.querySelectorAll('.skill-bar__fill');
let skillsAnimated = false;

const skillsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !skillsAnimated) {
        skillsAnimated = true;

        // Stagger the animation of each bar slightly
        skillBars.forEach((bar, index) => {
          setTimeout(() => {
            // The target width is stored as --w in the inline style
            const targetWidth = bar.style.getPropertyValue('--w');
            bar.style.width = targetWidth;
          }, index * 120);
        });

        skillsObserver.disconnect();
      }
    });
  },
  { threshold: 0.2 }
);

const aboutSection = document.getElementById('about');
if (aboutSection) skillsObserver.observe(aboutSection);

/* ============================================================
   5. ACTIVE NAV LINK — SECTION TRACKING
   ============================================================ */

/**
 * Tracks which section is currently in view and highlights
 * the corresponding desktop nav link with .is-active.
 */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav__link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');

        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('is-active');
          } else {
            link.classList.remove('is-active');
          }
        });
      }
    });
  },
  {
    // Section is "active" when it occupies the middle 40% of the viewport
    rootMargin: '-30% 0px -60% 0px'
  }
);

sections.forEach(section => sectionObserver.observe(section));

/* ============================================================
   6. CONTACT FORM VALIDATION
   ============================================================ */

const contactForm  = document.getElementById('contactForm');
const formSuccess  = document.getElementById('formSuccess');

// Input references
const nameInput    = document.getElementById('name');
const emailInput   = document.getElementById('email');
const messageInput = document.getElementById('message');

// Error span references
const nameError    = document.getElementById('nameError');
const emailError   = document.getElementById('emailError');
const messageError = document.getElementById('messageError');

/**
 * Simple email regex validation.
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Mark a field as errored and display the error message.
 */
function showError(input, errorEl, message) {
  input.classList.add('is-error');
  errorEl.textContent = message;
}

/**
 * Clear the error state from a field.
 */
function clearError(input, errorEl) {
  input.classList.remove('is-error');
  errorEl.textContent = '';
}

/**
 * Validate all form fields.
 * Returns true if the form is valid, false otherwise.
 */
function validateForm() {
  let valid = true;

  // Name: required, min 2 chars
  if (nameInput.value.trim().length < 2) {
    showError(nameInput, nameError, 'Please enter your full name.');
    valid = false;
  } else {
    clearError(nameInput, nameError);
  }

  // Email: required, valid format
  if (!emailInput.value.trim()) {
    showError(emailInput, emailError, 'Please enter your email address.');
    valid = false;
  } else if (!isValidEmail(emailInput.value)) {
    showError(emailInput, emailError, 'Please enter a valid email address.');
    valid = false;
  } else {
    clearError(emailInput, emailError);
  }

  // Message: required, min 10 chars
  if (messageInput.value.trim().length < 10) {
    showError(messageInput, messageError, 'Please enter a message (at least 10 characters).');
    valid = false;
  } else {
    clearError(messageInput, messageError);
  }

  return valid;
}

// Live validation — clear errors as the user types
[nameInput, emailInput, messageInput].forEach(input => {
  input.addEventListener('input', () => {
    input.classList.remove('is-error');
    const errorEl = document.getElementById(input.id + 'Error');
    if (errorEl) errorEl.textContent = '';
  });
});

/**
 * Handle form submission.
 * In a real deployment, replace the timeout with a fetch() to your backend.
 */
contactForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Always prevent default

  // Hide any previous success message
  formSuccess.classList.remove('is-visible');

  if (!validateForm()) return; // Stop if invalid

  // Simulate a network request (replace with real API call in production)
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const btnText   = submitBtn.querySelector('.btn__text');

  submitBtn.disabled = true;
  btnText.textContent = 'Sending…';

  setTimeout(() => {
    // Success state
    submitBtn.disabled = false;
    btnText.textContent = 'Send Message';

    formSuccess.textContent = '✓ Message sent! Thank you — I\'ll be in touch soon.';
    formSuccess.classList.add('is-visible');

    // Reset the form
    contactForm.reset();

    // Scroll success message into view
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Hide success message after 6 seconds
    setTimeout(() => {
      formSuccess.classList.remove('is-visible');
    }, 6000);

  }, 1200); // Simulated 1.2s delay
});

/* ============================================================
   7. SMOOTH SCROLL — ANCHOR LINKS
   ============================================================ */

/**
 * Ensure all anchor links scroll smoothly and account for
 * the fixed navigation height so content isn't hidden behind it.
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');

    // Handle '#' (top of page) separately
    if (targetId === '#') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;

    e.preventDefault();

    const navHeight = navbar.offsetHeight;
    const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 8;

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: 'smooth'
    });
  });
});

/* ============================================================
   8. PROJECT CARD — SUBTLE TILT EFFECT (desktop only)
   ============================================================ */

/**
 * Adds a subtle 3D tilt on mouse move for project cards.
 * Only runs on non-touch devices.
 */
if (window.matchMedia('(hover: hover)').matches) {
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const centerX = rect.left + rect.width  / 2;
      const centerY = rect.top  + rect.height / 2;

      // Clamp rotation to ±3 degrees
      const rotateY = Math.max(-3, Math.min(3, ((e.clientX - centerX) / rect.width)  * 6));
      const rotateX = Math.max(-3, Math.min(3, ((e.clientY - centerY) / rect.height) * -6));

      card.style.transform     = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      card.style.transition    = 'transform 0.08s ease, box-shadow 0.08s ease';
      card.style.boxShadow     = '0 20px 60px rgba(18,16,14,0.12)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
      card.style.boxShadow  = '';
    });
  });
}

/* ============================================================
   9. QUAL CARDS — STAGGER REVEAL
   ============================================================ */

/**
 * Extra stagger for qualification cards — each card gets
 * a slightly longer delay so they cascade in nicely.
 */
document.querySelectorAll('.qual-card').forEach((card, i) => {
  card.style.setProperty('--delay', `${i * 0.07}s`);
});

/* ============================================================
   10. INTEREST CARDS — STAGGER REVEAL
   ============================================================ */

document.querySelectorAll('.interest-card').forEach((card, i) => {
  card.style.setProperty('--delay', `${i * 0.06}s`);
});

/* ============================================================
   11. INIT — Log to console for portfolio authenticity
   ============================================================ */

console.log(
  '%c Alex Carter — Portfolio %c\n' +
  'Built with HTML5, CSS3 & Vanilla JS\n' +
  'BTEC IT Level 3 — Unit 3: A Digital Portfolio\n' +
  'Applying for apprenticeship at Konnekted 🚀',
  'background:#D95C2B;color:#fff;padding:4px 8px;border-radius:4px;font-weight:bold;',
  'color:#D95C2B'
);
