import { readFileSync, rmSync, writeFileSync } from 'node:fs'

// `vue-tsc` keeps the CSS side-effect import from the source entry in the
// declaration file. Consumers do not need it and TypeScript projects without a
// `*.css` module declaration would fail on it, so strip it from the published
// types. The JS entry still imports the stylesheet.
const path = 'dist/types/index.d.ts'
const source = readFileSync(path, 'utf8')
const cleaned = source.replace(/^import ['"]\.\/style\.css['"];\r?\n/m, '')
if (cleaned === source) {
  console.log('declarations: no css import to strip')
} else {
  writeFileSync(path, cleaned)
  console.log(`declarations: stripped css import from ${path}`)
}

// tsc mirrors the JSON fixtures next to the declarations. The `samples` entry
// already bundles them into `dist/samples.js`, so drop the duplicates.
rmSync('dist/samples', { recursive: true, force: true })
console.log('declarations: removed duplicated JSON fixtures')
