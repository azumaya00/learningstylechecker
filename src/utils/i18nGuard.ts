export function useI18nGuard(t: (key: string) => string) {
  function tq(id: number) {
    const k = `questions.${id}`
    const v = t(k)
    return v === k ? '' : v   // 未定義なら空文字など
  }
  function trTitle(type: string) {
    const k = `results.${type}.title`
    const v = t(k)
    return v === k ? '' : v
  }
  function trDesc(type: string) {
    const k = `results.${type}.description`
    const v = t(k)
    return v === k ? '' : v
  }
  return { tq, trTitle, trDesc }
}
