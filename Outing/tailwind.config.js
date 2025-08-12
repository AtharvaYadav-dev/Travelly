module.exports = {
  darkMode: 'class', // Enable dark mode via class strategy
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom dark mode palette (optional)
        'dark-bg': '#181926',
        'dark-card': '#23243a',
        'dark-glass': 'rgba(36,37,50,0.72)',
        'dark-border': '#30324a',
      },
      boxShadow: {
        'glass-dark': '0 8px 32px 0 rgba(36,37,50,0.24)',
      },
    },
  },
  plugins: [],
};
