import { ref, computed } from 'vue'
import { diagnose } from '@azumaya00/learningstyle-core'
import { Answer, DiagnoseResult } from '@/types/diagnosis'

function clampLikert(v: number, min = 1, max = 5) {
  return Math.max(min, Math.min(max, Math.round(v)))
}

export function useDiagnosis(totalQuestions: number) {
  const answers = ref<Answer[]>([])

  function setAnswer(questionIndex: number, rawValue: number) {
    const value = clampLikert(rawValue)
    const i = answers.value.findIndex(a => a.questionIndex === questionIndex)
    if (i >= 0) answers.value[i] = { questionIndex, value }
    else answers.value.push({ questionIndex, value })
  }

  const isComplete = computed(() => answers.value.length >= totalQuestions)

  function run(): DiagnoseResult {
    return diagnose(answers.value)
  }

  function reset() {
    answers.value = []
  }

  return { answers, setAnswer, isComplete, run, reset }
}
