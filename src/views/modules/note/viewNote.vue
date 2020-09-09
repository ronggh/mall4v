<template>
  <el-dialog :title="'查看'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             width="60%">
    <el-form :model="dataForm"
             ref="dataForm"
             size="mini"
             class="myform"
             label-width="100px">
      <el-form-item label="笔记标题：">
        <label style="display:inline-block">{{dataForm.note.title}}</label>
      </el-form-item>
      <el-form-item label="笔记内容：">
        <el-input v-model="dataForm.note.content"
                  type="textarea"
                  autosize
                  :rows="5"
                  :disabled="true"
                  placeholder="笔记内容"></el-input>
      </el-form-item>
      <el-form-item label="位置：">
        <label style="display:inline-block;width:40%">{{dataForm.note.location}}</label>
        <label style="display:inline-block;width:40%">标签：{{dataForm.note.noteMark}}</label>
      </el-form-item>
      <el-form-item label="创建时间：">
        <label style="display:inline-block;width:40%">{{dataForm.note.createtime}}</label>
        <label style="display:inline-block;width:40%">最后更新时间：{{dataForm.note.updatetime}}</label>
      </el-form-item>
      <el-form-item label="所属社群：">
        <label style="display:inline-block;width:40%">{{dataForm.note.groupName}}</label>
        <label style="display:inline-block;width:40%">话题：{{dataForm.note.topicName}}</label>
      </el-form-item>
      <el-form-item label="创建人：">
        <label style="display:inline-block;width:20%">{{dataForm.note.nickname}}</label>
        <label style="display:inline-block;width:50%">学校：{{dataForm.note.schoolCnname}}</label>
        <label style="display:inline-block;width:20%">学历：{{dataForm.note.degreeName}}</label>
      </el-form-item>
      <el-form-item >
        <el-radio v-model="dataForm.note.isFormal" label="0" disabled>草稿</el-radio>
        <el-radio v-model="dataForm.note.isFormal" label="1" disabled>正式发布</el-radio>
        <el-checkbox v-model="this.isHideNote">隐藏</el-checkbox>
        <el-checkbox v-model="this.isSyncNote">同步到个人首页</el-checkbox>
      </el-form-item>

      <el-form-item label="笔记反响：" style="display:inline-block;width:100%">
        <label style="display:inline-block;width:20%">点赞数：{{dataForm.note.praiseNum}}</label>
        <label style="display:inline-block;width:20%">收藏数：{{dataForm.note.colletNum}}</label>
        <label style="display:inline-block;width:20%">评论数：{{dataForm.note.commentNum}}</label>
        <label style="display:inline-block;width:20%">积分数：{{dataForm.note.score}}</label>
      </el-form-item>
      <el-form-item label="笔记图片：" style="display:inline-block;width:100%">
        <el-image style="width:150px;margin:5px"
            v-for="(item,index) in dataForm.noteImages" 
            :key="index" 
            :src="item.imgUrl"
            :lazy="true"
            :preview-src-list="getImageList(index)">
        </el-image>
      </el-form-item>
    </el-form>

    <span slot="footer"
          class="dialog-footer">
      <el-button type="primary" @click="visible = false">关闭</el-button>
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
  // 使用计算属性
  computed: {
    isHideNote () {
      return this.dataForm.note.isHide === '1'
    },
    isSyncNote () {
      return this.dataForm.note.isSync === '1'
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
          // console.log(this.dataForm.note)
          this.dataForm.noteImages = data.noteImages
        })
      }
    },
    getImageList (index) {
      let arr = []
      let i = 0
      for (i; i < this.dataForm.noteImages.length; i++) {
        arr.push(this.dataForm.noteImages[i + index].imgUrl)
        if (i + index >= this.dataForm.noteImages.length - 1) {
          index = 0 - (i + 1)
        }
      }
      // console.log(arr)
      return arr
    }
  }
}
</script>
<style type="text/css" scoped>
  .myform {
    margin: 0;
    padding: 0;
  }
</style>
