// 定义 Crontabs 列表项的类型
export interface List {
  id: number
  name: string
  rule: string
  enable: number
  url: string
  method: string
  routing_key: string
  params: string
  last_run_time: string
  next_run_time: string
  remark: string
  custom_handler: string
  created_at: string
  updated_at: string
}

export interface CrontabsDataResponse {
  list: List[]
  total: number
}

// 定义获取 Crontabs 列表接口的响应类型
export type CrontabsListResponse = CrontabsDataResponse
