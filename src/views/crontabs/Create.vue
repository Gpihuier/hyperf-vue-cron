<template>
  <div class="container">
    <div class="content">
      <CrontabForm @submit="onFormSubmit" @cancel="onCancel" />
    </div>
  </div>
</template>

<script lang="ts" setup>
// give this component a multi-word name to satisfy the ESLint rule
defineOptions({ name: 'CrontabCreate' })
import { ElMessage } from 'element-plus'
import { createCrontabApi } from '@/api/crontabs'
import { useRouter } from 'vue-router'
import CrontabForm from '@/components/crontabs/CrontabsForm.vue'

const router = useRouter()

const onFormSubmit = async (payload: Record<string, unknown>) => {
  try {
    await createCrontabApi(payload)
    ElMessage.success('创建成功')
    setTimeout(() => router.push({ name: 'CrontabsList' }), 800)
  } catch (e) {
    ElMessage.error('创建失败，请稍后重试')
    console.error('createCrontabApi error', e)
  }
}

const onCancel = () => {
  setTimeout(() => router.push({ path: '/crontabs' }), 100)
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;

  .content {
    width: 100%;

    .table-header {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 8px;
      padding: 0 8px;
    }

    :deep(.el-table) {
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      overflow: hidden;
    }

    @media (max-width: 1200px) {
      max-width: 100%;

      :deep(.el-table) {
        font-size: 14px;
      }
    }
  }
}
</style>
