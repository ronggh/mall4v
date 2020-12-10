<template>
  <div class="mod-user">
    <avue-crud ref="crud"
               :page="page"
               :data="dataList"
               :option="tableOption"
               @search-change="searchChange"
               @on-load="getDataList">
      <template slot-scope="scope"
                slot="menu">
        <el-button type="primary"
                   icon="el-icon-edit"
                   size="small"
                   v-if="isAuth('note:info:noteDetail')"
                   @click.stop="addOrUpdateHandle(scope.row.noteId)">查看</el-button>
        <el-button type="danger"
                   icon="el-icon-delete"
                   size="small"
                   v-if="isAuth('note:info:delNote')"
                   @click.stop="deleteNote(scope.row.noteId)">删除</el-button>
      </template>
    </avue-crud>

    <!-- 弹窗, 查看 -->
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import { tableOption } from '@/crud/note/noteList'
import AddOrUpdate from './viewNote'
export default {
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      tableOption: tableOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      }
    }
  },
  components: {
    AddOrUpdate
  },
  methods: {
    // 获取数据列表
    getDataList (page, params) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/note/list/noteList'),
        method: 'post',
        data: this.$http.adornData(
          Object.assign(
            {
              currentPage: page == null ? this.page.currentPage : page.currentPage,
              pageSize: page == null ? this.page.pageSize : page.pageSize,
              content: params == null ? '' : params.title
            },
            params
          )
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
        this.dataListLoading = false
      })
    },
    // 查看
    addOrUpdateHandle (noteId) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(noteId)
      })
    },
    deleteNote (noteId) {
      this.$confirm(`确定进行删除笔记操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/note/info/delNote'),
            method: 'post',
            data: this.$http.adornData({
              'noteId': noteId
            })
          }).then(({ data }) => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList(this.page)
              }
            })
          })
        })
        .catch(() => { })
    },
    // 条件查询
    searchChange (params) {
      this.getDataList(this.page, params)
    }
  }
}</script>
