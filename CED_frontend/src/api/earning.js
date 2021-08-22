import request from '@/utils/request'

export function getEarning(query) {
  return request({
    url: '/earning/',
    method: 'get',
    params: query
  })
}