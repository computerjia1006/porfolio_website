/**
 * Data Loader - Loads content from JSON files
 * This allows easy content updates without editing HTML
 */

'use strict';

class DataLoader {
  constructor() {
    this.dataPath = 'data/';
    this.cache = {};
  }

  /**
   * Fetch JSON data from file
   */
  async fetchData(filename) {
    if (this.cache[filename]) {
      return this.cache[filename];
    }

    try {
      const response = await fetch(`${this.dataPath}${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to load ${filename}`);
      }
      const data = await response.json();
      this.cache[filename] = data;
      return data;
    } catch (error) {
      console.error(`Error loading ${filename}:`, error);
      return null;
    }
  }

  /**
   * Load and render projects
   */
  async loadProjects(containerId = 'projects-grid') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const data = await this.fetchData('projects.json');
    if (!data || !data.projects) return;

    container.innerHTML = data.projects.map(project => this.renderProjectCard(project)).join('');
  }

  /**
   * Render a single project card
   */
  renderProjectCard(project) {
    const links = [];
    if (project.links.live) {
      links.push(`
        <a href="${project.links.live}" class="project-card__link" target="_blank" rel="noopener noreferrer" aria-label="Visit Website">
          <ion-icon name="open-outline"></ion-icon>
        </a>
      `);
    }
    if (project.links.github) {
      links.push(`
        <a href="${project.links.github}" class="project-card__link" target="_blank" rel="noopener noreferrer" aria-label="View on GitHub">
          <ion-icon name="logo-github"></ion-icon>
        </a>
      `);
    }

    return `
      <div class="project-card" data-category="${project.category}">
        <div class="project-card__image-wrapper">
          <img 
            src="${project.image}" 
            alt="${project.title}" 
            class="project-card__image"
            loading="lazy"
          >
          <div class="project-card__overlay">
            <div class="project-card__links">
              ${links.join('')}
            </div>
          </div>
        </div>
        <div class="project-card__content">
          <span class="project-card__category">${project.context || project.category}</span>
          <h3 class="project-card__title">${project.title}</h3>
          <p class="project-card__description">${project.description}</p>
          <div class="project-card__tags">
            ${project.tags.map(tag => `<span class="project-card__tag">${tag}</span>`).join('')}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Load and render experience
   */
  async loadExperience(containerId = 'experience-list') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const data = await this.fetchData('experience.json');
    if (!data || !data.experience) return;

    container.innerHTML = data.experience.map(exp => this.renderExperienceCard(exp)).join('');
  }

  /**
   * Render a single experience card
   */
  renderExperienceCard(exp) {
    const emoji = this.getCompanyEmoji(exp.company);
    
    return `
      <div class="experience-card">
        <div class="experience-card__logo">${emoji}</div>
        <div class="experience-card__content">
          <div class="experience-card__header">
            <h4 class="experience-card__company">${exp.company}</h4>
            <span class="experience-card__period">${exp.period}</span>
          </div>
          <p class="experience-card__role">${exp.role}</p>
          <p class="experience-card__location">${exp.location}</p>
          <ul class="experience-card__highlights">
            ${exp.highlights.map(h => `<li class="experience-card__highlight">${h}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  /**
   * Get emoji for company
   */
  getCompanyEmoji(company) {
    const emojiMap = {
      'Amazon': '🚀',
      'UCL Technology Society': '👥',
      'Bloomberg': '🏢',
      'Jia Studying': '📱',
      'default': '💼'
    };
    
    for (const [key, emoji] of Object.entries(emojiMap)) {
      if (company.toLowerCase().includes(key.toLowerCase())) {
        return emoji;
      }
    }
    return emojiMap.default;
  }

  /**
   * Load and render skills
   */
  async loadSkills() {
    const data = await this.fetchData('skills.json');
    if (!data) return;

    // Skills are currently hardcoded in HTML for better control
    // This method can be used for dynamic skill loading if needed
    console.log('Skills data loaded:', data);
  }

  /**
   * Load social/profile data
   */
  async loadProfile() {
    const data = await this.fetchData('social.json');
    if (!data || !data.profile) return data;

    // Update profile elements if they exist
    const nameEl = document.querySelector('.profile__name');
    const titleEl = document.querySelector('.profile__title');
    
    if (nameEl) nameEl.textContent = data.profile.name;
    if (titleEl) titleEl.textContent = data.profile.title;

    return data;
  }

  /**
   * Initialize all data loading
   */
  async init() {
    // Load data in parallel
    await Promise.all([
      this.loadProfile(),
      // Uncomment to load from JSON instead of hardcoded HTML:
      // this.loadProjects(),
      // this.loadExperience(),
    ]);
    
    console.log('Data loaded successfully');
  }
}

// Export for use
window.DataLoader = DataLoader;

// Auto-initialize if needed
// const dataLoader = new DataLoader();
// dataLoader.init();


