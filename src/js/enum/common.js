let tests = [
  {
    key: 'test',
    value: 1,
    name: '测试',
  },
]

let userAuth = [
  {
    key: 'manager',
    value: 'PROJECTMANAGER',
    name: '项目负责人',
  },
  {
    key: 'edit',
    value: 'PROJECTPARTICIPANTS',
    name: '项目参与人',
  },
  {
    key: 'read',
    value: 'PROJECTREADERSONLY',
    name: '项目只读人',
  },
]

export default {
  tests,
  userAuth,
}
