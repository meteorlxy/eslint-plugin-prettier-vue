## [2.1.1](https://github.com/meteorlxy/eslint-plugin-prettier-vue/compare/v2.1.0...v2.1.1) (2020-07-24)


### Bug Fixes

* support vue-indent-script-and-style option (close [#12](https://github.com/meteorlxy/eslint-plugin-prettier-vue/issues/12)) ([ec36426](https://github.com/meteorlxy/eslint-plugin-prettier-vue/commit/ec364265f132cf9201647ac2440b33c404dfe561))



# [2.1.0](https://github.com/meteorlxy/eslint-plugin-prettier-vue/compare/v2.0.2...v2.1.0) (2020-04-28)


### Features

* support prettier 2.0 ([fe58782](https://github.com/meteorlxy/eslint-plugin-prettier-vue/commit/fe587826c52f10afc5582397a7d4afb21845b68f))



## [2.0.2](https://github.com/meteorlxy/eslint-plugin-prettier-vue/compare/v2.0.1...v2.0.2) (2019-10-24)


### Bug Fixes

* warning for unsupported file format ([1c6b918](https://github.com/meteorlxy/eslint-plugin-prettier-vue/commit/1c6b918))



## [2.0.1](https://github.com/meteorlxy/eslint-plugin-prettier-vue/compare/v2.0.0...v2.0.1) (2019-10-22)


### Bug Fixes

* add prefix to avoid cache ([d80eaaf](https://github.com/meteorlxy/eslint-plugin-prettier-vue/commit/d80eaaf))



# [2.0.0](https://github.com/meteorlxy/eslint-plugin-prettier-vue/compare/v1.1.3...v2.0.0) (2019-08-22)


### Features

* make this plugin more flexible ([e67cffd](https://github.com/meteorlxy/eslint-plugin-prettier-vue/commit/e67cffd))
  - ability to process `<template>` block
  - options to disable prettier for `<template>`, `<script>` and `<style>` blocks


### BREAKING CHANGES

* settings for custom blocks migrate from `settings['prettier-vue].customBlocks` to `settings['prettier-vue].SFCBlocks.customBlocks`
* this plugin will process `<template>` block by default



## [1.1.3](https://github.com/meteorlxy/eslint-plugin-prettier-vue/compare/v1.1.2...v1.1.3) (2019-08-22)


### Bug Fixes

* disable deindent option ([a98b58d](https://github.com/meteorlxy/eslint-plugin-prettier-vue/commit/a98b58d))



## [1.1.2](https://github.com/meteorlxy/eslint-plugin-prettier-vue/compare/v1.1.1...v1.1.2) (2019-08-05)


### Bug Fixes

* move prettier to dependencies ([6797c8c](https://github.com/meteorlxy/eslint-plugin-prettier-vue/commit/6797c8c))



## [1.1.1](https://github.com/meteorlxy/eslint-plugin-prettier-vue/compare/v1.1.0...v1.1.1) (2019-08-05)


### Bug Fixes

* restriction of vue-template-compiler version ([a7c20fa](https://github.com/meteorlxy/eslint-plugin-prettier-vue/commit/a7c20fa))



# [1.1.0](https://github.com/meteorlxy/eslint-plugin-prettier-vue/compare/v1.0.0...v1.1.0) (2019-08-04)


### Features

* ignore custom blocks by default ([a5e4907](https://github.com/meteorlxy/eslint-plugin-prettier-vue/commit/a5e4907))



# [1.0.0](https://github.com/meteorlxy/eslint-plugin-prettier-vue/compare/v0.2.0...v1.0.0) (2019-08-03)

### Features

* set options in settings field ([3751942](https://github.com/meteorlxy/eslint-plugin-prettier-vue/commit/3751942))


### BREAKING CHANGES

* options set in the third item of the rule is not valid



# [0.2.0](https://github.com/meteorlxy/eslint-plugin-prettier-vue/compare/v0.1.2...v0.2.0) (2019-08-03)


### Features

* process all sfc blocks in the same way ([546d098](https://github.com/meteorlxy/eslint-plugin-prettier-vue/commit/546d098))



## [0.1.2](https://github.com/meteorlxy/eslint-plugin-prettier-vue/compare/v0.1.1...v0.1.2) (2019-08-03)


### Bug Fixes

* handle empty blocks (close [#1](https://github.com/meteorlxy/eslint-plugin-prettier-vue/issues/1)) ([83adc70](https://github.com/meteorlxy/eslint-plugin-prettier-vue/commit/83adc70))



## [0.1.1](https://github.com/meteorlxy/eslint-plugin-prettier-vue/compare/v0.1.0...v0.1.1) (2019-08-03)


### Bug Fixes

* set default lang of custom blocks to vue ([194d86a](https://github.com/meteorlxy/eslint-plugin-prettier-vue/commit/194d86a))



# [0.1.0](https://github.com/meteorlxy/eslint-plugin-prettier-vue/compare/v0.0.1...v0.1.0) (2019-08-03)


### Features

* specify prettier options ([957d17b](https://github.com/meteorlxy/eslint-plugin-prettier-vue/commit/957d17b))
* support style and custom blocks ([238912f](https://github.com/meteorlxy/eslint-plugin-prettier-vue/commit/238912f))



## 0.0.1 (2019-07-31)
