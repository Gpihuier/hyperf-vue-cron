<template>
  <el-form :inline="true" :model="search" ref="searchFormRef" label-width="auto">
    <el-form-item label="任务名称" prop="name">
      <el-input v-model="search.name" type="text" />
    </el-form-item>

    <el-form-item label="url" prop="url">
      <el-input v-model="search.url" type="text" />
    </el-form-item>

    <el-form-item label="状态" prop="enable" label-width="auto" style="width: 250px">
      <el-select v-model="search.enable" clearable>
        <el-option label="启用" :value="1" />
        <el-option label="禁用" :value="0" />
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleSubmit">查询</el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

interface Props {
  initSearch: {
    name?: string
    url?: string
    enable?: number
  }
}

const props = withDefaults(defineProps<Props>(), {
  initSearch: () => ({
    name: '',
    url: '',
    enable: undefined,
  }),
})

// 定义 emits 用于向父组件传递搜索条件
const emit = defineEmits<{
  search: [searchParams: { name?: string; url?: string; enable?: number }]
  reset: []
}>()

const search = reactive({
  name: props.initSearch.name || '',
  url: props.initSearch.url || '',
  enable: props.initSearch.enable as number | undefined,
})

const handleSubmit = () => {
  // 触发搜索事件，将搜索条件传递给父组件
  emit('search', {
    name: search.name.trim() ?? '',
    url: search.url.trim() ?? '',
    enable: search.enable,
  })
}

const handleReset = () => {
  search.name = ''
  search.url = ''
  search.enable = undefined
  // 触发重置事件
  emit('reset')
}
</script>

<style scoped lang="scss"></style>
