import request from '@/utils/request'

var demand = {
    list: function (query) {
        return request({
            url: '/manager/newProduct/list',
            method: 'get',
            params: query
        })
    }
}

export default demand;