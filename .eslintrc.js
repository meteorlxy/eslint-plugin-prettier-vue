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
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
      },
    },
    {
      files: ['*.vue'],
      extends: ['@meteorlxy/typescript-vue', 'plugin:prettier-vue/recommended'],
      parserOptions: {
        project: ['tsconfig.json'],
      },
      rules: {
        'prettier-vue/prettier': [
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
        template: false,
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
