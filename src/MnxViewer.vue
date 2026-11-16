<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'

import { mountScore } from '@viritura/score-viewer'
import type { ScoreViewerHandle, ScoreViewerOptions } from '@viritura/score-viewer'

import type {
  MnxViewerExposed,
  MnxViewerLayoutPayload,
  MnxViewerProps,
  MnxViewerReadyPayload,
} from './types'

const props = withDefaults(defineProps<MnxViewerProps>(), {
  viewMode: 'page',
  zoom: 'fit-width',
  assetBaseUrl: '/score-engine/',
  pageBackground: '#ffffff',
  ink: '#171717',
  useWorker: false,
  contentAlign: 'center',
  height: '100%',
  label: '曲谱',
})

const emit = defineEmits<{
  ready: [payload: MnxViewerReadyPayload]
  layout: [payload: MnxViewerLayoutPayload]
  error: [error: Error]
}>()

const host = ref<HTMLElement | null>(null)
const viewer = shallowRef<ScoreViewerHandle | null>(null)

function buildOptions(): ScoreViewerOptions {
  const options: ScoreViewerOptions = {
    assetBaseUrl: props.assetBaseUrl,
    viewMode: props.viewMode,
    zoom: props.zoom,
    pageBackground: props.pageBackground,
    ink: props.ink,
    useWorker: props.useWorker,
    contentAlign: props.contentAlign,
    onReady: ({ engine, displayList }) => {
      emit('ready', { engine, displayList })
    },
    onLayout: (measurements) => {
      emit('layout', { measurements, pageCount: measurements.pageCount })
    },
    onError: (error) => {
      emit('error', error)
    },
  }

  if (props.background !== undefined) options.background = props.background
  if (props.pageWidth !== undefined) options.pageWidth = props.pageWidth
  if (props.pageHeight !== undefined) options.pageHeight = props.pageHeight
  if (props.spatium !== undefined) options.spatium = props.spatium
  if (props.scoreIndex !== undefined) options.scoreIndex = props.scoreIndex
  if (props.pageGap !== undefined) options.pageGap = props.pageGap
  if (props.pagesPerRow !== undefined) options.pagesPerRow = props.pagesPerRow
  if (props.textFont !== undefined) options.textFont = props.textFont
  if (props.playhead !== undefined) options.playhead = props.playhead

  return options
}

function mount(): void {
  if (!host.value) return
  try {
    viewer.value = mountScore(host.value, props.mnx, buildOptions())
  } catch (error) {
    emit('error', error instanceof Error ? error : new Error(String(error)))
  }
}

onMounted(mount)

onBeforeUnmount(() => {
  viewer.value?.destroy()
  viewer.value = null
})

watch(
  () => props.mnx,
  (next) => viewer.value?.update(next),
)

watch(
  () => [
    props.viewMode,
    props.zoom,
    props.pageWidth,
    props.pageHeight,
    props.spatium,
    props.scoreIndex,
    props.pageBackground,
    props.ink,
    props.background,
    props.pageGap,
    props.pagesPerRow,
    props.contentAlign,
    props.textFont,
    props.playhead,
  ],
  () => {
    const options = buildOptions()
    delete options.onReady
    delete options.onLayout
    delete options.onError
    viewer.value?.setOptions(options)
  },
  { deep: true },
)

function zoomTo(zoom: number | 'fit-width' | 'fit-page'): void {
  viewer.value?.zoomTo(zoom)
}

function fitWidth(): void {
  viewer.value?.zoomTo('fit-width')
}

function fitPage(): void {
  viewer.value?.zoomTo('fit-page')
}

function scrollToPosition(position: Parameters<ScoreViewerHandle['scrollToPosition']>[0]): void {
  viewer.value?.scrollToPosition(position)
}

async function toSvg(page = 0): Promise<string> {
  const active = viewer.value
  if (!active?.engine || !active.displayList) {
    throw new Error('曲谱尚未完成排版，无法导出 SVG')
  }
  return active.engine.toSvg(active.displayList, { page })
}

defineExpose<MnxViewerExposed>({
  getViewer: () => viewer.value,
  zoomTo,
  fitWidth,
  fitPage,
  scrollToPosition,
  toSvg,
  getEngine: () => viewer.value?.engine ?? null,
  getDisplayList: () => viewer.value?.displayList ?? null,
})
</script>

<template>
  <div
    ref="host"
    class="mnx-viewer"
    :style="{ height }"
    role="img"
    :aria-label="label"
    data-pu-mnx-viewer
  />
</template>
