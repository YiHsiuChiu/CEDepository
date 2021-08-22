import request from '@/utils/request'

export function getABI() {
  return request({
    url: '/contract/abi',
    method: 'get'
  })
}

export function getContractAddress() {
  return request({
    url: '/contract/contractAddress',
    method: 'get'
  })
}
