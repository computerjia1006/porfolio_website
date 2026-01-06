/**
 * Portfolio Renderer
 * Dynamically loads and renders project cards from JSON data
 * 
 * This eliminates the need to hardcode project cards in HTML.
 * Just update data/projects.json to add/edit/remove projects.
 */

'use strict';

class PortfolioRenderer {
  constructor() {
    this.dataPath = 'data/projects.json';
    this.projects = [];
    this.categories = [];
    this.currentFilter = 'all';
  }

  async init() {
    const success = await this.loadData();
    if (success) {
      this.renderFilters();
      this.renderProjects();
      this.initFilterListeners();
    }
  }

  async loadData() {
    try {
      const response = await fetch(this.dataPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.projects = data.projects || [];
      this.categories = data.categories || [];
      return true;
    } catch (error) {
      console.error('Error loading projects:', error);
      this.showError('Failed to load projects. Please refresh the page.');
      return false;
    }
  }

  showError(message) {
    const container = document.getElementById('projects-grid');
    if (container) {
      container.innerHTML = `
        <div class="portfolio__empty">
          <ion-icon name="alert-circle-outline" class="portfolio__empty-icon"></ion-icon>
          <p>${message}</p>
        </div>
      `;
    }
  }

  renderFilters() {
    const container = document.querySelector('.portfolio__filters');
    if (!container || this.categories.length === 0) return;

    container.innerHTML = this.categories.map(cat => `
      <button class="filter-btn ${cat.id === 'all' ? 'active' : ''}" data-filter="${cat.id}">
        ${cat.name}
      </button>
    `).join('');
  }

  renderProjects(filter = 'all') {
    const container = document.getElementById('projects-grid');
    if (!container) return;

    const filteredProjects = filter === 'all' 
      ? this.projects 
      : this.projects.filter(p => p.category === filter);

    if (filteredProjects.length === 0) {
      container.innerHTML = `
        <div class="portfolio__empty">
          <ion-icon name="folder-open-outline" class="portfolio__empty-icon"></ion-icon>
          <p>No projects found in this category.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filteredProjects.map(project => `
      <a href="projects/project.html?id=${project.id}" class="project-card" data-category="${project.category}">
        <div class="project-card__image-wrapper">
          <img 
            src="${project.image}" 
            alt="${project.title}" 
            class="project-card__image"
            loading="lazy"
          >
          <div class="project-card__overlay">
            <div class="project-card__links">
              <span class="project-card__link" aria-label="View Details">
                <ion-icon name="arrow-forward-outline"></ion-icon>
              </span>
            </div>
          </div>
        </div>
        <div class="project-card__content">
          <span class="project-card__category">${project.categoryLabel}</span>
          <h3 class="project-card__title">${project.title}</h3>
          <p class="project-card__description">${project.shortDescription}</p>
          <div class="project-card__tags">
            ${project.tags.slice(0, 4).map(tag => `
              <span class="project-card__tag">${tag}</span>
            `).join('')}
          </div>
        </div>
      </a>
    `).join('');
  }

  initFilterListeners() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-btn')) {
        // Update active state
        document.querySelectorAll('.filter-btn').forEach(btn => {
          btn.classList.remove('active');
        });
        e.target.classList.add('active');

        // Filter projects
        const filter = e.target.dataset.filter;
        this.currentFilter = filter;
        this.renderProjects(filter);
      }
    });
  }
}

// Export for use
window.PortfolioRenderer = PortfolioRenderer;
