# Design QA

## Comparison target

- Source visual truth:
  - `https://diaoquesang.github.io/`
  - `https://jiayu-chen03.github.io/`
- Source captures:
  - `design-qa-assets/diao-desktop.png`
  - `design-qa-assets/jiayu-desktop.png`
  - `design-qa-assets/jiayu-mobile.png`
  - `design-qa-assets/jiayu-publications.png`
- Implementation: `http://127.0.0.1:4000/`
- Implementation captures:
  - `design-qa-assets/implementation-desktop.png`
  - `design-qa-assets/implementation-mobile.png`
  - `design-qa-assets/implementation-publications-mobile.png`
- Combined comparison inputs:
  - `design-qa-assets/desktop-comparison.png`
  - `design-qa-assets/mobile-comparison.png`
  - `design-qa-assets/publications-mobile-comparison.png`

## Viewports and normalization

- Desktop browser viewport: 1280 × 720 CSS px, device pixel ratio 1. Browser capture: 1220 × 712 px for each source and implementation. No density resampling was required.
- Mobile browser viewport: 390 × 844 CSS px, device pixel ratio 1. Browser capture: 375 × 812 px for both Jiayu and the implementation. No density resampling was required.
- State: light theme, initial page load with all publications visible. Publications were additionally checked in representative and all-publications states.

## Full-view comparison evidence

The desktop comparison confirms that the implementation preserves Diao's fixed identity column, dense academic-document layout, compact section rhythm, live metric badges, and logo-backed education entries. The mobile comparison confirms that the profile collapses into a compact identity header while keeping Jiayu's social-icon treatment and content hierarchy.

## Focused-region comparison evidence

The publications comparison checks the most detailed region at the same mobile size. It confirms the representative/all switch, real framework images, venue emphasis, author hierarchy, Paper/Code/Citations links, and readable single-column collapse. The experience region was also inspected in the browser at desktop and mobile sizes; the alternating desktop timeline becomes a single left-rail timeline on mobile.

## Findings

- No actionable P0, P1, or P2 issue remains.
- Fonts and typography: the Trebuchet/Helvetica/Arial stack matches Diao's compact academic tone; weights and line heights remain readable for long author lists at both tested sizes.
- Spacing and layout rhythm: desktop identity/content proportions, section rules, timeline spacing, and mobile stacking are consistent and do not overflow.
- Colors and visual tokens: the implementation keeps Diao's neutral gray/blue base and borrows Jiayu's restrained maroon publication and timeline accents without introducing card-heavy styling.
- Image quality and asset fidelity: the portrait is an 800 × 800 WebP derived from the user-selected white-background photo; the CUG emblem comes from the university's official visual identity system; university logos and all eight publication thumbnails are real local assets with correct aspect ratios and no hotlinking. HeiSD, FreqCache, and 2D or 3D use framework figures downloaded from their arXiv HTML papers; CAMODE-CLA and APEX-SAM use framework overviews extracted from the official paper PDFs supplied by the user.
- Copy and content: current undergraduate status, incoming PKU Ph.D. status, IF-Lab internship, publications, and awards are separated accurately. Published/accepted papers and preprints are not conflated.
- New evidence-backed content: Funding lists the official 2024–2025 BYD Scholarship as scholarship support; About lists the user-confirmed 2027 reviewer service; Open Source lists the user-confirmed core-contributor roles for KERV, RoboECC, and RoboNix, the public A-Pilot edge-MoE contribution, the maintained CUG Template collection, four merged RoboNix upstream pull requests, two RoboNix skills, two services, and live star badges.

## Comparison history

1. Earlier P2: the Scholar badge had no backing JSON branch and the visitor badge provider returned a broken image. Fixed by initializing `google-scholar-stats` and switching to a working visitor badge endpoint. Post-fix browser evidence shows `Citations 22`, GitHub totals, and a visible visitor count.
2. Earlier P2: the third representative paper image could appear late after scrolling. Fixed by eagerly loading the three small representative images. Post-fix publication comparison shows all representative figures rendered.
3. Earlier P2: flat experience rows did not match Jiayu's internship presentation. Replaced with a logo-backed timeline that alternates on desktop and collapses to one rail on mobile. Post-fix desktop evidence shows consistent logos, dates, titles, advisor links, and descriptions.

## Primary interactions and runtime checks

- Initial Show All state: 8 visible.
- Representative filter: 4 visible.
- Mobile overflow navigation: opens, reports `aria-expanded=true`, and closes correctly.
- Dynamic citation link: KERV resolves to `Citations: 10` and links to its Google Scholar detail entry.
- Browser console: no errors during the final local check.
- Publication asset runtime check: 8 of 8 images completed with non-zero natural dimensions.
- Favorite Music interaction: 10 local cover images render at 600 × 600; 9 tracks expose official Apple Music 30-second previews, and the custom player supports card selection, play/pause, previous/next, progress, volume, sequential, shuffle, and repeat-one modes. The first playback test advanced normally with a 30-second duration and no console error.
- Responsive check: at a 390 × 844 viewport, the document client width and scroll width are both 390 px; all nine Open Source rows, the player controls, and the ten Diao-inspired Favorite Music cards wrap without horizontal overflow.
- Jekyll production build: passed.

## Follow-up polish

- P3: the visitor badge wraps to a second line at 390 px. This is acceptable and avoids shrinking the academic text or truncating a live metric.
- P3: Patents remains an explicit placeholder until verified content is available. Favorite Music contains ten user-selected, source-checked tracks with local cover art, official full-track links, and nine stable official preview sources. `知我` retains a full-track platform link because no stable official web preview file was found. The former Software section was removed because the verified repositories belong under Open Source and there is currently no software-copyright record to list.

final result: passed
