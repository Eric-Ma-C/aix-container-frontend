<template>
  <div class="app-container" style="display: flex; flex-direction:column; align-items:center">
    <h1 style="align-self: center">已结束任务列表</h1>
    <el-table
      style="width: auto"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="ID" prop="id" width="55"/>
      <el-table-column align="center" label="设备ID" prop="deviceId" width="65"/>
      <el-table-column align="center" label="AIX任务ID" prop="taskId" width="75"/>
      <el-table-column align="center" label="状态" prop="status" width="110"/>
      <el-table-column align="center" label="开始时间" prop="begin" width="100"/>
      <el-table-column align="center" label="结束时间" prop="end" width="100"/>
      <el-table-column align="center" label="持续时长(分钟)" prop="durationMin" width="90"/>
      <el-table-column align="center" label="任务日志" prop="logs" width="500" show-overflow-tooltip/>
      <el-table-column align="center" label="操作" width="205">
        <template slot-scope="scope">
          <el-button @click="deleteById(scope.row.id)">删除</el-button>
          <el-button @click="showLog(scope.row.logs)">日志</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="totalCount">
    </el-pagination>
    <el-dialog
      title="任务日志"
      :visible.sync="dialogVisible"
      width="1500px">
      <el-input
        type="textarea"
        wrap="off"
        style="width: 100%; font-size: 17px; "
        readonly="true"
        resize="none"
        :autosize="{ minRows: 1, maxRows: 26}"
        v-model="logs">
      </el-input>
    </el-dialog>
  </div>
</template>

<script>
import * as task_api from '../../api/aix-finished-task'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      totalCount: 0,
      pageSize: 9,
      currentPage: 1,
      logs: '',
      dialogVisible: false
    }
  },
  methods: {
    deleteById(id) {
      this.$confirm('确认删除？')
        .then(_ => {
          task_api.deleteById(id)
            .then(response => {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.refreshPage()
            })
        })
        .catch(_ => {})
    },
    showLog(logs) {
      this.dialogVisible = true
      this.logs = logs
    },
    handleCurrentChange(cur) {
      this.currentPage = cur
      this.refreshPage()
    },
    refreshPage() {
      task_api.getTaskCount().then(response => {
        this.totalCount = response.data
      })
      task_api.getTaskListByPage(this.currentPage, this.pageSize).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    }
  },
  created() {
    this.listLoading = true
    task_api.getTaskCount().then(response => {
      this.totalCount = response.data
    })

    task_api.getTaskListByPage(1, this.pageSize).then(response => {
      this.list = response.data
      this.listLoading = false
    })
    // const win = this
    // // 定义复制按钮
    // const btn = new ClipboardJS('.copyBtn')
    // btn.on('success', function(e) {
    //   console.info('Action:', e.action)
    //   console.info('Text:', e.text)
    //   console.info('Trigger:', e.trigger)
    //   win.copySuccess()
    //   e.clearSelection()
    // })
  }
}
</script>

<style scoped>

</style>
