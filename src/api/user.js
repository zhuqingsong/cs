import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/login',
    method: 'post',
    data
  })
}

export function getInfo(data) {
  return request({
    url: '/api/getmenu',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

export function getUserList(data) {
  return request({
    url: '/api/getuserlist',
    method: 'get'
  })
}

export function getRoleList(){
   return request({
     url: '/api/role',
     method: 'get'
   })
}

export function getMenuList(params) {
  return request({
    url: '/api/getMenuList',
    method: 'get',
    params
  })
}

export function addRole(data) {
  return request({
    url: '/api/addRole',
    method: 'post',
    data
  })
}

export function updateAuth(data) {
  return request({
    url: '/api/updateAuth',
    method: 'post',
    data
  })
}


export function addUserInfo(data) {
  return request({
    url: '/api/addUserInfo',
    method: 'post',
    data
  })
}

//api/addUserMenu 添加菜单
export function addUserMenu(data) {
  return request({
    url: '/api/addUserMenu',
    method: 'post',
    data
  })
}

// /api/updateUserInfo
export function updateUserInfo(data) {
  return request({
    url: '/api/updateUserInfo',
    method: 'post',
    data
  })
}