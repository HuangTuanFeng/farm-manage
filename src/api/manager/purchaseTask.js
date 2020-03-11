import request from '@/utils/request'

var purchaseTask = {
    list: function (query) {
        return request({
            url: '/manager/task/list',
            method: 'get',
            params: query
        })
    },
    add: function (data) {
        return request({
            url: '/manager/task/add',
            method: 'post',
            data: data
        })
    },
    get: function (id) {
        return request({
            url: '/manager/task/' + id,
            method: 'get'
        })
    },
    update: function (data) {
        return request({
            url: '/manager/task',
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
    // 获取明细列表
    getLines: function (id) {
        return request({
            url: '/manager/task/listTaskInfo/' + id,
            method: 'get'
        })
    },
}

export default purchaseTask;