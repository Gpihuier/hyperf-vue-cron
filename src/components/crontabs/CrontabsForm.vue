<template>
  <el-form :model="inner" :rules="rules" ref="ruleFormRef" label-width="auto">
    <el-form-item label="任务名称" prop="name">
      <el-input v-model="inner.name" show-word-limit type="text" :maxlength="64" />
    </el-form-item>

    <el-form-item label="任务执行规则" prop="rule">
      <el-input v-model="inner.rule" type="text" :maxlength="64" />
    </el-form-item>

    <el-form-item label="是否启动" prop="enable">
      <el-radio-group v-model="inner.enable">
        <el-radio :value="true">是</el-radio>
        <el-radio :value="false">否</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="URL地址" prop="url">
      <el-input v-model="inner.url" />
    </el-form-item>

    <el-form-item label="请求方式" prop="method">
      <el-select v-model="inner.method" clearable>
        <el-option label="GET" value="GET" />
        <el-option label="POST" value="POST" />
      </el-select>
    </el-form-item>

    <el-form-item label="MQ路由Key" prop="routing_key">
      <el-input v-model="inner.routing_key" />
    </el-form-item>

    <el-form-item label="请求参数" prop="params">
      <el-input
        v-model="inner.params"
        type="textarea"
        :rows="4"
        placeholder='示例: {"hello":"world"}'
      />
    </el-form-item>

    <el-form-item label="自定义任务处理方法" prop="custom_handler">
      <el-input v-model="inner.custom_handler" />
    </el-form-item>

    <el-form-item label="备注" prop="remark">
      <el-input v-model="inner.remark" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

interface CrontabFormModel {
  name?: string
  rule?: string
  enable?: boolean
  url?: string
  method?: string
  routing_key?: string
  params?: string
  custom_handler?: string
  remark?: string
}

const props = defineProps<{ modelValue?: CrontabFormModel }>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: CrontabFormModel): void
  (e: 'submit', payload: Record<string, unknown>): void
  (e: 'cancel'): void
}>()

const ruleFormRef = ref<FormInstance>()

const inner = reactive<Required<CrontabFormModel>>({
  name: props.modelValue?.name ?? '',
  rule: props.modelValue?.rule ?? '',
  enable: props.modelValue?.enable ?? true,
  url: props.modelValue?.url ?? '',
  method: props.modelValue?.method ?? '',
  routing_key: props.modelValue?.routing_key ?? '',
  params: props.modelValue?.params ?? '',
  custom_handler: props.modelValue?.custom_handler ?? '',
  remark: props.modelValue?.remark ?? '',
})

watch(
  () => props.modelValue,
  (v) => {
    if (!v) return
    inner.name = v.name ?? ''
    inner.rule = v.rule ?? ''
    inner.enable = v.enable ?? true
    inner.url = v.url ?? ''
    inner.method = v.method ?? ''
    inner.routing_key = v.routing_key ?? ''
    inner.params = v.params ?? ''
    inner.custom_handler = v.custom_handler ?? ''
    inner.remark = v.remark ?? ''
  },
  { immediate: true, deep: true },
)

const validateCron = (_rule: unknown, value: string, callback: (err?: Error) => void) => {
  if (!value || String(value).trim() === '') return callback(new Error('任务执行规则 为必填'))
  const parts = String(value).trim().split(/\s+/)
  if (parts.length !== 5 && parts.length !== 6)
    return callback(new Error('Crontab 表达式格式不正确'))
  callback()
}

const validateRoutingKey = (_rule: unknown, value: string, callback: (err?: Error) => void) => {
  if (!value || String(value).trim() === '') return callback(new Error('MQ路由Key 为必填'))
  const s = String(value)
  if (s.length > 255) return callback(new Error('MQ路由Key 最多 255 个字符'))
  if (!/^[a-zA-Z0-9._*-]+$/.test(s))
    return callback(new Error('MQ路由Key 只允许 a-zA-Z0-9 . _ * -'))
  callback()
}

const validateParamsJson = (_rule: unknown, value: string, callback: (err?: Error) => void) => {
  if (!value || String(value).trim() === '') return callback()
  try {
    const parsed = JSON.parse(value)
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return callback(new Error('请求参数 必须是合法的json对象, e.g. {"hello":"world"}'))
    }
    callback()
  } catch {
    return callback(new Error('请求参数 必须是合法的 JSON'))
  }
}

const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入任务名称', trigger: 'blur' },
    { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' },
    {
      pattern: /^[A-Za-z0-9_-]+$/,
      message: '任务名称 只允许字母、数字、下划线和短横线',
      trigger: 'blur',
    },
  ],
  rule: [
    { required: true, validator: validateCron, trigger: 'blur' },
    { max: 32, message: '任务执行规则 最多 32 个字符', trigger: 'blur' },
  ],
  enable: [{ required: true, message: '请选择是否启动', trigger: 'change' }],
  url: [
    { required: true, message: '请输入 URL 地址', trigger: 'blur' },
    { max: 128, message: 'url 最多 128 个字符', trigger: 'blur' },
  ],
  method: [{ required: true, message: '请选择请求方式', trigger: 'change' }],
  routing_key: [{ required: true, validator: validateRoutingKey, trigger: 'blur' }],
  params: [{ validator: validateParamsJson, trigger: 'blur' }],
  custom_handler: [{ max: 64, message: '自定义任务处理方法 最多 64 个字符', trigger: 'blur' }],
  remark: [{ max: 255, message: '备注 最多 255 个字符', trigger: 'blur' }],
})

const handleSubmit = () => {
  ruleFormRef.value?.validate((valid) => {
    if (!valid) return
    let paramsObj: Record<string, unknown> | undefined = undefined
    if (inner.params && String(inner.params).trim() !== '') {
      try {
        paramsObj = JSON.parse(inner.params)
      } catch (e) {
        console.error('params JSON parse failed', e)
        return
      }
    }

    const payload: Record<string, unknown> = {
      name: inner.name,
      rule: inner.rule,
      enable: inner.enable ? 1 : 0,
      url: inner.url,
      method: inner.method,
      routing_key: inner.routing_key,
      params: paramsObj,
      custom_handler: inner.custom_handler,
      remark: inner.remark,
    }

    emit('submit', payload)
    emit('update:modelValue', { ...inner })
  })
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped lang="scss">
.el-form {
  width: 100%;
}
</style>
