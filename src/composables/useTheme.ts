import { onMounted, ref } from 'vue';

type ThemeName = 'ls-light' | 'ls-dark';
const KEY = 'ls_theme';

export function useTheme() {
  const theme = ref<ThemeName>('ls-light');
  
  const apply = (t: ThemeName) => {
    theme.value = t;
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem(KEY, t);
  };
  
  const toggle = () => apply(theme.value === 'ls-light' ? 'ls-dark' : 'ls-light');

  onMounted(() => {
    const saved = localStorage.getItem(KEY) as ThemeName | null;
    if (saved) return apply(saved);
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    apply(prefersDark ? 'ls-dark' : 'ls-light');
  });

  return { theme, apply, toggle };
}



