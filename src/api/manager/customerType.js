import request from '@/utils/request'

// 查询行业类型列表
export function listCustomerType(query) {
  return request({
    url: '/manager/type/list',
    method: 'get',
    params: query
  })
}

// 新增销售员客户
export function addCustomerType(data) {
    return request({
      url: '/manager/type/add',
      method: 'post',
      data: data
    })
  }
  

// 查询行业类型详细
export function getCustomerType(id) {
    return request({
      url: '/manager/type/info/' + id,
      method: 'get'
    })
  }

// 修改行业类型
export function updateCustomerType(data) {
    return request({
      url: '/manager/type',
      method: 'put',
      data: data
    })
  }
    
// 删除行业类型
export function delCustomerType(id) {
    return request({
      url: '/manager/type/' + id,
      method: 'delete'
    })
  }