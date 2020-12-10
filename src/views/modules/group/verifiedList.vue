<template>
  <div class="mod-user">
    <avue-crud ref="crud"
               :page="page"
               :data="dataList"
               :option="tableOption"
               @search-change="searchChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @on-load="getDataList">

      <template slot-scope="scope" slot="menu">
       
        <!-- 社置群 -->
        <el-button type="primary"
                   icon="el-icon-edit"
                   size="small"
                   v-if="isAuth('group:info:adminGroup')"
                   @click.stop="adminGroup(scope.row.groupId,scope.row.schoolId)">设置群</el-button>
        <!-- 关闭群 -->
        <el-button type="danger"
                   icon="el-icon-delete"
                   size="small"
                   v-if="isAuth('group:info:closeGroup')"
                   @click.stop="closeGroup(scope.row.groupId)">关闭群</el-button>

        
      </template>
    </avue-crud>
    
    <!-- 弹窗, 设置群 -->
    <admin-group v-if="adminGroupVisible"
                   ref="adminGroup"
                   @refreshDataList="getDataList"></admin-group>
  </div>
</template>

<script>
import { tableOption } from '@/crud/group/verifiedList'
import AdminGroup from './adminGroup'
export default {
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      markGroupVisible: false,
      adminGroupVisible: false,
      tableOption: tableOption,
      page: {
        // pageSizes: [5,10,15,20],
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      params: {}
    }
  },
  components: {
    AdminGroup
  },
  methods: {
    // 获取数据列表
    getDataList (page, params) {
      if(page != null) {
        this.page = page
      }
      if(params != null) {
        this.params = params
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/group/list/verifiedList'),
        method: 'post',
        data: this.$http.adornData(
          Object.assign(
            {
              currentPage: page == null ? this.page.currentPage : page.currentPage,
              pageSize: page == null ? this.page.pageSize : page.pageSize
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
    // 社置群：标签、学校和管理员
    adminGroup (groupId, schoolId) {
      this.adminGroupVisible = true
      this.$nextTick(() => {
        this.$refs.adminGroup.init(groupId, schoolId)
      })
    },
    // 关闭群
    closeGroup (groupId) {
      this.$confirm(`确定进行关闭群操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/group/info/closeGroup'),
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
    searchChange (params) {
      this.page.currentPage = 1
      this.params = params
      this.getDataList(this.page, params)
    },
    // 换页
    currentChange(val) {
      this.page.currentPage = val
      this.getDataList(this.page,this.params)       
    },
    // 改变每页显示数量
    sizeChange(val) {
      this.page.currentPage = 1
      this.page.pageSize = val
      this.getDataList(this.page,this.params)
    }
  }
}
</script>
