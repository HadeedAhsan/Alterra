# Alterra

**Change one thing. Discover another world.**

Alterra is an interactive possibility lab. Move a slider, watch a simplified world respond, and compare it with the one you started from. Everything runs in the browser. There is no backend and no database.

Every result is an illustrative model, not a prediction. Each lab lists its assumptions and limits next to the numbers.

## The three labs

**City Lab.** Population, car use, and transit frequency. Watch commute time, road congestion, and transit ridership shift.

**Time Lab.** Sleep, focused work, and exercise inside a 24 hour day. See free time, energy, and productive output, including what happens when the day is overbooked.

**Nature Lab.** Rainfall, predators, and land cleared. See plant cover, herbivore numbers, and overall ecosystem health, including overgrazing when predators disappear.

## Features

- Live simulation: results update as you move a slider
- SVG visualization for each lab
- Baseline comparison: pin a scenario, change variables, and see ghost outlines plus a table of what changed
- Saved experiments: save, reopen, rename, and delete, stored in your browser with localStorage
- JSON export and import. Import only accepts Alterra exports and checks every value against the lab's slider range.
- Reset to defaults
- Dark only design with a cosmic look, responsive from phone to desktop
- Accessibility: keyboard navigation, visible focus states, skip link, labelled sliders and visuals, touch friendly controls, and reduced motion support

## Tech stack

- React 19 with React Router 7
- Vite 8
- Plain JavaScript (ES6+) with JSX
- SVG for visuals
- Lucide React for icons
- Fontsource for Space Grotesk, Inter, and JetBrains Mono
- Vitest for tests
- Oxlint for linting

## Getting started

You need Node.js 22.12 or newer.

```bash
git clone https://github.com/HadeedAhsan/Alterra.git
cd alterra
npm install
npm run dev
```

The dev server opens in your browser. To test on a phone on the same Wi-Fi, run `npm run dev -- --host` and open the Network URL it prints.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm test` | Run all tests once |
| `npm run lint` | Lint the code with Oxlint |
| `npm run build` | Create the production build in `dist` |
| `npm run preview` | Serve the production build locally |

## Project structure

```text
src/
  components/    Reusable UI: Button, Card, Panel, Slider, Outcome,
                 Toolbar, Comparison, SaveForm, Logo, BranchHero,
                 and one View per lab (CityView, TimeView, NatureView)
  data/          World list and availability (worlds.js)
  pages/         Home, Worlds, Workspace, Saved
  simulations/   Pure simulation logic, one folder per lab,
                 plus registry.js and compare.js
  storage/       localStorage experiments and JSON export
  styles/        Design tokens and global styles
```

## How a simulation works

Each lab is a pure function. It takes the current variable values and returns metrics, a short summary, and its assumptions. The React side never does the math. It only calls the function and draws the result.

```js
simulate(values) // { metrics, summary, assumptions }
```

To add a new lab:

1. Create `src/simulations/<name>/model.js` exporting its variables, defaults, and simulate function, with a test file beside it.
2. Register it in `src/simulations/registry.js`.
3. Add a View component in `src/components/` and map it in the `views` object in `src/pages/Workspace.jsx`.
4. Add the world to `src/data/worlds.js` with `available: true`.

## Data and privacy

Saved experiments live only in your browser under the key `alterra:experiments`. Nothing is sent anywhere. Clearing site data removes them, so use Export JSON on the Saved page if you want a copy.

Export format:

```json
{
  "app": "Alterra",
  "version": 1,
  "exportedAt": "2026-11-01T10:00:00.000Z",
  "experiments": []
}
```
Import skips any entry with an unknown lab, a missing variable, or a value outside the slider range, and reports how many it skipped. Experiments already saved are detected by id and not duplicated.

## Deployment

Alterra is a static site. Run `npm run build` and deploy the `dist` folder to Vercel, GitHub Pages, or any static host. Because routing happens in the browser, the host needs a fallback that serves `index.html` for unknown paths. This repo includes a vercel.json with that rewrite. On GitHub Pages you will need a 404 fallback or a hash router.

**Live demo: https://alterra-sepia.vercel.app/**

## Roadmap

- Share image for link previews

## Disclaimer

The models are deliberately simple and built to show cause and effect, not to forecast anything real. Do not use them for real decisions about cities, schedules, or ecosystems.

## License

MIT. See [LICENSE](LICENSE).