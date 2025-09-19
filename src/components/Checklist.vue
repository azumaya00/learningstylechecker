<template>
  <div class="p-checklist bg-base-100" style="position: relative;">
    <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
      {{ texts.common?.skipToContent || 'メインコンテンツにスキップ' }}
    </a>
    
    <!-- 進捗数字（カード右上） -->
    <div style="position: absolute; top: 16px; right: 16px; z-index: 10;">
      <span style="font-size: 12px; font-weight: 500; color: var(--c-text); opacity: 0.8;">
        {{ currentQuestion }}/{{ questions.length }}
      </span>
    </div>
    
    <div class="p-checklist__question-container">
      <ul class="p-checklist__list" role="group" aria-labelledby="question-title">
        <transition appear mode="out-in" name="question">
          <li :key="currentQuestion" class="p-checklist__list__item">
            <h1 id="question-title" class="p-checklist__title text-2xl md:text-3xl font-extrabold tracking-wide">Q{{ currentQuestion }}.</h1>
            <div class="p-checklist__question">
              <p v-html="currentQuestionText" class="p-checklist__question__text leading-relaxed tracking-wide text-base-content/90"></p>
            </div>
          </li>
        </transition>
      </ul>
    </div>
    <div class="p-checklist__btn-group" role="group" aria-label="回答選択">
      <button 
        class="c-btn c-btn--middle c-btn--accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary hover:scale-105 transition-transform duration-200 motion-reduce:transition-none" 
        @click="addPoint(5)"
        @keydown.enter.stop.prevent="addPoint(5)"
        @keydown.space.stop.prevent="addPoint(5)"
        :aria-pressed="selectedValue === 5"
      >{{ texts.choices?.always || 'いつもそうだ' }}</button>
      <button 
        class="c-btn c-btn--middle c-btn--sub focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary hover:scale-105 transition-transform duration-200 motion-reduce:transition-none" 
        @click="addPoint(3)"
        @keydown.enter.stop.prevent="addPoint(3)"
        @keydown.space.stop.prevent="addPoint(3)"
        :aria-pressed="selectedValue === 3"
      >{{ texts.choices?.sometimes || '時々そうだ' }}</button>
      <button 
        class="c-btn c-btn--middle c-btn--main focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary hover:scale-105 transition-transform duration-200 motion-reduce:transition-none" 
        @click="addPoint(1)"
        @keydown.enter.stop.prevent="addPoint(1)"
        @keydown.space.stop.prevent="addPoint(1)"
        :aria-pressed="selectedValue === 1"
      >{{ texts.choices?.rarely || 'めったにない' }}</button>
    </div>
    <div v-if="showError" class="p-checklist__error" role="alert" aria-live="polite">
      {{ texts.errors?.selectOne || '選択してください' }}
    </div>
    
    <!-- 進捗バー -->
    <div class="progress-container bg-base-200" 
         style="margin-top: 48px; padding: 24px; border-radius: 12px;">
      
      <!-- 進捗バー -->
      <div class="w-full h-2 rounded-full overflow-hidden relative" 
           style="background-color: var(--c-border, #E2E8F0); height: 8px; margin-bottom: 24px;"
           role="progressbar" 
           :aria-valuenow="currentQuestion - 1" 
           :aria-valuemin="0" 
           :aria-valuemax="questions.length"
           :aria-label="`進捗: ${currentQuestion - 1}/${questions.length}`">
        <div 
          class="progress-bar-fill transition-[width] duration-500 ease-out motion-reduce:transition-none"
          :style="{ 
            width: Math.max(2, Math.round(((currentQuestion - 1) / questions.length) * 100)) + '%',
            height: '8px',
            minHeight: '8px'
          }" 
        />
      </div>
      
      <!-- ステップドット -->
      <div class="flex items-center justify-center" style="gap: 16px;">
        <span
          v-for="(step, index) in stepDots"
          :key="index"
          class="step-dot rounded-full transition-all duration-200"
          :style="{
            width: '8px',
            height: '8px',
            backgroundColor: step <= currentQuestion ? '#69c4d0' : 'var(--c-border, #E2E8F0)',
            transform: step <= currentQuestion ? 'scale(1.2)' : 'scale(1)',
            boxShadow: step <= currentQuestion ? '0 0 6px rgba(105, 196, 208, 0.3)' : 'none'
          }"
        />
      </div>
      
    </div>
  </div>
</template>

