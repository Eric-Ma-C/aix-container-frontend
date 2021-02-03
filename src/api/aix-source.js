import request from '@/utils/request'

const base_url = '/aix/source'

export function getPipSourceCount() {
  return request({
    url: base_url + '/pip_count',
    method: 'get'
  })
}
export function getAptSourceCount() {
  return request({
    url: base_url + '/apt_count',
    method: 'get'
  })
}

export function getPipSourceListByPage(page, countPerPage) {
  return request({
    url: base_url + '/pip_page',
    params: { page, countPerPage },
    method: 'get'
  })
}
export function getAptSourceListByPage(page, countPerPage) {
  return request({
    url: base_url + '/apt_page',
    params: { page, countPerPage },
    method: 'get'
  })
}

export function updateNameById(id, newName) {
  return request({
    url: base_url + '/name',
    data: { id: id, newName: newName },
    method: 'post'
  })
}

export function updateUrlById(id, url) {
  return request({
    url: base_url + '/url',
    data: { id: id, newUrl: url },
    method: 'post'
  })
}


export function insert(name, url, type) {
  return request({
    url: base_url + '/insert',
    data: { name: name, url: url, type: type },
    method: 'post'
  })
}

export function deleteById(id) {
  return request({
    url: base_url + '/delete',
    data: { id: id },
    method: 'post'
  })
}
