# eslint-plugin-prettier-vue

[![npm](https://img.shields.io/npm/v/eslint-plugin-prettier-vue)](https://www.npmjs.com/package/eslint-plugin-prettier-vue)
[![prettier](https://img.shields.io/badge/code%20style-prettier-blue)](https://github.com/prettier/prettier)
[![GitHub](https://img.shields.io/github/license/meteorlxy/eslint-plugin-prettier-vue)](https://github.com/meteorlxy/eslint-plugin-prettier-vue/blob/main/LICENSE)

> Make prettier works better on Vue SFC

- Includes all functions of [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier).
- Provides the ability for `prettier` to process [custom blocks](https://vue-loader.vuejs.org/guide/custom-blocks.html) of Vue SFCs.
- Options to disable `prettier` for `<template>`, `<script>` or `<style>` blocks of Vue SFCs.

## Demo

Prettier custom blocks:

![demo](https://user-images.githubusercontent.com/18205362/63491748-9a33fb00-c4ea-11e9-9f2e-cdb9b1dab8f1.gif)

## Usage

### Installation

```sh
npm install --save-dev \
  eslint-plugin-prettier-vue \
  eslint-plugin-vue \
  eslint-config-prettier \
  eslint \
  prettier
```

### ESLint Config

**DO NOT** use `eslint-plugin-prettier` together. This plugin includes all functionalities of `eslint-plugin-prettier` so you do not need it.

```js
// .eslintrc.js
module.exports = {
  extends: ['plugin:vue/recommended', 'plugin:prettier-vue/recommended'],

  settings: {
    'prettier-vue': {
      // Settings for how to process Vue SFC Blocks
      SFCBlocks: {
        /**
         * Use prettier to process `<template>` blocks or not
         *
         * If set to `false`, you may need to enable those vue rules that are disabled by `eslint-config-prettier`,
         * because you need them to lint `<template>` blocks
         *
         * @default true
         */
        template: true,

        /**
         * Use prettier to process `<script>` blocks or not
         *
         * If set to `false`, you may need to enable those rules that are disabled by `eslint-config-prettier`,
         * because you need them to lint `<script>` blocks
         *
         * @default true
         */
        script: true,

        /**
         * Use prettier to process `<style>` blocks or not
         *
         * @default true
         */
        style: true,

        // Settings for how to process custom blocks
        customBlocks: {
          // Treat the `<docs>` block as a `.markdown` file
          docs: { lang: 'markdown' },

          // Treat the `<config>` block as a `.json` file
          config: { lang: 'json' },

          // Treat the `<module>` block as a `.js` file
          module: { lang: 'js' },

          // Ignore `<comments>` block (omit it or set it to `false` to ignore the block)
          comments: false,

          // Other custom blocks that are not listed here will be ignored
        },
      },

      // Use prettierrc for prettier options or not (default: `true`)
      usePrettierrc: true,

      // Set the options for `prettier.getFileInfo`.
      // @see https://prettier.io/docs/en/api.html#prettiergetfileinfofilepath-options
      fileInfoOptions: {
        // Path to ignore file (default: `'.prettierignore'`)
        // Notice that the ignore file is only used for this plugin
        ignorePath: '.testignore',

        // Process the files in `node_modules` or not (default: `false`)
        withNodeModules: false,
      },
    },
  },

  rules: {
    'prettier-vue/prettier': [
      'error',
      {
        // Override all options of `prettier` here
        // @see https://prettier.io/docs/en/options.html
        printWidth: 100,
        singleQuote: true,
        semi: false,
        trailingComma: 'es5',
      },
    ],
  },
};
```

## LICENSE

[MIT](https://github.com/meteorlxy/eslint-plugin-prettier-vue/blob/main/LICENSE) &copy; [@meteorlxy](https://github.com/meteorlxy) & [Contributors](https://github.com/meteorlxy/eslint-plugin-prettier-vue/graphs/contributors)

[MIT](https://github.com/prettier/eslint-plugin-prettier/blob/master/LICENSE.md) &copy; [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier)
