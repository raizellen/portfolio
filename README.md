# Portfolio

Personal portfolio for Raizelle Nana. Plain HTML, CSS and a little JavaScript, so there is no build step.

## Pages

- `index.html`: landing page with the name tiles and skills strip
- `projects.html`: scroll-through project gallery
- `about.html`: school, tools, and things outside class
- `story.html`: the path so far (work and teaching experience)
- `contact.html`: email, LinkedIn, GitHub

## Fun bits

- Click the name tiles on the landing page and they hop.
- Click the cat (bottom of every page) and it jumps somewhere else and says something. Lines live in the `lines` array in `script.js`.
- The projects gallery scrolls with the arrows, the dots, or the left and right arrow keys.
- Motion is switched off for visitors who prefer reduced motion.

## Colours

All colours are variables at the top of `style.css` (`--rose`, `--ochre`, `--sage`, `--teal`, `--plum`, `--rust`, plus `--bg`, `--blush` and `--ink`). Change them there and the whole site follows.

## Run locally

Open `index.html` in a browser, or serve the folder:

    python3 -m http.server 8000

Then visit http://localhost:8000.

## Deploy with GitHub Pages

In the repo, go to Settings, then Pages, and choose "Deploy from a branch" with the `main` branch and the `/ (root)` folder.

## To do

- Replace the placeholder links on each project card in `projects.html` with the real repo or live site.
- Add a photo or illustration of yourself on the About page if you want one.
