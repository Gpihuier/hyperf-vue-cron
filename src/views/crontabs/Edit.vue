<template>
  <div class="container">
    <div class="content">
      <CrontabForm :modelValue="initial" @submit="onFormSubmit" @cancel="onCancel" />
    </div>
  </div>
</template>

<script lang="ts" setup>
// give this component a multi-word name to satisfy the ESLint rule
defineOptions({ name: 'CrontabEdit' })
import { reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { readCrontabApi, updateCrontabApi } from '@/api/crontabs'
import { useRouter, useRoute } from 'vue-router'
import CrontabForm from '@/components/crontabs/CrontabsForm.vue'

const router = useRouter()
const route = useRoute()

// initial values passed to form
const initial = reactive<Record<string, unknown>>({})

onMounted(async () => {
  const id = Number(route.params.id)
  if (!id) return
  try {
    const res = await readCrontabApi(id)
    // res is expected to be business data object
    initial.name = res.name ?? ''
    initial.rule = res.rule ?? ''
    initial.enable = res.enable === 1
    initial.url = res.url ?? ''
    initial.method = res.method ?? ''
    initial.routing_key = res.routing_key ?? ''
    initial.params = res.params
      ? typeof res.params === 'string'
        ? res.params
        : JSON.stringify(res.params)
      : ''
    initial.remark = res.remark ?? ''
  } catch (e) {
    ElMessage.error('读取定时任务失败')
    console.error('readCrontabApi error', e)
  }
})

const onFormSubmit = async (payload: Record<string, unknown>) => {
  const id = Number(route.params.id)
  try {
    await updateCrontabApi(id, payload)
    ElMessage.success('更新成功')
    setTimeout(() => router.push({ name: 'CrontabsList' }), 800)
  } catch (e) {
    ElMessage.error('更新失败，请稍后重试')
    console.error('updateCrontabApi error', e)
  }
}

const onCancel = () => {
  setTimeout(() => router.push({ name: 'CrontabsList' }), 100)
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
.content {
  width: 100%;
}
</style>
