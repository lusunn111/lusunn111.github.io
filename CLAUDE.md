# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Local Development
```bash
# Install Ruby dependencies
bundle install

# Start local development server with live reload
bundle exec jekyll serve -l -H localhost

# Alternative command if gem permission issues occur
bundle config set --local path 'vendor/bundle'
bundle install
bundle exec jekyll serve -l -H localhost
```

### Docker Development
```bash
# Build and run with Docker Compose
chmod -R 777 .
docker compose up

# Access site at http://localhost:4000
```

### JavaScript/CSS Build
```bash
# Install Node.js dependencies
npm install

# Build and minify JavaScript
npm run build:js

# Watch JavaScript files for changes
npm run watch:js
```

## Project Architecture

This is a **Jekyll-based academic portfolio website** using the Academic Pages template, a fork of Minimal Mistakes. The site generates static HTML for GitHub Pages hosting.

### Key Directories and Files

- **`_config.yml`** - Main site configuration with site metadata, author info, and Jekyll settings
- **`_posts/`** - Blog posts (Markdown files with date-based naming)
- **`_pages/`** - Static pages like About, CV, Publications
- **`_publications/`** - Academic publications collection
- **`_talks/`** - Conference talks and presentations
- **`_teaching/`** - Teaching experience and courses
- **`_portfolio/`** - Project portfolio items
- **`_layouts/`** - HTML templates for different content types
- **`_includes/`** - Reusable HTML components and partials
- **`_sass/`** - SCSS stylesheets organized by theme and layout
- **`assets/`** - Static assets (CSS, JS, fonts, images)
- **`files/`** - File uploads accessible via `/files/filename.ext`

### Collections Structure

The site uses Jekyll collections with specific layouts:
- **Posts** (`_posts/`) - Blog entries with `single` layout
- **Publications** (`_publications/`) - Academic papers with `single` layout
- **Talks** (`_talks/`) - Presentations with `talk` layout
- **Teaching** (`_teaching/`) - Course information with `single` layout
- **Portfolio** (`_portfolio/`) - Project showcase with `single` layout

### Content Generation Tools

- **`markdown_generator/`** - Python scripts and Jupyter notebooks for generating publications/talks from TSV files
- **`scripts/`** - Utility scripts including CV markdown to JSON conversion
- **`talkmap.py`** - Generates interactive map of talk locations

### Configuration Notes

- Site is configured for GitHub Pages hosting at `https://lusunn111.github.io`
- Uses Chinese locale and author information for Zhihao Mao
- Includes social media integration (Zhihu, GitHub, etc.)
- Supports comments via multiple providers (currently disabled)
- Google Analytics disabled (set to "false")

### Development Environment

- **Ruby**: Jekyll with GitHub Pages gem
- **Node.js**: For JavaScript asset processing
- **Docker**: Containerized development environment available
- **Live Reload**: Automatic browser refresh on file changes during development

### File Naming Conventions

- Posts: `YYYY-MM-DD-title.md`
- Collections: `YYYY-MM-DD-title.md` format for consistent archiving
- Pages: Use `.md` or `.html` extensions in `_pages/` directory