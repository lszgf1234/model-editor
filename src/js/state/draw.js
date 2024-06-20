import {reactive} from 'vue'
export const drawState = reactive({
  // 缩放值
  scale: 100,
  // 数据源
  drawData: {},
  // en
  entityList: [],
  updateLineStatus: 0,
  // 更新绘图区使用的data$
  updateUseDrawDataStatus: 0,
  graphicsId: '',
})
