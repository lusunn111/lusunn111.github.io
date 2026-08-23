(() => {
  const scholarProfileUrl = 'https://scholar.google.com/citations?user=lQmlVzoAAAAJ&hl=en';
  const scholarDataUrl =
    'https://cdn.jsdelivr.net/gh/lusunn111/lusunn111.github.io@google-scholar-stats/gs_data.json';

  const normalizeTitle = (value) =>
    value
      .toLowerCase()
      .replace(/[–—]/g, '-')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();

  const updateCitationLinks = async () => {
    const links = [...document.querySelectorAll('[data-scholar-title]')];
    if (links.length === 0) return;

    try {
      const response = await fetch(scholarDataUrl, { cache: 'no-store' });
      if (!response.ok) return;

      const data = await response.json();
      const publications = Object.values(data.publications || {});
      const byTitle = new Map(
        publications.map((publication) => [normalizeTitle(publication.bib?.title || ''), publication]),
      );

      links.forEach((link) => {
        const publication = byTitle.get(normalizeTitle(link.dataset.scholarTitle || ''));
        if (!publication) return;

        const count = Number(publication.num_citations || 0);
        link.textContent = `Citations: ${count}`;
        link.href = `${scholarProfileUrl}&view_op=view_citation&citation_for_view=${encodeURIComponent(
          publication.author_pub_id,
        )}`;
      });
    } catch {
      // The static Scholar profile links remain usable if the daily data endpoint is unavailable.
    }
  };

  const initializePublicationFilter = () => {
    const buttons = [...document.querySelectorAll('[data-publication-filter]')];
    const items = [...document.querySelectorAll('[data-publication-item]')];
    const groups = [...document.querySelectorAll('[data-publication-group]')];
    if (buttons.length === 0 || items.length === 0) return;

    const applyFilter = (filter) => {
      items.forEach((item) => {
        item.hidden = filter === 'representative' && item.dataset.representative !== 'true';
      });

      groups.forEach((group) => {
        group.hidden = !group.querySelector('[data-publication-item]:not([hidden])');
      });

      buttons.forEach((button) => {
        button.setAttribute('aria-pressed', String(button.dataset.publicationFilter === filter));
      });
    };

    buttons.forEach((button) => {
      button.addEventListener('click', () => applyFilter(button.dataset.publicationFilter));
    });

    applyFilter('representative');
  };

  initializePublicationFilter();
  updateCitationLinks();
})();
