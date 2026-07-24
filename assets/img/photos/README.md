# Photo assets

Drop photos here to replace SVG placeholders automatically (`main.js` → `has-photo`).

| File | Used for | Notes |
|------|----------|--------|
| `storit.png` | Hero + Services — Storit gallery (home screen) | App screenshot (portrait) |
| `ranking.png` | Services — Storit gallery (ranking) | App screenshot |
| `daily_mission.png` | Services — Storit gallery (daily mission) | App screenshot |
| `pictory.png` | Services — Picktory card logo | Logo (transparent PNG preferred) |
| `pictory1.png`–`pictory4.png` | Services — Picktory screen gallery | App screenshots |
| `kgsan.jpg` | Team — 김강산 (CEO) | Portrait, 4:5 crop, ~800×1000 |
| `kdshin.jpg` | Team — 김동신 (Planning) | Portrait, 4:5 crop, ~800×1000 |
| `tolli.png` | Services — tolli card logo | Mascot/logo, **transparent PNG** preferred |
| `tolli1.png`–`tolli4.png` | Services — tolli screen gallery | App screenshots |
| `workspace.jpg` | About — office | 21:9 wide; section hidden until file loads |

Supported: `.jpg`, `.png`, `.webp` (update `index.html` src if using webp).

## Optimized `.webp` (auto-generated)

Each source above has a resized `.webp` sibling used as the primary image via
`<picture><source type="image/webp"> … <img src="original"></picture>`. WebP is
served to ~97% of browsers; the original PNG/JPG is the fallback.

To regenerate after replacing a source image, run a `sharp` resize→webp pass
(widths: screenshots ~560, card shots ~320, logos ~480–640, avatars ~400,
`workspace` ~1600). The 1200×630 `assets/img/og-image.png` is built by
compositing `freshmilk.png` onto a brand background.

Team group photo: add as `team.jpg` when ready (slot not wired yet — ask to enable).
