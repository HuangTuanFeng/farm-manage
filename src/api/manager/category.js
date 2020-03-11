import request from '@/utils/request'

// 查询品类列表
export function listCategory(query) {
  return request({
    url: '/manager/category/list',
    method: 'get',
    params: query
  })
}

// 查询品类树列表
export function treeListCategory(query) {
  return request({
    url: '/manager/category/treeList',
    method: 'get',
    params: query
  })
}

// 查询品类详细
export function getCategory(CategoryId) {
  return request({
    url: '/manager/category/info/' + CategoryId,
    method: 'get'
  })
}

// 查询农场关联的品类
export function getCategoriesByFarmId(farmId) {
  return request({
    url: '/manager/category/farmId/' + farmId,
    method: 'get'
  })
}

// 新增品类
export function addCategory(data) {
  return request({
    url: '/manager/category/add',
    method: 'post',
    data: data
  })
}

// 修改品类
export function updateCategory(data) {
  return request({
    url: '/manager/category',
    method: 'put',
    data: data
  })
}
