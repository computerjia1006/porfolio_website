#!/usr/bin/env node

/**
 * Blog Build Script
 * 
 * Converts Markdown files in blog/posts/ to JSON format for the website.
 * 
 * Usage:
 *   node scripts/build-blog.js
 * 
 * This script:
 * 1. Reads all .md files from blog/posts/
 * 2. Parses frontmatter (metadata) and content
 * 3. Converts Markdown to structured JSON
 * 4. Outputs to data/blog.json
 */

const fs = require('fs');
const path = require('path');

// Paths
const POSTS_DIR = path.join(__dirname, '..', 'blog', 'posts');
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'blog.json');

/**
 * Parse frontmatter from markdown content
 */
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { metadata: {}, body: content };
  }

  const frontmatter = match[1];
  const body = match[2].trim();
  
  // Parse YAML-like frontmatter
  const metadata = {};
  frontmatter.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;
    
    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();
    
    // Parse arrays [item1, item2]
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map(s => s.trim());
    }
    // Parse booleans
    else if (value === 'true') value = true;
    else if (value === 'false') value = false;
    
    metadata[key] = value;
  });

  return { metadata, body };
}

/**
 * Convert markdown body to structured content sections
 */
function parseMarkdownToSections(markdown) {
  const lines = markdown.split('\n');
  const sections = [];
  let currentParagraph = [];

  function flushParagraph() {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(' ').trim();
      if (text) {
        sections.push({ type: 'paragraph', text });
      }
      currentParagraph = [];
    }
  }

  let inList = false;
  let listItems = [];
  let inCodeBlock = false;
  let codeLines = [];
  let codeLanguage = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code blocks
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        flushParagraph();
        inCodeBlock = true;
        codeLanguage = line.slice(3).trim();
        codeLines = [];
      } else {
        sections.push({ 
          type: 'code', 
          text: codeLines.join('\n'),
          language: codeLanguage 
        });
        inCodeBlock = false;
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    // Headings
    if (line.startsWith('## ')) {
      flushParagraph();
      if (inList) {
        sections.push({ type: 'list', items: listItems });
        inList = false;
        listItems = [];
      }
      sections.push({ type: 'heading', text: line.slice(3).trim() });
      continue;
    }

    if (line.startsWith('### ')) {
      flushParagraph();
      if (inList) {
        sections.push({ type: 'list', items: listItems });
        inList = false;
        listItems = [];
      }
      sections.push({ type: 'subheading', text: line.slice(4).trim() });
      continue;
    }

    // Blockquotes
    if (line.startsWith('> ')) {
      flushParagraph();
      if (inList) {
        sections.push({ type: 'list', items: listItems });
        inList = false;
        listItems = [];
      }
      sections.push({ type: 'quote', text: line.slice(2).trim() });
      continue;
    }

    // List items
    if (line.startsWith('- ') || line.startsWith('* ')) {
      flushParagraph();
      if (!inList) {
        inList = true;
        listItems = [];
      }
      listItems.push(line.slice(2).trim());
      continue;
    }

    // End of list
    if (inList && line.trim() === '') {
      sections.push({ type: 'list', items: listItems });
      inList = false;
      listItems = [];
      continue;
    }

    // Empty line = end of paragraph
    if (line.trim() === '') {
      flushParagraph();
      continue;
    }

    // Regular text
    currentParagraph.push(line);
  }

  // Flush remaining content
  flushParagraph();
  if (inList) {
    sections.push({ type: 'list', items: listItems });
  }

  return sections;
}

/**
 * Main build function
 */
function buildBlog() {
  console.log('🔨 Building blog...\n');

  // Check if posts directory exists
  if (!fs.existsSync(POSTS_DIR)) {
    console.log('📁 Creating posts directory...');
    fs.mkdirSync(POSTS_DIR, { recursive: true });
  }

  // Get all markdown files (excluding template)
  const files = fs.readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.md') && !f.startsWith('_'));

  console.log(`📄 Found ${files.length} post(s)\n`);

  const posts = [];

  for (const file of files) {
    const filePath = path.join(POSTS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    const { metadata, body } = parseFrontmatter(content);
    const sections = parseMarkdownToSections(body);

    const post = {
      id: metadata.id || file.replace('.md', ''),
      title: metadata.title || 'Untitled',
      excerpt: metadata.excerpt || '',
      category: metadata.category || 'General',
      date: metadata.date || new Date().toISOString().split('T')[0],
      readingTime: metadata.readingTime || '5 min read',
      image: metadata.image || 'assets/images/blog/placeholder.jpg',
      tags: Array.isArray(metadata.tags) ? metadata.tags : [],
      featured: metadata.featured || false,
      content: { sections }
    };

    posts.push(post);
    console.log(`  ✅ ${post.title}`);
  }

  // Sort by date (newest first)
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Build output
  const output = {
    posts,
    categories: [
      { id: 'all', label: 'All Posts' },
      { id: 'technology', label: 'Technology' },
      { id: 'career', label: 'Career' },
      { id: 'personal', label: 'Personal' }
    ]
  };

  // Write to file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  
  console.log(`\n✨ Built ${posts.length} post(s) → data/blog.json`);
}

// Run
buildBlog();

