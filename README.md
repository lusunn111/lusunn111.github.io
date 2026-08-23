# Zhihao Mao Academic Homepage

This repository contains the source for [https://lusunn111.github.io](https://lusunn111.github.io). It uses [al-folio v1.2](https://github.com/alshedivat/al-folio/releases/tag/v1.2) and deploys automatically to GitHub Pages.

## Content

- `_pages/about.md`: homepage entry point using the custom academic profile layout.
- `_data/academic_profile.yml`: verified biography plus structured placeholders for education, experience, news, honors, funding, publications, patents, software, competitions, and favorite music.
- `_layouts/academic-profile.liquid`: AcadHomepage-inspired single-page structure implemented on top of the al-folio runtime.
- `assets/css/academic-profile.css`: responsive desktop and mobile presentation for the academic profile.
- `_pages/publications.md`: publication page; currently an explicit placeholder until the bibliography is verified.
- `_pages/projects.md`: project page; currently an explicit placeholder until public projects are verified.
- `_pages/blog.md`: lightweight redirect from the academic site's Blog navigation item to the separate blog.
- `_data/socials.yml`: verified public social profiles.
- `_bibliography/papers.bib`: the future publication source of truth.

The internal al-folio blog, demo news, demo projects, demo publications, and demo CV are intentionally disabled. The public blog is hosted separately at [https://lusunn111-blog.pages.dev](https://lusunn111-blog.pages.dev).

## Local preview

The recommended reproducible setup is Docker:

```bash
docker compose up
```

Then open `http://localhost:8080`.

With Ruby 3.3 and Bundler installed, the site can also be built directly:

```bash
bundle install
bundle exec jekyll build
bundle exec jekyll serve
```

## Deployment

Pushes to `master` trigger `.github/workflows/deploy.yml`, which builds the site and publishes the generated artifact through GitHub Pages. In the repository settings, the Pages source must be **GitHub Actions**.

Do not add publication, email, Google Scholar, ORCID, or CV data until it has been verified.
