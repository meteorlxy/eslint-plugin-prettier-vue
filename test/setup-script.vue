<script setup>
import { ref } from 'vue'

const attrOrder = 'v-model'
const refVal = ref("foo")
const onClick = () => {
  refVal.value = 'bar';
}
</script>

<template>
  <div>
    <input id="multiple" class="attributes" v-model="attrOrder" @click="onClick">
  </div>
</template>
