import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'

import type { Plugin } from 'vite'

const require = createRequire(import.meta.url)

/** Runtime files the engine resolves relative to `assetBaseUrl`. */
const ENGINE_ASSETS = ['wasm', 'fonts', 'score-engine.worker.js'] as const

const STAMP_FILE = '.pu-score-engine.json'

function engineDistDir(): string {
  const packageJson = require.resolve('@viritura/score-engine/package.json')
  return join(dirname(packageJson), 'dist')
}

export interface ScoreEngineAssetsOptions {
  /**
   * Directory that should contain `wasm/`, `fonts/` and
   * `score-engine.worker.js`. Defaults to `<publicDir>/score-engine`.
   */
  target?: string
}

/**
 * Copies the engine runtime files into the host app's public directory.
 *
 * The engine loads WASM, fonts and its layout worker from `assetBaseUrl` at
 * runtime; a bundler cannot infer those URLs. Add this plugin to every Vite
 * config that renders scores, then keep the default
 * `assetBaseUrl: '/score-engine/'` on <MnxViewer>.
 */
export function scoreEngineAssets(options: ScoreEngineAssetsOptions = {}): Plugin {
  let targetDir = ''

  const sync = (logger?: { info: (message: string) => void }): void => {
    const source = engineDistDir()
    const version = (
      JSON.parse(readFileSync(join(source, '..', 'package.json'), 'utf8')) as { version: string }
    ).version
    const stampPath = join(targetDir, STAMP_FILE)

    if (existsSync(stampPath)) {
      try {
        const stamp = JSON.parse(readFileSync(stampPath, 'utf8')) as { version?: string }
        if (stamp.version === version) return
      } catch {
        // A corrupt stamp only means a redundant copy.
      }
    }

    mkdirSync(targetDir, { recursive: true })
    for (const name of ENGINE_ASSETS) {
      cpSync(join(source, name), join(targetDir, name), { recursive: true })
    }
    writeFileSync(stampPath, JSON.stringify({ version, source: '@viritura/score-engine' }, null, 2))
    logger?.info(`[pu] score engine ${version} assets → ${targetDir}`)
  }

  return {
    name: 'pu:score-engine-assets',
    configResolved(config) {
      const publicDir = config.publicDir || resolve(config.root, 'public')
      targetDir = resolve(config.root, options.target ?? join(publicDir, 'score-engine'))
      sync(config.logger)
    },
  }
}
