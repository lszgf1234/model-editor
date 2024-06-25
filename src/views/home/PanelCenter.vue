
<script setup>
import {onMounted, nextTick, ref} from 'vue'
import {cloneDeep} from 'lodash'
import ErgRenderer from '@/lib/canvas-render'
import {data as mockData} from '@/js/mock/theme'

import {drawState, Erg, loadCanvas} from '@/js/state/draw'

// const {updateLineStatus, } = toRefs(drawState)
/**
 * 根据主题获取数据
 * 实体数据
 * 实体关系
 * 绘图数据
 * */
onMounted(() => {
  initData()
})

function initData() {
  /* 组装绘图数据
             获取图形数据
             获取实体数据
             根据节点的key与实体的id，组装节点信息
             */
  let data = mockData
  let entities = data.entityInfos instanceof Array ? data.entityInfos : []
  /*if (entities.length) {
    entities.forEach(it => {
      toDictionary(it.attributes.primaryKeyAttributes)
      toDictionary(it.attributes.foreignKeyAttributes)
      it.primaryKeyAttributes = Lodash.cloneDeep(it.attributes.primaryKeyAttributes)
      it.foreignKeyAttributes = Lodash.cloneDeep(it.attributes.foreignKeyAttributes)
      it.attributes = it.attributes.primaryKeyAttributes.concat(it.attributes.foreignKeyAttributes)
    })
  }*/
  let lineData = (data.graphics ? data.graphics : null)
  let initLineData = () => {
    if (!lineData) {
      lineData = {
        nodeDataArray: [],
        linkDataArray: [],
        markDataArray: [],
        noteDataArray: [],
      }
    } else {
      lineData = JSON.parse(lineData)
      if (!lineData.nodeDataArray) {
        lineData.nodeDataArray = []
      }
      if (!lineData.linkDataArray) {
        lineData.linkDataArray = []
      }
      if (!lineData.markDataArray) {
        lineData.markDataArray = []
      }
      if (!lineData.noteDataArray) {
        lineData.noteDataArray = []
      }
    }
  }
  let dleRedundantData = () => {
    /*
    删除多余的节点信息，
      节点在实体集合中找到的留下
    删除多余的线
      线的起始，在实体集合中都能找到的留下
    更新一次线信息
  */
    let entityId = entities.map(it => it.id)
    lineData.linkDataArray = lineData.linkDataArray.filter(it => (entityId.includes(it.from) && entityId.includes(it.to)))
    lineData.nodeDataArray = lineData.nodeDataArray.filter(it => entityId.includes(it.key))
    nextTick(() => {
      drawState.updateLineStatus++
    })
  }
  let initNodeData = () => {
    if (lineData.nodeDataArray.length) {
      lineData.nodeDataArray.forEach(node => {
        let entity = entities.find(it => it.id === node.key)
        if (entity) {
          Object.assign(node, entity)
        }
      })
    }
  }

  initLineData()
  dleRedundantData()
  initNodeData()

  drawState.drawData = lineData
  drawState.entityList = data.entityInfos || []
  drawState.canvasData = cloneDeep(lineData)

  // this.themeId = data.id
  // 更新绘图区id
  drawState.graphicsId = data.id
  // 更新绘图区data$
  drawState.updateUseDrawDataStatus++
  // 打开绘图区区域
  drawState.panelVisible = true
  // 更新实体信息
  // drawState.entityUpdateData++
  loadCanvas()
}

</script>
<template>
<div>
  <div>
    <div id="canvas" class="canvas"></div>
  </div>
</div>
</template>
<style scoped>

</style>
