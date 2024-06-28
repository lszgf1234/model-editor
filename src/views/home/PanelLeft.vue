<script setup>
/**
 * mock数据
 * */
import {reactive, getCurrentInstance} from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import {cloneDeep} from 'lodash'
import {nanoid} from "nanoid";

import {data} from '@/js/mock/theme1.js'
import {convertTree} from '@/utils/toTree.js'
import EjIcon from '@/components/ej-icon'

const {proxy} = getCurrentInstance()

const state = reactive({
  dataList: [],
  treeData: [],
})
async function getData(){
  state.dataList = data
}
function initData() {
  state.treeData = convertTree(cloneDeep(state.dataList))
  console.log('--------', state.treeData)
}

async function init() {
  await getData()
  initData()
}

init()

/**
 * 初始化主题数据
 * 压入数据源
 * 重新生成树数据
 * */
function addTheme(parentId, isFiles) {
  const params = {
    parentId,
    id: nanoid(5),
    themeName: `名称_${nanoid(3)}`,
    isFiles: isFiles,
    isEdit: true,
  }
  state.dataList.push(params)
  initData()
}

function edit(data) {// debugger
  const idx = state.dataList.findIndex(it => it.id === data.id)
  state.dataList.splice(idx, 1, {
    ...data,
    isEdit: false,
  })
  initData()
}

function rename(id){
  const idx = state.dataList.findIndex(it => it.id === data.id)
  state.dataList.splice(idx, 1, {
    ...data,
    isEdit: true,
  })
  initData()
}

function del(id) {
  proxy.$confirm(
    '确认删除主题/目录?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(() => {
      const idx = state.dataList.findIndex(it => it.id === data.id)
      state.dataList.splice(idx, 1)
      initData()
      proxy.$message({
        type: 'success',
        message: 'Delete completed',
      })
    })
}

</script>
<template>
<div class="px-5 py-3">
  <div class="themes-view">
<!--    <div>按钮组</div>-->
    <div>
      <el-tree
        style="max-width: 600px"
        :data="state.treeData"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        :teleported="false"
      >
        <template #default="{ node, data }">
          <div class="flex-grow flex pr-4 base-input-wrap">
            <div v-if="!data.isEdit"
                 class="flex-grow flex items-center hide-dropdown">
              <ej-icon :icon="data.isFiles ? 'folder' : 'file'" class="my-icon mr-1"
                       :class="{'text-blue': data.isFiles}"></ej-icon>
              <span v-if="!data.isFiles" class="flex-grow">{{data.themeName}}</span>
              <span v-else class="flex-grow">{{data.themeName}}</span>
              <el-dropdown class="ml-auto my-dropdown">
                <div class="el-dropdown-link">
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-if="data.isFiles" @click="addTheme(data.id, false)">新建主题</el-dropdown-item>
                    <el-dropdown-item v-if="data.isFiles" @click="addTheme(data.id, false)">新建文件夹</el-dropdown-item>
                    <el-dropdown-item v-if="data.id !== '0'" @click="rename(data.id)">重命名</el-dropdown-item>
                    <el-dropdown-item v-if="data.id !== '0'" @click="del(data.id)">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </template>

              </el-dropdown>
            </div>
            <el-input v-else
                      ref="input"
                      size="small"
                      v-model="data.themeName"
                      @blur="edit(data)"
                      @keydown.enter="edit(data)"
                      class="my-input"/>
          </div>
        </template>
      </el-tree>
    </div>
  </div>
</div>
</template>
<style lang="scss">
.themes-view {
  .my-icon {
    width: 12px;
    height: 12px;
  }

  .my-input .el-input__inner {
    height: 20px;
    line-height: 20px;
  }

  .my-dropdown-main {
    width: 100px;

    a {
      @apply px-2;

      &:hover {
        @apply bg-blue-lighter text-blue-default;
      }
    }
  }

  .hide-dropdown {
    .my-dropdown {
      //display: none
    }
  }

  .my-tree {
    padding-bottom: 140px;

    .el-tree-node > .el-tree-node__children {
      overflow: visible;
    }
  }

  .files {
    color: #F2F7FF;
  }
}
</style>
