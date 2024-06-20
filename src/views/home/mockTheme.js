import { nanoid } from 'nanoid'

export const data = {
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
