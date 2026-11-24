# Portfolio rebuild — what to do

## Install

Copy into the root of `github.com/Nawazaz/Portfolio`, replacing the old ones:

```
index.html
style.css
script.js
assets/Nawaz_CV.pdf     <- your new CV, replaces the old one
```

Push to `main`. GitHub Pages serves these files directly, so it's live immediately.

## Delete these (no longer used)

```
assets/wellness-home.jpg
assets/wellness-signin.jpg
assets/Wellnessbridge.pdf
```

The old site also pointed at `assets/sustainalink-3.jpg`, which doesn't exist in the repo —
that was a broken image. Nothing references it now.

Your `package.json`, `vite.config.ts`, `tsconfig.json`, `bun.lockb` and `package-lock.json` are
leftovers from a React/shadcn template and were never used by the site — it's plain HTML, CSS and
JS. I left them alone, but you can delete them and drop ~540KB.

## What changed

**Content** is now from your current CV. New: Virtual Science Park, Deep Learning Coursework, the
Trafikverket detail on the SRE agent, and your updated skills. Your positioning changed from
"Computer Engineer · IoT Specialist" to AI/ML engineer, which is what your CV now says.

**Design** carries the same electric cyan/violet as your GitHub profile, so the two read as one
identity.

**Parallax and motion**
- Hero: canvas starfield with depth layers, drifting gradient orbs, rotating energy core, and a
  core that drifts with your mouse
- Headings, project images and orbs all move at different scroll speeds
- Project images are oversized inside their frames and slide within them as you scroll
- Scroll progress rail at the top, timeline that fills as you scroll it
- Counters that count up when they come into view
- Everything respects `prefers-reduced-motion`

Parallax is off below 760px, both for layout safety and battery.

## Worth checking

- **The SRE agent card has no repo link.** You called it a private team repo before, but the
  team repo `maxcolliander/SRE-Agent` exists. If it's public, wrap that card's `<img>` in a link
  like the other cards.
- **Virtual Science Park has no link.** Add the repo or demo if there is one.
- **Your phone number is not on the site** — same reasoning as the GitHub profile. Email and
  LinkedIn are there.
- **Fonts** load from Google Fonts (Space Grotesk + JetBrains Mono). If you'd rather not depend
  on that, delete the two `<link>` tags in `<head>` and it falls back to system fonts cleanly.
