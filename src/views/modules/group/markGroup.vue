<template>
  <el-dialog :title="'设置社群标签'"
             :close-on-click-modal="false"
             :visible.sync="visible">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-form-item label="社群Id"
                    prop="dataForm.groupId">
        <el-input v-model="dataForm.groupId"
                  :disabled="true"
                  placeholder="社群Id"></el-input>
      </el-form-item>  
      <el-form-item label="社群名称"
                    prop="dataForm.groupName">
        <el-input v-model="dataForm.groupName"
                  :disabled="true"
                  placeholder="社群名称"></el-input>
      </el-form-item>   
      <el-form-item label="社群标签"
                    prop="dataForm.groupMark">
        <el-input v-model="dataForm.groupMark"
                  :disabled="false"
                  placeholder="请输入社群标签，多个时以逗号分隔"></el-input>
      </el-form-item> 

    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary"
                 @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        groupId: 0,
        groupName: '',
        groupMark: ''
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      resourcesUrl: window.SITE_CONFIG.resourcesUrl,
      dataRule: {
        groupMark: [
          { required: true, message: '群标签不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (groupId, groupName, groupMark) {
      this.dataForm.groupId = groupId || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
      })
      if (this.dataForm.groupId) {
        this.dataForm.groupName = groupName
        this.dataForm.groupMark = groupMark
      }
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/group/info/setGroupMark`),
            method: 'post',
            data: this.$http.adornData({
              groupId: this.dataForm.groupId,
              groupMark: this.dataForm.groupMark
            })
          }).then(({ data }) => {
            this.$message({
              message: '设置群标签成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList', this.page)
              }
            })
          })
        }
      })
    }
  }
}
</script>
