/* ==========================================================================
   Liquid Glass Portfolio Script
   ========================================================================== */

const PROJECTS = {
  'grain-robot': {
    title: 'Smart Grain Management Robot',
    image: 'assets/project1.svg',
    tags: ['Robotics', 'IoT Patent'],
    summary: 'Design-patented robotic system for automated grain handling, real-time monitoring, and crushing — built for agricultural efficiency.',
    year: '2025',
    role: 'Lead Inventor',
    tools: ['Embedded C', 'IoT Sensors', 'CAD', 'Proteus', 'Mechanical Design'],
    highlights: [
      'Secured design patent under the Designs Act, 2000.',
      'Integrated monitoring sensors for grain quality and storage conditions.',
      'Automated crushing mechanism for on-site grain processing.',
      'Recognized at Impetus \'25 international project competition.'
    ],
    links: [
      { label: 'Contact for Patent Info', href: 'mailto:deharkarkunal48@gmail.com?subject=Smart%20Grain%20Robot%20Patent', icon: 'fa-certificate' }
    ]
  },
  'netflix-analysis': {
    title: 'Netflix Movies & TV Shows Analysis',
    image: 'assets/project2.svg',
    tags: ['Python', 'Data Analysis', 'Visualization'],
    summary: 'End-to-end exploratory analysis of Netflix catalogue data — uncovering content trends, release patterns, and regional production insights.',
    year: '2024',
    role: 'Data Analyst',
    tools: ['Python', 'Pandas', 'Matplotlib', 'Seaborn', 'Jupyter'],
    highlights: [
      'Cleaned and structured large-scale streaming catalogue dataset.',
      'Mapped country-wise content production and genre distributions.',
      'Identified release pattern trends across movies vs. TV shows.',
      'Delivered visual insights for platform content strategy.'
    ],
    links: [
      { label: 'Request Report', href: 'mailto:deharkarkunal48@gmail.com?subject=Netflix%20Analysis%20Project', icon: 'fa-envelope' }
    ]
  },
  'sales-dashboard': {
    title: 'Sales & Regional Analytics Dashboard',
    image: 'assets/project3.svg',
    tags: ['Power BI', 'DAX', 'Business Intelligence'],
    summary: 'Interactive Power BI dashboard tracking regional sales performance, revenue pipelines, and growth KPIs with custom DAX measures.',
    year: '2024',
    role: 'BI Developer',
    tools: ['Power BI', 'DAX', 'Excel', 'SQL', 'Data Modeling'],
    highlights: [
      'Built multi-page dashboard with drill-down regional views.',
      'Created custom DAX KPIs for YoY growth and revenue tracking.',
      'Designed intuitive visuals for non-technical stakeholders.',
      'Optimized data model for fast refresh and filtering.'
    ],
    links: [
      { label: 'Request Demo', href: 'mailto:deharkarkunal48@gmail.com?subject=Sales%20Dashboard%20Demo', icon: 'fa-chart-simple' }
    ]
  },
  'hybrid-bearing': {
    title: 'Rotary & Reciprocating Bearing',
    image: 'assets/project1.svg',
    tags: ['CAD', 'Mechanical Design', 'Patent'],
    summary: 'Patented hybrid ball bearing mechanism enabling simultaneous rotary and reciprocating motion in a single compact unit.',
    year: '2025',
    role: 'Lead Inventor',
    tools: ['CAD', 'Mechanical Design', 'Prototyping', 'Solid Modeling'],
    highlights: [
      'Secured design patent (2025) for novel bearing architecture.',
      'Engineered dual-motion capability in one integrated mechanism.',
      'Reduced component count vs. traditional dual-system setups.',
      'Applicable to robotics, automation, and industrial machinery.'
    ],
    links: [
      { label: 'Contact for Patent Info', href: 'mailto:deharkarkunal48@gmail.com?subject=Hybrid%20Bearing%20Patent', icon: 'fa-certificate' }
    ]
  },
  'voting-system': {
    title: 'Secure Online Voting System',
    image: 'assets/project3.svg',
    tags: ['Cybersecurity', 'Research', 'Cryptography'],
    summary: 'Peer-reviewed research paper proposing a transparent, secure online voting protocol for democratic digital transformation.',
    year: '2024',
    role: 'Lead Researcher',
    tools: ['Cryptography', 'Network Security', 'Research Writing', 'Protocol Design'],
    highlights: [
      'Authored peer-reviewed paper on secure voting infrastructure.',
      'Designed transparent audit trail for vote verification.',
      'Addressed tampering and identity verification challenges.',
      'Presented as part of IEEE institute research initiatives.'
    ],
    links: [
      { label: 'Request Paper', href: 'mailto:deharkarkunal48@gmail.com?subject=Secure%20Voting%20System%20Paper', icon: 'fa-file-pdf' }
    ]
  }
};

