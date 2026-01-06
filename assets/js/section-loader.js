/**
 * Section Loader
 * Loads HTML sections from separate files for better code organization
 * 
 * File Structure:
 * ├── sections/
 * │   ├── sidebar.html    → Profile sidebar
 * │   ├── about.html      → About section
 * │   ├── resume.html     → Resume section
 * │   ├── portfolio.html  → Portfolio section
 * │   └── contact.html    → Contact section
 */

'use strict';

class SectionLoader {
  constructor() {
    this.sectionsPath = 'sections/';
    this.sections = ['about', 'resume', 'portfolio', 'contact'];
    this.loaded = false;
  }

  /**
   * Load a single HTML file
   */
  async loadHTML(filename) {
    try {
      const response = await fetch(`${this.sectionsPath}${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to load ${filename}`);
      }
      return await response.text();
    } catch (error) {
      console.error(`Error loading ${filename}:`, error);
      return `<div class="error">Failed to load ${filename}</div>`;
    }
  }

  /**
   * Load sidebar
   */
  async loadSidebar() {
    const container = document.getElementById('sidebar-container');
    if (!container) return;

    const html = await this.loadHTML('sidebar.html');
    container.innerHTML = html;
  }

  /**
   * Load all sections
   */
  async loadSections() {
    const container = document.getElementById('sections-container');
    if (!container) return;

    // Load all sections in parallel for speed
    const sectionPromises = this.sections.map(section => 
      this.loadHTML(`${section}.html`)
    );

    const sectionContents = await Promise.all(sectionPromises);
    
    // Combine all sections
    container.innerHTML = sectionContents.join('\n');
  }

  /**
   * Initialize portfolio renderer
   */
  async initPortfolio() {
    // Check if PortfolioRenderer exists
    if (typeof PortfolioRenderer !== 'undefined') {
      const portfolioRenderer = new PortfolioRenderer();
      await portfolioRenderer.init();
    }
  }

  /**
   * Initialize - load everything
   */
  async init() {
    // Show loading state
    document.body.classList.add('loading');

    try {
      // Load sidebar and sections in parallel
      await Promise.all([
        this.loadSidebar(),
        this.loadSections()
      ]);

      this.loaded = true;
      
      // Initialize portfolio after sections are loaded
      await this.initPortfolio();
      
      // Dispatch event when done loading
      document.dispatchEvent(new CustomEvent('sectionsLoaded'));
      
    } catch (error) {
      console.error('Error loading sections:', error);
    } finally {
      // Remove loading state
      document.body.classList.remove('loading');
      document.body.classList.add('loaded');
    }
  }
}

// Create and initialize loader
const sectionLoader = new SectionLoader();

// Load sections when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  sectionLoader.init();
});
