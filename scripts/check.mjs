// Validates every theme before it reaches the docs site, whose build fails on a bad one.

import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = resolve(dirname(fileURLToPath(import.meta.url)), '../themes')

// The colors the previews on the docs site draw with. contentTileOverlay is left out because
// the previews fall back to the background for it.
const REQUIRED = [
  'accent', 'background', 'foregroundOnAccent', 'label', 'secondaryBackground',
  'secondaryLabel', 'separator', 'statusDestructive', 'statusInfo', 'tertiaryBackground'
]
const COLOR = /^#[0-9A-Fa-f]{8}$/
const UUID = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i
const FILE_NAME = /^[a-z0-9]+(-[a-z0-9]+)*\.json$/
const GITHUB_USER = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/

const errors = []
const ids = new Map()
const names = new Map()
const files = readdirSync(dir).filter(file => file.endsWith('.json'))

if (!files.length) errors.push('no themes found')

for (const file of files) {
  const fail = message => errors.push(`${file}: ${message}`)

  // The file name is the public URL, so it stays lowercase and URL-safe.
  if (!FILE_NAME.test(file)) fail('the file name must be lowercase words joined by hyphens')

  let parsed
  try {
    parsed = JSON.parse(readFileSync(join(dir, file), 'utf8'))
  } catch (error) {
    fail(`not valid JSON (${error.message})`)
    continue
  }

  const { schemaVersion, author, theme } = parsed
  if (schemaVersion !== 1) fail('schemaVersion must be 1')
  if (typeof author?.name !== 'string' || !author.name.trim()) fail('needs an author with a name')
  if (author?.github !== undefined && !GITHUB_USER.test(author.github)) fail('author.github must be a GitHub username')
  if (!theme?.name) fail('needs a name')
  if (!UUID.test(theme?.id ?? '')) fail('needs an id that is a UUID')

  const colors = theme?.colors?.values ?? {}
  for (const key of REQUIRED) {
    if (!colors[key]) fail(`missing color ${key}`)
  }
  for (const [key, value] of Object.entries(colors)) {
    if (!COLOR.test(value)) fail(`${key} must be #RRGGBBAA, not ${value}`)
  }

  // A theme's id is its identity in Mana, so a copied file must not ship with the original's.
  for (const [seen, value] of [[ids, theme?.id?.toUpperCase()], [names, theme?.name]]) {
    if (!value) continue
    if (seen.has(value)) fail(`shares "${value}" with ${seen.get(value)}`)
    seen.set(value, file)
  }
}

if (errors.length) {
  console.error(errors.map(error => `✗ ${error}`).join('\n'))
  process.exit(1)
}

console.log(`✓ ${files.length} themes pass`)