const CONTACT_EMAIL = 'deharkarkunal48@gmail.com';
// Replace with your deployed Google Apps Script web app URL after deploying the script below
const SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzN74WZLgONf0tZ97vYwTmyHq8_y_yKSR6GgmGnt21AG8vO4DzI7k-0sCK55MDJH5qZkg/exec';

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initBackgroundParallax();
  initNavbarScroll();
  initMobileMenu();
  initTypingEffect();
  initCard3DTiltAndGlow();
  initPortfolioFilter();
  initScrollReveal();
  initContactForm();
  initProjectModals();
  initScrollToTop();
});

/* ==========================================================================
   1. Custom Liquid Cursor
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  const cursorDot = document.getElementById('custom-cursor-dot');

  if (!cursor || !cursorDot || window.matchMedia('(hover: none)').matches) return;

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let lastX = 0, lastY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  const interactiveElements = document.querySelectorAll('a, button, .filter-btn, .project-link-btn, .social-btn, .form-input, .logo');

  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (el.tagName === 'A' || el.classList.contains('logo') || el.classList.contains('social-btn') || el.classList.contains('project-link-btn')) {
        document.body.classList.add('hover-link');
      } else {
        document.body.classList.add('hover-button');
      }
    });

    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('hover-link');
      document.body.classList.remove('hover-button');
    });
  });

  function renderCursor() {
    const lerpSpeed = 0.15;
    cursorX += (mouseX - cursorX) * lerpSpeed;
    cursorY += (mouseY - cursorY) * lerpSpeed;

    const dx = cursorX - lastX;
    const dy = cursorY - lastY;
    const distance = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const scaleX = 1 + Math.min(distance / 60, 0.6);
    const scaleY = 1 - Math.min(distance / 90, 0.3);

    if (distance > 0.5) {
      cursor.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scale(${scaleX}, ${scaleY})`;
    } else {
      cursor.style.transform = `translate(-50%, -50%) scale(1, 1)`;
    }

    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    lastX = cursorX;
    lastY = cursorY;
    requestAnimationFrame(renderCursor);
  }

  requestAnimationFrame(renderCursor);
}

/* ==========================================================================
   2. Background Blobs Interactive Parallax
   ========================================================================== */
function initBackgroundParallax() {
  const blobs = document.querySelectorAll('.blob');
  if (window.matchMedia('(hover: none)').matches) return;

  window.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;

    blobs.forEach((blob, idx) => {
      const speed = (idx + 1) * 35;
      blob.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
  });
}

/* ==========================================================================
   3. Navbar Scroll Behavior
   ========================================================================== */
function initNavbarScroll() {
  const header = document.querySelector('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
    highlightActiveNavLink();
  });
}

function highlightActiveNavLink() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');
  let currentSection = '';

  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 150) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
  });
}

/* ==========================================================================
   4. Mobile Menu Toggling
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.querySelector('.menu-btn');
  const nav = document.querySelector('nav');
  const backdrop = document.getElementById('nav-backdrop');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (!menuBtn || !nav) return;

  function closeMenu() {
    menuBtn.classList.remove('open');
    nav.classList.remove('open');
    backdrop?.classList.remove('active');
    document.body.style.overflow = '';
  }

  function openMenu() {
    menuBtn.classList.add('open');
    nav.classList.add('open');
    backdrop?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  menuBtn.addEventListener('click', () => {
    if (nav.classList.contains('open')) closeMenu();
    else openMenu();
  });

  backdrop?.addEventListener('click', closeMenu);
  navLinks.forEach(link => link.addEventListener('click', closeMenu));
}

/* ==========================================================================
   5. Typing Headline Text Cycling
   ========================================================================== */
function initTypingEffect() {
  const target = document.querySelector('.typing-text');
  if (!target) return;

  const words = JSON.parse(target.getAttribute('data-words'));
  let wordIndex = 0;
  let txt = '';
  let isDeleting = false;

  function type() {
    const currentWord = words[wordIndex];
    txt = isDeleting
      ? currentWord.substring(0, txt.length - 1)
      : currentWord.substring(0, txt.length + 1);

    target.textContent = txt;

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && txt === currentWord) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && txt === '') {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
  }

  setTimeout(type, 1000);
}

/* ==========================================================================
   6. 3D Card Hover Tilt and Radial Glow
   ========================================================================== */
function initCard3DTiltAndGlow() {
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = -(y - centerY) / (centerY / 8);
      const tiltY = (x - centerX) / (centerX / 8);

      card.style.setProperty('--rx', `${tiltX}deg`);
      card.style.setProperty('--ry', `${tiltY}deg`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}

/* ==========================================================================
   7. Portfolio Sorting Filters
   ========================================================================== */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card-wrap');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        const show = filterValue === 'all' || categories.includes(filterValue);

        if (show) {
          card.classList.remove('hide');
          card.style.opacity = '0';
          card.style.transform = 'scale(0.92)';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          });
        } else {
          card.classList.add('hide');
        }
      });
    });
  });
}

