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
    label: '申请理由',
    prop: 'applyReason'
  }, {
    label: '社群介绍',
    prop: 'groupDesc'
  }, {
    label: '申请人',
    prop: 'nickname'
  }
  // , {
  //   label: '所属学校',
  //   prop: 'schoolCnname'
  // }
]
}
