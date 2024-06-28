export const tree = [{
  id: 1,
  themeName: '一级 1',
  isFiles: true,
  children: [{
    id: 4,
    themeName: '二级 1-1',
    isFiles: true,
    children: [{
      id: 9,
      themeName: '三级 1-1-1',
    }, {
      id: 10,
      themeName: '三级 1-1-2',
    }],
  }],
}, {
  id: 2,
  themeName: '一级 2',
  children: [],
  isFiles: true,
}]

export const data = [{
  id: 1,
  parentId: 0,
  themeName: '主题树',
  isFiles: true,
}, {
  id: '111',
  themeName: '模型工具库',
  isFiles: false,
  parentId: 1,
}, {
  id: 2,
  themeName: '一级1',
  isFiles: true,
  parentId: 1,
}, {
  id: 3,
  themeName: '一级2',
  isFiles: true,
  parentId: 1,
}, {
  id: 4,
  themeName: '二级1-1',
  isFiles: false,
  hasData: true,
  parentId: 2,
}, {
  id: 5,
  themeName: '二级1-2',
  isFiles: false,
  hasData: false,
  parentId: 2,
}]
