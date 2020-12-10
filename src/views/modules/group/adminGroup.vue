<template>
  <el-dialog :title="'设置社群'"
             :close-on-click-modal="false"
             :visible.sync="visible">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmit()"
             label-width="100px">
      <el-form-item label="社群Id">
        <el-input v-model="dataForm.groupId"
                  :disabled="true"
                  placeholder="社群Id"></el-input>
      </el-form-item>  
      <el-form-item label="社群名称" prop="groupName">
        <el-input v-model="dataForm.groupName"
                  maxlength="50"
                  show-word-limit                  
                  placeholder="社群名称" ></el-input>
      </el-form-item>
      <el-form-item label="社群标签">
        <el-input v-model="dataForm.groupMark"
                  :disabled="false"
                  placeholder="请输入社群标签，多个时以逗号分隔"></el-input>
      </el-form-item> ""
      <el-form-item label="社群简介" prop="groupDesc">
        <el-input type="textarea" v-model="dataForm.groupDesc"
                  :autosize="{ minRows: 2, maxRows: 5}"
                  maxlength="500"
                  show-word-limit
                  placeholder="社群简介"></el-input>
      </el-form-item>
      <el-form-item label="关联学校">
        <el-select v-model="dataForm.schoolId" 
                  filterable
                  style="width:100%" 
                  :disabled="false"
                  clearable
                  placeholder="请选择要关联的学校">t
          <el-option
            v-for="item in schools"
           :key="item.schoolId"
           :label="item.schoolCnname"
           :value="item.schoolId">
          </el-option>
        </el-select>
      </el-form-item> 
      <el-form-item label="加群认证">
        <el-radio-group v-model="dataForm.needAuth">
            <el-radio :label="0">不需认证</el-radio>
            <el-radio :label="1">需要认证</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="社群管理员">
        <el-transfer v-model="admins"
                  style="height:300px" 
                  :titles="['社群成员', '社群管理员']"
                  :filterable="true"
                  :props="{
                    key: 'uid',
                    label: 'nickname'
                  }"
                  :data="members"                  
                  :disabled="false"></el-transfer>
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
        groupDesc:'',
        groupMark: '',
        schoolId: 0,
        needAuth:0,
        groupMembers: [],
        groupAdmins: []
      },
      schools: [],
      members: [],
      admins: [], 
      resourcesUrl: window.SITE_CONFIG.resourcesUrl,
      dataRule: {
        groupName: [
          {
            required: true,
            message: '社群名称不能为空',
            trigger: 'blur'
          }
        ],
        groupDesc: [
          {
            required: true,
            message: '社群简介不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  // 请求所有的学校信息
  created () {
    this.$http({
      url: this.$http.adornUrl(`/group/list/getSchoolList`),
      method: 'post',
      data: this.$http.adornData({
        'schoolName': ''
      })
    }).then(({ data }) => {
      // console.log(data)
      this.schools = data
    })
  },
  methods: {
    init (groupId, schoolId) {      
      this.dataForm.groupId = groupId || 0
      this.dataForm.schoolId = schoolId || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
      })
      if (this.dataForm.groupId) {
        this.$http({
          url: this.$http.adornUrl(`/group/info/getGroupDetail`),
          method: 'post',
          data: this.$http.adornData({
            'groupId': this.dataForm.groupId
          })
        }).then(({ data }) => {
          // console.log(data)
          this.dataForm = data
          //
          this.members = this.dataForm.groupMembers.concat(this.dataForm.groupAdmins)
          // 为管理员进行赋值
          data.groupAdmins.forEach(item => {
            this.admins.push(item.uid)

          })
          // console.log(this.admins)
        })
      }
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          // console.log(this.dataForm.schoolId)
          this.$http({
            url: this.$http.adornUrl(`/group/info/adminGroup`),
            method: 'post',
            data: this.$http.adornData({
              groupId: this.dataForm.groupId,
              groupName: this.dataForm.groupName,
              groupMark: this.dataForm.groupMark,
              groupDesc: this.dataForm.groupDesc,
              needAuth: this.dataForm.needAuth,
              schoolId: this.dataForm.schoolId,
              admins: this.admins
            })
          }).then(({ data }) => {
            // console.log("Response ===> " + data)
            if(data ==="success"){
              this.$message({
                message: '设置群成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false                  
                  this.$emit('refreshDataList',this.$parent.page,this.$parent.params)
                }
              })
            }
            else {
              this.$message({
                message: data,
                type: 'error',
                showClose: true
              })
            }

          })
        }
      })
    }
  }
}
</script>
