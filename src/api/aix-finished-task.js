import request from '@/utils/request'

const base_url = '/aix/finished_task'

export function getTaskCount() {
  return request({
    url: base_url + '/count',
    method: 'get'
  })
}

export function getTaskListByPage(page, countPerPage) {
  return request({
    url: base_url + '/page',
    params: { page, countPerPage },
    method: 'get'
  })
}
export function deleteById(id) {
  return request({
    url: base_url + '/delete',
    data: { id: id },
    method: 'post'
  })
}
