/*拖拽实体关联到主题上*/

import {reactive} from '@vue/composition-api'

export const state = reactive({
  dragEntity: {
    status: false,
    entity: null,
  },
})
