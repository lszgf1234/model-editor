import {reactive} from 'vue'
export const drawState = reactive({
  // 缩放值
  scale: 100,
  // 数据源-绘图数据
  drawData: {},
  // 实体数据
  entityList: [],
  updateLineStatus: 0,
  // 更新绘图区使用的data$
  updateUseDrawDataStatus: 0,
  graphicsId: '',
})
