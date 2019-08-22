module.exports = {
  root: true,

  extends: [
    'standard',
    'plugin:vue/recommended',
    'plugin:self/recommended',
    'prettier/standard',
    'prettier/vue',
  ],

  settings: {
    'prettier-vue': {
      SFCBlocks: {
        template: true,
        script: true,
        style: true,
        customBlocks: {
          docs: { lang: 'markdown' },
          'no-prettier-block': false,
        },
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
