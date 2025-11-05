<template>
  <div class="crontabs-container">
    <div class="crontabs">
      <header class="table-header">
        <div class="search">
          <CrontabsSearch
            :init-search="initSearch"
            @search="handleSearchSubmit"
            @reset="handleSearchReset"
          />
        </div>
        <div class="create">
          <el-button type="primary" @click="addBtn">新增定时任务</el-button>
        </div>
      </header>

      <el-table :data="crontabsList.list" stripe>
        <el-table-column
          v-for="column in tableColumns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :show-overflow-tooltip="column.showTooltip || false"
        >
          <template #default="scope">
            <template v-if="column.prop === 'enable'">
              <el-tag
                :type="scope.row.enable ? 'success' : 'danger'"
                :effect="scope.row.enable ? 'dark' : 'plain'"
              >
                {{ scope.row.enable ? '启用' : '禁用' }}
              </el-tag>
            </template>
            <template v-else>
              {{ scope.row[column.prop] }}
            </template>
          </template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column fixed="right" label="操作" min-width="180">
          <!-- ensure the slot exposes `scope` so we can access scope.row.id -->
          <template #default="scope">
            <el-button link type="primary" size="small" @click="editBtn(scope.row.id)"
              >编辑</el-button
            >
            <el-button link type="danger" size="small" @click="deleteBtn(scope.row.id)"
              >删除</el-button
            >
            <el-button
              v-if="scope.row.enable"
              link
              type="danger"
              size="small"
              @click="enableBtn(scope.row.id, 0)"
            >
              禁用
            </el-button>
            <el-button v-else link type="primary" size="small" @click="enableBtn(scope.row.id, 1)">
              启用
            </el-button>
            <el-button link type="success" size="small" @click="viewLogs(scope.row.id)"
              >查看日志</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="page-wrapper">
        <div class="num">共 {{ crontabsList.total }} 项数据</div>
        <el-pagination
          :background="true"
          layout="prev, pager, next"
          :current-page="pagination.currentPage"
          :total="crontabsList.total"
          :page-size="pagination.pageSize"
          @current-change="changeList"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

import { getCrontabsListApi, deleteCrontabApi, enableCrontabApi } from '@/api/crontabs'
import { ElMessage, ElMessageBox } from 'element-plus'

import type { CrontabsListResponse } from '@/api/crontabs/type'

import CrontabsSearch from '@/components/crontabs/CrontabsSearch.vue'

defineOptions({ name: 'CrontabIndex' })

const router = useRouter()

// 搜索条件
const searchParams = reactive({
  name: '',
  url: '',
  enable: undefined as number | undefined,
})

// 初始搜索条件（传递给子组件）
const initSearch = ref({ ...searchParams })

// 分页参数
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
})

// 切换分页
const changeList = (val: number) => {
  pagination.currentPage = val
  crontabsListApi()
}

const loading = ref(false)

// 定义表格列配置
const tableColumns = ref([
  { prop: 'name', label: '名称', width: 200 },
  { prop: 'rule', label: 'Cron表达式', width: 100 },
  { prop: 'enable', label: '状态', width: 80 },
  { prop: 'url', label: 'url', width: 200 },
  { prop: 'last_run_time', label: '上次运行时间', width: 180 },
  { prop: 'next_run_time', label: '下次运行时间', width: 180 },
  { prop: 'remark', label: '备注', width: 200, showTooltip: true },
  { prop: 'created_at', label: '创建时间', width: 180 },
])

const crontabsList = reactive<CrontabsListResponse>({
  list: [],
  total: 0,
})

onMounted(() => {
  crontabsListApi()
})

// 获取列表数据
const crontabsListApi = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.currentPage,
      page_size: pagination.pageSize,
      ...searchParams,
    }

    const data = await getCrontabsListApi(params)

    crontabsList.list = data.list || []
    crontabsList.total = data.total || 0
  } catch (error) {
    console.error('获取定时任务列表失败:', error)
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 创建（使用命名路由）
const addBtn = () => {
  router.push({ name: 'CrontabsCreate' })
}

// 编辑（使用命名路由并传参）
const editBtn = (id: number) => {
  router.push({ name: 'CrontabsEdit', params: { id } })
}

// 删除
const deleteBtn = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除该定时任务吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
  } catch {
    return
  }

  try {
    await deleteCrontabApi(id)
    ElMessage.success('删除成功')
    // refresh list
    await crontabsListApi()
  } catch (e) {
    ElMessage.error('删除失败，请稍后重试')
    console.error('deleteCrontabApi error', e)
  }
}

const handleSearchSubmit = async (params: { name?: string; url?: string; enable?: number }) => {
  // 更新搜索条件
  searchParams.name = params.name ?? ''
  searchParams.url = params.url ?? ''
  searchParams.enable = params.enable

  // 重置到第一页
  pagination.currentPage = 1

  // 获取数据
  await crontabsListApi()
}

const handleSearchReset = async () => {
  // 重置搜索条件
  searchParams.name = ''
  searchParams.url = ''
  searchParams.enable = undefined

  // 重置到第一页
  pagination.currentPage = 1

  // 获取数据
  await crontabsListApi()
}

const enableBtn = async (id: number, enable: number) => {
  try {
    await ElMessageBox.confirm(`确定要${enable === 1 ? '启用' : '禁用'}该定时任务吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
  } catch {
    return
  }

  try {
    await enableCrontabApi(id, enable)
    ElMessage.success(`${enable === 1 ? '启用' : '禁用'}成功`)
    // refresh list
    await crontabsListApi()
  } catch (e) {
    ElMessage.error(`${enable === 1 ? '启用' : '禁用'}失败，请稍后重试`)
    console.error('enableCrontabApi error', e)
  }
}

// 查看日志
const viewLogs = (id: number) => {
  router.push({ name: 'CrontabLogs', params: { id } })
}
</script>

<style lang="scss" scoped>
.crontabs-container {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;

  .crontabs {
    width: 100%;

    .table-header {
      display: flex;
      justify-content: space-between;
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

    .page-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 16px;
      .num {
        color: rgba(0, 0, 0, 0.6);
        font-size: 14px;
      }
    }
  }
}
</style>
