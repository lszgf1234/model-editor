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

const graphics = "{\"nodeDataArray\":[{\"key\":1,\"loc\":{\"x\":274,\"y\":106},\"width\":150,\"height\":150,\"bgC\":\"#8080FF\",\"tableName\":\"主题\",\"attributes\":[{\"attrName\":\"id\",\"primaryKey\":true,\"foreignKey\":false,\"columnName\":\"id\"},{\"attrName\":\"名称\",\"primaryKey\":false,\"columnName\":\"themeName\"},{\"attrName\":\"父id\",\"primaryKey\":false,\"columnName\":\"parentId\"},{\"attrName\":\"最后修改人Id\",\"columnName\":\"modifierId\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"状态\",\"columnName\":\"status\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"是否是文件夹\",\"columnName\":\"isFiles\",\"primaryKey\":false,\"foreignKey\":false}],\"checkoutInfo\":{\"operator\":2,\"imgUrl\":\"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1577153562&di=707f4dafb7a30c1d4486d086e29113eb&imgtype=jpg&er=1&src=http%3A%2F%2Fimg2015.zdface.com%2F20191128%2F494953ca4b98166a13dd8d7f8eced177.jpg\"},\"id\":1,\"englishName\":\"en2\",\"modelType\":\"\"},{\"id\":\"kwoNyOPG\",\"key\":\"kwoNyOPG\",\"tableName\":\"绘图数据\",\"englishName\":\"en_sI-0i\",\"modelType\":\"\",\"attributes\":[{\"attrName\":\"id\",\"primaryKey\":true,\"foreignKey\":false,\"columnName\":\"id\"},{\"attrName\":\"绘图数据\",\"primaryKey\":false,\"foreignKey\":false,\"columnName\":\"graphics\"}],\"loc\":{\"x\":660,\"y\":94},\"width\":150,\"height\":100},{\"id\":\"tCDZrJ10\",\"key\":\"tCDZrJ10\",\"tableName\":\"实体\",\"englishName\":\"en_4YSxb\",\"modelType\":\"\",\"attributes\":[{\"attrName\":\"id\",\"primaryKey\":true,\"foreignKey\":false,\"columnName\":\"id\"},{\"attrName\":\"中文名\",\"primaryKey\":false,\"foreignKey\":false,\"columnName\":\"tableName\"},{\"attrName\":\"英文名\",\"columnName\":\"englishName\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"模型类型\",\"columnName\":\"modelType\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"实体创建人\",\"columnName\":\"creatorId\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"属性_poq\",\"columnName\":\"poq\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"属性_aQh\",\"columnName\":\"aQh\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"属性_2Pd\",\"columnName\":\"2Pd\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"属性_4-x\",\"columnName\":\"4-x\",\"primaryKey\":false,\"foreignKey\":false}],\"loc\":{\"x\":259,\"y\":412},\"width\":162,\"height\":270},{\"id\":\"v4_XbkeO\",\"key\":\"v4_XbkeO\",\"tableName\":\"属性\",\"englishName\":\"en_LDn2Y\",\"modelType\":\"\",\"attributes\":[{\"attrName\":\"id\",\"primaryKey\":true,\"foreignKey\":false,\"columnName\":\"id\"},{\"attrName\":\"中文名\",\"primaryKey\":false,\"foreignKey\":false,\"columnName\":\"attrName\"},{\"attrName\":\"英文名\",\"columnName\":\"columnName\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"字段类型\",\"columnName\":\"columnType\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"字段长度\",\"columnName\":\"columnLength\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"字段详情\",\"columnName\":\"columnInfo\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"是否为主键\",\"columnName\":\"primaryKey\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"是否为外键\",\"columnName\":\"foreignKey\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"是否非空\",\"columnName\":\"notEmpty\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"属性_5xN\",\"columnName\":\"5xN\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"属性_chu\",\"columnName\":\"chu\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"属性_7pK\",\"columnName\":\"7pK\",\"primaryKey\":false,\"foreignKey\":false}],\"loc\":{\"x\":651,\"y\":411},\"width\":185,\"height\":292},{\"id\":\"RvHDE31u\",\"key\":\"RvHDE31u\",\"tableName\":\"用户\",\"englishName\":\"en_k9fr0\",\"modelType\":\"\",\"attributes\":[{\"attrName\":\"userId\",\"primaryKey\":true,\"foreignKey\":false,\"columnName\":\"userId\"},{\"attrName\":\"账号\",\"primaryKey\":false,\"foreignKey\":false,\"columnName\":\"username\"},{\"attrName\":\"昵称\",\"columnName\":\"nickname\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"工号\",\"columnName\":\"jobNumber\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"头像\",\"columnName\":\"avatar\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"权限码\",\"columnName\":\"permissionCodes\",\"primaryKey\":false,\"foreignKey\":false}],\"loc\":{\"x\":654,\"y\":781},\"width\":180,\"height\":175},{\"id\":\"4rmwNIZi\",\"key\":\"4rmwNIZi\",\"tableName\":\"模型\",\"englishName\":\"en_pDZSL\",\"modelType\":\"\",\"attributes\":[{\"attrName\":\"id\",\"primaryKey\":true,\"foreignKey\":false,\"columnName\":\"id\"},{\"attrName\":\"项目Id\",\"primaryKey\":false,\"foreignKey\":false,\"columnName\":\"projectId\"},{\"attrName\":\"项目名称\",\"columnName\":\"projectName\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"项目类型\",\"columnName\":\"projectType\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"项目版本\",\"columnName\":\"projectVersion\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"租户Id\",\"columnName\":\"tenantId\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"模型名称\",\"columnName\":\"modelName\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"项目状态\",\"columnName\":\"status\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"模型详情\",\"columnName\":\"modelDetails\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"模型参与人数\",\"columnName\":\"modelUserCount\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"模型人员信息\",\"columnName\":\"userVo\",\"primaryKey\":false,\"foreignKey\":false}],\"loc\":{\"x\":283,\"y\":769},\"width\":170,\"height\":271},{\"id\":\"D1o2pvaW\",\"key\":\"D1o2pvaW\",\"tableName\":\"备注基本信息\",\"englishName\":\"en_blRGa\",\"modelType\":\"\",\"attributes\":[{\"attrName\":\"id\",\"primaryKey\":true,\"foreignKey\":false,\"columnName\":\"id\"},{\"attrName\":\"模型Id\",\"primaryKey\":false,\"foreignKey\":false,\"columnName\":\"modelId\"},{\"attrName\":\"实体Id\",\"columnName\":\"entityId\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"备注信息\",\"columnName\":\"remarkContent\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"创建人\",\"columnName\":\"creatorId\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"修改时间\",\"columnName\":\"updateTime\",\"primaryKey\":false,\"foreignKey\":false}],\"loc\":{\"x\":1004,\"y\":1044},\"width\":186,\"height\":159},{\"id\":\"YGlWujN4\",\"key\":\"YGlWujN4\",\"tableName\":\"引用基本信息\",\"englishName\":\"en_PNIm3\",\"modelType\":\"\",\"attributes\":[{\"attrName\":\"引用状态\",\"primaryKey\":true,\"foreignKey\":false,\"columnName\":\"quoteTypeEnum\"},{\"attrName\":\"引用实体\",\"primaryKey\":false,\"foreignKey\":false,\"columnName\":\"quoteEntity\"},{\"attrName\":\"引用人\",\"columnName\":\"quoteUser\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"引用时间\",\"columnName\":\"quoteTime\",\"primaryKey\":false,\"foreignKey\":false}],\"loc\":{\"x\":1000,\"y\":768},\"width\":190,\"height\":210},{\"id\":\"A6yjOeNv\",\"key\":\"A6yjOeNv\",\"tableName\":\"物理表\",\"englishName\":\"en_u8SPu\",\"modelType\":\"\",\"attributes\":[{\"attrName\":\"id\",\"primaryKey\":true,\"foreignKey\":false,\"columnName\":\"id\"},{\"attrName\":\"实体Id\",\"primaryKey\":false,\"foreignKey\":false,\"columnName\":\"entityId\"},{\"attrName\":\"英文名\",\"columnName\":\"englishName\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"库名\",\"columnName\":\"libName\",\"primaryKey\":false,\"foreignKey\":false}],\"loc\":{\"x\":1024,\"y\":1304},\"width\":150,\"height\":100},{\"id\":\"ooLl6HuM\",\"key\":\"ooLl6HuM\",\"tableName\":\"日志\",\"englishName\":\"en_pq_m7\",\"modelType\":\"\",\"attributes\":[{\"attrName\":\"实体日志Id\",\"primaryKey\":true,\"foreignKey\":false,\"columnName\":\"id\"},{\"attrName\":\"实体Id\",\"primaryKey\":false,\"foreignKey\":false,\"columnName\":\"entityId\"},{\"attrName\":\"操作人\",\"columnName\":\"operUser\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"操作内容\",\"columnName\":\"operContent\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"操作时间\",\"columnName\":\"createTime\",\"primaryKey\":false,\"foreignKey\":false}],\"loc\":{\"x\":682,\"y\":1291},\"width\":175,\"height\":158},{\"id\":\"nuvcNd7V\",\"key\":\"nuvcNd7V\",\"tableName\":\"索引表\",\"englishName\":\"en_mEYeC\",\"modelType\":\"\",\"attributes\":[{\"attrName\":\"id\",\"primaryKey\":true,\"foreignKey\":false,\"columnName\":\"id\"},{\"attrName\":\"模型Id\",\"primaryKey\":false,\"foreignKey\":false,\"columnName\":\"modelId\"},{\"attrName\":\"实体Id\",\"columnName\":\"entityId\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"索引名称\",\"columnName\":\"indexName\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"索引关联属性对象\",\"columnName\":\"attributes\",\"primaryKey\":false,\"foreignKey\":false}],\"loc\":{\"x\":270,\"y\":1274},\"width\":156,\"height\":168},{\"id\":\"YoO9Qioi\",\"key\":\"YoO9Qioi\",\"tableName\":\"domain表\",\"englishName\":\"en_C87yc\",\"modelType\":\"\",\"attributes\":[{\"attrName\":\"id\",\"primaryKey\":true,\"foreignKey\":false,\"columnName\":\"id\"},{\"attrName\":\"模型Id\",\"primaryKey\":false,\"foreignKey\":false,\"columnName\":\"modelId\"},{\"attrName\":\"数据类型\",\"columnName\":\"dataType\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"备注\",\"columnName\":\"remarks\",\"primaryKey\":false,\"foreignKey\":false},{\"attrName\":\"删除状态\",\"columnName\":\"status\",\"primaryKey\":false,\"foreignKey\":false}],\"loc\":{\"x\":266,\"y\":1488},\"width\":150,\"height\":130}],\"linkDataArray\":[{\"key\":\"171955836574012939\",\"from\":\"v4_XbkeO\",\"to\":\"tCDZrJ10\",\"pos\":[{\"x\":651,\"y\":547},{\"x\":536,\"y\":547},{\"x\":536,\"y\":547},{\"x\":421,\"y\":547}],\"type\":\"primaryKey\"},{\"key\":\"171955837065896208\",\"from\":\"tCDZrJ10\",\"to\":1,\"pos\":[{\"x\":347,\"y\":412},{\"x\":347,\"y\":334},{\"x\":347,\"y\":334},{\"x\":347,\"y\":256}],\"type\":\"primaryKey\"},{\"key\":\"171955837439194445\",\"from\":\"kwoNyOPG\",\"to\":1,\"pos\":[{\"x\":660,\"y\":150},{\"x\":542,\"y\":150},{\"x\":542,\"y\":150},{\"x\":424,\"y\":150}],\"type\":\"primaryKey\"},{\"key\":\"17195594626753977\",\"from\":\"RvHDE31u\",\"to\":\"4rmwNIZi\",\"pos\":[{\"x\":654,\"y\":825},{\"x\":554,\"y\":825},{\"x\":554,\"y\":825},{\"x\":453,\"y\":825}],\"type\":\"foreignKey\"},{\"key\":\"171955975047753727\",\"from\":\"RvHDE31u\",\"to\":\"YGlWujN4\",\"pos\":[{\"x\":834,\"y\":868},{\"x\":1000,\"y\":868}],\"type\":\"foreignKey\"},{\"key\":\"171955994153937548\",\"from\":\"RvHDE31u\",\"to\":\"ooLl6HuM\",\"pos\":[{\"x\":758,\"y\":956},{\"x\":758,\"y\":1291}],\"type\":\"foreignKey\"},{\"key\":\"171956004501159851\",\"from\":\"v4_XbkeO\",\"to\":\"nuvcNd7V\",\"pos\":[{\"x\":651,\"y\":557},{\"x\":112,\"y\":557},{\"x\":112,\"y\":1358},{\"x\":270,\"y\":1358}],\"type\":\"foreignKey\"}],\"markDataArray\":[],\"noteDataArray\":[]}"
const entityInfos = [
  {
    "key": 1,
    "tableName": "主题",
    "englishName": "en2",
    "id": 1,
    "attributes": [
      {
        "attrName": "id",
        "primaryKey": true,
        "foreignKey": false,
        "columnName": "id"
      },
      {
        "attrName": "名称",
        "primaryKey": false,
        "columnName": "themeName"
      },
      {
        "attrName": "父id",
        "primaryKey": false,
        "columnName": "parentId"
      },
      {
        "attrName": "最后修改人Id",
        "columnName": "modifierId",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "状态",
        "columnName": "status",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "是否是文件夹",
        "columnName": "isFiles",
        "primaryKey": false,
        "foreignKey": false
      }
    ],
    "modelType": ""
  },
  {
    "key": "kwoNyOPG",
    "tableName": "绘图数据",
    "englishName": "en_sI-0i",
    "id": "kwoNyOPG",
    "attributes": [
      {
        "attrName": "id",
        "primaryKey": true,
        "foreignKey": false,
        "columnName": "id"
      },
      {
        "attrName": "绘图数据",
        "primaryKey": false,
        "foreignKey": false,
        "columnName": "graphics"
      }
    ],
    "modelType": ""
  },
  {
    "key": "tCDZrJ10",
    "tableName": "实体",
    "englishName": "en_4YSxb",
    "id": "tCDZrJ10",
    "attributes": [
      {
        "attrName": "id",
        "primaryKey": true,
        "foreignKey": false,
        "columnName": "id"
      },
      {
        "attrName": "中文名",
        "primaryKey": false,
        "foreignKey": false,
        "columnName": "tableName"
      },
      {
        "attrName": "英文名",
        "columnName": "englishName",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "模型类型",
        "columnName": "modelType",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "实体创建人",
        "columnName": "creatorId",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "属性_poq",
        "columnName": "poq",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "属性_aQh",
        "columnName": "aQh",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "属性_2Pd",
        "columnName": "2Pd",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "属性_4-x",
        "columnName": "4-x",
        "primaryKey": false,
        "foreignKey": false
      }
    ],
    "modelType": ""
  },
  {
    "key": "v4_XbkeO",
    "tableName": "属性",
    "englishName": "en_LDn2Y",
    "id": "v4_XbkeO",
    "attributes": [
      {
        "attrName": "id",
        "primaryKey": true,
        "foreignKey": false,
        "columnName": "id"
      },
      {
        "attrName": "中文名",
        "primaryKey": false,
        "foreignKey": false,
        "columnName": "attrName"
      },
      {
        "attrName": "英文名",
        "columnName": "columnName",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "字段类型",
        "columnName": "columnType",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "字段长度",
        "columnName": "columnLength",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "字段详情",
        "columnName": "columnInfo",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "是否为主键",
        "columnName": "primaryKey",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "是否为外键",
        "columnName": "foreignKey",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "是否非空",
        "columnName": "notEmpty",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "属性_5xN",
        "columnName": "5xN",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "属性_chu",
        "columnName": "chu",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "属性_7pK",
        "columnName": "7pK",
        "primaryKey": false,
        "foreignKey": false
      }
    ],
    "modelType": ""
  },
  {
    "key": "RvHDE31u",
    "tableName": "用户",
    "englishName": "en_k9fr0",
    "id": "RvHDE31u",
    "attributes": [
      {
        "attrName": "userId",
        "primaryKey": true,
        "foreignKey": false,
        "columnName": "userId"
      },
      {
        "attrName": "账号",
        "primaryKey": false,
        "foreignKey": false,
        "columnName": "username"
      },
      {
        "attrName": "昵称",
        "columnName": "nickname",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "工号",
        "columnName": "jobNumber",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "头像",
        "columnName": "avatar",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "权限码",
        "columnName": "permissionCodes",
        "primaryKey": false,
        "foreignKey": false
      }
    ],
    "modelType": ""
  },
  {
    "key": "4rmwNIZi",
    "tableName": "模型",
    "englishName": "en_pDZSL",
    "id": "4rmwNIZi",
    "attributes": [
      {
        "attrName": "id",
        "primaryKey": true,
        "foreignKey": false,
        "columnName": "id"
      },
      {
        "attrName": "项目Id",
        "primaryKey": false,
        "foreignKey": false,
        "columnName": "projectId"
      },
      {
        "attrName": "项目名称",
        "columnName": "projectName",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "项目类型",
        "columnName": "projectType",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "项目版本",
        "columnName": "projectVersion",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "租户Id",
        "columnName": "tenantId",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "模型名称",
        "columnName": "modelName",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "项目状态",
        "columnName": "status",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "模型详情",
        "columnName": "modelDetails",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "模型参与人数",
        "columnName": "modelUserCount",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "模型人员信息",
        "columnName": "userVo",
        "primaryKey": false,
        "foreignKey": false
      }
    ],
    "modelType": ""
  },
  {
    "key": "D1o2pvaW",
    "tableName": "备注基本信息",
    "englishName": "en_blRGa",
    "id": "D1o2pvaW",
    "attributes": [
      {
        "attrName": "id",
        "primaryKey": true,
        "foreignKey": false,
        "columnName": "id"
      },
      {
        "attrName": "模型Id",
        "primaryKey": false,
        "foreignKey": false,
        "columnName": "modelId"
      },
      {
        "attrName": "实体Id",
        "columnName": "entityId",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "备注信息",
        "columnName": "remarkContent",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "创建人",
        "columnName": "creatorId",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "修改时间",
        "columnName": "updateTime",
        "primaryKey": false,
        "foreignKey": false
      }
    ],
    "modelType": ""
  },
  {
    "key": "YGlWujN4",
    "tableName": "引用基本信息",
    "englishName": "en_PNIm3",
    "id": "YGlWujN4",
    "attributes": [
      {
        "attrName": "引用状态",
        "primaryKey": true,
        "foreignKey": false,
        "columnName": "quoteTypeEnum"
      },
      {
        "attrName": "引用实体",
        "primaryKey": false,
        "foreignKey": false,
        "columnName": "quoteEntity"
      },
      {
        "attrName": "引用人",
        "columnName": "quoteUser",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "引用时间",
        "columnName": "quoteTime",
        "primaryKey": false,
        "foreignKey": false
      }
    ],
    "modelType": ""
  },
  {
    "key": "A6yjOeNv",
    "tableName": "物理表",
    "englishName": "en_u8SPu",
    "id": "A6yjOeNv",
    "attributes": [
      {
        "attrName": "id",
        "primaryKey": true,
        "foreignKey": false,
        "columnName": "id"
      },
      {
        "attrName": "实体Id",
        "primaryKey": false,
        "foreignKey": false,
        "columnName": "entityId"
      },
      {
        "attrName": "英文名",
        "columnName": "englishName",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "库名",
        "columnName": "libName",
        "primaryKey": false,
        "foreignKey": false
      }
    ],
    "modelType": ""
  },
  {
    "key": "ooLl6HuM",
    "tableName": "日志",
    "englishName": "en_pq_m7",
    "id": "ooLl6HuM",
    "attributes": [
      {
        "attrName": "实体日志Id",
        "primaryKey": true,
        "foreignKey": false,
        "columnName": "id"
      },
      {
        "attrName": "实体Id",
        "primaryKey": false,
        "foreignKey": false,
        "columnName": "entityId"
      },
      {
        "attrName": "操作人",
        "columnName": "operUser",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "操作内容",
        "columnName": "operContent",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "操作时间",
        "columnName": "createTime",
        "primaryKey": false,
        "foreignKey": false
      }
    ],
    "modelType": ""
  },
  {
    "key": "nuvcNd7V",
    "tableName": "索引表",
    "englishName": "en_mEYeC",
    "id": "nuvcNd7V",
    "attributes": [
      {
        "attrName": "id",
        "primaryKey": true,
        "foreignKey": false,
        "columnName": "id"
      },
      {
        "attrName": "模型Id",
        "primaryKey": false,
        "foreignKey": false,
        "columnName": "modelId"
      },
      {
        "attrName": "实体Id",
        "columnName": "entityId",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "索引名称",
        "columnName": "indexName",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "索引关联属性对象",
        "columnName": "attributes",
        "primaryKey": false,
        "foreignKey": false
      }
    ],
    "modelType": ""
  },
  {
    "key": "YoO9Qioi",
    "tableName": "domain表",
    "englishName": "en_C87yc",
    "id": "YoO9Qioi",
    "attributes": [
      {
        "attrName": "id",
        "primaryKey": true,
        "foreignKey": false,
        "columnName": "id"
      },
      {
        "attrName": "模型Id",
        "primaryKey": false,
        "foreignKey": false,
        "columnName": "modelId"
      },
      {
        "attrName": "数据类型",
        "columnName": "dataType",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "备注",
        "columnName": "remarks",
        "primaryKey": false,
        "foreignKey": false
      },
      {
        "attrName": "删除状态",
        "columnName": "status",
        "primaryKey": false,
        "foreignKey": false
      }
    ],
    "modelType": ""
  }
]

export const data = {
  id: nanoid(10),
  themeName: '主题名称',
  parentId: nanoid(10), // 主题父Id

  graphics: graphics,
  entityInfos: entityInfos,
  isFiles: false,// 是否是文件夹
  status: '主题状态',
}

