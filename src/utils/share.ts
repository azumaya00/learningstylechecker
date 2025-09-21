type ResultType = 'v'|'a'|'t'|'va'|'vt'|'at'|'all'

export function useShare(t: (key: string) => string, locale: string) {
  const defaultOrigin = (typeof window !== 'undefined' && window.location?.origin)
    ? window.location.origin
    : ''
  const baseOrigin = (import.meta.env?.VITE_SITE_ORIGIN as string | undefined) || defaultOrigin

  function shareLandingUrl(type: ResultType, channel: string) {
    const normalizedOrigin = baseOrigin.replace(/\/$/, '')
    const url = new URL(`${normalizedOrigin}/share/${type}.html`)
    if (locale === 'en') {
      url.searchParams.set('lang', locale)
    }
    url.searchParams.set('utm_source', channel)
    url.searchParams.set('utm_medium', 'share')
    url.searchParams.set('utm_campaign', 'learningstyle')
    return url
  }

  function typeLabel(type: ResultType) {
    return t(`labels.type.${type}`)
  }

  function shareText(type: ResultType) {
    const base = t('share.message.base') // "%TYPE%" を置換
    return base.replace('%TYPE%', typeLabel(type))
  }

  function shareUrl(channel: 'x'|'line'|'wa'|'fb', type: ResultType) {
    const landingUrl = shareLandingUrl(type, channel)

    if (channel === 'x') {
      const u = new URL('https://twitter.com/intent/tweet')
      u.searchParams.set('text', shareText(type))
      u.searchParams.set('url', landingUrl.toString())
      const tags = t('share.tags').replace(/#/g,'').split(/\s+/).filter(Boolean).join(',')
      if (tags) u.searchParams.set('hashtags', tags)
      return u.toString()
    }
    if (channel === 'line') {
      const u = new URL('https://social-plugins.line.me/lineit/share')
      u.searchParams.set('url', landingUrl.toString())
      return u.toString()
    }
    if (channel === 'wa') {
      const u = new URL('https://api.whatsapp.com/send')
      u.searchParams.set('text', `${shareText(type)} ${landingUrl.toString()}`)
      return u.toString()
    }
    const u = new URL('https://www.facebook.com/sharer/sharer.php')
    u.searchParams.set('u', landingUrl.toString())
    return u.toString()
  }

  async function shareNative(type: ResultType) {
    const url = shareLandingUrl(type, 'webshare').toString()
    const text = shareText(type)
    try {
      if (navigator.share) {
        await navigator.share({ title: t('app.title'), text, url })
        return true
      }
    } catch {}
    return false
  }

  function copyLink(type: ResultType) {
    const url = shareLandingUrl(type, 'copy').toString()
    return navigator.clipboard?.writeText(url)
  }

  // 画像は後で差し替え。暫定は共通1枚。
  function ogImageUrl(type: ResultType) {
    return `${location.origin}/og/common.png`
  }

  return { typeLabel, shareText, shareUrl, shareNative, copyLink, ogImageUrl }
}
