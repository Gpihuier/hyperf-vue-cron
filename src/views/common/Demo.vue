<template>
  <div>
    <Common
      v-for="value in titles"
      :key="value.id"
      :title="value.title"
      @click-me="fn"
      v-model="counter"
    />
  </div>
</template>

<script setup lang="ts">
import Common from '@/components/common/Common.vue'
import { ref } from 'vue'

const titles = [
  { id: 1, title: 'Demo Page' },
  { id: 2, title: 'Test Page' },
  { id: 3, title: 'Sample Page' },
]

const counter = ref(0)

// 父组件写逻辑，子组件触发事件
const fn = () => {
  console.log('Button clicked!')
}
</script>

<style scoped lang="scss"></style>
