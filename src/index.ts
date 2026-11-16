import './style.css'

export { default as MnxViewer } from './MnxViewer.vue'
export { isMnxDocument, parseMnx, summarizeMnx } from './mnx'
export { mountScore } from '@viritura/score-viewer'
export { loadEngine, isEngineReady } from '@viritura/score-engine'
export type { Engine, DisplayList, ScorePosition } from '@viritura/score-engine'
export type { ScoreViewerHandle, ScoreViewerOptions } from '@viritura/score-viewer'
export type {
  MnxSource,
  MnxSummary,
  MnxViewerExposed,
  MnxViewerLayoutPayload,
  MnxViewerProps,
  MnxViewerReadyPayload,
  ScoreViewMode,
} from './types'
// The asset plugin is Node-only. It is exported from `@quincyx/vue-mnx-viewer/vite`
// so importing the component never drags `node:fs` into the browser bundle.
