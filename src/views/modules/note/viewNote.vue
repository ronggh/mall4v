<template>
  <el-dialog :title="'查看'"
             :close-on-click-modal="false"
             :visible.sync="visible">
    <el-form :model="dataForm"
             ref="dataForm"
             label-width="80px">
      <el-form-item label="笔记Id">
        <el-input v-model="dataForm.noteId"
                  :disabled="true"
                  placeholder="笔记Id"></el-input>
      </el-form-item>  
      <el-form-item label="笔记标题">
        <el-input v-model="dataForm.note.title"
                  :disabled="true"
                  placeholder="笔记标题"></el-input>
      </el-form-item>
      <el-form-item label="笔记内容">
        <el-input v-model="dataForm.note.content"
                  type="textarea"
                  :rows="3"
                  :disabled="true"
                  placeholder="笔记标题"></el-input>
      </el-form-item>

    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        noteId: 0,
        note: {},
        noteImages: []
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
    init (noteId) {
      this.dataForm.noteId = noteId || 0
      // console.log(this.dataForm.noteId)
      this.visible = true
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
      })
      if (this.dataForm.noteId) {
        this.$http({
          url: this.$http.adornUrl(`/note/info/noteDetail`),
          method: 'post',
          data: this.$http.adornData({
            'noteId': this.dataForm.noteId
          })
        }).then(({ data }) => {
          this.dataForm.note = data.note
          this.dataForm.noteImages = data.noteImages
        })
      }
    }
  }
}
</script>
