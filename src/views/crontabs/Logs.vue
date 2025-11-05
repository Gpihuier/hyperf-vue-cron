<template>
  <div class="crontab-logs">
    <el-card>
      <div class="go-back">
        <div></div>
        <div>
          <el-button type="primary" @click="goBack">返回列表</el-button>
        </div>
      </div>

      <el-table :data="list" stripe style="width: 100%">
        <el-table-column prop="level" label="级别" width="100">
          <template #default="scope">
            <el-tag
              :type="
                scope.row.level === 'info'
                  ? 'success'
                  : scope.row.level === 'error'
                    ? 'warning'
                    : 'danger'
              "
              :effect="scope.row.level === 'info' ? 'dark' : 'plain'"
            >
              {{ scope.row.level }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="output" label="输出" :showTooltip="true" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag
              :type="scope.row.status === 1 ? 'success' : 'danger'"
              :effect="scope.row.status === 1 ? 'dark' : 'plain'"
            >
              {{ scope.row.status === 1 ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="cost_ms" label="耗时(ms)" width="120" />
        <el-table-column prop="created_at" label="时间" width="200" />
      </el-table>

      <div style="margin-top: 12px; display: flex; justify-content: flex-end">
        <el-pagination
          background
          :page-size="pagination.page_size"
          :current-page="pagination.page"
          :total="pagination.total"
          @current-change="onPageChange"
          @size-change="onSizeChange"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 50, 100]"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { getCrontabLogsApi } from '@/api/crontabs'
import { ElMessage } from 'element-plus'

import { useRoute, useRouter } from 'vue-router'

defineOptions({ name: 'CrontabLogs' })

const route = useRoute()
const id = Number(route.params.id)

const router = useRouter()

const goBack = () => {
  router.push({ name: 'CrontabsList' })
}

type LogItem = {
  level?: string
  output?: string
  status?: number | string
  cost_ms?: number
  created_at?: string
}

const list = ref<LogItem[]>([])

const pagination = reactive({ page: 1, page_size: 20, total: 0 })

const fetchList = async () => {
  try {
    const params = {
      page: pagination.page,
      page_size: pagination.page_size,
    }
    const res = (await getCrontabLogsApi(id, params)) as { list?: LogItem[]; total?: number }
    // assume API returns { list: [], total: number }
    list.value = Array.isArray(res?.list) ? res.list : []
    pagination.total = Number(res?.total || 0)
  } catch (err) {
    ElMessage.error((err as Error)?.message || '查询日志失败')
  }
}

const onPageChange = (page: number) => {
  pagination.page = page
  fetchList()
}

const onSizeChange = (size: number) => {
  pagination.page_size = size
  pagination.page = 1
  fetchList()
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped lang="scss">
.crontab-logs {
  padding: 12px;
}
.go-back {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
</style>
