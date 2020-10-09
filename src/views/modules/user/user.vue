<template>
  <div class="mod-user">
    <avue-crud ref="crud"
               :page="page"
               :data="dataList"
               :option="tableOption"
               @search-change="searchChange"
               @selection-change="selectionChange"
               @on-load="getDataList">
      <template slot="menuLeft">
        <el-button type="danger"
                   @click="deleteHandle()"
                   v-if="isAuth('admin:user:delete')"
                   size="small"
                   :disabled="dataListSelections.length <= 0">批量删除
        </el-button>
      </template>

      <template slot-scope="scope"
                slot="verifyFlag">
        <el-tag v-if="scope.row.verifyFlag == 0"
                type="danger"
                size="small">未实名
        </el-tag>
        <el-tag v-if="scope.row.verifyFlag == 1"
                size="small">已实名
        </el-tag>
      </template>

      <template slot-scope="scope"
                slot="userType">
        <el-tag v-if="scope.row.userType == '1'"
                size="small"
        >普通用户
        </el-tag>
        <el-tag v-if="scope.row.userType == 2"
                size="small"
        >商铺用户
        </el-tag>
        <el-tag v-if="scope.row.userType == 3"
                size="small"
        >个人店铺用户
        </el-tag>
        <el-tag v-if="scope.row.userType == 0"
                size="small">系统管理员
        </el-tag>
      </template>

      <template slot-scope="scope"
                slot="sex">
        <el-tag v-if="scope.row.sex == 1"
                size="small">男
        </el-tag>
        <el-tag v-if="scope.row.sex == 2"
                size="small">女
        </el-tag>
      </template>

      <template slot-scope="scope"
                slot="status">
        <el-tag v-if="scope.row.status == 0"
                size="small"
                type="info">用户停用
        </el-tag>
        <el-tag v-if="scope.row.status == 1"
                size="small">正常
        </el-tag>
        <el-tag v-if="scope.row.status == 2"
                type="warning"
                size="danger">禁用中
        </el-tag>
      </template>

      <template slot-scope="scope"
                slot="menu">
        <el-button type="primary"
                   icon="el-icon-edit"
                   size="small"
                   v-if="isAuth('admin:user:update')"
                   @click.stop="addOrUpdateHandle(scope.row.uid)">编辑
        </el-button>
      </template>
    </avue-crud>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import {tableOption} from '@/crud/user/user'
import AddOrUpdate from './user-add-or-update'

export default {
  data() {
    return {
      dataList: [],
      params: {},
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
    getDataList(page, params,type) {
      if(type=='1'){
        this.params=params;
      }else{
        params=this.params;
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/admin/user/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize
            },
            params
          )
        )
      }).then(({data}) => {
        this.dataList = data.records
        this.page.total = data.total
        this.dataListLoading = false
      })
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle (id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.uid
      })
      this.$confirm(`确定进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/admin/user'),
            method: 'delete',
            data: this.$http.adornData(ids, false)
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
      this.getDataList(this.page, params,'1')
    },
    // 多选变化
    selectionChange(val) {
      this.dataListSelections = val
    }
  }
}
</script>
