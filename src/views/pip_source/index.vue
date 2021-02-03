<template>
  <div class="app-container" style="display: flex; flex-direction:column; align-items:center">
    <h1 style="align-self: center">PIP软件源管理</h1>
    <el-button @click="insertSource">添加</el-button>
    <br>
    <el-table
      style="width: auto"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="ID" prop="id" width="55"/>
      <el-table-column align="center" label="名称" prop="name" width="155"/>
      <el-table-column align="center" label="url" prop="url" width="455"/>
      <el-table-column align="center" label="操作" width="200px">
        <template slot-scope="scope">
          <div style="display: flex">
            <el-button @click="jumpToManageDialog(scope.row)">修改</el-button>
            <el-button @click="deleteById(scope.row.id)">删除</el-button>
          </div>
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
      title="管理"
      :visible.sync="dialogVisible"
      width="1000px">
      <el-form label-position="right" label-width="auto">
        <el-form-item style="margin-right: 450px" label="ID">
          <el-input v-model="dialogSourceId" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="PIP源名称">
          <div style="display: flex">
            <el-input style="margin-right: 20px" v-model="inputSourceName"></el-input>
            <el-button style="margin-right: 450px" size="small" @click="updateName">修改名称</el-button>
          </div>
        </el-form-item>
        <el-form-item label="URL">
          <div style="display: flex">
            <el-input
              type="textarea"
              style="margin-right: 20px"
              :autosize="{ minRows: 3, maxRows: 7}"
              maxlength="1000"
              v-model="inputUrl">
            </el-input>
            <el-button style="height: 35px; margin-right: 50px" size="small" @click="updateUrl">修改URL</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="添加"
      :visible.sync="dialogInsertVisible"
      width="1000px">
      <el-form label-position="right" label-width="auto">
        <el-form-item label="PIP源名称">
          <el-input style="width: 50%" v-model="insertSourceName"></el-input>
        </el-form-item>
        <el-form-item label="URL">
          <el-input
            type="textarea"
            style="margin-right: 20px"
            :autosize="{ minRows: 3, maxRows: 7}"
            maxlength="1000"
            v-model="insertSourceUrl">
          </el-input>
        </el-form-item>
        <br/>
        <el-button type="primary" @click="insertPipSource">添加</el-button>
      </el-form>
    </el-dialog>
    <!--    <el-dialog-->
    <!--      title="提示"-->
    <!--      :visible.sync="dialogWorningVisible"-->
    <!--      width="30%">-->
    <!--      <span>请谨慎修改此部分配置!</span>-->
    <!--      <span slot="footer" class="dialog-footer">-->
    <!--        <el-button type="primary" @click="dialogWorningVisible = false">确 定</el-button>-->
    <!--      </span>-->
    <!--    </el-dialog>-->
  </div>
</template>

<script>
import * as source_api from '../../api/aix-source'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      totalCount: 0,
      pageSize: 9,
      currentPage: 1,
      dialogVisible: false,
      dialogInsertVisible: false,
      dialogWorningVisible: true,
      inputSourceName: '',
      insertSourceName: '',
      inputUrl: '',
      insertSourceUrl: '',
      dialogSourceId: -1
    }
  },
  created() {
    this.listLoading = true
    source_api.getPipSourceCount().then(response => {
      this.totalCount = response.data
    })

    source_api.getPipSourceListByPage(1, this.pageSize).then(response => {
      this.list = response.data
      this.listLoading = false
    })
  },
  methods: {
    updateName() {
      source_api.updateNameById(this.dialogSourceId + '', this.inputSourceName)
        .then(response => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.refreshPage()
        })
    },
    updateUrl() {
      source_api.updateUrlById(this.dialogSourceId + '', this.inputUrl)
        .then(response => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.refreshPage()
        })
    },
    insertSource() {
      this.dialogInsertVisible = true
    },
    deleteById(id) {
      this.$confirm('确认删除？')
        .then(_ => {
          source_api.deleteById(id)
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
    insertPipSource() {
      let canUpdate = true
      if (this.insertSourceName.trim() === '' || this.insertSourceUrl.trim() === '') {
        canUpdate = false
        this.$message.error('不能有空字段!')
      }
      if (!canUpdate) {
        return
      }
      source_api.insert(this.insertSourceName.trim(), this.insertSourceUrl.trim(), 'PIP')
        .then(response => {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.insertSourceName = ''
          this.insertSourceUrl = ''
          this.refreshPage()
          this.dialogInsertVisible = false
        })
    },
    jumpToManageDialog(source) {
      this.dialogVisible = true
      // this.dialogDeviceIndex = index
      this.dialogSourceId = source.id
      this.inputSourceName = source.name
      this.inputUrl = source.url
    },
    handleCurrentChange(cur) {
      this.currentPage = cur
      this.refreshPage()
    },
    refreshPage() {
      source_api.getPipSourceCount().then(response => {
        this.totalCount = response.data
      })
      source_api.getPipSourceListByPage(this.currentPage, this.pageSize).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
