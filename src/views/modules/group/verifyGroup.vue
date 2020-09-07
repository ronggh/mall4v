<template>
  <el-dialog :title="'审核社群'"
             :close-on-click-modal="false"
             :visible.sync="visible">
    <el-form :model="dataForm"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-form-item label="社群Id">
        <el-input v-model="dataForm.groupId"
                  :disabled="true"
                  placeholder="社群Id"></el-input>
      </el-form-item>  
      <el-form-item label="社群名称">
        <el-input v-model="dataForm.groupName"
                  :disabled="true"
                  placeholder="社群名称"></el-input>
      </el-form-item>   
      <el-form-item label="社群头像">
        <img :src="dataForm.groupHeadImg"
             class="image">
      </el-form-item>
      <el-form-item label="申请理由">
        <el-input v-model="dataForm.applyReason"
                  :disabled="true"
                  placeholder="申请理由"></el-input>
      </el-form-item> 

    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="dataFormSubmit('2')" >不通过</el-button>
      <el-button type="primary"
                 @click="dataFormSubmit('1')">通过</el-button>
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
        groupHeadImg: '',
        applyReason: ''
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      resourcesUrl: window.SITE_CONFIG.resourcesUrl
    }
  },
  methods: {
    init (groupId, groupName, groupHeadImg, applyReason) {
      this.dataForm.groupId = groupId || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
      })
      if (this.dataForm.groupId) {
        this.dataForm.groupName = groupName
        this.dataForm.groupHeadImg = groupHeadImg
        this.dataForm.applyReason = applyReason
      }
    },
    // 表单提交
    dataFormSubmit (flag) {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/group/info/verify`),
            method: 'post',
            data: this.$http.adornData({
              groupId: this.dataForm.groupId,
              verifyFlag: flag
            })
          }).then(({ data }) => {
            this.$message({
              message: '审核成功',
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
