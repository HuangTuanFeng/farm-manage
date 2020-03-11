import request from '@/utils/request'

// 查询供应商列表
export function listFarm(query) {
  return request({
    url: '/manager/farm/list',
    method: 'get',
    params: query
  })
}

// 查询供应商详细
export function getFarm(roleId) {
  return request({
    url: '/manager/farm/info/' + roleId,
    method: 'get'
  })
}

// 查询供应商供货计划信息
export function getFarmSupplyPlan(roleId) {
  return request({
    url: '/manager/farm/plan/' + roleId,
    method: 'get'
  })
}

// 添加供应商等级
export function addFarmLevel(data) {
  return request({
    url: '/manager/farm/update',
    method: 'put',
    data
  })
}