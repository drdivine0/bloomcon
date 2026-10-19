/* Theme for the Tailwind CDN: maps utility names (bg-forest, text-muted…) to the colour tokens in styles.css */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Figtree', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Unbounded', 'Figtree', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Fixed brand colours
        forest: token('forest'),
        cream: token('cream'),
        salmon: token('salmon'),
        mustard: token('mustard'),
        mint: token('mint'),
        // Theme-aware colours (change in dark mode)
        paper: token('paper'),
        surface: token('surface'),
        ink: token('ink'),
        muted: token('muted'),
        line: token('line'),
        brand: token('brand'),
        'on-brand': token('on-brand'),
        'salmon-deep': token('salmon-deep'),
        'salmon-soft': token('salmon-soft'),
        'mustard-deep': token('mustard-deep'),
        'mustard-soft': token('mustard-soft'),
        'mint-deep': token('mint-deep'),
        'mint-soft': token('mint-soft'),
        'forest-soft': token('forest-soft'),
      },
      boxShadow: {
        lift: '0 1px 2px rgb(var(--shadow) / .08), 0 8px 24px -8px rgb(var(--shadow) / .14)',
        float: '0 2px 6px rgb(var(--shadow) / .10), 0 24px 48px -12px rgb(var(--shadow) / .28)',
      },
    },
  },
};
