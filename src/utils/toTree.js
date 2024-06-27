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
