<template>
  <el-dialog :title="!dataForm.id ? '编辑' : '编辑'"
             :close-on-click-modal="false"
             :visible.sync="visible">
    <el-form :model="dataForm"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-form-item label="笔记标题"
                     prop="noteId">
                         <el-input v-model="dataForm.noteId"
                              :disabled="false"
                              readonly="true"
                               placeholder="笔记标题">
                         </el-input>
      </el-form-item>
        <el-form-item label="笔记内容"
                     prop="content">
                         <el-input v-model="dataForm.content"
                              :disabled="false"
                               readonly="true"
                               placeholder="笔记内容">
                         </el-input>
      </el-form-item>
        <el-form-item label="发布用户"
                     prop="nickname">
                         <el-input v-model="dataForm.nickname"
                              :disabled="false"
                               readonly="true"
                               placeholder="发布用户">
                         </el-input>
      </el-form-item>
        <el-form-item label="所属话题"
                     prop="topicName">
                         <el-input v-model="dataForm.topicName"
                              :disabled="false"
                               readonly="true"
                               placeholder="所属话题">
                         </el-input>
      </el-form-item>
        <el-form-item label="所属社群"
                     prop="groupName">
                         <el-input v-model="dataForm.groupName"
                              :disabled="false"
                               readonly="true"
                               placeholder="所属社群">
                         </el-input>
      </el-form-item>
      <el-form-item label="笔记图片">
          <pic-upload v-model="dataForm.imgUrl"></pic-upload>
        </el-form-item>
    <el-form-item label="当前状态"
                    size="mini"
                    prop="status">
    <el-radio-group v-model="dataForm.status">
      <el-radio-button label="0">已删除</el-radio-button>
      <el-radio-button label="1">正常</el-radio-button>
    </el-radio-group>
      </el-form-item>

    <el-form-item label="笔记标签">
        <el-transfer v-model="noteLabels"
                  style="height:300px"
                  :titles="['未打标签', '已有标签']"
                  :props="{
                    key: 'id',
                    label: 'name'
                  }"
                  :data="labels"
                  :disabled="false"></el-transfer>
      </el-form-item>

    <el-form-item label="权重积分"
                     prop="score">
                         <el-input v-model="dataForm.score"
                              :disabled="false"
                               placeholder="权重积分">
                         </el-input>
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
import PicUpload from '@/components/pic-upload'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        noteId: 0,
        title: '无',
        content: '',
        nickname: '',
        topicName: '无',
        groupName: '无',
        imgUrl: '',
        score: 0,
        status: '1',
        choosedLabels: [],
        noChooseLabels: []
      },
      noteLabels: [],
      labels: [],
      resourcesUrl: window.SITE_CONFIG.resourcesUrl
    }
  },
   components: {
    PicUpload
  },
  methods: {
    init (id) {
      this.dataForm.noteId = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
       }) 
        if (this.dataForm.noteId) {
          this.$http({
            url: this.$http.adornUrl('/Note/selectNoteDetailById'),
            method: 'post',
            data: this.$http.adornData({
            'noteId': this.dataForm.noteId
          })
          }).then(({ data }) => {
            this.dataForm = data
            this.labels = this.dataForm.noChooseLabels.concat(this.dataForm.choosedLabels)
            console.log("noclabels:"+this.dataForm.noChooseLabels)
            console.log("clabels:"+this.dataForm.choosedLabels)
             // 为已打标签赋值
            data.choosedLabels.forEach(item => {
              this.noteLabels.push(item.id)
             })
            console.log("noteLabels"+this.noteLabels)
          })
        }
    },
    // init (id) {
    //   this.visible = true
    //   this.$nextTick(() => {
    //     this.$refs['dataForm'].resetFields()
    //     this.dataForm.noteId = id || 0
    //     if (this.dataForm.noteId) {
    //       this.$http({
    //         url: this.$http.adornUrl('/Note/selectNoteDetailById/' + this.dataForm.noteId),
    //         method: 'get',
    //         params: this.$http.adornParams()
    //       }).then(({ data }) => {
    //         console.log(data)
    //         console.log("title:"+data.obj.title)
    //         console.log("twq"+data.obj.noChooseLabels)
    //          this.$set(this.dataForm, 'title', data.obj.title)
    //          this.$set(this.dataForm, 'content', data.obj.content)
    //          this.$set(this.dataForm, 'nickname', data.obj.nickname)
    //          this.$set(this.dataForm, 'topicName', data.obj.topicName)
    //          this.$set(this.dataForm, 'groupName', data.obj.groupName)
    //          this.$set(this.dataForm, 'imgUrl', data.obj.imgUrl)
    //          this.$set(this.dataForm, 'status', data.obj.status)
    //          this.$set(this.dataForm, 'score', data.obj.score)
    //          this.labels = this.dataForm.choosedLabels.concat(this.dataForm.noChooseLabels)
    //          // 为管理员进行赋值
    //          data.obj.noChooseLabels.forEach(item => {
    //             this.noteLabels.id.push(item.id)
    //             console.log("twq"+this.noChooseLabels.id)
    //          })
    //       })
    //     }
    //   })
    //   this.visible = true
    // },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.dataForm.noteId ? this.$http.adornUrl('/Note/modifyScoreAndLabel') :this.$http.adornUrl('/noteLabel/addNoteLabel'),
            method: 'post',
             data: this.$http.adornData({
              noteId: this.dataForm.noteId,
              score: this.dataForm.score,
              noteLabels: this.noteLabels
            })
            // data: this.$http.adornData(this.dataForm)
          }).then(({ data }) => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          })
        }
      })
    }
  }
}
</script>
