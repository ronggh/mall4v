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
    label: '社群名称',
    prop: 'groupName',
    search: true
  }, {
    label: '社群头像',
    prop: 'groupHeadImg',
    type: 'upload',
    imgWidth: 30,
    listType: 'picture-img'
  }, {
    label: '群标签',
    prop: 'groupMark'
  }, {
    label: '创建人',
    prop: 'nickname'
  }, {
    label: '所属学校',
    prop: 'schoolCnname'
  }, {
    label: '加群需要认证',
    prop: 'needAuth',    
    type: 'select',
    dicData: [
      {
        label: '否',
        value: 0
      }, {
        label: '是',
        value: 1
      }
    ]
  }]
}
