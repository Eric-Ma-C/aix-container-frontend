<template>
  <div class="dashboard-container">
    <div class="dashboard-text">User: {{ name }}</div>
    <el-button type="primary" @click="changeConnectState">{{ connectBtnStr }}</el-button>
    <div class="dashboard-aix-test">Active Client Num: {{ activeClientNum }}</div>
    <div class="dashboard-aix-test">Online Client Num: {{ onlineClientNum }}</div>
    <br>
    <div display="flex">
      <el-button type="primary" @click="changeLogState">{{ logBtnStr }}</el-button>
      <el-button type="primary" @click="jumpToELK">日志管理</el-button>
    </div>
    <!--    <el-input-->
    <!--      type="textarea"-->
    <!--      style="resize:none;white-space: pre-wrap;"-->
    <!--      :autosize="{ minRows: 20, maxRows: 20}"-->
    <!--      readonly="true"-->
    <!--      v-show="showLog"-->
    <!--      id="log_area"-->
    <!--      placeholder="服务器日志"-->
    <!--      v-for="i in logStr"-->
    <!--      :key="i"-->
    <!--      v-text="i"-->
    <!--    >-->
    <!--    </el-input>-->
    <ul id="logArea" v-show="showLog" class="infinite-list"
        style="width:95%;height:550px;overflow:auto;white-space: pre-wrap;">
      <li v-for="i in logStr" :key="i" class="infinite-list-item">{{ i }}</li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as client_api from '../../api/aix-client'
import * as server_api from '../../api/aix-server'

export default {
  name: 'Dashboard',
  // activeClientNum: 0,
  data() {
    return {
      activeClientNum: 0,
      onlineClientNum: 0,
      connected: false,
      connectBtnStr: '点击连接AIX服务器',
      logBtnStr: '显示服务器日志',
      showLog: false,
      logStr: []
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    changeLogState() {
      if (!this.connected) {
        this.$message('请先连接服务器!')
        return
      }
      if (this.showLog) {
        server_api.serverLogStop()
        this.logBtnStr = '显示服务器日志'
        this.logStr = []
        // this.clearTimer()
        this.showLog = false
      } else {
        server_api.serverLogInit()
        this.logBtnStr = '关闭日志'
        // this.setTimer()
        this.showLog = true
      }
    },
    changeConnectState() {
      if (this.connected) {
        this.clearTimer()
        if (this.showLog) {
          server_api.serverLogStop()
          this.logBtnStr = '显示服务器日志'
          this.logStr = []
          this.showLog = false
        }
        this.connectBtnStr = '点击连接AIX服务器'
        this.activeClientNum = 0
        this.onlineClientNum = 0
        this.connected = false
      } else {
        this.setTimer()
        this.connectBtnStr = '点击断开服务器'
        this.connected = true
      }
    },
    jumpToELK() {
      // window.location.href = 'http://10.214.211.205:5601/app/kibana#/discover'
      window.location.href = 'http://10.214.211.205:5601/app/logs'
    },
    getActiveClientNum() {
      client_api.getClientActiveNum().then(response => {
        this.activeClientNum = response.data
      })
    },
    getOnlineClientNum() {
      client_api.getOnlineClientNum().then(response => {
        this.onlineClientNum = response.data
      })
    },
    loadLog() { // 加载一行日志
      server_api.serverLogReadLine().then(res => {
        if (res.data !== null && res.data !== '') {
          // console.log('收到' + res.data)
          this.logStr.push(res.data)
        }
      })
    },
    setTimer() {
      if (this.timer === null) {
        this.timer = setInterval(() => {
          if (this.showLog) {
            // console.log('开始定时...每过一秒执行一次')
            this.loadLog()
          }
          this.getActiveClientNum()
          this.getOnlineClientNum()
          var logArea = document.getElementById('logArea')
          logArea.scrollTop = logArea.scrollHeight
        }, 3000)
      }
    },
    clearTimer() {
      clearInterval(this.timer)
      this.timer = null
    }
  },
  created: function() {
    // 每次进入界面时，先清除之前的所有定时器，然后启动新的定时器
    this.clearTimer()
  },
  destroyed: function() {
    // 每次离开当前界面时，清除定时器
    this.clearTimer()
  }
}

// const timer = setInterval(() => {
//   // 定时器操作
//   // this.loadLog()
// }, 1000)
// // 通过$once来监听定时器
// // 在beforeDestroy钩子触发时清除定时器
// this.$once('hook:beforeDestroy', () => {
//   clearInterval(timer)
// })

</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }

  &-aix-test {
    font-size: 30px;
    line-height: 46px;
  }

}
</style>
