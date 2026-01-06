/**
 * Blog Renderer
 * Dynamically renders blog posts from data/blog.json
 * 
 * To add a new blog post, simply add an entry to data/blog.json
 * OR create a .md file in blog/posts/ and run the build script
 */

'use strict';

class BlogRenderer {
  constructor() {
    this.blogGrid = null;
    this.posts = [];
    this.dataPath = 'data/blog.json';
  }

  /**
   * Initialize the blog renderer
   */
  async init() {
    this.blogGrid = document.getElementById('blog-grid');
    if (!this.blogGrid) {
      console.log('Blog grid not found, skipping initialization');
      return;
    }

    try {
      await this.loadPosts();
      this.renderPosts();
    } catch (error) {
      console.error('Error initializing blog:', error);
      this.showError();
    }
  }

  /**
   * Load posts from JSON
   */
  async loadPosts() {
    const response = await fetch(this.dataPath);
    if (!response.ok) {
      throw new Error('Failed to load blog posts');
    }
    const data = await response.json();
    this.posts = data.posts || [];
  }

  /**
   * Render all posts
   */
  renderPosts() {
    if (this.posts.length === 0) {
      this.showEmpty();
      return;
    }

    // Sort posts by date (newest first)
    const sortedPosts = [...this.posts].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );

    this.blogGrid.innerHTML = sortedPosts.map(post => this.createPostCard(post)).join('');
  }

  /**
   * Create a single post card
   */
  createPostCard(post) {
    const formattedDate = this.formatDate(post.date);
    const tagsHTML = post.tags.slice(0, 3).map(tag => 
      `<span class="blog-card__tag">${tag}</span>`
    ).join('');

    return `
      <article class="blog-card" data-post-id="${post.id}">
        <div class="blog-card__image">
          <img src="${post.image}" alt="${post.title}" 
               onerror="this.src='assets/images/blog/placeholder.jpg'">
          <span class="blog-card__category">${post.category}</span>
        </div>
        
        <div class="blog-card__content">
          <div class="blog-card__meta">
            <span class="blog-card__meta-item">
              <ion-icon name="calendar-outline"></ion-icon>
              ${formattedDate}
            </span>
          </div>
          
          <h3 class="blog-card__title">${post.title}</h3>
          
          <p class="blog-card__excerpt">${post.excerpt}</p>
          
          <div class="blog-card__tags">
            ${tagsHTML}
          </div>
          
          <div class="blog-card__footer">
            <a href="blog/post.html?id=${post.id}" class="blog-card__read-more">
              Read More
              <ion-icon name="arrow-forward-outline"></ion-icon>
            </a>
            <span class="blog-card__reading-time">
              <ion-icon name="time-outline"></ion-icon>
              ${post.readingTime}
            </span>
          </div>
        </div>
      </article>
    `;
  }

  /**
   * Format date to readable string
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Show empty state
   */
  showEmpty() {
    this.blogGrid.innerHTML = `
      <div class="blog__empty">
        <div class="blog__empty-icon">
          <ion-icon name="document-text-outline"></ion-icon>
        </div>
        <p class="blog__empty-text">No posts yet</p>
        <p class="blog__empty-subtext">Check back soon for new content!</p>
      </div>
    `;
  }

  /**
   * Show error state
   */
  showError() {
    this.blogGrid.innerHTML = `
      <div class="blog__empty">
        <div class="blog__empty-icon">
          <ion-icon name="alert-circle-outline"></ion-icon>
        </div>
        <p class="blog__empty-text">Unable to load posts</p>
        <p class="blog__empty-subtext">Please try refreshing the page</p>
      </div>
    `;
  }
}

// Export for use
if (typeof window !== 'undefined') {
  window.BlogRenderer = BlogRenderer;
}
