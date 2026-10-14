/**
 * SUBATHRA R - PORTFOLIO JAVASCRIPT
 * Modern, lightning-fast interactivity and smooth UX animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initAmbientCanvas();
  initNavbarScroll();
  initMobileMenu();
  initTypewriter();
  initStatsCounter();
  initSkillsFilter();
  initProjectsFilter();
  initProjectModals();
  initTimelineTabs();
  initContactForm();
  initCopyEmail();
  initBackToTop();
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

/* ==========================================================================
   1. Theme Management (Dark / Light)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const storedTheme = localStorage.getItem('portfolio-theme');
  
  const currentTheme = storedTheme || (prefersDark ? 'dark' : 'light');
  applyTheme(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('portfolio-theme', theme);
  
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (themeToggleBtn) {
    if (theme === 'light') {
      themeToggleBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
      themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
      themeToggleBtn.setAttribute('aria-label', 'Switch to Dark Mode');
    } else {
      themeToggleBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
      themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
      themeToggleBtn.setAttribute('aria-label', 'Switch to Light Mode');
    }
  }
}

/* ==========================================================================
   2. Interactive Ambient Canvas (Constellation / Network Effect)
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(Math.floor(window.innerWidth / 18), 65);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 1.8 + 0.8,
    });
  }

  let mouse = { x: null, y: null, maxDistance: 130 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function render() {
    ctx.clearRect(0, 0, width, height);

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const dotColor = isLight ? 'rgba(99, 102, 241, 0.45)' : 'rgba(129, 140, 248, 0.35)';
    const lineColor = isLight ? '99, 102, 241' : '129, 140, 248';

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = dotColor;
      ctx.fill();

      // Connect with mouse
      if (mouse.x !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.maxDistance) {
          const alpha = (1 - dist / mouse.maxDistance) * 0.25;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${lineColor}, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const alpha = (1 - dist / 110) * 0.15;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${lineColor}, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   3. Navbar Scroll & Active Section Spy
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let currentSectionId = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   4. Mobile Menu Drawer
   ========================================================================== */
function initMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!hamburgerBtn || !mobileDrawer || !mobileOverlay) return;

  function toggleMenu(open) {
    const isOpen = open !== undefined ? open : !mobileDrawer.classList.contains('active');
    hamburgerBtn.classList.toggle('active', isOpen);
    mobileDrawer.classList.toggle('active', isOpen);
    mobileOverlay.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  hamburgerBtn.addEventListener('click', () => toggleMenu());
  mobileOverlay.addEventListener('click', () => toggleMenu(false));

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => toggleMenu(false));
  });
}

/* ==========================================================================
   5. Dynamic Typewriter Effect in Hero
   ========================================================================== */
