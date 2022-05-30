import request from '@/utils/request'

export function getGoodsList(data) {
  return request({
    url: '/api/getZlStore',
    method: 'post',
    data
  })
}



