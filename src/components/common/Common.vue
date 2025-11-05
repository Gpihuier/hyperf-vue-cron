<template>
  <div>
    <h2>{{ props.title }}</h2>
    <button @click="handleClick">click me</button>
  </div>
  <div>
    <p>Model Value: {{ model }}</p>
    <button @click="update">Increment Model</button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['title'])

const emit = defineEmits(['click-me'])

const model = defineModel({
  type: Number,
  required: true,
})

const handleClick = () => {
  emit('click-me')
}

const update = () => {
  model.value++
}
</script>

<style scoped lang="scss"></style>
