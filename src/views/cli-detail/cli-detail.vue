<template>
  <div class="cil-detail-container">
    <div class="dashboard-text">User: {{ name }}</div>
    <el-button type="primary" @click="fetchData">刷新</el-button>
    <div class="dashboard-aix-test">Active Client Num: {{ activeClientNum }}</div>
    <br>
    <el-button type="primary" @click="changeLogState">实时日志</el-button>
    <ul v-show="showLog" class="infinite-list" style="width:95%;height:550px;overflow:auto;white-space: pre-wrap;">
      <li v-for="i in logStr" :key="i" class="infinite-list-item">{{ i }}</li>
    </ul>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as client_api from '../../api/aix-client'

export default {
  name: 'CilDetail',
  // activeClientNum: 0,
  data() {
    return {
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
      if (this.showLog) {
        client_api.clientLogStop(this.$route.params.token)
        this.logStr = []
        this.clearTimer()
        this.showLog = false
      } else {
        client_api.clientLogInit(this.$route.params.token)
        this.setTimer()
        this.showLog = true
      }
    },
    // fetchData() {
    //   client_api.getClientActiveNum().then(response => {
    //     this.activeClientNum = response.data
    //   })
    // },
    loadLog() { // 加载一行日志
      client_api.clientLogReadLine().then(res => {
        if (res.data !== null && res.data !== '') {
          // console.log('收到' + res.data)
          this.logStr.push(res.data)
        }
      })
    },
    setTimer() {
      if (this.timer === null) {
        this.timer = setInterval(() => {
          // console.log('开始定时...每过一秒执行一次')
          this.loadLog()
        }, 1000)
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
