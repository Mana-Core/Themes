// Builds themes.json, the index of every theme, the same way sources.json lists sources.
// CI runs this on every push to main and commits the result.

import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dir = join(root, 'themes')

// Mana loads a theme from this URL, so it has to be absolute.
const HOST = 'https://raw.githubusercontent.com/Mana-Core/Themes/main'

const themes = readdirSync(dir)
  .filter(file => file.endsWith('.json'))
  .sort()
  .map((file) => {
    const text = readFileSync(join(dir, file))
    const { theme } = JSON.parse(text)
    return {
      id: theme.id,
      name: theme.name,
      path: `themes/${file}`,
      url: `${HOST}/themes/${file}`,
      hash: createHash('sha256').update(text).digest('hex')
    }
  })

writeFileSync(join(root, 'themes.json'), JSON.stringify({ repositoryName: 'Mana Themes', themes }, null, 2) + '\n')
console.log(`✓ themes.json lists ${themes.length} themes`)
