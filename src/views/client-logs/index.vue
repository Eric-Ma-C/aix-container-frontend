<template>
  <div class="app-container">
    <div style="font-size: 17px;">请输入容器ID:</div>
    <div style="display: flex;margin-top: 15px">
      <el-autocomplete
        class="inline-input"
        v-model="id"
        :fetch-suggestions="querySearch"
        placeholder="请输入id"
        @oninput="refreshTime"
        @select="handleSelect">
      </el-autocomplete>
      <el-button style="margin-left: 10px" @click="getLog">强制刷新</el-button>
    </div>

    <div style="margin-top: 18px; margin-bottom: 15px; font-size: 17px; ">容器{{ id }}日志信息:</div>
    <el-input
      type="textarea"
      wrap="off"
      style="width: 90%; font-size: 17px; "
      color="darkred"
      readonly="true"
      resize="none"
      :autosize="{ minRows: 1, maxRows: 26}"
      v-model="logs">
    </el-input>

  </div>
</template>

<script>
import * as client_api from '@/api/aix-client'

export default {

  data() {
    return {
      id: '',
      autoRefreshTimer: null,
      lastInputTime: 0,
      logs: ''
    }
  },
  created() {
    // 每次进入界面时，先清除之前的所有定时器，然后启动新的定时器
    this.clearTimer()
    this.id = this.$route.params.clientId
    if (this.id === undefined) {
      this.id = ''
    }
    this.setTimer()
  },
  destroyed: function() {
    // 每次离开当前界面时，清除定时器
    this.clearTimer()
  },
  methods: {
    getLog() {
      if (this.id === '') {
        return
      }
      client_api.getInfoById(this.id).then(response => {
        if (response.data === '') {
          return
        }
        const token = response.data.token
        client_api.getTaskLogs(token).then(response => {
          this.logs = response.data
        })
      })
    },
    refreshTime() {
      this.lastInputTime = Date.now()
    },
    setTimer() {
      if (this.autoRefreshTimer === null) {
        this.autoRefreshTimer = setInterval(() => {
          // console.log('开始定时...每过3秒执行一次')
          if (Date.now() - this.lastInputTime > 3000) {
            this.getLog()
          }
        }, 3000)
      }
    },
    clearTimer() {
      clearInterval(this.autoRefreshTimer)
      this.autoRefreshTimer = null
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    loadAll() {
      return [
        { 'value': '1' },
        { 'value': '2' },
        { 'value': '3' },
        { 'value': '4' }
      ]
    },
    handleSelect(item) {
      console.log(item)
    }
  },
  mounted() {
    this.restaurants = this.loadAll()
  }

}
</script>

