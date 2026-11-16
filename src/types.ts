import type { DisplayList, Engine, ScoreMeasurements, ScorePosition } from '@viritura/score-engine'
import type { ScoreViewMode } from '@viritura/score-viewer'

import type { MnxSource } from './mnx'

export type { MnxSource, MnxSummary } from './mnx'
export type { ScoreViewMode } from '@viritura/score-viewer'

export interface MnxViewerProps {
  /** MNX JSON string or already-parsed object. `null` renders the empty state. */
  mnx: MnxSource
  viewMode?: ScoreViewMode
  zoom?: number | 'fit-width' | 'fit-page'
  pageWidth?: number
  pageHeight?: number
  spatium?: number
  scoreIndex?: number
  pageBackground?: string
  ink?: string
  background?: string
  assetBaseUrl?: string
  textFont?: boolean
  useWorker?: boolean
  pageGap?: number
  pagesPerRow?: number
  contentAlign?: 'start' | 'center'
  playhead?: (ScorePosition & { follow?: boolean }) | null
  /** CSS height of the host element. The viewer fills it. */
  height?: string
  /** Accessible label for the rendered score surface. */
  label?: string
}

export interface MnxViewerReadyPayload {
  engine: Engine
  displayList: DisplayList
}

export interface MnxViewerLayoutPayload {
  measurements: ScoreMeasurements
  pageCount: number
}

export interface MnxViewerExposed {
  getViewer(): unknown
  zoomTo(zoom: number | 'fit-width' | 'fit-page'): void
  fitWidth(): void
  fitPage(): void
  scrollToPosition(position: ScorePosition): void
  toSvg(page?: number): Promise<string>
  getEngine(): Engine | null
  getDisplayList(): DisplayList | null
}
