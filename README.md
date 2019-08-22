# eslint-plugin-prettier-vue

[![npm](https://img.shields.io/npm/v/eslint-plugin-prettier-vue)](https://www.npmjs.com/package/eslint-plugin-prettier-vue)
[![prettier](https://img.shields.io/badge/code%20style-prettier-blue)](https://github.com/prettier/prettier)
[![GitHub](https://img.shields.io/github/license/meteorlxy/eslint-plugin-prettier-vue)](https://github.com/meteorlxy/eslint-plugin-prettier-vue/blob/master/LICENSE)

> Make prettier works better on Vue SFCs

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

__DO NOT__ use `eslint-plugin-prettier` together. This plugin is based on `eslint-plugin-prettier` so you do not need it.

```js
// .eslintrc.js
module.exports = {
  extends: [
    'plugin:vue/recommended',
    'plugin:prettier-vue/recommended',
    // Do not add `'prettier/vue'` if you don't want to use prettier for `<template>` blocks
    'prettier/vue',
  ],

  settings: {
    'prettier-vue': {
      // Settings for how to process Vue SFC Blocks
      SFCBlocks: {
        /**
         * Use prettier to process `<template>` blocks or not
         *
         * If set to `false`, remember not to `extends: ['prettier/vue']`, as you need the rules from `eslint-plugin-vue` to lint `<template>` blocks
         *
         * @default true
         */
        template: false,

        /**
         * Use prettier to process `<script>` blocks or not
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
}
```

## LICENSE

[MIT](https://github.com/meteorlxy/eslint-plugin-prettier-vue/blob/master/LICENSE) &copy; [@meteorlxy](https://github.com/meteorlxy) & [Contributors](https://github.com/meteorlxy/eslint-plugin-prettier-vue/graphs/contributors)
