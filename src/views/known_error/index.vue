<template>
  <div class="app-container" style="display: flex; flex-direction:column; align-items:center">
    <h1 style="align-self: center">环境错误修复管理</h1>
    <el-table
      style="width: auto"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="ID" prop="id" width="55"/>
      <el-table-column align="center" label="错误名称" prop="name" width="65"/>
      <el-table-column align="center" label="错误描述" prop="key_words" width="455"/>
      <el-table-column align="center" label="修复指令" width="460">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            width="100%"
            trigger="hover">
            <p v-for="cmd in scope.row.repair_cmds">{{ cmd }}</p>
            <el-button slot="reference">{{ scope.row.repair_cmds }}</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="105">
        <template slot-scope="scope">
          <el-button @click="jumpToManageDialog(scope.row)">修改</el-button>
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
          <el-input v-model="dialogErrorId" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="错误名称">
          <div style="display: flex">
            <el-input style="margin-right: 20px" v-model="inputErrorName"></el-input>
            <el-button style="margin-right: 450px" size="small" @click="updateName">修改名称</el-button>
          </div>
        </el-form-item>
        <el-form-item label="错误描述">
          <div style="display: flex">
            <el-input style="margin-right: 20px" v-model="inputKeyWords"></el-input>
            <el-button style="margin-right: 250px" size="small" @click="updateKeywords">修改描述</el-button>
          </div>
        </el-form-item>
        <br/>
        <el-form-item
          v-for="(cmd, index) in inputRepairCmds"
          :label="'修复指令' + index"
          :key="index">
          <div style="display: flex">
            <el-input style="margin-right: 20px" v-model="inputRepairCmds[index]"></el-input>
            <el-button style="margin-right: 50px" @click="removeCmd(index)">删除</el-button>
          </div>
        </el-form-item>
        <!--        <el-form-item-->
        <!--          v-for="(cmd, index) in inputRepairCmds"-->
        <!--          :label="'修复指令' + index"-->
        <!--          :key="cmd.key"-->
        <!--          :prop="'cmds.' + index + '.value'"-->
        <!--          :rules="{ required: true, message: '指令不能为空', trigger: 'blur'}">-->
        <!--          <div style="display: flex">-->
        <!--            <el-input style="margin-right: 20px" v-model="cmd.index"></el-input>-->
        <!--            <el-button style="margin-right: 50px" @click="removeCmd(cmd)">删除</el-button>-->
        <!--          </div>-->
        <!--        </el-form-item>-->
        <el-form-item>
          <el-button @click="addCmd">新增修复指令</el-button>
          <el-button type="primary" @click="updateRepairCmds">提交修复指令</el-button>
          <!--          <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>-->
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="dialogWorningVisible"
      width="30%">
      <span>请谨慎修改此部分配置!</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogWorningVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as known_error_api from '../../api/aix-known_error'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      totalCount: 0,
      pageSize: 9,
      currentPage: 1,
      dialogVisible: false,
      dialogWorningVisible: true,
      inputErrorName: '',
      inputKeyWords: '',
      inputRepairCmds: [],
      dialogErrorId: -1
    }
  },
  created() {
    this.listLoading = true
    known_error_api.getErrorCount().then(response => {
      this.totalCount = response.data
    })

    known_error_api.getErrorListByPage(1, this.pageSize).then(response => {
      this.list = response.data
      this.listLoading = false
    })
  },
  methods: {
    updateName() {
      known_error_api.updateNameById(this.dialogErrorId + '', this.inputErrorName)
        .then(response => {
          this.refreshPage()
        })
    },
    updateKeywords() {
      known_error_api.updateKeywordsById(this.dialogErrorId + '', this.inputKeyWords)
        .then(response => {
          this.refreshPage()
        })
    },
    updateRepairCmds() {
      let canUpdate = true
      for (var i = 0, len = this.inputRepairCmds.length; i < len; i++) {
        if (this.inputRepairCmds[i].trim() === '') {
          canUpdate = false
          this.$message.error('不能有空指令!')
          return
        }
      }
      if (!canUpdate) {
        return
      }
      known_error_api.updateRepairCmdsById(this.dialogErrorId + '', JSON.stringify(this.inputRepairCmds))
        .then(response => {
          this.$message({
            message: '更新成功',
            type: 'success'
          })
          this.refreshPage()
        })
    },
    jumpToManageDialog(knownError) {
      this.dialogVisible = true
      // this.dialogDeviceIndex = index
      this.dialogErrorId = knownError.id
      this.inputErrorName = knownError.name
      this.inputKeyWords = knownError.key_words
      this.inputRepairCmds = knownError.repair_cmds.slice()
      // this.$router.push({
      //   path: `/detail/${token}`
      // })
    },
    handleCurrentChange(cur) {
      this.currentPage = cur
      this.refreshPage()
    },
    refreshPage() {
      known_error_api.getErrorListByPage(this.currentPage, this.pageSize).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    removeCmd(index) {
      this.inputRepairCmds.splice(index, 1)
    },
    addCmd() {
      this.inputRepairCmds.push(
        ''
      )
    }
  }
}
</script>

<style scoped>

</style>
