<template>
  <div>
    <input
      id="multiple"
      v-model="attrOrder"
      class="attributes"
    >
  </div>
</template>

<script>
export default {
  name: 'PascalCase',

  data: () => ({
    attrOrder: 'v-model',
    single: 'quote',
    comma: 'dangle',
  }),
}
</script>
