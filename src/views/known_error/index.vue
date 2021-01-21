<template>
  <div class="app-container" style="display: flex; flex-direction:column; align-items:center">
    <h1 style="align-self: center">环境错误修复管理</h1>
    <el-button @click="insertError">添加</el-button>
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
      <el-table-column align="center" label="错误名称" prop="name" width="155"/>
      <el-table-column align="center" label="错误描述" prop="key_words" width="455"/>
      <el-table-column align="center" label="修复指令" width="260">
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
      title="添加"
      :visible.sync="dialogInsertVisible"
      width="1000px">
      <el-form label-position="right" label-width="auto">
        <el-form-item label="错误名称">
          <el-input style="margin-right: 20px" v-model="insertErrorName"></el-input>
        </el-form-item>
        <el-form-item label="错误描述">
          <el-input style="margin-right: 20px" v-model="insertKeyWords"></el-input>
        </el-form-item>
        <br/>
        <el-form-item
          v-for="(cmd, index) in insertRepairCmds"
          :label="'修复指令' + index"
          :key="index">
          <div style="display: flex">
            <el-input style="margin-right: 20px" v-model="insertRepairCmds[index]"></el-input>
            <el-button style="margin-right: 50px" @click="removeInsertCmd(index)">删除</el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="addInsertCmd">新增修复指令</el-button>
        </el-form-item>
        <el-button type="primary" @click="insertCmds">添加</el-button>
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
      dialogInsertVisible: false,
      dialogWorningVisible: true,
      inputErrorName: '',
      insertErrorName: '',
      inputKeyWords: '',
      insertKeyWords: '',
      inputRepairCmds: [],
      insertRepairCmds: [],
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
    insertError() {
      this.dialogInsertVisible = true
    },
    deleteById(id) {
      this.$confirm('确认删除？')
        .then(_ => {
          known_error_api.deleteById(id)
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
    insertCmds() {
      let canUpdate = true
      for (var i = 0, len = this.insertRepairCmds.length; i < len; i++) {
        if (this.insertRepairCmds[i].trim() === '') {
          canUpdate = false
          this.$message.error('不能有空指令!')
          return
        }
      }
      if (this.insertErrorName.trim() === '' || this.insertKeyWords.trim() === '') {
        canUpdate = false
        this.$message.error('不能有空字段!')
      }
      if (!canUpdate) {
        return
      }
      known_error_api.insert(this.insertErrorName.trim(), this.insertKeyWords.trim(),
        JSON.stringify(this.insertRepairCmds))
        .then(response => {
          this.$message({
            message: '添加成功',
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
    removeInsertCmd(index) {
      this.insertRepairCmds.splice(index, 1)
    },
    addInsertCmd() {
      this.insertRepairCmds.push(
        ''
      )
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
