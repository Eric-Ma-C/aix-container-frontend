import request from '@/utils/request'


const base_url = '/aix/client'

export function getClientActiveNum() {
  return request({
    url: base_url + '/active_num',
    method: 'get'
  })
}

export function getOnlineClientNum() {
  return request({
    url: base_url + '/online_num',
    method: 'get'
  })
}

export function getClientList() {
  return request({
    url: base_url + '/list',
    method: 'get'
  })
}

export function getClientMsgQueue(token) {
  return request({
    url: base_url + '/msg_queue',
    params: { token },
    method: 'get'
  })
}

export function getClientTask(token) {
  return request({
    url: base_url + '/task',
    params: { token },
    method: 'get'
  })
}

export function clientLogInit(token) {
  return request({
    url: base_url + '/log/start',
    params: { token },
    method: 'get'
  })
}

export function clientLogStop(token) {
  return request({
    url: base_url + '/log/stop',
    params: { token },
    method: 'get'
  })
}

export function clientLogReadLine() {
  return request({
    url: base_url + '/log/line',
    method: 'get'
  })
}
