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

<style></style>

<style>
div { color: green }
</style>

<style lang="scss">
div { color: $text-color; }
  p { color: $text-color; }
    h1 { color: $text-color; }
</style>
