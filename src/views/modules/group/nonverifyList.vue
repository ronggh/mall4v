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
                   v-if="isAuth('group:info:verify')"
                   @click.stop="addOrUpdateHandle(scope.row.groupId, scope.row.groupName, scope.row.groupHeadImg, scope.row.applyReason)">审核</el-button>
 
      </template>
    </avue-crud>

    <!-- 弹窗, 审核 -->
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import { tableOption } from '@/crud/group/nonverifyList'
import AddOrUpdate from './verifyGroup'
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
        url: this.$http.adornUrl('/group/list/nonVerifyList'),
        method: 'post',
        // data: this.$http.adornData({
        //   'currentPage': this.page.currentPage,
        //   'pageSize': this.page.pageSize,
        //   'groupName': params.groupName
        // })
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
    // 审核
    addOrUpdateHandle (groupId, groupName, groupHeadImg, applyReason) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(groupId, groupName, groupHeadImg, applyReason)
      })
    },
    // 条件查询
    searchChange (params) {
      this.getDataList(this.page, params)
    }
  }
}
</script>
