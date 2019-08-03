<template>
  <div>
    <input id="multiple" class="attributes" v-model="attrOrder">
  </div>
</template>

<script lang="ts">
export default {
  name: 'pascal-case',

  data: () => ({
    attrOrder: 'v-model',
    single: "quote",
    comma: 'dangle'
  }),
}
</script>

<style>
div { color: green }
</style>

<style lang="less">
@text-color: green;
div { color: @text-color; }
</style>
