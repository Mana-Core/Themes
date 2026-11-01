// Builds dist/themes.json and dist/themes/*.json, the same way mana-dev builds sources.json
// and its bundles. CI publishes dist to GitHub Pages on every push to main.

import { createHash } from 'node:crypto'
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = join(root, 'themes')
const dist = join(root, 'dist')

// Mana loads a theme from this URL, so it has to be absolute.
const HOST = 'https://mana-core.github.io/Themes'

rmSync(dist, { recursive: true, force: true })
mkdirSync(join(dist, 'themes'), { recursive: true })

const themes = readdirSync(source)
  .filter(file => file.endsWith('.json'))
  .sort()
  .map((file) => {
    const text = readFileSync(join(source, file))
    writeFileSync(join(dist, 'themes', file), text)
    const { theme } = JSON.parse(text)
    return {
      id: theme.id,
      name: theme.name,
      path: `themes/${file}`,
      url: `${HOST}/themes/${file}`,
      hash: createHash('sha256').update(text).digest('hex')
    }
  })

writeFileSync(join(dist, 'themes.json'), JSON.stringify({ repositoryName: 'Mana Themes', themes }, null, 2) + '\n')
console.log(`✓ dist/themes.json lists ${themes.length} themes`)
