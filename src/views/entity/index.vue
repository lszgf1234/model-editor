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
import {drawState} from '@/js/state/draw.js'

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



</script>

<template>
  <el-drawer
    v-model="visible"
    :title="state.data$.tableName"
    direction="rtl"
  >
    <span>Hi, there!</span>
  </el-drawer>
</template>

<style scoped>

</style>
