<script setup>
import {
  DocumentAdd
} from '@element-plus/icons-vue'

import EjIcon from '@/components/ej-icon'
import {nanoid} from 'nanoid'

import {Erg, addNode} from '@/js/state/draw'
/**
 * 头部-实体
 *  左侧项目标题
 *  中间工具栏
 *  右侧登录信息*/
/**
 * 工具栏
 *  新增实体
 *  新增主键
 *  新增非主键
 *  */
/**
 * 工具栏
 * 布局设计：间距组件+图标+tooltip提示
 * 绑定点击事件，
 * */
/**
 * 新增实体
 *  通知画板 新增实体
 *  画板确认新增实例，回传实体信息
 *  补充必要信息，存储到实体列表中
 *  存储绘图信息（api）
 * 删除实体
 *  画板选中实体，通过del准备删除，回传要删除的实体id
 *  确认删除实体
 *  实体列表中删除实体
 *  重新初始化绘图信息
 *  通知画板更新视图
 * 新增主键
 *  点击工具栏，新增主键按钮，通知画板准备新增
 *  画板点击实体a，再点击实体b，完成绘制线，回传线的基本信息
 *  保存主键关系，
 *  实体b中添加a中的主键，并别名
 *  重新初始化绘图信息
 *  通知画板更新视图
 *  保存实体，保存绘图信息（api）
 * 删除主键关系
 *  画板选中线，通过del准备删除，回传要删除的线id
 *  确认删除线
 *  删除线
 *  通知画板更新视图
 *
 * */

const tools = [
  {
    icon: DocumentAdd,
    title: '新增实体',
    fn: addNode,
  },
  {
    icon: DocumentAdd,
    title: '新增主键关系',
    fn: () => {
    },
  },
  {
    icon: DocumentAdd,
    title: '新增非主键关系',
    fn: () => {
    },
  },
]



</script>
<template>
  <div class="header-wrapper">
    <el-space class="tools">
      <!--      <div
              v-for="(it, idx) of tools"
              :key="idx"
            >
              <el-tooltip
                effect="dark"
                :content="it.title"
                placement="bottom"
              >
                <el-icon @click="it.fn">
                  <component :is="it.icon"/>
                </el-icon>
              </el-tooltip>
            </div>-->
      <el-tooltip
        effect="dark"
        content="新增实体"
        placement="bottom"
      >
        <EjIcon @click="addNode" icon="table-add"/>
      </el-tooltip>
      <el-tooltip
        effect="dark"
        content="新增主键"
        placement="bottom"
      >
        <EjIcon icon="primary"/>
      </el-tooltip>
      <el-tooltip
        effect="dark"
        content="新增非主键"
        placement="bottom"
      >
        <EjIcon icon="non-primary"/>
      </el-tooltip>
    </el-space>
  </div>
</template>
<style scoped lang="scss">
.header-wrapper {
  display: flex;
  align-items: center;
  padding-left: 300px;
  color: #fff;

  .tools {
    fill: #ddd;

    svg {
      outline: none;

      &:hover {
        cursor: pointer;
        fill: #fff;
      }
    }
  }
}
</style>