<style scoped>
/* 進捗バーのスタイル */
.progress-bar-fill {
  height: 8px !important;
  min-height: 8px !important;
  background: linear-gradient(90deg, #69c4d0 0%, #4fd1c7 100%) !important;
  border-radius: 9999px;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: block !important;
  min-width: 2px;
  box-shadow: 0 1px 2px rgba(105, 196, 208, 0.2);
}

/* 進捗コンテナのスタイル */
.progress-container {
  background-color: var(--c-card, #ffffff);
  border-color: var(--c-border, #E2E8F0);
}

/* ステップドットのスタイル */
.step-dot {
  width: 8px !important;
  height: 8px !important;
  min-width: 8px !important;
  min-height: 8px !important;
  display: block !important;
  border-radius: 50% !important;
  flex-shrink: 0 !important;
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useDiagnosis } from '@/composables/useDiagnosis'
import { buildQuestions } from '@/utils/buildQuestions'
import { useI18nGuard } from '@/utils/i18nGuard'
import { DiagnoseResult } from '@/types/diagnosis'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import StepDots from '@/components/ui/StepDots.vue'

interface Props {
  currentLocale: string
  texts: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'finish-check': [result: DiagnoseResult]
}>()

// コンポーネントを定義
defineOptions({
  components: {
    ProgressBar,
    StepDots
  }
})

// i18n関数のシミュレーション（既存のtextsから取得）
const t = (key: string) => {
  const keys = key.split('.')
  let value = props.texts
  for (const k of keys) {
    value = value?.[k]
  }
  return value || key
}

// 現在の質問テキストを取得
const currentQuestionText = computed(() => {
  const index = currentQuestion.value - 1
  const question = shuffledQuestions.value[index] ?? questions[index]
  return question?.text || ''
})

// 質問データを構築
const questions = buildQuestions(t)
const { setAnswer, isComplete, run, reset } = useDiagnosis(questions.length)

// 現在の質問番号（1-24）
const currentQuestion = ref(1)

// ランダム化された質問順序
const shuffledQuestions = ref<typeof questions>([])

// 現在選択されている値（A11y用）
const selectedValue = ref<number | null>(null)

// エラー表示フラグ
const showError = ref(false)


// ステップドットの位置を計算（24問中7つの代表点）
const stepDots = computed(() => {
  const total = questions.length
  const maxDots = 7
  if (total <= maxDots) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  
  // 24問の場合: 1, 4, 7, 10, 13, 16, 19, 22, 24 のような代表点
  const step = Math.ceil(total / maxDots)
  const dots = []
  for (let i = 1; i <= total; i += step) {
    dots.push(i)
  }
  // 最後の質問を必ず含める
  if (dots[dots.length - 1] !== total) {
    dots.push(total)
  }
  return dots.slice(0, maxDots)
})

// 現在表示する質問を取得
const filteredItems = computed(() => {
  const currentQuestionData = shuffledQuestions.value[currentQuestion.value - 1]
  return currentQuestionData ? [currentQuestionData] : []
})

// 質問をランダム化する
function shuffleQuestions() {
  // Fisher-Yatesシャッフルアルゴリズム
  const shuffleArray = (array: typeof questions) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }
  
  // 全24問をランダムに並び替え
  shuffledQuestions.value = shuffleArray(questions)
  
  // 重複チェック
  const ids = shuffledQuestions.value.map(q => q.id)
  const uniqueIds = [...new Set(ids)]
  if (ids.length !== uniqueIds.length) {
    console.warn('[Checklist] Duplicate questions detected! Re-shuffling...')
    shuffleQuestions()
    return
  }
  
  console.log('[Checklist] All questions shuffled:', shuffledQuestions.value.map(q => q.id))
}

// 回答に基づいてスコアを加算し、次の質問へ進む
function addPoint(point: number) {
  // エラーをクリア
  showError.value = false
  
  // 選択された値を記録
  selectedValue.value = point
  
  // 現在の質問の元のIDを取得（0-23のインデックス）
  const currentQuestionData = shuffledQuestions.value[currentQuestion.value - 1]
  const originalId = currentQuestionData.id
  
  // coreライブラリのsetAnswerを使用
  setAnswer(originalId, point)
  
  // 次の質問へ進む
  currentQuestion.value++
  
  // 選択状態をリセット
  selectedValue.value = null
  
  // 最後の質問の場合は診断完了
  if (currentQuestion.value > 24) {
    completeDiagnosis()
  }
}

// 診断完了時の処理
function completeDiagnosis() {
  const result = run()
  emit('finish-check', result)
}

// リトライ時の処理
function resetScores() {
  reset()
  currentQuestion.value = 1
  shuffleQuestions()
}

// コンポーネント作成時に質問をランダム化
onMounted(() => {
  console.log('[Checklist] Component mounted, questions:', questions)
  shuffleQuestions()
  console.log('[Checklist] After shuffle, shuffledQuestions:', shuffledQuestions.value)
})

// 言語が変更されたときに質問リストを更新
watch(() => props.texts, () => {
  const newQuestions = buildQuestions(t)
  questions.splice(0, questions.length, ...newQuestions)
  shuffleQuestions()
}, { deep: true })

// 外部からリセット可能にする
defineExpose({
  resetScores
})
</script>

<style scoped>
/* 質問切替アニメーション（位置固定でフェード） */
.question-enter-active {
  transition: opacity 0.25s ease-in-out;
}

.question-leave-active {
  transition: opacity 0.15s ease-in-out;
}

.question-enter-from {
  opacity: 0;
}

.question-leave-to {
  opacity: 0;
}

/* 位置ずれを防ぐための固定 */
.question-enter-active,
.question-leave-active,
.question-enter-from,
.question-leave-to {
  position: relative;
  transform: none !important;
  left: 0 !important;
  right: 0 !important;
  top: 0 !important;
  bottom: 0 !important;
}

/* レイアウト安定化 */
.p-checklist__question-container {
  min-height: 200px; /* 質問エリアの最小高さを確保 */
  position: relative;
}

.p-checklist__list {
  position: relative;
  width: 100%;
}

.p-checklist__list__item {
  position: relative;
  width: 100%;
}

.p-checklist__btn-group {
  position: relative;
  z-index: 10; /* 選択肢を前面に固定 */
  margin-top: 24px; /* 質問との間隔を復活 */
}

/* PRM対応: reduce ならアニメーション無効 */
@media (prefers-reduced-motion: reduce) {
  .question-enter-active,
  .question-leave-active {
    transition: none !important;
  }
}
</style>
