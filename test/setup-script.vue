<template>
  <div>
    <input id="multiple" class="attributes" v-model="attrOrder">
  </div>
</template>

<script setup>
import { ref } from 'vue'

const attrOrder = 'v-model'
const refVal = ref("foo")
</script>
