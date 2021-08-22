import request from '@/utils/request'

export function getFee(query) {
  return request({
    url: '/fee/',
    method: 'get',
    params: query
  })
}
