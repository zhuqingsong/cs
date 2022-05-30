import request from '@/utils/request'

export function getCustomerList(data) {
  return request({
    url: '/api/getZlStore',
    method: 'post',
    data
  })
}


export function postAddStore(data) {
  return request({
    url: '/api/postAddStore',
    method: 'post',
    data
  })
}

export function postCloseStore(data){
  return request({
    url: '/api/postCloseStore',
    method: 'post',
    data
  })
}

export function getTestFn() {
  return request({
    url: '/api/test',
    method: 'post',
  })
}

// export function getMenuList(params) {
//     return request({
//       url: '/api/getMenuList',
//       method: 'get',
//       params
//     })
// }


