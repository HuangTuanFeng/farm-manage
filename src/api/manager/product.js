import request from '@/utils/request'

var product = {
    list: function (query) {
        return request({
            url: '/manager/product/list',
            method: 'get',
            params: query
        })
    }
}

export default product;