/* ==========================================================================
   8. Scroll Reveal Animations
   ========================================================================== */
function initScrollReveal() {
  const revealItems = document.querySelectorAll('.reveal-item');
  const fillProgressBars = document.querySelectorAll('.skill-progress-fill, .progress-bar-fill');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('active');

      if (entry.target.classList.contains('skill-progress-fill') ||
          entry.target.classList.contains('progress-bar-fill')) {
        entry.target.style.width = entry.target.getAttribute('data-width') || '85%';
      }

      obs.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  revealItems.forEach(item => observer.observe(item));
  fillProgressBars.forEach(bar => observer.observe(bar));

  // Animate hero progress bars on load
  setTimeout(() => {
    document.querySelectorAll('.progress-bar-fill').forEach(bar => {
      bar.style.width = bar.getAttribute('data-width') || '85%';
    });
  }, 1200);
}

/* ==========================================================================
   9. Contact Form
   ========================================================================== */
// Simple rate limiter: allow 1 submit per 5 seconds
let lastSubmitTime = 0;

function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  const statusMessage = document.getElementById('form-status-message');
  if (!form || !statusMessage) return;

  // Add honeypot field (hidden from users, spam bots fill it)
  const honeypot = document.createElement('input');
  honeypot.type = 'text';
  honeypot.name = 'website';
  honeypot.style.position = 'absolute';
  honeypot.style.left = '-9999px';
  honeypot.setAttribute('tabindex', '-1');
  honeypot.setAttribute('autocomplete', 'off');
  form.appendChild(honeypot);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Check honeypot — if filled, it's likely a bot
    if (honeypot.value) {
      console.warn('Honeypot triggered: spam form submission blocked');
      showFormStatus(statusMessage, 'Submission blocked. Please try again.', 'error');
      return;
    }

    // Rate limit: prevent rapid submissions
    const now = Date.now();
    if (now - lastSubmitTime < 5000) {
      showFormStatus(statusMessage, 'Please wait a moment before sending again.', 'error');
      return;
    }
    lastSubmitTime = now;

    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const subject = form.querySelector('#subject').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !subject || !message) {
      showFormStatus(statusMessage, 'Please fill in all fields.', 'error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFormStatus(statusMessage, 'Please enter a valid email address.', 'error');
      return;
    }

    const payload = {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString()
    };

    try {
      showFormStatus(statusMessage, 'Sending...', '');

      const resp = await fetch(SHEET_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(payload)
      });

      showFormStatus(statusMessage, 'Message sent successfully!', 'success');
      form.reset();
    } catch (err) {
      console.error('Contact form submit error:', err);
      showFormStatus(statusMessage, 'Failed to send message. Try again later.', 'error');
    }

    setTimeout(() => {
      statusMessage.style.display = 'none';
      statusMessage.classList.remove('success', 'error');
    }, 6000);
  });
}

function showFormStatus(el, text, type) {
  el.textContent = text;
  el.style.display = 'block';
  el.className = `form-status ${type}`;
}

/* ==========================================================================
   10. Project Detail Modals
   ========================================================================== */
function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const backdrop = document.getElementById('modal-backdrop');
  const closeBtn = document.getElementById('modal-close');
  if (!modal) return;

  document.querySelectorAll('.project-open-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.getAttribute('data-project');
      if (id && PROJECTS[id]) openProjectModal(id);
    });
  });

  closeBtn?.addEventListener('click', closeProjectModal);
  backdrop?.addEventListener('click', closeProjectModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeProjectModal();
  });
}

function openProjectModal(id) {
  const project = PROJECTS[id];
  const modal = document.getElementById('project-modal');
  if (!project || !modal) return;

  document.getElementById('modal-img').src = project.image;
  document.getElementById('modal-img').alt = project.title;
  document.getElementById('modal-title').textContent = project.title;
  document.getElementById('modal-summary').textContent = project.summary;
  document.getElementById('modal-year').textContent = project.year;
  document.getElementById('modal-role').textContent = project.role;

  document.getElementById('modal-tags').innerHTML = project.tags
    .map(tag => `<span class="project-tag">${tag}</span>`).join('');

  document.getElementById('modal-tools').innerHTML = project.tools
    .map(tool => `<li>${tool}</li>`).join('');

  document.getElementById('modal-highlights').innerHTML = project.highlights
    .map(item => `<li>${item}</li>`).join('');

  document.getElementById('modal-actions').innerHTML = project.links
    .map(link => `<a href="${link.href}" class="btn-glass primary"><i class="fa-solid ${link.icon}"></i> ${link.label}</a>`)
    .join('');

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

/* ==========================================================================
   11. Scroll to Top
   ========================================================================== */
function initScrollToTop() {
  const btn = document.getElementById('scroll-top-btn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
