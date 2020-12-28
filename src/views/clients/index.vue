<template>
  <div class="app-container">
    <h1>在线容器列表</h1>
    <el-button @click="fetchData">强制刷新</el-button>
    <br>
    <br>

    <el-table
      v-loading="listLoading"
      :data="list"
      width="100%"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="ID" prop="id" width="55"/>
      <el-table-column align="center" label="名称" prop="name" width="95"/>
      <el-table-column align="center" label="描述" prop="info" width="195"/>
      <el-table-column align="center" label="创建用户" prop="userId" width="95"/>
      <el-table-column align="center" label="活动时间" prop="since" width="195"/>
      <el-table-column align="center" label="GPU驱动版本" prop="gpuInfo.driverVersion" width="120"/>
      <el-table-column align="center" label="CUDA版本" prop="gpuInfo.cudaVersion" width="120"/>
      <el-table-column align="center" label="GPU数量" width="95">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            width="100%"
            trigger="hover">
            <el-table :data="scope.row.gpuInfo.gpus">
              <el-table-column prop="id" label="编号" width="55"/>
              <el-table-column prop="name" label="型号" width="150"/>
              <el-table-column prop="calPower" label="算力" width="50"/>
              <el-table-column prop="temperature" label="温度" width="55"/>
              <el-table-column prop="powerDraw" label="当前功率" width="99"/>
              <el-table-column prop="powerLimit" label="最大功率" width="99"/>
              <el-table-column prop="memUsed" label="已用显存" width="99"/>
              <el-table-column prop="memAll" label="显存总量" width="99"/>
            </el-table>
            <el-button slot="reference">{{ scope.row.gpuInfo.gpuNum }}</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" label="当前任务" width="200">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            width="100%"
            trigger="hover">
            <el-table :data="scope.row.taskBriefInfoList">
              <el-table-column prop="name" label="名称" width="200"/>
              <el-table-column prop="type" label="类型" width="100"/>
              <el-table-column prop="accessType" label="权限" width="100"/>
              <el-table-column prop="info" label="简介" width="250"/>
              <el-table-column prop="createdTime" label="创建时间" width="230"/>
              <el-table-column prop="status" label="状态" width="100"/>
            </el-table>
            <el-button slot="reference">{{ scope.row.firstTaskName }}</el-button>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column align="center" label="详情" width="105">
        <template slot-scope="scope">
          <el-button type="primary" @click="jumpToManageDialog(scope.$index)">更多</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="dialogDeviceInfo.name"
      :visible.sync="dialogVisible"
      width="1100px">
      <!--      :before-close="handleClose">-->
      <div style="display: flex">
        <div style="margin-right: 5px; font-size: 17px; ">Token:</div>
        <div><span style="font-size: 17px; color: darkred; margin-right: 20px;">{{ dialogDeviceInfo.token }}</span>
        </div>
        <div>
          <el-link class="copyBtn" style="font-size: 17px; " :data-clipboard-text="dialogDeviceInfo.token">复制</el-link>
        </div>
      </div>
      <h3 v-if="dialogDeviceInfo.taskBriefInfoList.length > 0">任务详情</h3>
      <el-table
        v-if="dialogDeviceInfo.taskBriefInfoList.length > 0"
        :data="dialogDeviceInfo.taskBriefInfoList">
        <el-table-column prop="name" label="名称" width="200"/>
        <el-table-column prop="type" label="类型" width="100"/>
        <el-table-column prop="accessType" label="权限" width="100"/>
        <el-table-column prop="info" label="简介" width="250"/>
        <el-table-column prop="createdTime" label="创建时间" width="230"/>
        <el-table-column prop="status" label="状态" width="100"/>
      </el-table>
      <div style="display: flex; margin-top: 15px" v-if="dialogDeviceInfo.runningCmds != ''">
        <div style="margin-top: 8px; margin-right: 5px; font-size: 17px; ">执行指令:</div>
        <el-input
          type="textarea"
          style="width: 90%; font-size: 17px;"
          color="darkred"
          readonly="true"
          resize="none"
          :autosize="{ minRows: 1, maxRows: 5}"
          v-model="dialogDeviceInfo.runningCmds">
        </el-input>
      </div>
      <div style="display: flex; margin-top: 10px" v-if="dialogDeviceInfo.latestErrors != ''">
        <div style="margin-top: 8px; margin-right: 5px; font-size: 17px; ">报错信息:</div>
        <el-input
          type="textarea"
          style="width: 90%; font-size: 17px;"
          color="darkred"
          readonly="true"
          resize="none"
          :autosize="{ minRows: 1, maxRows: 12}"
          v-model="dialogDeviceInfo.latestErrors">
        </el-input>
      </div>
      <el-button
        style=" float:left;"
        slot="footer"
        v-if="dialogDeviceInfo.taskBriefInfoList.length > 0"
        type="primary"
        @click="stopTask(dialogDeviceInfo.token)"
      >
        终止任务
      </el-button>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { getList } from '@/api/clients'
