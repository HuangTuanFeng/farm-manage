import request from '@/utils/request'

// 查询销售员客户列表
export function listCustomer(query) {
  return request({
    url: '/manager/customer/list',
    method: 'get',
    params: query
  })
}

// 查询销售员客户详细
export function getCustomer(id) {
  return request({
    url: '/manager/customer/info/' + id,
    method: 'get'
  })
}

// 新增销售员客户
export function addCustomer(data) {
  return request({
    url: '/manager/customer',
    method: 'post',
    data: data
  })
}

// 修改销售员客户
export function updateCustomer(data) {
  return request({
    url: '/manager/customer',
    method: 'put',
    data: data
  })
}

// 删除销售员客户
export function delCustomer(id) {
  return request({
    url: '/manager/customer/' + id,
    method: 'delete'
  })
}

// 导出销售员客户
export function exportCustomer(query) {
  return request({
    url: '/manager/customer/export',
    method: 'get',
    params: query
  })
}