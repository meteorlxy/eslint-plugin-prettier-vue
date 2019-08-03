# eslint-plugin-prettier-vue

[![npm](https://img.shields.io/npm/v/eslint-plugin-prettier-vue)](https://www.npmjs.com/package/eslint-plugin-prettier-vue)
[![prettier](https://img.shields.io/badge/code%20style-prettier-blue)](https://github.com/prettier/prettier)
[![GitHub](https://img.shields.io/github/license/meteorlxy/eslint-plugin-prettier-vue)](https://github.com/meteorlxy/eslint-plugin-prettier-vue/blob/master/LICENSE)

> Make prettier work better with [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue) on `.vue` files

- Has the same function as [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier), except `.vue` files (basically, it's a fork of [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier)).
- Stops `prettier` processing the `<template>` block of `.vue` files, so that you can following the [Vue Style Guide](https://vuejs.org/v2/style-guide/) to write your `<template>`.
- Provides the ability for `prettier` to process [custom blocks](https://vue-loader.vuejs.org/guide/custom-blocks.html) of `.vue` files.

## Demo

![demo](https://user-images.githubusercontent.com/18205362/62232051-e31af700-b3f7-11e9-8bd4-bd7805bfbca0.gif)

Works with `<script>`, `<style>` and custom blocks:

![demo-custom-blocks](https://user-images.githubusercontent.com/18205362/62407420-f80bac00-b5ea-11e9-8cd9-77e2e55cb16c.gif)

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

```js
// .eslintrc.js
module.exports = {
  extends: [
    'plugin:vue/recommended',
    'plugin:prettier-vue/recommended',
  ],

  settings: {
    'prettier-vue': {
      // Settings for how to process the custom blocks
      customBlocks: {
        // Treat the `<docs>` block as a `.markdown` file
        docs: { lang: 'markdown' },

        // Treat the `<config>` block as a `.json` file
        config: { lang: 'json' },

        // Treat the `<module>` block as a `.js` file
        module: { lang: 'js' },
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

        // Array of plugins (default: `[]`)
        // @see https://prettier.io/docs/en/plugins.html
        plugins: ['@prettier/plugin-pug'],
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

- __DO NOT__ use `eslint-plugin-prettier` together. This plugin is based on `eslint-plugin-prettier` so you do not need it.
- __DO NOT__ add `extends: ['prettier/vue']`, as you need the rules from `eslint-plugin-vue` to lint the `<template>` block of `.vue` files.

## LICENSE

[MIT](https://github.com/meteorlxy/eslint-plugin-prettier-vue/blob/master/LICENSE) &copy; [@meteorlxy](https://github.com/meteorlxy) & [Contributors](https://github.com/meteorlxy/eslint-plugin-prettier-vue/graphs/contributors)