function initTypewriter() {
  const typewriterElement = document.getElementById('typewriter-text');
  if (!typewriterElement) return;

  const roles = [
    'Full-Stack Developer',
    'Pursuing MCA @ Karpagam (2025–2027)',
    'BCA Graduate (2022–2025)',
    'Based in Coimbatore, Tamil Nadu',
    'Next.js & Java Specialist',
    'SQL & Database Architect'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
      typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 2200; // Pause at end of word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400; // Pause before new word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   6. Animated Stat Counters
   ========================================================================== */
function initStatsCounter() {
  const statsElements = document.querySelectorAll('.stat-number[data-target]');
  if (!statsElements.length) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statsElements.forEach((el) => {
          const target = parseFloat(el.getAttribute('data-target'));
          const isDecimal = el.getAttribute('data-decimal') === 'true';
          const suffix = el.getAttribute('data-suffix') || '';
          let count = 0;
          const duration = 1800;
          const stepTime = 25;
          const steps = duration / stepTime;
          const increment = target / steps;

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              count = target;
              clearInterval(timer);
            }
            el.textContent = (isDecimal ? count.toFixed(2) : Math.floor(count)) + suffix;
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const heroStatsSection = document.querySelector('.hero-stats');
  if (heroStatsSection) {
    observer.observe(heroStatsSection);
  }
}

/* ==========================================================================
   7. Skills Category Filtering
   ========================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-category-card');

  if (!filterBtns.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach((card) => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
          card.style.animation = 'slideUpFade 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   8. Projects Filtering
   ========================================================================== */
function initProjectsFilter() {
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          card.style.animation = 'slideUpFade 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   9. Interactive Project Details Modal
   ========================================================================== */
const projectData = {
  'assessment-tool': {
    title: 'Assessment Tool Website',
    subtitle: 'Full-Stack Automated Evaluation & Online Proctoring Platform',
    category: 'Full-Stack Web Application',
    status: 'Flagship Project',
    tech: ['Next.js', 'React', 'SQL / PostgreSQL', 'REST APIs', 'Node.js', 'Tailwind CSS'],
    overview: 'A comprehensive, enterprise-ready full-stack examination and skill evaluation system engineered to streamline testing for educational institutions and corporate recruiting.',
    highlights: [
      'Built-in real-time online proctoring mechanisms including browser tab-focus monitoring and anti-cheating validation.',
      'Automated digital certificate generation with verifiable hashes and PDF export capabilities upon exam completion.',
      'Embedded online code compiler supporting dynamic execution, custom test case evaluations, and instant scoring.',
      'Highly normalized relational SQL database architecture ensuring secure candidate authentication, encrypted submissions, and audit trails.'
    ],
    github: 'https://github.com/subathrarajakumar60-netizen',
    demo: 'https://github.com/subathrarajakumar60-netizen'
  },
  'doctor-booking': {
    title: 'Doctor Appointment Booking System',
    subtitle: 'End-to-End Healthcare Scheduling & Role-Based Portal',
    category: 'Full-Stack Enterprise',
    status: 'Featured Full-Stack',
    tech: ['Next.js', 'Java', 'PostgreSQL', 'Java Servlets', 'REST APIs'],
    overview: 'An architected full-stack healthcare scheduling ecosystem connecting patients with verified specialists while providing doctors and hospital administrators with comprehensive management tooling.',
    highlights: [
      'Tailored role-based dynamic workflows for three distinct user portals: Patients, Medical Doctors, and System Administrators.',
      'High-performance Java backend orchestrating secure appointment booking algorithms, conflict detection, and calendar sync.',
      'PostgreSQL relational schema optimized with indexed foreign keys and transaction integrity for medical scheduling.',
      'Intuitive Next.js responsive frontend featuring real-time doctor availability slots and instant confirmation triggers.'
    ],
    github: 'https://github.com/subathrarajakumar60-netizen',
    demo: 'https://github.com/subathrarajakumar60-netizen'
  },
  'portfolio': {
    title: 'Personal Portfolio Website',
    subtitle: 'Modern High-Performance Developer Showcase',
    category: 'Frontend & UI/UX',
    status: 'Active',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design', 'Canvas API'],
    overview: 'An interactive, responsive portfolio showcasing personal projects, technical skills, academic milestones, and certifications with an ultra-clean dark/light aesthetic.',
    highlights: [
      'Lightning-fast vanilla architecture with zero heavy runtimes, achieving near-perfect Lighthouse performance scores.',
      'Custom theme toggle engine with persistent localStorage and smooth CSS variable transitions.',
      'Interactive constellation particle background on HTML5 Canvas responding smoothly to cursor velocity.',
      'Accessible modals, tabbed timeline views, and dynamic search/filter controls.'
    ],
    github: 'https://github.com/subathrarajakumar60-netizen',
    demo: '#'
  },
  'tourism-platform': {
    title: 'Tourism Experience Platform',
    subtitle: 'Interactive Destination Discovery & Gallery Showcase',
    category: 'Frontend Application',
    status: 'Showcase',
    tech: ['React.js', 'Bootstrap 5', 'Custom CSS', 'Responsive UI'],
    overview: 'An engaging tourism web platform built to spotlight world destinations with dynamic image galleries, curated travel itineraries, and interactive travel packages.',
    highlights: [
      'Dynamic photo galleries featuring responsive grid layouts and interactive visual inspection states.',
      'Mobile-first responsive layout utilizing custom Bootstrap grids and seamless fluid breakpoints.',
      'Interactive booking inquiry forms and destination filter systems tailored for exploratory travelers.'
    ],
    github: 'https://github.com/subathrarajakumar60-netizen',
    demo: 'https://github.com/subathrarajakumar60-netizen'
  },
  'todo-crud': {
    title: 'Task Management (Todo) CRUD App',
    subtitle: 'Lightweight Task Planner with Client-Side Persistence',
    category: 'Web Utility',
    status: 'Utility App',
    tech: ['JavaScript (ES6+)', 'HTML5', 'CSS3', 'LocalStorage API'],
    overview: 'A lightweight and intuitive productivity application with full CRUD (Create, Read, Update, Delete) capabilities designed for task organization.',
    highlights: [
      'Persistent data retention between browser sessions powered by JSON-serialized LocalStorage transactions.',
      'Interactive inline task editing, priority assignment tags, and category filtering (All, Completed, Pending).',
      'Zero latency client-side execution with intuitive key bindings (Enter to submit, Esc to cancel).'
    ],
    github: 'https://github.com/subathrarajakumar60-netizen',
    demo: 'https://github.com/subathrarajakumar60-netizen'
  }
};

function initProjectModals() {
  const modalBackdrop = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-dynamic-content');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  if (!modalBackdrop || !modalBody) return;

  document.querySelectorAll('.open-project-modal').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      const data = projectData[projectId];
      if (!data) return;

      modalBody.innerHTML = `
        <div style="margin-bottom: 1.25rem;">
          <span class="project-badge-top" style="margin-bottom: 0.75rem;">${data.category}</span>
          <h2 style="font-size: 1.85rem; margin-bottom: 0.35rem; color: var(--text-primary);">${data.title}</h2>
          <p style="color: var(--primary-light); font-weight: 600; font-size: 1rem;">${data.subtitle}</p>
        </div>

        <p style="color: var(--text-secondary); line-height: 1.7; font-size: 0.98rem; margin-bottom: 1.5rem;">
          ${data.overview}
        </p>

        <h3 style="font-size: 1.1rem; margin-bottom: 0.75rem; color: var(--text-primary);">Key Architectural Features</h3>
        <ul class="project-features-list" style="margin-bottom: 1.75rem;">
          ${data.highlights.map(h => `
            <li style="font-size: 0.92rem; color: var(--text-secondary);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--cyan); margin-top: 3px; flex-shrink: 0;">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>${h}</span>
            </li>
          `).join('')}
        </ul>

        <h3 style="font-size: 1.1rem; margin-bottom: 0.75rem; color: var(--text-primary);">Technology Stack</h3>
        <div class="project-tech-tags" style="border-top: none; padding-top: 0; margin-bottom: 2rem;">
          ${data.tech.map(t => `<span class="tech-tag" style="font-size: 0.82rem; padding: 0.35rem 0.8rem;">${t}</span>`).join('')}
        </div>

        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding: 0.65rem 1.4rem;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span>GitHub Repository</span>
          </a>
          <a href="${data.demo}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="padding: 0.65rem 1.4rem;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            <span>Live Demonstration</span>
          </a>
        </div>
      `;

      modalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   10. Education vs Experience Timeline Tabs
   ========================================================================== */
function initTimelineTabs() {
  const tabs = document.querySelectorAll('.timeline-tab-btn');
  const panes = document.querySelectorAll('.timeline-content-pane');

  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      panes.forEach((p) => p.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-target');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
        targetPane.style.animation = 'slideUpFade 0.4s ease forwards';
      }
    });
  });
}

/* ==========================================================================
   11. Contact Form Handling
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const subject = form.querySelector('#subject').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    const submitBtn = form.querySelector('.form-submit-btn');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10"></path>
      </svg>
      <span>Sending Message...</span>
    `;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();
      showToast('Thank you! Your message has been sent successfully.', 'success');
    }, 1200);
  });
}

/* ==========================================================================
   12. Copy Email to Clipboard
   ========================================================================== */
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const email = 'Subathrarajakumar60@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      showToast('Email address copied to clipboard!', 'success');
    }).catch(() => {
      showToast('Email: Subathrarajakumar60@gmail.com', 'info');
    });
  });
}

/* ==========================================================================
   13. Back to Top Floating Button
   ========================================================================== */
function initBackToTop() {
  const backBtn = document.getElementById('back-to-top');
  if (!backBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 450) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  });

  backBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   14. Toast Notification Engine
   ========================================================================== */
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';

  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
  } else if (type === 'error') {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
  } else {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  }

  toast.innerHTML = `${iconSvg}<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
