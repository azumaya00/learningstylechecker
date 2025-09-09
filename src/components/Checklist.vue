<template>
  <div class="p-checklist">
    <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
      {{ texts.common?.skipToContent || 'メインコンテンツにスキップ' }}
    </a>
    <ul class="p-checklist__list" role="group" aria-labelledby="question-title">
      <transition-group appear mode="in-out" name="question" tag="ul">
        <li v-for="(question, index) in filteredItems" :key="question.id" class="p-checklist__list__item">
          <h1 id="question-title" class="p-checklist__title">Q{{ currentQuestion }}.</h1>
          <div class="p-checklist__question">
            <p v-html="question.text" class="p-checklist__question__text"></p>
          </div>
        </li>
      </transition-group>
    </ul>
    <div class="p-checklist__btn-group" role="group" aria-label="回答選択">
      <button 
        class="c-btn c-btn--middle c-btn--accent focus-visible:outline-2 focus-visible:outline-offset-2" 
        @click="addPoint(5)"
        @keydown.enter.stop.prevent="addPoint(5)"
        @keydown.space.stop.prevent="addPoint(5)"
        :aria-pressed="selectedValue === 5"
      >{{ texts.choices?.always || 'いつもそうだ' }}</button>
      <button 
        class="c-btn c-btn--middle c-btn--sub focus-visible:outline-2 focus-visible:outline-offset-2" 
        @click="addPoint(3)"
        @keydown.enter.stop.prevent="addPoint(3)"
        @keydown.space.stop.prevent="addPoint(3)"
        :aria-pressed="selectedValue === 3"
      >{{ texts.choices?.sometimes || '時々そうだ' }}</button>
      <button 
        class="c-btn c-btn--middle c-btn--main focus-visible:outline-2 focus-visible:outline-offset-2" 
        @click="addPoint(1)"
        @keydown.enter.stop.prevent="addPoint(1)"
        @keydown.space.stop.prevent="addPoint(1)"
        :aria-pressed="selectedValue === 1"
      >{{ texts.choices?.rarely || 'めったにない' }}</button>
    </div>
    <div v-if="showError" class="p-checklist__error" role="alert" aria-live="polite">
      {{ texts.errors?.selectOne || '選択してください' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useDiagnosis } from '@/composables/useDiagnosis'
import { buildQuestions } from '@/utils/buildQuestions'
import { useI18nGuard } from '@/utils/i18nGuard'
import { DiagnoseResult } from '@/types/diagnosis'

interface Props {
  currentLocale: string
  texts: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'finish-check': [result: DiagnoseResult]
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

// 現在表示する質問を取得
const filteredItems = computed(() => {
  const currentQuestionData = shuffledQuestions.value[currentQuestion.value - 1]
  console.log('[Checklist] filteredItems computed:', {
    currentQuestion: currentQuestion.value,
    shuffledQuestionsLength: shuffledQuestions.value.length,
    currentQuestionData
  })
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
  const originalId = currentQuestionData.id - 1 // 1-24から0-23に変換
  
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