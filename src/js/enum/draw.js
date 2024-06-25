
// 实体间线类型
let lineTypes = [
  {
    key: 'primaryKey',
    value: 'primaryKey',
    name: '主键',
    visible: true,
  },
  {
    key: 'foreignKey',
    value: 'foreignKey',
    name: '非主键',
    visible: true,
  },
  {
    key: 'branchLine',
    value: 'branchLine',
    name: '过滤器相关的线',
    visible: false,
  },
]

// 实体间关系类型 后台的
let entityRelationTypes = [
  {
    key: 'primaryKey',
    value: 'PRIMARYKEY',
    name: '主键关系',
  },
  {
    key: 'foreignKey',
    value: 'FOREIGNKEY',
    name: '非主键关系',
  },
]

// 基数线类型
let numLineTypes = [
  {
    key: 'n1',
    value: 1,
    // name: '0,1,n',
    name: 'Zero, One or More',
  },
  {
    key: 'n2',
    value: 2,
    // name: '1,n',
    name: 'One or More',
  },
  {
    key: 'n3',
    value: 3,
    // name: '1,1',
    name: 'One or One',
  },
  {
    key: 'n4',
    value: 4,
    // name: '0,1',
    name: 'Zero or One',
  },
]

// 过滤器类型
let filterTypes = [
  {
    key: 'exclusive',
    value: 'exclusive',
    name: '不包含',
  },
  {
    key: 'inclusive',
    value: 'inclusive',
    name: '包含',
  },
]

// 创建过滤器的结果
let filterAddResult  = [
  {
    key: 'sure',
    value: 1,
    name: '确认',
  },
  {
    key: 'cancel ',
    value: 2,
    name: '取消',
  },
  {
    key: 'transition',
    value: 3,
    name: '转换成创建非主键',
  },
]

// 绘图区颜色类型
let colorType  = [
  {
    key: 'text',
    value: 'color',
    name: '文本颜色',
  },
  {
    key: 'bg',
    value: 'bgC',
    name: '背景色',
  },
  {
    key: 'border',
    value:'bdC',
    name: '边框颜色',
  },
]

export default {
  lineTypes,
  numLineTypes,
  filterAddResult,
  entityRelationTypes,
  colorType,
}
