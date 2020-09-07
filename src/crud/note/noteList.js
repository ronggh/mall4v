export const tableOption = {
  border: true,
  selection: false,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  addBtn: false,
  editBtn: false,
  delBtn: false,
  viewBtn: false,
  props: {
    label: 'label',
    value: 'value'
  },
  column: [{
    label: '笔记标题',
    prop: 'title',
    search: true
  }, {
    label: '笔记标签',
    prop: 'noteMark'
  }, {
    label: '创建人',
    prop: 'nickname'
  }, {
    label: '所属社群',
    prop: 'groupName'
  }, {
    label: '点赞数',
    prop: 'praiseNum'
  }, {
    label: '收藏数',
    prop: 'colletNum'
  }, {
    label: '评论数',
    prop: 'commentNum'
  }]
}
