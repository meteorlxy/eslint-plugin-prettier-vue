module.exports = {
  root: true,

  extends: ['@meteorlxy/prettier'],

  overrides: [
    {
      files: ['*.ts'],
      extends: '@meteorlxy/prettier-typescript',
      rules: {
        'no-console': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },
    {
      files: ['*.vue'],
      extends: [
        '@meteorlxy',
        'plugin:vue/recommended',
        'plugin:self/recommended',
        'prettier/vue',
      ],
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
    },
  ],

  settings: {
    'prettier-vue': {
      SFCBlocks: {
        template: true,
        script: true,
        style: true,
        customBlocks: {
          'docs': { lang: 'markdown' },
          'no-prettier-block': false,
        },
      },
      usePrettierrc: true,
      fileInfoOptions: {
        ignorePath: '.testignore',
      },
    },
  },
};
