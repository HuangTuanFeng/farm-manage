import request from '@/utils/request'

// 查询销售单列表
export function listSalesOrder(query) {
  return request({
    url: '/manager/saleorder/list',
    method: 'get',
    params: query
  })
}

// 查询销售单详细
export function getSalesOrder(id) {
  return request({
    url: '/manager/saleorder/info/' + id,
    method: 'get'
  })
}

// 新增销售单
export function addSalesOrder(data) {
  return request({
    url: '/manager/saleorder',
    method: 'post',
    data: data
  })
}

// 修改销售单
export function updateSalesOrder(data) {
  return request({
    url: '/manager/saleorder',
    method: 'put',
    data: data
  })
}

// 删除销售单
export function delSalesOrder(id) {
  return request({
    url: '/manager/saleorder/' + id,
    method: 'delete'
  })
}

// 导出销售单
export function exportSalesOrder(query) {
  return request({
    url: '/manager/saleorder/export',
    method: 'get',
    params: query
  })
}