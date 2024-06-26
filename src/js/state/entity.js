/*实体*/
import {reactive, nextTick} from 'vue'

export const state = reactive({
  // 选中的实体id
  entityIdChecked: '',
  // 抽屉中的实体信息保持最新
  entityUpdateData: 1,
  // 创建状态
  addEntityStatus: 1,
  addEntityData: {},
  dictionaries: [],
})

setTimeout(() => {
  nextTick(() => {
    state.entityIdChecked = 1
  })
}, 1500)



