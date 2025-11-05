import request from '@/utils/request'
import type { List, CrontabsListResponse } from './type'

// 获取crontabs列表
export const getCrontabsListApi = (
  params?: Record<string, unknown>,
): Promise<CrontabsListResponse> => {
  return request.get('/v1/cron', params)
}

export const createCrontabApi = (params?: Record<string, unknown>): Promise<unknown> => {
  return request.post('/v1/cron', params)
}

export const updateCrontabApi = (
  id: number,
  params?: Record<string, unknown>,
): Promise<unknown> => {
  return request.put(`/v1/cron/${id}`, params)
}

export const readCrontabApi = (id: number): Promise<List> => {
  return request.get(`/v1/cron/${id}`)
}

export const deleteCrontabApi = (id: number): Promise<unknown> => {
  return request.delete(`/v1/cron/${id}`)
}

export const enableCrontabApi = (id: number, enable: number): Promise<List> => {
  return request.get(`/v1/cron/${id}/enable/${enable}`)
}

// 获取定时任务执行日志
export const getCrontabLogsApi = (
  id: number,
  params?: Record<string, unknown>,
): Promise<unknown> => {
  return request.get(`/v1/cron/${id}/logs`, params)
}
