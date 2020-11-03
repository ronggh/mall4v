<template>
  <div class="mod-note">
    <avue-crud ref="crud"
               :page="page"
               :data="dataList"
               :table-loading="dataListLoading"
               :option="tableOption"
               @search-change="searchChange"
               @on-load="getDataList"
               @refresh-change="refreshChange">

      <template slot-scope="scope"
                slot="menu">
         <el-button type="primary"
                   icon="el-icon-edit"
                   size="small"
                   @click.stop="addOrUpdateHandle(scope.row.noteId)">编辑</el-button>
      </template>
    </avue-crud>
   <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import { tableOption } from '@/crud/note/noteList'
  import AddOrUpdate from './note-update'
  export default {
    data () {
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
    created () {
  },
  mounted () {
  },
    methods: {
      // 获取数据列表
      getDataList (page, params,type) {
        if(type=='1'){
        this.params=params;
        }else{
        params=this.params;
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/Note/getAllNote'),
          method: 'get',
          params: this.$http.adornParams(
            Object.assign(
              {
                title: params.title,
                nickname: params.nickname,
                currentPage: page == null ? this.page.currentPage : page.currentPage,
                pageSize: page == null ? this.page.pageSize : page.pageSize
              },
              params
            )
          )
        }).then(({ data }) => {
          this.dataList = data.obj.records
          this.page.total = data.obj.total
          this.dataListLoading = false
        })
      },
     /**
     * 刷新回调
     */
    refreshChange () {
      this.getDataList(this.page)
    },
     // 新增 / 修改
      addOrUpdateHandle (noteId) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(noteId)
        })
      },
      // 条件查询
      searchChange(params) {
        this.getDataList(this.page,params,'1');
      },
      // searchChange1 (params) {
      //   this.searchNote(this.page, params);
      // },
      // 多选变化
      selectionChange (val) {
        this.dataListSelections = val
      },
      // 模糊搜索
    // searchNote (page,params) {
    //   this.dataListLoading = true
    //   this.$http({
    //     url: this.$http.adornUrl('/Note/selectNoteBySearchContent'),
    //     method: 'post',
    //     data: {
    //       currentPage: page == null ? this.page.currentPage : page.currentPage,
    //       pageSize: page == null ? this.page.pageSize : page.pageSize,
    //       nickname: params.nickname,
    //       title:params.title
    //     }
    //   }).then(({ data }) => {
    //     this.dataList = data.obj.records
    //     this.page.total = data.obj.total
    //     this.dataListLoading = false
    //   })
    // }
    }
  }
</script>
