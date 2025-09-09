type ResultType = 'v'|'a'|'t'|'va'|'vt'|'at'|'all'

export function useShare(t: (key: string) => string, locale: string) {

  function typeLabel(type: ResultType) {
    return t(`labels.type.${type}`)
  }

  function shareText(type: ResultType) {
    const base = t('share.message.base') // "%TYPE%" を置換
    return base.replace('%TYPE%', typeLabel(type))
  }

  function appUrlWithParams(channel: string) {
    const url = new URL(location.origin + '/')
    url.searchParams.set('lang', String(locale))
    url.searchParams.set('utm_source', channel)
    url.searchParams.set('utm_medium', 'share')
    url.searchParams.set('utm_campaign', 'learningstyle')
    return url
  }

  function shareUrl(channel: 'x'|'line'|'wa'|'fb', type: ResultType) {
    const appUrl = appUrlWithParams(channel)

    if (channel === 'x') {
      const u = new URL('https://twitter.com/intent/tweet')
      u.searchParams.set('text', shareText(type))
      u.searchParams.set('url', appUrl.toString())
      const tags = t('share.tags').replace(/#/g,'').split(/\s+/).filter(Boolean).join(',')
      if (tags) u.searchParams.set('hashtags', tags)
      return u.toString()
    }
    if (channel === 'line') {
      const u = new URL('https://social-plugins.line.me/lineit/share')
      u.searchParams.set('url', appUrl.toString())
      return u.toString()
    }
    if (channel === 'wa') {
      const u = new URL('https://api.whatsapp.com/send')
      u.searchParams.set('text', `${shareText(type)} ${appUrl.toString()}`)
      return u.toString()
    }
    const u = new URL('https://www.facebook.com/sharer/sharer.php')
    u.searchParams.set('u', appUrl.toString())
    return u.toString()
  }

  async function shareNative(type: ResultType) {
    const url = appUrlWithParams('webshare').toString()
    const text = shareText(type)
    try {
      if (navigator.share) {
        await navigator.share({ title: t('app.title'), text, url })
        return true
      }
    } catch {}
    return false
  }

  function copyLink() {
    const url = appUrlWithParams('copy').toString()
    return navigator.clipboard?.writeText(url)
  }

  // 画像は後で差し替え。暫定は共通1枚。
  function ogImageUrl(type: ResultType) {
    return `${location.origin}/og/common.png`
  }

  return { typeLabel, shareText, shareUrl, shareNative, copyLink, ogImageUrl }
}