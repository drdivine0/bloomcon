# BLOOMCON 2.0 website

Static, public-facing site for BLOOMCON 2.0 (14 November 2026). Plain HTML, CSS and JavaScript:
no build step and no Node. Edit the files and upload the folder to any web host.

Libraries load from CDNs: Tailwind CSS (utility classes), Alpine.js (interactivity and templates),
GSAP (animation) and qrcode-generator (ticket QR code).

## Files

```
index.html                    Page layout and Alpine templates (the "components")
assets/js/content.js          All repeated content: programmes, schedule, audiences, partners, FAQs, nav
assets/js/app.js              Page behaviour: selection, filters, dialog, registration, ticket
assets/js/motion.js           Animations (the page still works if GSAP is blocked or motion is reduced)
assets/js/tailwind.config.js  Tailwind theme: maps bg-rose, text-muted… to the colour tokens
assets/css/styles.css         Colour tokens, dark mode and custom components
assets/img/                   Flower logo (colour and mono SVG), app icons and the social share image
```

## Brand

The six-petal flower is drawn in SVG, so it stays sharp and can animate. The page uses it
through the `#logo-mark` symbol in the sprite at the top of `<body>`; the hero and programme
cards have their own copies so their petals can bloom. Colours (forest `#163828`, cream
`#FFF7EE`, salmon `#F4A98C`, mustard `#E8B13B`, mint `#80C68B`) are tokens at the top of
`styles.css`. Headings use Unbounded, body text uses Figtree.

## Editing content

Programmes, schedule rows, audiences, partner tiers, FAQs and nav links are data in
`assets/js/content.js`. Each is rendered by a single template in `index.html` (look for
`x-for`), so adding a programme means adding one object to `PROGRAMS`: its card, details
dialog, registration option and ticket chip all appear automatically. A programme's `phase`
sets its colour, and `icon` is an id from the icon sprite.

One-off sections (hero, journey, exhibit, closing call to action) stay as plain HTML.

## Hosting

Hosted on GitHub Pages from the `main` branch of [drdivine0/bloomcon](https://github.com/drdivine0/bloomcon).
Pushing to `main` publishes the site. `.nojekyll` tells Pages to serve the files as they are.

## Previewing

Open `index.html` through a local web server rather than double-clicking it, so the
browser treats it like the live site. In VS Code the Live Server extension works.

## Before launch

1. **Domain.** The site is set up for `https://drdivine0.github.io/bloomcon/`. If you move it to its own domain,
   replace that address in `index.html` (canonical, social sharing, structured data), `robots.txt` and `sitemap.xml`.
2. **Registrations.** Set `FORM_ENDPOINT` at the top of `assets/js/app.js` to a form service
   that accepts a JSON POST (Formspree, Basin, or your own API). Until it is set, registrations
   stay on the visitor's device and the ticket shows a notice saying so.
3. **Contact details.** Fill in the WhatsApp number and email in the footer.

## Adding an icon

Icons are an inline SVG sprite at the top of `<body>`. To add one, copy the inner `<path>`
elements of the icon from [lucide.dev](https://lucide.dev) into a new
`<symbol id="i-NAME" viewBox="0 0 24 24">…</symbol>`, then use it as
`<svg class="icon h-5 w-5" aria-hidden="true"><use href="#i-NAME"/></svg>`.
