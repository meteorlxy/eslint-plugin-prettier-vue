# eslint-plugin-prettier-vue

> Forked from [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier), with some refactor and modifications.

Make prettier work better with [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue).

With the help of this plugin, you can stop prettier processing the `<template>` block of `.vue` files, so that you can following the [Vue Style Guide](https://vuejs.org/v2/style-guide/) to write your `<template>`.

![demo](https://user-images.githubusercontent.com/18205362/62232051-e31af700-b3f7-11e9-8bd4-bd7805bfbca0.gif)

## Usage

### Installation

```sh
npm install --save-dev eslint-plugin-prettier-vue eslint-plugin-vue eslint-config-prettier eslint prettier
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
      customBlocks: {
        docs: { lang: 'markdown' }
      }
    }
  }
}
```

- __DO NOT__ use `eslint-plugin-prettier` together. This plugin is based on `eslint-plugin-prettier` so you do not need it.
- __DO NOT__ add `extends: ['prettier/vue']`, as you need the rules from `eslint-plugin-vue` to lint the `<template>` block of `.vue` files.

## LICENSE

[MIT](https://github.com/meteorlxy/eslint-plugin-prettier-vue/blob/master/LICENSE) &copy; [@meteorlxy](https://github.com/meteorlxy) & [Contributors](https://github.com/meteorlxy/eslint-plugin-prettier-vue/graphs/contributors)
