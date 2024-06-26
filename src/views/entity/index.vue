<script setup>
/**
 * 双击实体
 * 存储实体 id
 * 存储模态框状态 visible
 * 显示模态框
 *  显示实体基本信息
 *  显示属性信息
 * */
import {computed, reactive, watch} from 'vue'
import {cloneDeep} from 'lodash'

import {state as entityState} from '@/js/state/entity.js'
import {drawState, updateData} from '@/js/state/draw.js'
import EjDisplayEdit from '@/components/display-editor'

const visible = computed({
  get () {
    return !!entityState.entityIdChecked
  },

  set () {
    entityState.entityIdChecked = ''
  },
})

let state = reactive({
  data$: {}
})

watch(() => entityState.entityIdChecked, (id) => {
  if (!id) return
  console.log('------', drawState.drawData, entityState.entityIdChecked)
  const entityData = drawState.drawData?.nodeDataArray?.find(it => it.key === entityState.entityIdChecked) || {}
  state.data$ = cloneDeep(entityData)
}, {
  immediate: true
})


/**
 * 更新draw data
 * 找到当前表
 * 删除，1 添加
 * */
function saveTable () {
  const index = drawState.drawData.nodeDataArray.findIndex(it => state.data$.id === it.id)

  const data = cloneDeep(state.data$)
  drawState.drawData.nodeDataArray.splice(index, 1, data)
  updateData()

  /*
  * 保存实体信息
  * 初始化数据源
  * */

}

function close () {
  visible.value = false
}

</script>

<template>
  <el-drawer
    v-model="visible"
    :title="state.data$.tableName"
    direction="rtl"
    class="entity-view"
    :size="1000"
  >
    <div class="flex mb-6 table-info px-3">
      <div class="flex flex-1 items-center">
        <span class="label">实体中文名称</span>
        <ej-display-edit v-model:val="state.data$.tableName"  @change="saveTable"></ej-display-edit>
      </div>
      <div class="flex flex-1 items-center">
        <span class="label">实体英文名称</span>
        <ej-display-edit v-model:val="state.data$.englishName"  @change="saveTable"/>
      </div>
    </div>
  </el-drawer>
</template>

<style lang="scss">
.entity-view {
  width: 700px;

  .table-info {
    font-size: 15px;
    min-height: 28px;

    .label {
      @apply mr-2;
    }

    .el-input {
      width: 180px;
    }
  }
}
</style>
