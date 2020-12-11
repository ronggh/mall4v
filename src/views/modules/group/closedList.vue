<template>
  <div class="mod-user">
    <avue-crud ref="crud"
               :page="page"
               :data="dataList"
               :option="tableOption"
               @search-change="searchChange"
               @on-load="getDataList">
      <template slot-scope="scope" slot="menu">
        <el-button type="primary"
                   icon="el-icon-edit"
                   size="small"
                   v-if="isAuth('group:info:openGroup')"
                   @click.stop="closeGroup(scope.row.groupId)">解禁群</el-button>
      </template>
    </avue-crud>


  </div>
</template>

<script>
import { tableOption } from '@/crud/group/closedList'
export default {
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      tableOption: tableOption,
      page: {
        total: 0, // 总页数。
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      params: {}
    }
  },
  components: {

  },
  methods: {
    // 获取数据列表
    getDataList (page, params) {
      if(page != null ) {
        this.page = page
      }
      if(params != null) {
        this.params = params
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/group/list/closedList'),
        method: 'post',
        data: this.$http.adornData(
          Object.assign(
            {
              currentPage: page == null ? this.page.currentPage : page.currentPage,
              pageSize: page == null ? this.page.pageSize : page.pageSize
            },
            params == null ? this.params : params
          )
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
        this.dataListLoading = false
      })
    },
    // 解禁群
    closeGroup (groupId) {
      this.$confirm(`确定进行解禁群操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/group/info/openGroup'),
            method: 'post',
            data: this.$http.adornData({
              'groupId': groupId
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
    searchChange(params) {
      this.page.currentPage = 1
      this.params = params
      this.getDataList(this.page, params)
    },
    // 多选变化
    selectionChange(val) {
      this.dataListSelections = val
    }
  }
}
</script>
