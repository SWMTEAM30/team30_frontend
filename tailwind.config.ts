module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-noto-sans-kr)', 'var(--font-plus-jakarta-sans)', 'system-ui', 'sans-serif'],
        'plus-jakarta': ['var(--font-plus-jakarta-sans)', 'system-ui', 'sans-serif'],
        'noto-sans': ['var(--font-noto-sans-kr)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
