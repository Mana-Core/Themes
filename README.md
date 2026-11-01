# Mana Themes

Color themes for the Mana app. Every push to `main` builds this repo into [its own site](https://mana-core.github.io/Themes/themes.json), which hosts each theme and the `themes.json` index. The [Mana Core site](https://mana-core.github.io/themes/) shows a preview of each one with an **Add to Mana** link.

## Adding a theme

1. Add the theme to `themes/` as `your-theme-name.json`. The file name becomes its public URL, so don't rename it later.
2. Give it its own `id`, a new UUID.
3. Run `node scripts/check.mjs`.

`themes.json` is built, so there's nothing else to update. To build it locally, run `node scripts/build.mjs`, which writes to `dist/`. The Mana Core site picks up changes on its next rebuild, which runs daily.
