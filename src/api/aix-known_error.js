import request from '@/utils/request'

const base_url = '/aix/known_error'

export function getErrorCount() {
  return request({
    url: base_url + '/count',
    method: 'get'
  })
}

export function getErrorListByPage(page, countPerPage) {
  return request({
    url: base_url + '/page',
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

export function updateKeywordsById(id, newKeywords) {
  return request({
    url: base_url + '/keywords',
    data: { id: id, newKeywords: newKeywords },
    method: 'post'
  })
}

export function updateRepairCmdsById(id, newRepairCmds) {
  return request({
    url: base_url + '/repair_cmds',
    data: { id: id, newRepairCmds: newRepairCmds },
    method: 'post'
  })
}

export function insert(name, keywords, repairCmds) {
  return request({
    url: base_url + '/insert',
    data: { name: name, keywords: keywords, repairCmds: repairCmds },
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
