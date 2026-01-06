# Chia Jia Yi - Portfolio Website

A modern, responsive personal portfolio website built with vanilla HTML, CSS, and JavaScript.

![Portfolio Preview](assets/images/preview.png)

## ✨ Features

- **Fully Responsive** - Works on all devices (desktop, tablet, mobile)
- **Modern Design** - Custom color palette with smooth animations
- **Easy to Maintain** - JSON-based content management for projects and experience
- **Fast & Lightweight** - No frameworks, pure vanilla code
- **SEO Optimized** - Proper meta tags and semantic HTML
- **Accessible** - ARIA labels and keyboard navigation support

## 🎨 Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Warm Sand | `#D4AF89` | Accents, highlights |
| Lavender | `#D1CFE2` | Secondary backgrounds |
| Dusty Blue | `#9CADCE` | Tags, borders |
| Teal | `#7EC4CF` | Primary accent, CTAs |

## 📁 Project Structure

```
portfolio_website/
├── index.html              # Main HTML file
├── data/                   # JSON data files (easy content updates!)
│   ├── projects.json       # Your projects
│   ├── experience.json     # Work experience
│   ├── skills.json         # Technical skills
│   └── social.json         # Profile & social links
├── assets/
│   ├── css/
│   │   ├── style.css       # Main stylesheet (imports all others)
│   │   ├── variables.css   # Design tokens (colors, fonts, spacing)
│   │   ├── base.css        # Reset & base styles
│   │   ├── components/     # Reusable components
│   │   │   ├── sidebar.css
│   │   │   ├── navbar.css
│   │   │   ├── cards.css
│   │   │   ├── buttons.css
│   │   │   └── animations.css
│   │   └── sections/       # Section-specific styles
│   │       ├── about.css
│   │       ├── resume.css
│   │       ├── portfolio.css
│   │       └── contact.css
│   ├── js/
│   │   ├── main.js         # Main JavaScript
│   │   └── data-loader.js  # JSON data loader utility
│   └── images/
│       ├── profile/        # Your profile photos
│       ├── projects/       # Project screenshots
│       └── logos/          # Company logos
└── README.md
```

## 🚀 Getting Started

### 1. Clone or Download

```bash
git clone https://github.com/yourusername/portfolio_website.git
cd portfolio_website
```

### 2. Add Your Images

Replace the placeholder images:
- `assets/images/profile/avatar.jpg` - Your profile photo (300x300px recommended)
- `assets/images/projects/*.jpg` - Project screenshots (800x500px recommended)

### 3. Update Your Information

Edit the JSON files in the `data/` folder:

**`data/social.json`** - Your profile info:
```json
{
  "profile": {
    "name": "Your Name",
    "title": "Your Title",
    "email": "your@email.com"
  }
}
```

**`data/projects.json`** - Add your projects:
```json
{
  "projects": [
    {
      "id": "project-1",
      "title": "My Project",
      "category": "web-development",
      "description": "Project description...",
      "image": "assets/images/projects/my-project.jpg",
      "tags": ["React", "Node.js"],
      "links": {
        "live": "https://myproject.com",
        "github": "https://github.com/you/project"
      }
    }
  ]
}
```

### 4. Preview Locally

Simply open `index.html` in your browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```

Then visit `http://localhost:8000`

## 🌐 Deployment

### GitHub Pages (Recommended - Free!)

1. Push your code to GitHub
2. Go to repository **Settings** → **Pages**
3. Select **Source**: `main` branch, `/ (root)` folder
4. Click **Save**
5. Your site will be live at `https://yourusername.github.io/portfolio_website`

### Custom Domain

1. Buy a domain (Namecheap, Google Domains, etc.)
2. Add a `CNAME` file with your domain name
3. Configure DNS:
   - Add CNAME record: `www` → `yourusername.github.io`
   - Add A records pointing to GitHub's IPs
4. Enable HTTPS in GitHub Pages settings

### Other Hosting Options

- **Netlify**: Drag & drop deployment
- **Vercel**: Great for static sites
- **Cloudflare Pages**: Unlimited bandwidth

## 🛠️ Customization

### Changing Colors

Edit `assets/css/variables.css`:

```css
:root {
  --clr-warm-sand: #D4AF89;    /* Change your accent color */
  --clr-teal: #7EC4CF;          /* Change your primary color */
  --bg-primary: #1A1A2E;        /* Change background */
}
```

### Changing Fonts

1. Update Google Fonts import in `assets/css/style.css`
2. Update font variables in `assets/css/variables.css`:

```css
:root {
  --font-heading: 'Your Font', sans-serif;
  --font-body: 'Your Body Font', sans-serif;
}
```

### Adding New Sections

1. Add HTML section in `index.html`
2. Create CSS file in `assets/css/sections/`
3. Import in `assets/css/style.css`
4. Add navigation link in navbar

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Credits

- Design inspired by [vCard Portfolio](https://github.com/codewithsadee/vcard-personal-portfolio) by codewithsadee
- Icons by [Ionicons](https://ionic.io/ionicons)
- Fonts by [Google Fonts](https://fonts.google.com)

---

Made with 💜 by Chia Jia Yi


