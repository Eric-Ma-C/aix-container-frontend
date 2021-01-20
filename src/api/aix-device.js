import request from '@/utils/request'

const base_url = '/aix/device'

export function getDeviceCount() {
  return request({
    url: base_url + '/count',
    method: 'get'
  })
}

export function getClientListByPage(page, countPerPage) {
  return request({
    url: base_url + '/page',
    params: { page, countPerPage },
    method: 'get'
  })
}

export function updateDeviceNameById(id, newName) {
  return request({
    url: base_url + '/name',
    data: { id: id, newName: newName },
    method: 'post'
  })
}

export function updateDeviceInfoById(id, newInfo) {
  return request({
    url: base_url + '/info',
    data: { id: id, info: newInfo },
    method: 'post'
  })
}
