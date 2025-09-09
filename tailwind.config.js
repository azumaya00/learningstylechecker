/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts,js}'],
  theme: { extend: {} },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        'ls-light': {
          'color-scheme': 'light',
          primary: '#4F46E5',
          'primary-content': '#ffffff',
          secondary: '#6D28D9', // AA確保の微調整: より暗くしてtext-whiteとのコントラスト向上
          accent: '#0EA5B5', // AA確保の微調整: より暗くしてtext-whiteとのコントラスト向上
          neutral: '#3D4451',
          'base-100': '#F7FAFC',
          'base-200': '#E6EEF6', // AA確保の微調整: プログレス背景・ボーダーの視認性向上
          'base-300': '#E2E8F0',
          info: '#0EA5E9',
          success: '#22C55E',
          warning: '#F59E0B',
          error: '#EF4444',
        },
      },
      {
        'ls-dark': {
          'color-scheme': 'dark',
          primary: '#60A5FA',
          'primary-content': '#0B1020',
          secondary: '#C4B5FD', // AA確保の微調整: 暗背景で輝度UPしてtext-whiteとのコントラスト向上
          accent: '#7DD3FC', // AA確保の微調整: 暗背景で輝度UPしてtext-whiteとのコントラスト向上
          neutral: '#1F2937',
          'base-100': '#0B1020',
          'base-200': '#111827',
          'base-300': '#1F2937',
          info: '#38BDF8',
          success: '#34D399',
          warning: '#FBBF24',
          error: '#F87171',
        },
      },
    ],
    base: true,
    utils: true,
    logs: false,
  },
};
