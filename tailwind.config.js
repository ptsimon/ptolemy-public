module.exports = {
  purge: false,
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      accent: {
        0: '#ef4631', // terracotta
        1: '#f3a258', // sandybrown
        2: '#53bed0', // shakespeare
        3: '#5267b4', // sanmarino
      },
      terracotta: '#ef4631',
      sandybrown: '#f3a258',
      shakespeare: '#53bed0',
      sanmarino: '#5267b4',
      gray: {
        0: '#000000',
        1: '#3c3a3b',
        2: '#5f5d5e',
        3: '#858384',
        4: '#acaaab',
        5: '#d6d3d5',
        6: '#ededed',
      },
      white: '#ffffff',
      whitetranslucent: '#ffffffcc',
      'dark-sandy-brown': '#A7560C',
      'dark-shakespeare': '#247583',
      'terracotta-hover': '#EA2A12',
      'terracotta-active': '#C92410',
      'terracotta-tp-hover': 'rgba(239,70,49,0.05)',
      'terracotta-tp-active': 'rgba(239,70,49,0.15)',
    },
    fontFamily: {
      'sans': ['Satoshi', 'ui-sans-serif', 'system-ui'],
      'serif': [
        'Merriweather',
        'Times New Roman',
        'serif',
      ],
      'sans-serif': [
        'Aktiv-Grotesk',
        'Helvetica',
        'Arial',
        'Apple Color Emoji',
        'sans-serif',
      ],
    },
  },
  screens: {
    sm: '544px',
    md: '768px',
    lg: '1366px',
  },
  boxShadow: {
    0: '0px 0px 10px rgba(0, 0, 0, 0.08)',
    1: '0px 0px 15px rgba(0, 0, 0, 0.16)',
    2: '0px 0px 20px rgba(0, 0, 0, 0.24)',
    input: '0px 0px 1px 1px #858384',
  },
  spacing: {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '16px',
    4: '24px',
    5: '32px',
    6: '40px',
    7: '48px',
    8: '64px',
    9: '80px',
    10: '96px',
    11: '112px',
    12: '128px',
  },
  variants: ['hover', 'active', 'focus', 'disabled'],
  plugins: [],
}
