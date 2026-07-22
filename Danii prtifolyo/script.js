/* =========================================================
   DANIEL GUESH — PORTFOLIO SCRIPT
   Handles: dark mode toggle, mobile navigation, sticky navbar,
   scroll fade-in animations, animated skill bars, typing effect,
   and a simple contact form handler.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Dark Mode Toggle ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;

  // Restore previously saved theme preference (in-memory for this session)
  const applyTheme = (isDark) => {
    body.classList.toggle('dark', isDark);
  };

  // Default to the visitor's system preference on first load
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark);

  themeToggle.addEventListener('click', () => {
    applyTheme(!body.classList.contains('dark'));
  });

  /* ---------- 2. Mobile Navigation Menu ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('is-open');
    navLinks.classList.toggle('is-open');
  });

  // Close the mobile menu whenever a link is tapped
  navLinks.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('is-open');
      navLinks.classList.remove('is-open');
    });
  });

  /* ---------- 3. Sticky Navbar Shadow on Scroll ---------- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 10
      ? '0 4px 16px rgba(30, 58, 138, 0.08)'
      : 'none';
  });

  /* ---------- 4. Scroll-Triggered Fade-In Animations ---------- */
  const fadeEls = document.querySelectorAll('.fade-in');
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  fadeEls.forEach((el) => fadeObserver.observe(el));

  /* ---------- 5. Animated Skill Progress Bars ---------- */
  const skillBars = document.querySelectorAll('.skill-bar__fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = bar.dataset.width + '%';
        skillObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.4 });

  skillBars.forEach((bar) => skillObserver.observe(bar));

  /* ---------- 6. Hero Typing Effect ---------- */
  const typedCodeEl = document.getElementById('typedCode');
  const codeSnippet =
`const developer = {
  name: "Daniel Guesh",
  role: "IT Student",
  goal: "Software Engineer",
  skills: ["JS", "Python", "Java", "SQL"],
  learning: true
};`;

  let charIndex = 0;
  function typeCode() {
    if (charIndex <= codeSnippet.length) {
      typedCodeEl.textContent = codeSnippet.slice(0, charIndex);
      charIndex++;
      setTimeout(typeCode, 22);
    }
  }
  typeCode();

  /* ---------- 7. Contact Form Handling ---------- */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic client-side validation is handled by the "required" attributes.
    // This is a front-end only demo: connect this to a real backend or
    // a form service (e.g. Formspree) to actually deliver messages.
    formStatus.textContent = 'Thanks for your message! I\u2019ll get back to you soon.';
    formStatus.style.color = '#22c55e';
    contactForm.reset();

    setTimeout(() => { formStatus.textContent = ''; }, 5000);
  });

  /* ---------- 8. Download CV Placeholder ---------- */
  const downloadCV = document.getElementById('downloadCV');
  downloadCV.addEventListener('click', (e) => {
    // Replace '#' in the HTML with a real path to a CV file (e.g. "assets/Daniel_Guesh_CV.pdf")
    // to enable an actual download. For now we let the user know it's a placeholder.
    if (downloadCV.getAttribute('href') === '#') {
      e.preventDefault();
      alert('Add your CV file link here (e.g. assets/Daniel_Guesh_CV.pdf) to enable downloading.');
    }
  });

});
