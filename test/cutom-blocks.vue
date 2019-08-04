<template>
  <div>
    <input id="multiple" class="attributes" v-model="attrOrder">
  </div>
</template>

<script>
export default {
  name: 'pascal-case',

  data: () => ({
    attrOrder: 'v-model',
    single: "quote",
    comma: 'dangle'
  }),
}
</script>

<docs>
# This is a markdown block and will be prettier
Because its language is specified in the settings:
```js
// .eslintrc.js
module.exports = {
  settings: {
    'prettier-vue': {
      customBlocks: {
        docs: { lang: "markdown" }
      }
    }
  }
}
```
```json
{"json": "in","markdown":"can","be":"formatted"}
```
</docs>

<no-prettier-block>
# This is a markdown block and won't be prettier
Because it is set to `false` settings:
```js
// .eslintrc.js
module.exports = {
  settings: {
    'prettier-vue': {
      customBlocks: {
        'no-prettier-block': false,
      },
    },
  },
}
```
</no-prettier-block>

<config>
## This block will be ignored too
Because it is not listed in the settings.
</config>

<style>
div { color: green }
</style>

<style lang="scss">
$text-color: green;
div { color: $text-color; }
</style>
