import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/search/getList/',
    method: 'get',
    params: query
  })
}
export function fetchallList() {
  return request({
    url: '/search/fetchallList/',
    method: 'get'
  })
}
export function fetchParking(id) {
  return request({
    url: '/tokenize/parking/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/tokenize/parking/pv',
    method: 'get',
    params: { pv }
  })
}

export function createParking(data) {
  return request({
    url: '/tokenize/parking/',
    method: 'post',
    data
  })
}

export function updateParking(data) {
  return request({
    url: '/tokenize/parking/',
    method: 'patch',
    data
  })
}

export function deleteParking(data) {
  return request({
    url: '/tokenize/parking/',
    method: 'delete',
    data
  })
}

export function updateList(query) {
  return request({
    url: '/tokenize/parking/update',
    method: 'get',
    params: query
  })
}

export function redeemParking(query) {
  return request({
    url: '/tokenize/parking/redeem',
    method: 'get',
    params: query
  })
}
