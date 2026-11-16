import { describe, expect, it } from 'vitest'

import { isMnxDocument, parseMnx, summarizeMnx } from '../mnx'
import { demoScores, findDemoScore } from '../samples'

describe('parseMnx', () => {
  it('parses a JSON object', () => {
    expect(parseMnx('{"mnx":{"version":1}}')).toEqual({ mnx: { version: 1 } })
  })

  it('rejects invalid JSON with a readable message', () => {
    expect(() => parseMnx('{')).toThrowError(/不是合法 JSON/)
  })

  it('rejects non-object documents', () => {
    expect(() => parseMnx('[]')).toThrowError(/必须是一个 JSON 对象/)
  })
})

describe('isMnxDocument', () => {
  it('accepts the example documents', () => {
    for (const score of demoScores) expect(isMnxDocument(score.mnx)).toBe(true)
  })

  it('rejects primitives and plain arrays', () => {
    expect(isMnxDocument(null)).toBe(false)
    expect(isMnxDocument('mnx')).toBe(false)
    expect(isMnxDocument([])).toBe(false)
    expect(isMnxDocument({ title: 'no music' })).toBe(false)
  })
})

describe('summarizeMnx', () => {
  it('counts parts and measures', () => {
    const summary = summarizeMnx(demoScores[2]!.mnx)
    expect(summary.partCount).toBe(1)
    expect(summary.measureCount).toBeGreaterThan(0)
  })

  it('falls back to readable placeholders', () => {
    const summary = summarizeMnx({ mnx: { version: 1 }, parts: [] })
    expect(summary.title).toBe('未命名曲谱')
    expect(summary.composer).toBe('佚名')
  })
})

describe('demoScores', () => {
  it('has unique slugs and can be looked up', () => {
    const slugs = demoScores.map((score) => score.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    expect(findDemoScore('grand-staff')?.title).toBe('大谱表练习')
  })
})
