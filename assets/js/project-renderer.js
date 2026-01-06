/**
 * Project Renderer
 * Dynamically loads and renders project details from JSON data
 * 
 * Usage: project.html?id=website-portal
 */

'use strict';

class ProjectRenderer {
  constructor() {
    this.dataPath = '../data/projects.json';
    this.projects = [];
    this.currentProject = null;
    this.init();
  }

  async init() {
    // Get project ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    if (!projectId) {
      this.showError('No project specified');
      return;
    }

    // Load projects data
    await this.loadProjects();

    // Find current project
    this.currentProject = this.projects.find(p => p.id === projectId);

    if (!this.currentProject) {
      this.showError('Project not found');
      return;
    }

    // Render project
    this.render();
    this.renderPagination();
    this.updateMeta();
  }

  async loadProjects() {
    try {
      const response = await fetch(this.dataPath);
      const data = await response.json();
      this.projects = data.projects;
    } catch (error) {
      console.error('Error loading projects:', error);
      this.showError('Failed to load project data');
    }
  }

  updateMeta() {
    const project = this.currentProject;
    document.title = `${project.title} | Jia Yi Chia`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', project.shortDescription);
  }

  showError(message) {
    document.getElementById('project-content').innerHTML = `
      <div class="error-message">
        <ion-icon name="alert-circle-outline"></ion-icon>
        <h2>${message}</h2>
        <a href="../index.html#portfolio" class="btn btn--primary">Back to Portfolio</a>
      </div>
    `;
  }

  render() {
    const project = this.currentProject;
    const container = document.getElementById('project-content');

    container.innerHTML = `
      <!-- Project Header -->
      <header class="project-header">
        <span class="project-header__category">${project.categoryLabel}</span>
        <h1 class="project-header__title">${project.title}</h1>
        <p class="project-header__subtitle">${project.shortDescription}</p>
        
        <div class="project-header__meta">
          <div class="project-header__meta-item">
            <ion-icon name="calendar-outline"></ion-icon>
            <span>${project.duration}</span>
          </div>
          <div class="project-header__meta-item">
            <ion-icon name="people-outline"></ion-icon>
            <span>${project.teamSize}</span>
          </div>
          <div class="project-header__meta-item">
            <ion-icon name="location-outline"></ion-icon>
            <span>${project.location}</span>
          </div>
        </div>

        <div class="project-header__tags">
          ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>

        <div class="project-header__links">
          ${project.links.github ? `
            <a href="${project.links.github}" class="btn btn--primary" target="_blank" rel="noopener noreferrer">
              <ion-icon name="logo-github"></ion-icon>
              View on GitHub
            </a>
          ` : ''}
          ${project.links.live ? `
            <a href="${project.links.live}" class="btn btn--secondary" target="_blank" rel="noopener noreferrer">
              <ion-icon name="open-outline"></ion-icon>
              Live Demo
            </a>
          ` : ''}
        </div>
      </header>

      <!-- Project Hero Image -->
      <div class="project-hero">
        <img src="../${project.image}" alt="${project.title}" class="project-hero__image">
      </div>

      ${project.stats ? this.renderStats(project.stats) : ''}

      <!-- Project Content -->
      <div class="project-content">
        ${this.renderWhatSection(project.sections.what)}
        ${this.renderWhySection(project.sections.why)}
        ${this.renderHowSection(project.sections.how)}
        ${this.renderResultsSection(project.sections.results)}
      </div>
    `;
  }

  renderStats(stats) {
    return `
      <div class="project-stats">
        ${stats.map(stat => `
          <div class="project-stats__item">
            <span class="project-stats__value">${stat.value}</span>
            <span class="project-stats__label">${stat.label}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderWhatSection(what) {
    return `
      <section class="project-section">
        <div class="project-section__icon">
          <ion-icon name="help-circle-outline"></ion-icon>
        </div>
        <div class="project-section__content">
          <h2 class="project-section__title">What is it?</h2>
          ${what.description.map(p => `<p>${p}</p>`).join('')}
          
          <h3>Key Features</h3>
          <ul class="project-list">
            ${what.features.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>
      </section>
    `;
  }

  renderWhySection(why) {
    return `
      <section class="project-section">
        <div class="project-section__icon">
          <ion-icon name="bulb-outline"></ion-icon>
        </div>
        <div class="project-section__content">
          <h2 class="project-section__title">Why did I build it?</h2>
          ${why.description.map(p => `<p>${p}</p>`).join('')}
          
          <h3>Problem Statement</h3>
          <p>${why.problem}</p>

          <h3>My Role</h3>
          <p>${why.role}</p>
        </div>
      </section>
    `;
  }

  renderHowSection(how) {
    return `
      <section class="project-section">
        <div class="project-section__icon">
          <ion-icon name="construct-outline"></ion-icon>
        </div>
        <div class="project-section__content">
          <h2 class="project-section__title">How did I build it?</h2>
          
          <h3>Tech Stack</h3>
          <div class="tech-stack">
            ${how.techStack.map(tech => `
              <div class="tech-stack__item">
                <strong>${tech.category}</strong>
                <span>${tech.items}</span>
              </div>
            `).join('')}
          </div>

          <h3>Development Process</h3>
          <ol class="project-list project-list--numbered">
            ${how.process.map(step => `
              <li><strong>${step.step}:</strong> ${step.description}</li>
            `).join('')}
          </ol>

          <h3>Challenges & Solutions</h3>
          <p>${how.challenges}</p>
        </div>
      </section>
    `;
  }

  renderResultsSection(results) {
    return `
      <section class="project-section">
        <div class="project-section__icon">
          <ion-icon name="trophy-outline"></ion-icon>
        </div>
        <div class="project-section__content">
          <h2 class="project-section__title">Results & Learnings</h2>
          
          <h3>Outcomes</h3>
          <ul class="project-list">
            ${results.outcomes.map(o => `<li>${o}</li>`).join('')}
          </ul>

          <h3>Key Learnings</h3>
          <p>${results.learnings}</p>
        </div>
      </section>
    `;
  }

  renderPagination() {
    const currentIndex = this.projects.findIndex(p => p.id === this.currentProject.id);
    const prevProject = this.projects[currentIndex - 1];
    const nextProject = this.projects[currentIndex + 1];

    const container = document.getElementById('project-pagination');

    container.innerHTML = `
      ${prevProject ? `
        <a href="project.html?id=${prevProject.id}" class="project-pagination__link project-pagination__link--prev">
          <ion-icon name="arrow-back-outline"></ion-icon>
          <div>
            <span class="project-pagination__label">Previous Project</span>
            <span class="project-pagination__title">${prevProject.title}</span>
          </div>
        </a>
      ` : '<div></div>'}
      
      ${nextProject ? `
        <a href="project.html?id=${nextProject.id}" class="project-pagination__link project-pagination__link--next">
          <div>
            <span class="project-pagination__label">Next Project</span>
            <span class="project-pagination__title">${nextProject.title}</span>
          </div>
          <ion-icon name="arrow-forward-outline"></ion-icon>
        </a>
      ` : ''}
    `;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ProjectRenderer();
});


