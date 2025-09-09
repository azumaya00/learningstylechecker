<template>
  <div class="p-result" id="main">
    <h1 class="p-result__title">Result</h1>
    <div class="p-result__container" aria-live="polite" aria-atomic="true">
      <!-- キャライラスト表示 -->
      <div class="result-hero">
        <img 
          :src="resultImage" 
          :alt="`診断結果: ${resultDiagnosis}`"
          loading="lazy"
          decoding="async"
        />
      </div>
      
      <div class="p-result__diagnosis">
        <h2 class="p-result__diagnosis__title">{{ texts.results?.diagnosisTitle || 'あなたは' }}<span>{{ currentResult.title }}</span>{{ texts.results?.diagnosisSuffix || 'タイプです！' }}</h2>
        <p v-html="currentResult.description" class="p-result__diagnosis__text"></p>
      </div>
      <div class="p-result__score">
        <h3 class="p-result__score__title">{{ texts.results?.scoreTitle || 'score' }}</h3>
        <table class="p-result__score__table">
          <tbody>
            <tr>
              <td class="p-result__score__table__column">{{ texts.results?.visualLabel || '視覚' }}:</td>
              <td class="p-result__score__table__column">{{ result.scores.v }}{{ texts.results?.pointsSuffix || '点' }}</td>
            </tr>
            <tr>
              <td class="p-result__score__table__column">{{ texts.results?.auditoryLabel || '聴覚' }}:</td>
              <td class="p-result__score__table__column">{{ result.scores.a }}{{ texts.results?.pointsSuffix || '点' }}</td>
            </tr>
            <tr>
              <td class="p-result__score__table__column">
                <span>{{ texts.results?.tactileLabel || '触覚・運動感覚' }}:&nbsp;</span>
              </td>
              <td class="p-result__score__table__column">{{ result.scores.t }}{{ texts.results?.pointsSuffix || '点' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- シェアボタン -->
    <ShareButtons 
      :type="selectedType" 
      :locale="props.currentLocale"
    />
    
    <div class="c-btn__group">
      <button class="c-btn c-btn--middle c-btn--main focus-visible:outline-2 focus-visible:outline-offset-2" @click="clickRetry">{{ texts.buttons?.retry || '最初からやり直す' }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import { getCurrentImagePath } from '@/lib/assetMap'
import ShareButtons from './ShareButtons.vue'
import { useI18nGuard } from '@/utils/i18nGuard'
import { applyOg } from '@/utils/seo'
import { DiagnoseResult, ResultType } from '@/types/diagnosis'

interface Props {
  result: DiagnoseResult
  currentTheme: string
  currentLocale: string
  texts: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'retry-check': []
}>()

// i18n関数のシミュレーション（既存のtextsから取得）
const t = (key: string) => {
  const keys = key.split('.')
  let value = props.texts
  for (const k of keys) {
    value = value?.[k]
  }
  return value || key
}

// i18nガードを使用
const { trTitle, trDesc } = useI18nGuard(t)

// 診断結果のタイプ
const selectedType = computed(() => props.result.type)

// 結果の診断名
const resultDiagnosis = computed(() => {
  return trTitle(props.result.type) || '不明'
})

// 現在の結果データ
const currentResult = computed(() => {
  const title = trTitle(props.result.type) || '不明'
  const description = trDesc(props.result.type) || '結果が見つかりませんでした。'
  return { title, description }
})

// 結果画像のパス
const resultImage = computed(() => {
  return getCurrentImagePath(selectedType.value, props.currentTheme)
})

// OGP更新
function updateOg() {
  if (!props.result) return
  applyOg({
    title: `${trTitle(props.result.type)} | ${t('app.title')}`,
    description: trDesc(props.result.type),
    url: location.origin + '/',
    image: getCurrentImagePath(props.result.type, props.currentTheme)
  })
}

// リトライボタンクリック時の処理
function clickRetry() {
  emit('retry-check')
}

// コンポーネントマウント時にOGP更新
onMounted(updateOg)

// テーマ変更時の画像更新
watch(() => props.currentTheme, () => {
  // 画像パスは computed で自動更新される
})
</script>