module.exports = {
  root: true,

  overrides: [
    {
      files: ['*.js'],
      extends: '@meteorlxy/prettier',
    },
    {
      files: ['*.ts'],
      extends: '@meteorlxy/prettier-typescript',
      parserOptions: {
        project: ['tsconfig.json'],
      },
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
        'plugin:prettier-vue/recommended',
        'prettier',
      ],
      rules: {
        'prettier-vue/prettier': [
          'error',
          {
            // singleQuote: false,
            // semi: true,
            // trailingComma: 'none',
          },
        ],
        'import/prefer-default-export': 'off',
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
