import {reactive, ref, nextTick} from 'vue'
import ErgRenderer from '@/lib/canvas-render'
import {nanoid} from "nanoid";
import {cloneDeep} from 'lodash'
export const drawState = reactive({
  // 缩放值
  scale: 100,
  // 数据源-绘图数据
  drawData: {},
  // 实体数据
  entityList: [],
  canvasData: [],
  updateLineStatus: 0,
  // 更新绘图区使用的data$
  updateUseDrawDataStatus: 0,
  graphicsId: '',
})
export const Erg = ref(new ErgRenderer())
export function loadCanvas() {
  Erg.value.load({
    id: 'canvas',
    data: drawState.canvasData,
    fontFamily: '-apple-system, Noto Sans, Helvetica Neue, Helvetica, Nimbus Sans L, Arial, Liberation Sans, PingFang SC, Hiragino Sans GB, Noto Sans CJK SC, Source Han Sans SC, Source Han Sans CN, Microsoft YaHei, Wenquanyi Micro Hei, WenQuanYi Zen Hei, ST Heiti, SimHei, WenQuanYi Zen Hei Sharp, sans-serif',
    externalFn: {
      addNode: addNodeSure,
      // delNode: this.delNode,
      // dbEntity: this.dbEntity,
      // addLine: this.addLineSure,
      // delLine: this.delLine,
      // dbLine: this.dbLine,
      // addMark: this.addMarkSure,
      // delMark: this.delMark,
      // addNote: this.addNoteDialog,
      // delNote: this.delNote,
      // dbNote: this.dbNote,
      // $message: this.$message,
    },
  })
}
/** 新增实体
 * 生成实体信息基本信息
 * 通知画布
 *
 * */
/** 通知画布创建实体*/
export function addNode () {
  let str = nanoid(5)
  const nodeData = {
    id: nanoid(8),
    tableName: `表_${str}`,
    englishName: `en_${str}`,
    modelType: '',
    attributes: []
  }
  Erg.value.addNode(nodeData)
}
export function addNodeSure (drawItem) {
  drawState.drawData.nodeDataArray.push(drawItem)
  updateData()
}

/**
 * 更新数据
 * 更新画板data
 * 通知画板更新
 * */
export async function updateData () {
  await nextTick()
  drawState.canvasData = cloneDeep(drawState.drawData)
  Erg.value.update(drawState.drawData)
}

