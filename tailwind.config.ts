import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#2A2823',
        mute: '#6B5D44',
        surface: '#F5EFE3',
        paper: '#FBF7EE',
        primary: {
          DEFAULT: '#2C5F5D',
          deep: '#1F4544',
        },
        accent: '#C97B5D',
        line: 'rgba(42,40,35,0.18)',
        kakao: '#FAE100',
        kakaoDeep: '#3C1E1E',
      },
      fontFamily: {
        'serif-ko': ['var(--font-noto-serif-kr)', 'Noto Serif KR', 'serif'],
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
        en: ['var(--font-eb-garamond)', 'EB Garamond', 'serif'],
      },
      maxWidth: {
        page: '1200px',
        read: '780px',
      },
    },
  },
  plugins: [],
};

export default config;
