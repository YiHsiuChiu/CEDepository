import request from '@/utils/request'

export function getEvent(query) {
  return request({
    url: '/event/',
    method: 'get',
    params: query
  })
}

