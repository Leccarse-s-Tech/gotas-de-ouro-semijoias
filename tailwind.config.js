module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        'vanilla-bone': '#F3F2D9',
        'soft-linen': '#F1F1EA',
        'travertine': '#D8D3C8',
        'mineral-taupe': '#8A857B',
        'celadon-slate': '#525A56',
        'onyx-graphite': '#1E1E1C'
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Manrope"', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif']
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'elastic-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)'
      }
    }
  },
  plugins: []
};
