export function applyOg({ title, description, url, image }:
  { title:string; description:string; url:string; image:string }) {
  document.title = title
  setMeta('name','description', description)
  setMeta('property','og:title', title)
  setMeta('property','og:description', description)
  setMeta('property','og:url', url)
  setMeta('property','og:image', image)
  setMeta('name','twitter:card','summary_large_image')
}

function setMeta(attr:'name'|'property', key:string, value:string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el) }
  el.setAttribute('content', value)
}

