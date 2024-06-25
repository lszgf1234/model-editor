// 约束配置
let attrRules = [
  {
    key: 'no',
    value: 1,
    name: '无约束',
  },
  {
    key: 'number',
    value: 2,
    name: '最大最小值',
  },
  {
    key: 'enumerate',
    value: 3,
    name: '枚举值',
  },
  {
    key: 'expression',
    value: 4,
    name: '表达式',
  },
]

// 安全等级
let safetyLevels = [
  {
    key: 'one',
    value: 1,
    name: '一级',
  },
  {
    key: 'tow',
    value: 2,
    name: '二级',
  },
  {
    key: 'there',
    value: 3,
    name: '三级',
  },
  {
    key: 'four',
    value: 4,
    name: '四级',
  },
]

// 安全等级
let codeSource = [
  {
    key: 'self',
    value: 1,
    name: '自定义',
  },
  {
    key: 'common',
    value: 2,
    name: '公共代码',
  },
]

// 字段类型-临时
let attrTypes = [
  {key: "CHAR", value: "CHAR"},
  {key: "VARCHAR", value: "VARCHAR"},
  {key: "CLOB", value: "CLOB"},
  {key: "NCHAR", value: "NCHAR"},
  {key: "VARYING", value: "VARYING"},
  {key: "BINARY", value: "BINARY"},
  {key: "LARGE", value: "LARGE"},
  {key: "OBJECT", value: "OBJECT"},
  {key: "NUMERIC", value: "NUMERIC"},
  {key: "DECIMAL", value: "DECIMAL"},
  {key: "SMALLINT", value: "SMALLINT"},
  {key: "INTEGER", value: "INTEGER"},
  {key: "BIGINT",value: "BIGINT"},
  {key: "FLOAT", value: "FLOAT"},
  {key: "REAL", value: "REAL"},
  {key: "DOUBLE",value: "DOUBLE"},
  {key: "PRECISION", value: "PRECISION"},
  {key: "BOOLEAN", value: "BOOLEAN"},
  {key: "DATE",value: "DATE"},
  {key: "TIME", value: "TIME"},
  {key: "TIMESTAMP", value: "TIMESTAMP"},
  {key: "INTERVAL",value: "INTERVAL"},
]

export default {
  attrRules,
  safetyLevels,
  attrTypes,
}
