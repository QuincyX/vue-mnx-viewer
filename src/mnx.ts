/** Anything the Viritura viewer accepts as MNX input. */
export type MnxSource = string | object | null

export interface MnxPartSummary {
  readonly id: string
  readonly name: string
}

export interface MnxSummary {
  readonly title: string
  readonly composer: string
  readonly partCount: number
  readonly measureCount: number
  readonly parts: readonly MnxPartSummary[]
}

/**
 * Parses an MNX JSON string. Throws a descriptive error instead of feeding
 * malformed input to the WASM layout engine.
 */
export function parseMnx(input: string): Record<string, unknown> {
  let value: unknown
  try {
    value = JSON.parse(input)
  } catch (error) {
    throw new Error(`MNX 不是合法 JSON：${(error as Error).message}`)
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('MNX 文档必须是一个 JSON 对象')
  }
  return value as Record<string, unknown>
}

/** A cheap structural check (not a full schema validation). */
export function isMnxDocument(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const record = value as Record<string, unknown>
  return Boolean(record.mnx ?? record.parts)
}

/**
 * Reads the handful of metadata fields the UI shows around a score. MNX keeps
 * score metadata in `global` (title/composer are typically on the first
 * measure's `metadata` or the document root depending on the producer), so this
 * deliberately tolerates missing values.
 */
export function summarizeMnx(mnx: MnxSource): MnxSummary {
  const doc = typeof mnx === 'string' ? parseMnx(mnx) : (mnx ?? {})
  const record = doc as Record<string, unknown>
  const global = (record.global ?? {}) as Record<string, unknown>

  const parts = Array.isArray(record.parts) ? record.parts : []
  const partSummaries = parts.map((part, index) => {
    const p = (part ?? {}) as Record<string, unknown>
    const name = typeof p.name === 'string' ? p.name : ''
    return { id: typeof p.id === 'string' ? p.id : `#${index}`, name }
  })

  const globalMeasures = Array.isArray(global.measures) ? global.measures : []
  const partMeasures = Array.isArray((parts[0] as Record<string, unknown> | undefined)?.measures)
    ? ((parts[0] as Record<string, unknown>).measures as unknown[])
    : []

  return {
    title: readString(global.title) || readString(record.title) || '未命名曲谱',
    composer:
      readString(global.composer) ||
      readString(global.creator) ||
      readString(record.composer) ||
      '佚名',
    partCount: parts.length,
    measureCount: Math.max(globalMeasures.length, partMeasures.length),
    parts: partSummaries,
  }
}

function readString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}
