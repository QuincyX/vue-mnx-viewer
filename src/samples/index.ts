import grandStaff from './grand-staff.json'
import helloWorld from './hello-world.json'
import keySignatures from './key-signatures.json'
import multipleVoices from './multiple-voices.json'
import scale from './two-bar-c-major-scale.json'

export type DemoDifficulty = 'beginner' | 'intermediate' | 'advanced'

export interface DemoScore {
  readonly id: string
  readonly slug: string
  readonly title: string
  readonly composer: string
  readonly difficulty: DemoDifficulty
  readonly keySignature: string
  readonly timeSignature: string
  readonly tags: readonly string[]
  readonly description: string
  readonly source: string
  readonly mnx: Record<string, unknown>
}

/**
 * Five tiny W3C MNX example documents used for local development and demos.
 * They are not production content: the apps replace them with API data as soon
 * as `VITE_API_BASE_URL` responds.
 */
export const demoScores: readonly DemoScore[] = [
  {
    id: 'demo-scale',
    slug: 'c-major-scale',
    title: 'C 大调音阶',
    composer: '传统练习',
    difficulty: 'beginner',
    keySignature: 'C 大调',
    timeSignature: '4/4',
    tags: ['音阶', '入门'],
    description: '两个八分音符级进小节，用于验证谱面排版与教学示例。',
    source: 'https://github.com/w3c-cg/mnx',
    mnx: scale,
  },
  {
    id: 'demo-hello',
    slug: 'hello-world',
    title: 'Hello World',
    composer: 'MNX 示例',
    difficulty: 'beginner',
    keySignature: 'C 大调',
    timeSignature: '4/4',
    tags: ['示例'],
    description: '最小可渲染的 MNX 文档，用来检查引擎与字体是否加载成功。',
    source: 'https://github.com/w3c-cg/mnx',
    mnx: helloWorld,
  },
  {
    id: 'demo-grand-staff',
    slug: 'grand-staff',
    title: '大谱表练习',
    composer: '传统练习',
    difficulty: 'intermediate',
    keySignature: 'C 大调',
    timeSignature: '4/4',
    tags: ['钢琴', '大谱表'],
    description: '高音与低音谱表联动的双手练习，展示跨谱表排版。',
    source: 'https://github.com/w3c-cg/mnx',
    mnx: grandStaff,
  },
  {
    id: 'demo-keys',
    slug: 'key-signatures',
    title: '调号练习',
    composer: '传统练习',
    difficulty: 'intermediate',
    keySignature: '多调号',
    timeSignature: '4/4',
    tags: ['调号', '乐理'],
    description: '连续切换调号，用于检查临时记号与调号绘制。',
    source: 'https://github.com/w3c-cg/mnx',
    mnx: keySignatures,
  },
  {
    id: 'demo-voices',
    slug: 'multiple-voices',
    title: '二声部练习',
    composer: '传统练习',
    difficulty: 'advanced',
    keySignature: 'C 大调',
    timeSignature: '4/4',
    tags: ['复调', '声部'],
    description: '同谱表内两个独立声部，验证符干方向与声部间距。',
    source: 'https://github.com/w3c-cg/mnx',
    mnx: multipleVoices,
  },
]

export function findDemoScore(slugOrId: string): DemoScore | undefined {
  return demoScores.find((score) => score.slug === slugOrId || score.id === slugOrId)
}
