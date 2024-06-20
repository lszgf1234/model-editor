/*实体*/
import {reactive} from '@vue/composition-api'

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
