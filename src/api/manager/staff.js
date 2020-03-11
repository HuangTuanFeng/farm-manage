import request from '@/utils/request'

var staff = {
    // 销售员列表
    listSales: function (query) {
        return request({
            url: '/manager/staff/listSales',
            method: 'get',
            params: query
        })
    },
    // 采购员列表
    listPurchase: function (query) {
        return request({
            url: '/manager/staff/listPurchase',
            method: 'get',
            params: query
        })
    },

    // 添加销售员
    addSale: function (data) {
        return request({
            url: '/manager/staff/sale/add',
            method: 'post',
            data: data
        })
    },

    // 添加采购员
    addPurchase: function (data) {
        return request({
            url: '/manager/staff/purchase/add',
            method: 'post',
            data: data
        })
    },

    get: function (id) {
        return request({
            url: '/manager/staff/info/' + id,
            method: 'get'
        })
    },
    update: function (data) {
        return request({
            url: '/manager/staff',
            method: 'put',
            data: data
        })
    },
    del: function (id) {
        return request({
            url: '/manager/task/' + id,
            method: 'delete'
        })
    },

    // 获取进行中的销售单
    listSaleOrdersInProgress: function (query) {
        return request({
            url: '/manager/staff/saleOrdersInProgress',
            method: 'get',
            params: query
        })
    },

    // 获取进行中的采购单
    listPurchaseOrdersInProgress: function (query) {
        return request({
            url: '/manager/staff/purchaseOrdersInProgress',
            method: 'get',
            params: query
        })
    },

    // 获取业务员业务情况
    getBusiness: function (id) {
        return request({
            url: '/manager/staff/business/' + id,
            method: 'get'
        })
    }
}

export default staff;