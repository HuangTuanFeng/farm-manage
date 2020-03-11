import request from '@/utils/request'

// 查询采购订单列表
export function listPurchaseOrder(query) {
  return request({
    url: '/manager/purchaseorder/list',
    method: 'get',
    params: query
  })
}

// 查询采购订单详细
export function getPurchaseOrder(id) {
  return request({
    url: '/manager/purchaseorder/info/' + id,
    method: 'get'
  })
}

// 查询采购订单统计信息
export function getStatistics() {
  return request({
    url: '/manager/purchaseorder/statistics',
    method: 'get'
  })
}