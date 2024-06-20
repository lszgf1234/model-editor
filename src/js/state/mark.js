/**绘图区-
 * 标记文本
 * 颜色
 * 标记框*/
import {reactive} from '@vue/composition-api'

export const state = reactive({
  // 新增标记框
  addMarkStatus: 0,
  // 新增标记文本
  addNoteStatus: 0,
  // 颜色信息
  colorObj: {
    status: 0,
    data: {},
  },
})
