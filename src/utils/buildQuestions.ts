import questionMeta from '@azumaya00/learningstyle-core/dist/data/questions.meta.js'

type Meta = { id: number; category: 'visual'|'auditory'|'tactile' }

export function buildQuestions(t: (key: string) => string) {
  return (questionMeta as Meta[]).map(m => ({
    id: m.id,
    text: t(`questions.${m.id}`),   // i18n から直接取得（コピーJSONは使わない）
    category: m.category
  }))
}