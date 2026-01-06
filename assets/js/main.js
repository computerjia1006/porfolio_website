/**
 * Portfolio Website - Main JavaScript
 * Jia Yi Chia | Full-Stack Engineer & Content Creator
 * 
 * This file handles:
 * - Navigation between sections
 * - Sidebar toggle (mobile)
 * - Portfolio filtering
 * - Animations & scroll reveal
 * - Contact form
 */

'use strict';

// ===== INITIALIZATION =====
// Wait for sections to be loaded before initializing
document.addEventListener('sectionsLoaded', initializeApp);

// Fallback if sections are already in HTML (not loaded dynamically)
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.section')) {
    initializeApp();
  }
});

function initializeApp() {
  // Prevent double initialization
  if (window.appInitialized) return;
  window.appInitialized = true;

  // Initialize all components
  initSidebar();
  initNavigation();
  initPortfolioFilter();
  initContactForm();
  initScrollReveal();
  initSkillBars();

  console.log('✅ Portfolio initialized');
}

// ===== SIDEBAR (Mobile) =====
function initSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  const sidebarOverlay = document.querySelector('.sidebar-overlay');

  if (!sidebar || !sidebarToggle) return;

  function toggleSidebar() {
    sidebar.classList.toggle('active');
    sidebarOverlay?.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
  }

  sidebarToggle.addEventListener('click', toggleSidebar);
  sidebarOverlay?.addEventListener('click', toggleSidebar);

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('active')) {
      toggleSidebar();
    }
  });
}

// ===== NAVIGATION =====
function initNavigation() {
  const navLinks = document.querySelectorAll('.navbar__link');
  const sections = document.querySelectorAll('.section');

  if (!navLinks.length || !sections.length) return;

  function switchSection(targetSection) {
    // Update nav links
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.nav === targetSection);
    });

    // Update sections
    sections.forEach(section => {
      const isTarget = section.dataset.section === targetSection;
      section.classList.toggle('active', isTarget);
      
      if (isTarget) {
        // Trigger reveal animations
        revealElements(section);
        // Animate skill bars if resume section
        if (targetSection === 'resume') {
          animateSkillBars();
        }
      }
    });

    // Update URL hash
    history.pushState(null, null, `#${targetSection}`);
    
    // Close sidebar on mobile
    const sidebar = document.querySelector('.sidebar');
    if (window.innerWidth <= 1024 && sidebar?.classList.contains('active')) {
      sidebar.classList.remove('active');
      document.querySelector('.sidebar-overlay')?.classList.remove('active');
      document.body.style.overflow = '';
    }

    // Scroll to top
    document.querySelector('.main-content')?.scrollTo(0, 0);
  }

  // Nav link click handlers
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchSection(link.dataset.nav);
    });
  });

  // Handle initial hash
  const hash = window.location.hash.slice(1);
  if (hash && ['about', 'resume', 'portfolio', 'contact'].includes(hash)) {
    switchSection(hash);
  } else {
    // Trigger animations for default (about) section
    const aboutSection = document.querySelector('[data-section="about"]');
    if (aboutSection) revealElements(aboutSection);
  }

  // Handle browser back/forward
  window.addEventListener('popstate', () => {
    const hash = window.location.hash.slice(1) || 'about';
    switchSection(hash);
  });
}

// ===== PORTFOLIO FILTER =====
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Filter projects
      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.display = match ? 'block' : 'none';
        if (match) {
          card.style.animation = 'fadeInUp 0.5s ease forwards';
        }
      });
    });
  });
}

// ===== CONTACT FORM =====
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('.form__submit');
    const originalText = submitBtn.innerHTML;
    
    // Loading state
    submitBtn.innerHTML = '<ion-icon name="hourglass-outline"></ion-icon> Sending...';
    submitBtn.disabled = true;
    
    try {
      // Simulate API call (replace with actual form handling)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success
      submitBtn.innerHTML = '<ion-icon name="checkmark-outline"></ion-icon> Sent!';
      submitBtn.classList.add('btn--accent');
      form.reset();
      
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.classList.remove('btn--accent');
        submitBtn.disabled = false;
      }, 3000);
      
    } catch (error) {
      submitBtn.innerHTML = '<ion-icon name="close-outline"></ion-icon> Error';
      submitBtn.style.background = '#ff6b6b';
      
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 3000);
    }
  });
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('[data-reveal]').forEach(el => {
    revealObserver.observe(el);
  });
}

function revealElements(container = document) {
  const revealItems = container.querySelectorAll('[data-reveal]');
  
  revealItems.forEach((item, index) => {
    const delay = item.dataset.delay || index * 100;
    setTimeout(() => {
      item.classList.add('revealed');
    }, delay);
  });
}

// ===== SKILL BARS =====
function initSkillBars() {
  // Initial setup - will animate when resume section is shown
}

function animateSkillBars() {
  const skillBars = document.querySelectorAll('.skill-bar__fill');
  
  skillBars.forEach(bar => {
    const width = bar.style.width;
    bar.style.width = '0';
    
    setTimeout(() => {
      bar.style.width = width;
    }, 300);
  });
}

// ===== CONSOLE EASTER EGG =====
console.log('%c👋 Hey there, curious developer!', 'font-size: 20px; font-weight: bold; color: #7EC4CF;');
console.log('%cLooking for the source code? Check out my GitHub!', 'font-size: 14px; color: #D4AF89;');
console.log('%c🚀 Built with vanilla HTML, CSS & JavaScript', 'font-size: 12px; color: #9CADCE;');
