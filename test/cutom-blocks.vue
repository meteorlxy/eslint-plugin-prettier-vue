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
# This is a markdown block
```json
{"json": "in","markdown":"can","be":"formatted"}
```
```js
const hello = {
  custom: 'blocks'
}
```
</docs>

<config></config>

<style>
div { color: green }
</style>

<style lang="scss">
$text-color: green;
div { color: $text-color; }
</style>
