import request from '@/utils/request'

export function postBookList(data) {
  return request({
    url: '/api/bookList',
    method: 'post',
    data
  })
}


export function getBookCate() {
  return request({
    url: '/api/bookcate',
    method: 'get'
  })
}


export function postAddBook(data) {
    return request({
      url: '/api/addBook',
      method: 'post',
      data
    })
  }

// /api/bookCateList
export function postBookNameList(data) {
    return request({
        url: '/api/bookNameList',
        method: 'post',
        data
      })
}

// /api/bookChildCataList

export function postBookChildCataList(data) {
    return request({
        url: '/api/bookChildCataList',
        method: 'post',
        data
      })
}
//分页List /api/bookChildCataListPage
export function postChildCataListPage(data){
  return request({
    url: '/api/bookChildCataListPage',
    method: 'post',
    data
  })
}

// 删除目录

export function postDeleteChildCata(data){
  return request({
    url: '/api/deleteChildCata',
    method: 'post',
    data
  })
}

// /api/splitBookAct 生成HTML;

export function postSplitBookAct(data) {
    return request({
        url: '/api/splitBookAct',
        method: 'post',
        data
      })
}


export function postAddChildBook(data){
  return request({
    url: '/api/addChildBook',
    method: 'post',
    data
  })
}

export function postDeleteBook(data) {
    return request({
      url: '/api/postDeleteBook',
      method: 'post',
      data
    })
}


export function checkBookNameIsRepeat(data) {
  return request({
    url: '/api/postBookNameIsRepeat',
    method: 'post',
    data
  })
}

