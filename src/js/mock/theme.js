import { nanoid } from 'nanoid'

export const dataEg = {
  id: nanoid(10),
  themeName: '主题名称',
  parentId: nanoid(10), // 主题父Id

  graphics: {
    id: '',
    graphics: '', // 绘图信息
  },
  entityInfos: [ // 实体信息
    {
      tableName: '表名称',
      englishName: '',
      modelType: '',
      attributes: {
        primaryKeyAttributes: [
          {
            id: nanoid(8),
            attrName: '属性名称',
            columnName: '字段名称',
            primaryKey: true, // 是否为主键
            foreignKey: false, // 是否为外键
            notEmpty: false, // 是否非空
            fromAttrId: '', //来源属性Id 映射所有
            columnType: '字段类型',
            columnLength: 10,
          }
        ],
        AttributeVO: [
          {}
        ],
      },
    }
  ],
  isFiles: false,// 是否是文件夹
  status: '主题状态',
}

// 使用的数据
export const lineData = {
  /**
   * 实体信息：来源 entityInfos 与 graphics
   * */
  nodeDataArray: [],
  /**
   * 线信息*/
  linkDataArray: [],
  // 框信息
  markDataArray: [],
  // 文本信息
  noteDataArray: [],
}
/**
 * 线信息直接作为json存储
 * 其他的直接使用结构化存储
 *
 * 获取线信息，直接绘图
 *  对于绘图信息的更改只发生在用户侧，即绘图区
 * 修改实体的属性，是怎么更新到绘图区域的。合并吗
 *  修改保存
 *  重新获取数据，
 *    将绘图信息初始化到nodeDataArray 中，此处采用合并
 *    缓存所有实体
 * 初始化数据
 *  缓存所有实体
 *  缓存绘图信息
 *  缓存所有关系（后台需要）
 * */
/**
 * 第一次
 * a - b
 * a [b]
 *
 * b - c
 *  [c]
 * */

/**
 * 目标1
 * 实体增删改
 * 线增删改
 *
 * 目标2
 * 其他工具
 * 左侧主题切换
 * */
/**
 * 渲染数据
 * 服务端
 *  mock数据
 *
 * 前端
 * 初始化获取数据
 * 处理数据
 * 状态存储
 *  在原来的基础上存储实体信息，在修改数据时，备用
 * 绘制到绘图中
 * */

const graphics = '{"nodeDataArray":[{"key":0,"loc":{"x":100,"y":100},"width":100,"height":50,"bgC":"#FF8080","tableName":"我这里是表名1哦","physicalTables":[{},{}],"quotePrimaryKey":true,"attributes":[{"attrName":"属性名111111","primaryKey":true,"foreignKey":true},{"attrName":"属性名3","primaryKey":true},{"attrName":"属性名5","primaryKey":false,"foreignKey":true},{"attrName":"属性名2222222222","primaryKey":true},{"attrName":"属性名4","primaryKey":false},{"attrName":"属性名6","primaryKey":false}],"checkoutInfo":{"operator":1,"imgUrl":"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1577153528&di=6fd6d99abb68d8649eca67d6026bb733&imgtype=jpg&er=1&src=http%3A%2F%2Fpuui.qpic.cn%2Fqqvideo_ori%2F0%2Fo0824iqtovj_496_280%2F0"}},{"key":1,"loc":{"x":400,"y":100},"width":50,"height":100,"bgC":"#8080FF","tableName":"我这里是表名2哦","attributes":[{"attrName":"属性名1","primaryKey":true,"foreignKey":false},{"attrName":"属性名3","primaryKey":true},{"attrName":"属性名2222222222","primaryKey":true}],"checkoutInfo":{"operator":2,"imgUrl":"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1577153562&di=707f4dafb7a30c1d4486d086e29113eb&imgtype=jpg&er=1&src=http%3A%2F%2Fimg2015.zdface.com%2F20191128%2F494953ca4b98166a13dd8d7f8eced177.jpg"}},{"key":2,"loc":{"x":100,"y":400},"width":50,"height":100,"bgC":"#FFFF80","tableName":"我这里是表名3哦","attributes":[{"attrName":"属性名1","primaryKey":false,"foreignKey":false},{"attrName":"属性名3","primaryKey":false}],"checkoutInfo":{"operator":2,"imgUrl":"https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=4024188264,3243314188&fm=26&gp=0.jpg"}},{"key":3,"loc":{"x":10,"y":80},"width":50,"height":100,"tableName":"我这里是表名4哦","attributes":[{"attrName":"属性名1","primaryKey":true,"foreignKey":false},{"attrName":"属性名3","primaryKey":true},{"attrName":"属性名5","primaryKey":false},{"attrName":"属性名2222222222","primaryKey":true},{"attrName":"属性名4","primaryKey":false},{"attrName":"属性名6","primaryKey":false}]},{"key":4,"loc":{"x":100,"y":250},"width":40,"height":20,"type":"inclusive"}],"linkDataArray":[{"from":0,"to":4,"pos":[{"x":120,"y":150},{"x":120,"y":250}],"type":"toFilter","numLineTypes":2},{"from":4,"to":2,"pos":[{"x":120,"y":270},{"x":120,"y":400}],"type":"fromFilter","numLineTypes":4}],"markDataArray":[],"noteDataArray":[{"key":"157837643603536658","loc":{"x":525,"y":408},"text":"啦啦啦啦啦111","type":"note","color":"#0000ff"}]}'
export const data = {
  id: nanoid(10),
  themeName: '主题名称',
  parentId: nanoid(10), // 主题父Id

  graphics: graphics,
  entityInfos: [ // 实体信息
    {
      id: 1,
      tableName: '表2222',
      englishName: 'en2',
      modelType: '',
      attributes: [
        {attrName: '属性名1', primaryKey: true, foreignKey: false},
        {attrName: '属性名3', primaryKey: false},
        {attrName: '属性名2222222222', primaryKey: false},
      ],
      width: 150,
      height: 150,
    },
    {
      id: 2,
      tableName: '表3',
      englishName: 'en3',
      modelType: '',
      attributes: [
        {attrName: '属性名1', primaryKey: false, foreignKey: false},
        {attrName: '属性名3', primaryKey: false}
      ],
      width: 150,
      height: 150,
    },
    {
      id: 3,
      tableName: '表4',
      englishName: 'en4',
      modelType: '',
      attributes: [
        {attrName: '属性名1', primaryKey: false, foreignKey: false},
        {attrName: '属性名3', primaryKey: false}
      ],
      width: 150,
      height: 150,
    },
  ],
  isFiles: false,// 是否是文件夹
  status: '主题状态',
}
