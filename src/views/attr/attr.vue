<script setup>

/*
* # 字段对接字典 #
* 渲染，获取当前实体属性 渲染
* 修改
  * 新增
  * 编辑
  * 删除
  * 拖拽移动
* 同步更新 实体属性
*
* */
import {nanoid} from "nanoid";
import { VueDraggable, vDraggable } from 'vue-draggable-plus'
import EjDisplayEdit from '@/components/display-editor'
import EjIcon from "@/components/ej-icon/index.js";
import {reactive, watch} from "vue";
import {state as entityState} from "@/js/state/entity.js";
import {drawState, updateData} from "@/js/state/draw.js";
import {cloneDeep} from "lodash";
import attrEnum from '@/js/enum/attr.js'

let state = reactive({
  data$: [],
  key: null,
})

watch(() => entityState.entityIdChecked, (id) => {
  if (!id) return
  const entityData = drawState.drawData?.nodeDataArray?.find(it => it.key === entityState.entityIdChecked) || {}
  state.data$ = cloneDeep(entityData.attributes) || []
  state.key = entityData.key
}, {
  immediate: true
})

function saveAttrs() {
  const index = drawState.drawData.nodeDataArray.findIndex(it => state.key === it.id)

  const data = cloneDeep(state.data$)
  drawState.drawData.nodeDataArray[index].attributes = data
  updateData()
}

function add() {
  let str = nanoid(3)
  const obj = {
    attrName: `属性_${str}`,
    columnName: `${str}`,
    primaryKey: false,
    foreignKey: false
  }
  state.data$.push(obj)
  saveAttrs()
}

function sort(val) {
  saveAttrs()
}
</script>

<template>
  <div class="attributes-view flex-grow flex flex-col overflow-hidden">
    <div class="attrs-list flex-grow px-3 overflow-auto scroll-bar">
      <table width="100%" class="table drag-table my-table">
        <thead>
        <tr>
          <th class="text-left">中文名</th>
          <th class="text-left">字段名</th>
          <th class="text-left attr-type-th">字段类型</th>
          <th class="text-left checkbox-th">主键</th>
          <th class="text-left checkbox-th">外键</th>
          <th class="text-left checkbox-th">非空</th>
        </tr>
        </thead>
        <tbody
          v-draggable="[
            state.data$,
            {
              // animation: 150,
              onEnd(val) {
                sort(val)
              },

            }
          ]
        ">

<!--          <VueDraggable v-model="state.data$">-->
            <tr v-for="(it, idx) of state.data$" :key="idx">
              <td class="text-th">
                <ej-display-edit v-model:val="it.attrName"
                                 @change="() => {saveAttrs()}"
                                 class="table-autocomplete"/>
              </td>
              <td>
                <ej-display-edit v-model:val="it.columnName"
                                 @change="() => {saveAttrs()}"
                                 class="table-autocomplete">
                </ej-display-edit>
              </td>
              <td>
                <el-select size="small"
                           v-model="it.columnType"
                           placeholder="请选择"
                           @change="saveAttrs(it)"
                           class="table-select">
                  <el-option v-for="(itChild) of attrEnum.attrTypes"
                             :value="itChild.value"
                             :label="itChild.value"
                             :key="itChild.value">
                  </el-option>
                </el-select>
              </td>
              <td>
                <el-checkbox :disabled="it.foreignKey" v-model="it.primaryKey" @change="saveAttrs(it, idx)"></el-checkbox>
              </td>
              <td>
                <el-checkbox disabled v-model="it.foreignKey" @change="saveAttrs(it)"></el-checkbox>
              </td>
              <td>
                <el-checkbox :disabled="it.primaryKey"
                             v-model="it.notEmpty"
                             @change="saveAttrs(it, idx)"></el-checkbox>
              </td>
            </tr>
<!--          </VueDraggable>-->
        </tbody>

      </table>
      <a href="javascript:" @click="add" class="dqs-btn dqs-btn-white btn-add">
        <ej-icon icon="plus" class="icon-add"></ej-icon>
        <span class="text-sm ml-3">新增字段</span>
      </a>
    </div>
  </div>
</template>
<style lang="scss">
  @import "./drag-table.scss";
  .attributes-view {
    .btn-add {
      @apply flex text-3xl text-gray-dark text-blue-default;
      border: none;
      border-bottom: 1px solid #EBEEF5;
      height: 30px;

      .icon-add {
        width: 9px;
        height: 9px;
      }
    }

    .btn-panel {
      @apply bg-white text-blue-default;
    }

    .my-table {
      .attr-type-th {
        width: 160px;
      }

      .checkbox-th {
        width: 50px;
      }

      .text-th {
        width: 25%;
      }

      tbody tr {
        @apply cursor-default;
      }
    }
  }
</style>
