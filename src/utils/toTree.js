/*
options = {
  id: 'organizationId',
  parentId: 'parentId',
  rootId: '0',
}
1. 先找到最外层，删掉集合中的当条数据
2. 循环最外层，循环集合，如果集合中的父id等于上一层的id，
*/
export function toTreeData (data, attributes) {
  let resData = data
  let tree = []

  if (attributes.rootId instanceof Object) {
    tree.push(attributes.rootId)
  } else {
    for (let i = 0; i < resData.length; i++) {
      if (resData[i][attributes.parentId] === attributes.rootId) {
        let obj = {
          children: [],
        }

        tree.push(Object.assign(obj, resData[i]))
        resData.splice(i, 1)
        i--
      }
    }
  }


  run(tree)
  function run (chiArr) {
    if (resData.length !== 0) {
      for (let i = 0; i < chiArr.length; i++) {
        for (let j = 0; j < resData.length; j++) {
          if (chiArr[i][attributes.id] === resData[j][attributes.parentId]) {
            let obj = {
              children: [],
            }

            chiArr[i].children.push(Object.assign(obj, resData[j]))
            resData.splice(j, 1)
            j--
          }
        }
        run(chiArr[i].children)
      }
    }
  }

  return tree
}

export function convertTree (list, opt = {
  rootId: 0
}) {
  const res = []
  /**
   *  将当前数据缓存到对象中，
   *  如果父id存在，缓存到它的子元素中
   *  */

  const map = list.reduce((r, v) => {
    r[v.id] = v
    return r
  }, {})
  for (const item of list) {
    if (item.parentId === opt.rootId) {
      res.push(item)
      continue
    }
    if (item.parentId in map) {
      const parent = map[item.parentId]
      parent.children = parent.children || []
      parent.children.push(item)
    }
  }
  return res
}
const tree = convertTree([
  { id: 1, name: '部门A', parentId: 0 },
  { id: 2, name: '部门B', parentId: 0 },
  { id: 3, name: '部门C', parentId: 1 },
  { id: 4, name: '部门D', parentId: 1 },
  { id: 5, name: '部门E', parentId: 2 },
  { id: 6, name: '部门F', parentId: 3 },
  { id: 7, name: '部门G', parentId: 2 },
  { id: 8, name: '部门H', parentId: 4 },
])
// console.log(tree)
