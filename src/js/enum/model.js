// 模型类型
let modelType = [
  {
    key: 'physical',
    value: 'PHYSICAL',
    name: '物理模型',
  },
  {
    key: 'logical',
    value: 'LOGICAL',
    name: '逻辑模型',
  },
]

// 数据库
let databases = [
  {
    key: 'mysql',
    value: 'MYSQL',
    name: 'MySQL',
  },
  {
    key: 'oracle',
    value: 'ORACLE',
    name: 'Oracle',
  },
  {
    key: 'hive',
    value: 'HIVE',
    name: 'Hive',
  },
  {
    key: 'mongodb',
    value: 'MONGODB',
    name: 'MongoDB',
  },
  {
    key: 'db2luw',
    value: 'DB2LUW',
    name: 'DB2LUW',
  },
  {
    key: 'gbase',
    value: 'GBASE',
    name: 'GBase',
  },
  {
    key: 'hana',
    value: 'HANA',
    name: 'Hana',
  },
  {
    key: 'postegrysql',
    value: 'POSTEGRYSQL',
    name: 'PostegrySQL',
  },
  {
    key: 'sqlserver',
    value: 'SQLSERVER',
    name: 'SQLServer',
  },
  {
    key: 'cassandra',
    value: 'CASSANDRA',
    name: 'cassandra',
  },
]

// 模型语句类型
let modelStatementType = [
  {
    key: 'createOrDrop',
    value: 'CREATEORDROP',
    name: 'Drop/Create',
  },
  {
    key: 'create',
    value: 'CREATE',
    name: 'Create',
  },
]

export default {
  modelType,
  databases,
  modelStatementType,
}
