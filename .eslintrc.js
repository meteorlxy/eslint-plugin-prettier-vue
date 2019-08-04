module.exports = {
  root: true,

  extends: [
    'standard',
    'prettier/standard',
    'plugin:vue/recommended',
    'plugin:self/recommended',
  ],

  settings: {
    'prettier-vue': {
      customBlocks: {
        docs: { lang: 'markdown' },
        'no-prettier-block': false,
      },
      usePrettierrc: true,
      fileInfoOptions: {
        ignorePath: '.testignore',
      },
    },
  },

  rules: {
    'self/prettier': [
      'error',
      {
        // singleQuote: false,
        // semi: true,
        // trailingComma: 'none',
      },
    ],
  },
}
