# Zero-Dose Children in Nigeria -- Interactive Dashboard

Interactive React dashboard presenting the results of an integrated ML-ABM-CNA pipeline for identifying intervention recipes to achieve 80% Pentavalent-1 vaccination coverage recovery in zero-dose communities across Nigeria.

## Live Demo

https://[username].github.io/zerodose-nigeria/

## Experiences

- **The Story** -- Scrollytelling data narrative (6 sections)
- **Policy Dashboard** -- Interactive maps, scenario comparison, what-if explorer
- **Technical Explorer** -- Full pipeline outputs with 7 analysis tabs

## Local Development

```bash
cd website
npm install
npm run dev
```

Open http://localhost:5173/zerodose-nigeria/

## Production Build

```bash
npm run build
npx serve dist
```

## Data Preparation

Data files in `public/data/` are pre-generated from pipeline outputs. To regenerate:

```bash
cd /path/to/vacSeries
python website/scripts/prepare_website_data.py
python website/scripts/precompute_scenarios.py
```

## Tech Stack

- React 18 + Vite
- Tailwind CSS + glass-morphism design system
- D3.js (modular) for charts
- Framer Motion for animations
- react-scrollama for scrollytelling
- Web Worker for counterfactual interpolation
- GitHub Actions for deployment

## Data Source

Nigeria Demographic and Health Survey (NDHS) 2024, 2018, 2013.
National Population Commission (NPC) [Nigeria] and ICF.

## Citation

Uthman OA. Trust, Access, and Causal Recipes for Vaccination Coverage Recovery in Nigeria. 2026.
