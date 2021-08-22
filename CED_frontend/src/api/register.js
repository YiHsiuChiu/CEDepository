import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/vue-element-admin/routes',
    method: 'get'
  })
}

export function getCars() {
  return request({
    url: '/register/getCars',
    method: 'get'
  })
}

export function addCar(data) {
  console.log(data)
  return request({
    url: '/register/addCar',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: 'put',
    data
  })
}

export function deleteCar(id) {
  //console.log(id)
  return request({
    url: `/register/deleteCar/${id}`,
    method: 'delete'
  })
}
