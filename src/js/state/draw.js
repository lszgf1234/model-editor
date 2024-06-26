import {reactive, ref, nextTick, watch} from 'vue'
import ErgRenderer from '@/lib/canvas-render'
import {nanoid} from "nanoid";
import {ElMessageBox, ElMessage} from 'element-plus'

import {state as stateEntity} from './entity'

export const drawState = reactive({
  // 缩放值
  scale: 100,
  // 数据源-绘图数据
  drawData: {},
  // 实体数据
  entityList: [],
  canvasData: {},
  updateLineStatus: 0,
  // 更新绘图区使用的data$
  updateUseDrawDataStatus: 0,
  graphicsId: '',
})

export const canvasDataRef = ref({})

/**
 * 监听画板数据变更，更新数据源
 *  这里有有性能损耗，从数据源到 画板数据更新，会二次触发此方法，需要一个状态来管理
 *  */
/*const updateStatus = ref(false)
const updateDataSource = debounce(function () {
  if (updateStatus.value) return
  console.warn('---------更新，-------')
  // drawState.drawData = drawState.canvasData
}, 100)
watch(canvasDataRef , function () {
  console.warn('---------更新，-------')
  // updateDataSource()
}, {
  deep: true
})*/

export const Erg = ref(new ErgRenderer())
export function loadCanvas() {
  Erg.value.load({
    id: 'canvas',
    data: drawState.drawData,
    fontFamily: '-apple-system, Noto Sans, Helvetica Neue, Helvetica, Nimbus Sans L, Arial, Liberation Sans, PingFang SC, Hiragino Sans GB, Noto Sans CJK SC, Source Han Sans SC, Source Han Sans CN, Microsoft YaHei, Wenquanyi Micro Hei, WenQuanYi Zen Hei, ST Heiti, SimHei, WenQuanYi Zen Hei Sharp, sans-serif',
    externalFn: {
      addNode: addNodeSure,
      delNode: delNode,
      dbEntity: dbEntity,
      addLine: addLineSure,
      delLine: delLine,
      // dbLine: dbLine,
      addMark: addMarkSure,
      delMark: delMark,
      addNote: addNoteDialog,
      delNote: delNote,
      dbNote: dbNote,
      // $message: this.$message,
    },
  })
}

/** 通知画布创建实体*/
export function addNode () {
  let str = nanoid(5)
  let id = nanoid(8)
  const nodeData = {
    id: id,
    key: id,
    tableName: `表_${str}`,
    englishName: `en_${str}`,
    modelType: '',
    attributes: []
  }
  Erg.value.addNode(nodeData)
}
/**
 * 确认新增实体*/
export function addNodeSure (obj) {
  let amend = () => {
    obj.width = 150
    obj.height = 100
  }
  // 临时修正宽高，绘图区修改后去掉
  amend()
  drawState.drawData.nodeDataArray.push(obj)
  updateData()
}

/**
 * 更新数据
 * 更新画板data
 * 通知画板更新
 * */
export async function updateData () {
  // await nextTick()
  // canvasDataRef.value = cloneDeep(drawState.drawData)
  Erg.value.update(drawState.drawData)
}
/**
 * 创建主键*/
export function addLine (type) {
    Erg.value.addLine(type)
}
/**
 * 确认创建主键*/

export function addLineSure (lineData) {
  drawState.drawData.linkDataArray.push(lineData)
  updateData()
  /* 新增线的逻辑
    组合线数据
    提交表关系，提交线
    初始化数据
  * */
}

/**
 * 删除节点*/
export function delNode(id) {
  const entity = drawState.drawData.nodeDataArray.find(it => it.key === id)
  ElMessageBox.confirm(
    `确认删除${entity.tableName}`,
    'Warning',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      /**
       * 删除实体
       * 删除相关的线
       * 更新绘图区
       * */
      drawState.drawData.nodeDataArray = drawState.drawData.nodeDataArray.filter(it => entity.key !== it.key)
      drawState.drawData.linkDataArray = drawState.drawData.linkDataArray.filter(it => {
        return entity.key !== it.from && entity.key !== it.to
      })
      updateData()
      ElMessage({
        type: 'success',
        message: '操作成功',
      })
    })
}

export function delLine(key) {
  const lineItem = drawState.drawData.linkDataArray.find(it => it.key === key)
  ElMessageBox.confirm(
    `确认删除${lineItem.tableName}`,
    'Warning',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      /**
       * 删除线
       * 更新绘图区
       * */
      drawState.drawData.linkDataArray = drawState.drawData.linkDataArray.filter(it => lineItem.key !== it.key)
      updateData()
      ElMessage({
        type: 'success',
        message: '操作成功',
      })
    })
}

/**
 * 修改颜色
 *  bug,
 *    修改背景色 成功
 *    修改边框颜色，背景色变
 *    修改字体颜色，背景色变
 * */
export function changeColor(val, type) {
  Erg.value.changeColor(val, type)
  // updateData()
}

/**
 * 新增备注
 * */
export function addNote() {
  Erg.value.addNote()
}

function addNoteDialog(obj) {
  ElMessageBox.prompt('请输入备注', 'Tip', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    inputValue: obj.text,
    inputValidator(val) {
      return val ? true: '请输入'
    }
  })
    .then(({ value }) => {
      const it = drawState.drawData.noteDataArray.find(it => it.key === obj.key)
      if (it) {
        it.text = value
      } else {
        drawState.drawData.noteDataArray.push({
          ...obj,
          text: value
        })
      }
      updateData()

      ElMessage({
        type: 'success',
        message: `操作成功`,
      })
    })
}
// 删除标记文本
export function delNote(key) {
  ElMessageBox.confirm(
    '确认彻删除标记文本',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(() => {
      drawState.drawData.noteDataArray = drawState.drawData.noteDataArray.filter(it => it.key !== key)
      updateData()
      ElMessage({
        type: 'success',
        message: '操作成功',
      })
    })
}

export function dbNote(key) {
  const it = drawState.drawData.noteDataArray.find(it => it.key === key)
  addNoteDialog(it, key)
}
/**
 * 创建矩形选框
 * */
export function addMark() {
  Erg.value.addMark()
}

export function addMarkSure(obj) {
  let amend = () => {
    if (obj.width === 0 && obj.height === 0) {
      obj.width = 50
      obj.height = 50
    }
  }
  // 临时修正宽高，绘图区修改后去掉
  amend()
  drawState.drawData.markDataArray.push(obj)
  updateData()
}
// 删除矩形选框
export function delMark(key) {
  ElMessageBox.confirm(
    '确认彻删除标记框',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(() => {
      drawState.drawData.markDataArray = drawState.drawData.markDataArray.filter(it => it.key !== key)
      updateData()
      ElMessage({
        type: 'success',
        message: '操作成功',
      })
    })
}

/**
 * 双击选中实体
 * */

export function dbEntity(id) {
  stateEntity.entityIdChecked = id
}



