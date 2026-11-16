<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

import {
  MnxViewer,
  summarizeMnx,
  type MnxSource,
  type MnxViewerExposed,
  type ScoreViewMode,
} from '../src'

interface Sample {
  id: string
  name: string
  note: string
}

const samples: Sample[] = [
  { id: 'two-bar-c-major-scale', name: 'C 大调音阶', note: '两小节 · 单声部' },
  { id: 'hello-world', name: 'Hello World', note: '最小 MNX 文档' },
  { id: 'grand-staff', name: '大谱表', note: '双谱表 · 钢琴' },
  { id: 'key-signatures', name: '调号', note: '多调号切换' },
  { id: 'multiple-voices', name: '多声部', note: '两个 sequence' },
]

const viewModes: Array<{ value: ScoreViewMode; label: string }> = [
  { value: 'page', label: '分页' },
  { value: 'spread', label: '对开' },
  { value: 'horizontal', label: '横向' },
  { value: 'horizon', label: '连续' },
]

const current = ref<Sample>(samples[2]!)
const mnx = ref<MnxSource>(null)
const loading = ref(false)
const error = ref('')
const dark = ref(false)
const viewMode = ref<ScoreViewMode>('page')
const zoom = ref<number | 'fit-width' | 'fit-page'>('fit-width')
const pageCount = ref(0)
const engineVersion = ref('')
const viewerRef = ref<MnxViewerExposed | null>(null)
// Built playground is served from /mnx/, so both demo samples and engine assets
// resolve relative to the Vite base instead of the domain root.
const baseUrl = import.meta.env.BASE_URL
const engineBaseUrl = `${baseUrl}score-engine/`

const summary = computed(() => summarizeMnx(mnx.value))
const pageBackground = computed(() => (dark.value ? '#1b1b1f' : '#ffffff'))
const ink = computed(() => (dark.value ? '#f4f1ea' : '#171717'))

async function load(sample: Sample): Promise<void> {
  loading.value = true
  error.value = ''
  try {
    const response = await fetch(`${baseUrl}samples/${sample.id}.json`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    mnx.value = await response.json()
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : String(cause)
    mnx.value = null
  } finally {
    loading.value = false
  }
}

function selectSample(id: string): void {
  const sample = samples.find((item) => item.id === id)
  if (!sample) return
  current.value = sample
  zoom.value = 'fit-width'
  void load(sample)
}

function downloadSvg(): void {
  void viewerRef.value?.toSvg(0).then((svg) => {
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${current.value.id}.svg`
    link.click()
    URL.revokeObjectURL(url)
  })
}

watch(current, (sample) => void load(sample))
onMounted(() => void load(current.value))
</script>

<template>
  <div class="demo">
    <aside class="sidebar">
      <header class="brand">
        <div class="mark">MNX</div>
        <div>
          <h1>MNX Viewer</h1>
          <p>W3C MNX · Viritura 内核</p>
        </div>
      </header>

      <section>
        <h2>样例</h2>
        <ul class="samples">
          <li v-for="sample in samples" :key="sample.id">
            <button
              type="button"
              :class="{ active: sample.id === current.id }"
              @click="selectSample(sample.id)"
            >
              <span>{{ sample.name }}</span>
              <small>{{ sample.note }}</small>
            </button>
          </li>
        </ul>
      </section>

      <section>
        <h2>视图</h2>
        <div class="segmented">
          <button
            v-for="mode in viewModes"
            :key="mode.value"
            type="button"
            :class="{ active: viewMode === mode.value }"
            @click="viewMode = mode.value"
          >
            {{ mode.label }}
          </button>
        </div>
        <div class="row">
          <button type="button" @click="zoom = 0.8">80%</button>
          <button type="button" @click="zoom = 1">100%</button>
          <button type="button" @click="zoom = 1.5">150%</button>
          <button type="button" @click="zoom = 'fit-width'">适宽</button>
          <button type="button" @click="zoom = 'fit-page'">适页</button>
        </div>
        <button type="button" class="ghost" @click="dark = !dark">
          {{ dark ? '切换为纸白' : '切换为深色' }}
        </button>
      </section>

      <section class="meta">
        <h2>文档</h2>
        <dl>
          <div><dt>标题</dt><dd>{{ summary.title }}</dd></div>
          <div><dt>声部</dt><dd>{{ summary.partCount }}</dd></div>
          <div><dt>小节</dt><dd>{{ summary.measureCount }}</dd></div>
          <div><dt>页数</dt><dd>{{ pageCount || '—' }}</dd></div>
          <div><dt>内核</dt><dd>{{ engineVersion || '加载中' }}</dd></div>
        </dl>
        <button type="button" class="ghost" :disabled="!engineVersion" @click="downloadSvg">
          导出 SVG
        </button>
      </section>

      <footer>
        <a href="https://w3c-cg.github.io/mnx/" target="_blank" rel="noreferrer">MNX 规范</a>
        <a href="https://viritura.com/developers" target="_blank" rel="noreferrer">Viritura</a>
      </footer>
    </aside>

    <main class="stage">
      <div class="stage-bar">
        <div>
          <strong>{{ current.name }}</strong>
          <span v-if="loading">载入中…</span>
          <span v-else-if="error" class="error">{{ error }}</span>
        </div>
        <code>{{ current.id }}.json</code>
      </div>
      <div class="viewport">
        <MnxViewer
          ref="viewerRef"
          :mnx="mnx"
          :view-mode="viewMode"
          :zoom="zoom"
          :page-background="pageBackground"
          :ink="ink"
          :asset-base-url="engineBaseUrl"
          label="MNX 样例曲谱"
          @ready="({ engine }) => (engineVersion = `${engine.version.package} / ${engine.version.engine}`)"
          @layout="({ pageCount: pages }) => (pageCount = pages)"
          @error="(cause) => (error = cause.message)"
        />
      </div>
    </main>
  </div>
</template>