import * as client_api from '../../api/aix-client'
// import * as server_api from '../../api/aix-server'
import ClipboardJS from 'clipboard'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      autoRefreshTimer: null,
      closeWaitingTimer: null,
      dialogVisible: false,
      dialogDeviceIndex: 0,
      dialogDeviceInfo: { name: 'unknown', runningCmds: '', taskBriefInfoList: [], latestErrors: '' },
      listLoading: true
    }
  },
  created() {
    // 每次进入界面时，先清除之前的所有定时器，然后启动新的定时器
    this.clearTimer()
    this.setTimer()

    this.listLoading = true
    client_api.getClientList().then(response => {
      this.list = response.data.items
      this.listLoading = false
    })

    const win = this

    // 定义复制按钮
    const btn = new ClipboardJS('.copyBtn')
    btn.on('success', function(e) {
      console.info('Action:', e.action)
      console.info('Text:', e.text)
      console.info('Trigger:', e.trigger)
      win.copySuccess()
      e.clearSelection()
    })
  },
  destroyed: function() {
    // 每次离开当前界面时，清除定时器
    this.clearTimer()
  },
  methods: {
    fetchData() {
      // this.listLoading = true
      client_api.getClientList().then(response => {
        this.list = response.data.items
        if (this.dialogDeviceIndex >= this.list.length) {
          this.dialogDeviceInfo = { name: 'unknown', runningCmds: '', taskBriefInfoList: [], latestErrors: '' }
        } else {
          this.dialogDeviceInfo = this.list[this.dialogDeviceIndex]
        }
        // this.listLoading = false
      })
    },
    setTimer() {
      if (this.autoRefreshTimer === null) {
        this.autoRefreshTimer = setInterval(() => {
          // console.log('开始定时...每过10秒执行一次')
          this.fetchData()
        }, 5000)
      }
    },
    clearTimer() {
      clearInterval(this.autoRefreshTimer)
      this.autoRefreshTimer = null
    },
    jumpToManageDialog(index) {
      this.dialogVisible = true
      this.dialogDeviceIndex = index
      this.dialogDeviceInfo = this.list[index]
      // this.$router.push({
      //   path: `/detail/${token}`
      // })
    },
    handleClose(done) { // close dialog
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    stopTask(token) {
      this.$confirm('确认终止？')
        .then(_ => {
          client_api.stopTask(token)
          this.fullScreenWaiting(token)
        })
        .catch(_ => {})
    },
    fullScreenWaiting(token) {
      const loading = this.$loading({
        lock: true,
        text: '正在停止，请稍后...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      if (this.closeWaitingTimer === null) {
        this.closeWaitingTimer = setInterval(() => {
          let task
          client_api.getClientTask(token).then(response => {
            task = response.data
            if (task === null) {
              this.fetchData()
              this.dialogDeviceInfo.runningCmds = ''
              this.dialogDeviceInfo.taskBriefInfoList = []
              loading.close()
              clearInterval(this.closeWaitingTimer)
              this.closeWaitingTimer = null
              this.$message({
                message: '任务已停止',
                type: 'success'
              })
            }
          })
        }, 2000)
      }
    },
    copySuccess() {
      this.$message({
        message: '复制成功',
        type: 'success'
      })
    }
  }
}
</script>
