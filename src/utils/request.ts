import axios from 'axios'

import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

import { ElMessage, ElLoading } from 'element-plus'

const axiosInstance = axios.create({
  baseURL: (import.meta.env.VITE_BASE_URL as string) ? '/api' : '',
  timeout: 5000,
})

// loading 实例类型
let loadingInstance: ReturnType<typeof ElLoading.service> | null = null

let requestCount = 0

// 响应数据格式
interface ApiResponse<T = unknown> {
  code: number
  message: string
  data?: T
  ok: boolean
}

// 避免重复调用
const increase = () => {
  requestCount++
  if (requestCount === 1) {
    loadingInstance = ElLoading.service({
      lock: true,
      fullscreen: true,
      text: '加载中',
    })
  }
}

const decrease = () => {
  requestCount--
  // 请求全部完成时关闭
  if (requestCount <= 0) {
    requestCount = 0
    if (loadingInstance) {
      loadingInstance.close()
      loadingInstance = null
    }
  }
}

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    increase()
    config.headers!.Token = 'TODO'
    return config
  },
  (err: AxiosError) => {
    decrease()
    return Promise.reject(err)
  },
)

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>): AxiosResponse | Promise<AxiosResponse> => {
    decrease()
    const res = response.data

    if (!res.ok) {
      ElMessage.error(res.message || '响应异常')
      throw new Error(res.message || '响应异常')
    }

    // 把业务 payload 写回 response.data，这样后续的 axiosInstance.request<T> 将得到 AxiosResponse<T>
    ;(response as AxiosResponse<unknown>).data = res.data as unknown
    return response as AxiosResponse
  },
  (err: AxiosError) => {
    decrease()
    return Promise.reject(err)
  },
)

// createRequest
const createRequest =
  <T = unknown>(method: 'get' | 'post' | 'put' | 'delete') =>
  (url: string, params: Record<string, unknown> = {}) => {
    if (method === 'get') {
      return axiosInstance.get<T>(url, { params }).then((res) => res.data) as Promise<T>
    }

    if (method === 'delete') {
      return axiosInstance.delete<T>(url, { data: params }).then((res) => res.data) as Promise<T>
    }

    // post / put
    return axiosInstance[method]<T>(url, params).then((res) => res.data) as Promise<T>
  }

  // 明确导出的请求对象类型，保证调用处能推断出泛型返回值
  type RequestMethods = {
    get: <T = unknown>(url: string, config?: { params?: Record<string, unknown> }) => Promise<T>
    post: <T = unknown>(url: string, data?: Record<string, unknown>) => Promise<T>
    put: <T = unknown>(url: string, data?: Record<string, unknown>) => Promise<T>
    delete: <T = unknown>(url: string, data?: Record<string, unknown>) => Promise<T>
  }

  const requestObj: RequestMethods = {
    get: createRequest('get'),
    post: createRequest('post'),
    put: createRequest('put'),
    delete: createRequest('delete'),
  }

  export default requestObj
