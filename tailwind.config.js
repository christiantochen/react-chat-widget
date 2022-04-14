module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  safelist: ['outline-none'],
  theme: {
    extend: {
      animation: {
        slidein: 'slidein 0.5s forwards',
        slideout: 'slideout 0.5s forwards',
      },
      keyframes: {
        slidein: {
          '0%': { opacity: '0', 'top': '100%', bottom: '-100%' },
          '25%': { opacity: '0', 'top': '3rem', bottom: '4rem' },
          '100%': { opacity: '1', 'top': '1rem', bottom: '6rem' },
        },
        slideout: {
          '0%': { opacity: '1', 'top': '1rem', bottom: '6rem' },
          '75%': { opacity: '0', 'top': '3rem', bottom: '4rem' },
          '100%': { opacity: '0', 'top': '100%', bottom: '-100%' },
        },
      },
      fontSize: {
        '2xs': '.625rem',
      },
      maxWidth: {
        'page-sm': '600px',
        'page-md': '728px',
        'page-lg': '984px',
        'page-xl': '1160px',
        'page-2xl': '1416px',
      },
      colors: {
        primary: 'var(--primary)',
        'primary-2': 'var(--primary-2)',
        secondary: 'var(--secondary)',
        'secondary-2': 'var(--secondary-2)',
        hover: 'var(--hover)',
        'hover-1': 'var(--hover-1)',
        'hover-2': 'var(--hover-2)',
        'accent-0': 'var(--accent-0)',
        'accent-1': 'var(--accent-1)',
        'accent-2': 'var(--accent-2)',
        'accent-3': 'var(--accent-3)',
        'accent-4': 'var(--accent-4)',
        'accent-5': 'var(--accent-5)',
        'accent-6': 'var(--accent-6)',
        'accent-7': 'var(--accent-7)',
        'accent-8': 'var(--accent-8)',
        'accent-9': 'var(--accent-9)',
      },
      textColor: {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
      },
      boxShadow: {
        'outline-normal': '0 0 0 2px var(--accent-2)',
        magical:
          'rgba(0, 0, 0, 0.02) 0px 30px 30px, rgba(0, 0, 0, 0.03) 0px 0px 8px, rgba(0, 0, 0, 0.05) 0px 1px 0px',
      },
    },
  },
}
