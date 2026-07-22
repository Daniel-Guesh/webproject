/**
 * DANIEL GUESH PORTFOLIO - script.js
 * Features: Dark mode, sticky nav, smooth scroll,
 *           scroll animations, skill bars, mobile menu,
 *           contact form, back-to-top button.
 */

// ─── DOM References ───────────────────────────────────────────────────────────
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const navLinks    = document.getElementById('navLinks');
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const backToTop   = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');
const skillFills  = document.querySelectorAll('.skill-fill');
const scrollItems = document.querySelectorAll('.animate-on-scroll');
const allNavLinks = document.querySelectorAll('.nav-link');
const sections    = document.querySelectorAll('section[id]');

// ─── Dark / Light Mode Toggle ─────────────────────────────────────────────────
/**
 * Reads saved preference from localStorage (or system preference)
 * and applies the correct theme on page load.
 */
(function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  applyTheme(theme);
})();

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  // Swap icon between moon (light mode) and sun (dark mode)
  themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  localStorage.setItem('theme', theme);
}

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

// ─── Sticky Navbar Shadow ─────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ─── Mobile Hamburger Menu ────────────────────────────────────────────────────
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  // Accessibility: toggle aria-expanded
  const isOpen = navLinks.classList.contains('open');
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// Close menu when clicking outside of it
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});

// ─── Active Nav Link on Scroll ────────────────────────────────────────────────
/**
 * Highlights the nav link that corresponds to the section
 * currently visible in the viewport.
 */
function updateActiveLink() {
  let current = '';
  sections.forEach(section => {
    const sectionTop    = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  allNavLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveLink);
updateActiveLink(); // Run once on load

// ─── Scroll-Triggered Animations (Intersection Observer) ─────────────────────
/**
 * Uses IntersectionObserver to add .visible class when elements
 * enter the viewport, triggering CSS fade-up transitions.
 */
const observerOptions = {
  root: null,
  rootMargin: '0px 0px -60px 0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Stagger siblings for a cascading effect
      const siblings = entry.target.parentElement.querySelectorAll('.animate-on-scroll');
      siblings.forEach((sibling, index) => {
        sibling.style.transitionDelay = `${index * 0.12}s`;
      });
      observer.unobserve(entry.target); // Animate once only
    }
  });
}, observerOptions);

scrollItems.forEach(item => observer.observe(item));

// ─── Skill Bar Animation ──────────────────────────────────────────────────────
/**
 * Animates skill progress bars when the skills section scrolls into view.
 * The target width is stored as a data attribute: data-width="85"
 */
const skillsSection = document.getElementById('skills');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      skillFills.forEach(fill => {
        const targetWidth = fill.getAttribute('data-width');
        // Small timeout so CSS transition picks it up
        setTimeout(() => {
          fill.style.width = targetWidth + '%';
        }, 200);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

if (skillsSection) skillObserver.observe(skillsSection);

// ─── Back to Top Button ───────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── Contact Form Submission ──────────────────────────────────────────────────
/**
 * Handles form submission with basic client-side validation.
 * Simulates a successful send (replace with real backend / EmailJS later).
 */
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  // Basic validation
  if (!name || !email || !message) {
    showFormFeedback('Please fill in all fields.', 'error');
    return;
  }

  if (!isValidEmail(email)) {
    showFormFeedback('Please enter a valid email address.', 'error');
    return;
  }

  // Simulate sending (replace with actual API call)
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

  setTimeout(() => {
    contactForm.reset();
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    showFormFeedback('Message sent successfully! I will get back to you soon.', 'success');
  }, 1500);
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormFeedback(msg, type) {
  formFeedback.textContent = msg;
  formFeedback.className = 'form-feedback ' + type;
  // Auto-clear feedback after 5 seconds
  setTimeout(() => {
    formFeedback.textContent = '';
    formFeedback.className = 'form-feedback';
  }, 5000);
}

// ─── Smooth Scroll for Anchor Links ──────────────────────────────────────────
/**
 * Adds smooth scrolling to all internal # links,
 * offsetting for the fixed navbar height.
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navbarHeight = navbar.offsetHeight;
    const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
    window.scrollTo({ top: targetPos, behavior: 'smooth' });
  });
});

// ─── Typing Effect on Hero Subtitle ──────────────────────────────────────────
/**
 * Optional: cycles through subtitle phrases for a dynamic feel.
 */
const subtitleEl = document.querySelector('.hero-subtitle');
const phrases = [
  'IT Student | Future Software Developer',
  'Problem Solver | Code Enthusiast',
  'Building Real-World Solutions'
];
let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;
let typingPaused = false;

function typeEffect() {
  if (typingPaused || !subtitleEl) return;

  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    subtitleEl.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    subtitleEl.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }

  let speed = isDeleting ? 50 : 90;

  if (!isDeleting && charIndex === currentPhrase.length) {
    // Pause at end of phrase
    speed = 2200;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    speed = 400;
  }

  setTimeout(typeEffect, speed);
}

// Start typing effect after 1.5s delay
setTimeout(typeEffect, 1500);

// ─── Console Easter Egg ────────────────────────────────────────────────────────
console.log('%c👋 Hey there, fellow developer!', 'color:#2563eb;font-size:16px;font-weight:bold;');
console.log('%cThis portfolio was built by Daniel Guesh with pure HTML, CSS & JavaScript.', 'color:#475569;font-size:13px;');
