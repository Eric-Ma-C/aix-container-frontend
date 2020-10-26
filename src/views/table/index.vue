<template>
  <div class="app-container">
    <h1>Client列表</h1>
    <el-button type="primary" @click="fetchData">刷新</el-button>
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
          <el-button type="primary" @click="jumpToManageDialog(scope.row)">管理</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="dialogDeviceInfo.name"
      :visible.sync="dialogVisible"
      width="80%">
      <!--      :before-close="handleClose">-->
      <div style="display: flex">
        <div style="margin-right: 5px; font-size: 17px; ">Token:</div>
        <div><span style="font-size: 17px; color: darkred; margin-right: 20px;">{{ dialogDeviceInfo.token }}</span>
        </div>
        <div>
          <el-link class="copyBtn" style="font-size: 17px; " :data-clipboard-text="dialogDeviceInfo.token">复制</el-link>
        </div>
      </div>
      <h3>任务详情</h3>
      <el-table :data="dialogDeviceInfo.taskBriefInfoList">
        <el-table-column prop="name" label="名称" width="200"/>
        <el-table-column prop="type" label="类型" width="100"/>
        <el-table-column prop="accessType" label="权限" width="100"/>
        <el-table-column prop="info" label="简介" width="250"/>
        <el-table-column prop="createdTime" label="创建时间" width="230"/>
        <el-table-column prop="status" label="状态" width="100"/>
      </el-table>
      <el-button
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
// import { getList } from '@/api/table'
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
      dialogVisible: false,
      dialogDeviceInfo: { name: 'unknown', taskBriefInfoList: [] },
      listLoading: true
    }
  },
  created() {
    this.fetchData()
    const win = this

    const btn = new ClipboardJS('.copyBtn')
    btn.on('success', function(e) {
      console.info('Action:', e.action)
      console.info('Text:', e.text)
      console.info('Trigger:', e.trigger)
      win.copySuccess()
      e.clearSelection()
    })
  },
  methods: {
    fetchData() {
      this.listLoading = true
      client_api.getClientList().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    jumpToManageDialog(deviceInfo) {
      this.dialogVisible = true
      this.dialogDeviceInfo = deviceInfo
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
        })
        .catch(_ => {})
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
