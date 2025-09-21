// 型定義を直接定義（coreライブラリを触らずに）
export interface Answer {
  questionIndex: number
  value: number
}

export interface DiagnoseResult {
  type: 'v' | 'a' | 't' | 'va' | 'vt' | 'at' | 'all'
  scores: ScoreMap
  confidence: number
}

export interface ScoreMap {
  v: number
  a: number
  t: number
}

export type ResultType = DiagnoseResult['type']