# Mana Themes

Color themes for the Mana app. This repo hosts every theme, and [`themes.json`](themes.json) lists them. The [Mana Core site](https://mana-core.github.io/themes/) shows a preview of each one with an **Add to Mana** link.

## Adding a theme

1. Add the theme to `themes/` as `your-theme-name.json`. The file name becomes its public URL, so don't rename it later.
2. Give it its own `id`, a new UUID.
3. Run `node scripts/check.mjs`.

Don't edit `themes.json` by hand: every push to `main` rebuilds it. The site picks up changes on its next rebuild, which runs daily.
