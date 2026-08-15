# myPortfolio

Personal site for Prithvi Yadav — a scroll-driven WebGL journey through five zones
(Boot, Arsenal, Campaign, Builds, Comms) rather than a static profile page.

## Running locally

No build step. Any static server works:

```bash
npm run dev      # http://localhost:5173
```

Open `http://localhost:5173`. ES modules require a server — opening `index.html`
directly from the filesystem will not work.

## Deploying

Static deploy. On Vercel, no framework preset and no build command are needed;
`vercel.json` sets the headers and clean URLs.

## Structure

| Path | Purpose |
| --- | --- |
| `index.html` | The single page; all five zones |
| `js/world.js` | Three.js scene, camera travel, zone registry |
| `js/data.js` | All resume content — skills, roles, projects, education |
| `js/app.js` | Rendering, scroll, nav, reveal, audio, contact form |
| `js/cursor.js` | Canvas cursor comet trail |
| `images/covers/` | Per-project SVG cover art |
| `about/`, `skills/`, `portfolio/`, `contact/` | Redirect stubs to the matching zone |

## Editing content

Content is data-driven — change `js/data.js`, not markup:

- **Skills** — `ARSENAL`, grouped by tier; each `items` entry is a plain string.
- **Experience** — `CAMPAIGN`, newest first.
- **Projects** — `BUILDS`. Set `live` only when a deployment actually responds;
  a `null` renders a "source only" note instead of a Launch button.
## Contact form

Messages send through EmailJS from the browser. The IDs live in `EMAILJS` at the
top of the contact section in `js/app.js`:

- public key `dZrmv2BzBh92btBSA`
- service `service_k94trc3`
- template `template_blmp8rw`

The template must expose `from_name`, `from_email`, `subject`, and `message`.
If the SDK fails to load or the send errors, the form falls back to showing the
direct email address rather than silently failing.

**If sends fail with HTTP 412** (`Gmail_API: Invalid grant`), the EmailJS
service has lost its OAuth token to Gmail. Fix it in the EmailJS dashboard —
Email Services → `service_k94trc3` → Reconnect. No code change is needed.

Validation rules are a table (`FIELD_RULES`) — adding a required field means
adding a row, not a new branch.

## Notes

- Three.js loads from a pinned CDN via an import map (`three@0.160.0`).
- Falls back to a flat layout if WebGL is unavailable, and honours
  `prefers-reduced-motion`.
- The 3D scene is deliberately low-contrast: structural geometry uses a
  desaturated teal so the saturated cyan stays reserved for content.
