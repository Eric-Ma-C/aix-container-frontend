import request from '@/utils/request'
import Qs from 'qs'

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
    url: base_url + '/task-info',
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

export function stopTask(token) {
  // return request({
  //   url: base_url + '/task',
  //   method: 'post',
  //   // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  //   // headers: { 'Content-Type': 'application/json' },
  //   // transformRequest: [
  //   //   function(data) {
  //   //     // 在请求之前对data传参进行格式转换
  //   //     data = Qs.stringify(data)
  //   //     return data
  //   //   }],
  //   data: {
  //     token: token,
  //     action: 'stop'
  //   }
  // })

  return request.post(
    base_url + '/task',
    {
      token: token,
      action: 'stop'
    })
}
