<script setup>
import {
  DocumentAdd
} from '@element-plus/icons-vue'

import EjIcon from '@/components/ej-icon'

import {addNode, addLine, changeColor} from '@/js/state/draw'
import enumerate from '@/js/enum'
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
 *
 *  文本颜色
 *  背景色
 *  边框颜色
 *
 *  新增过滤器--待开放
 *  备注
 *  创建矩形选框
 *
 *
 *  切换分辨率
 *  只读/编辑
 *
 *  生成ddl
 *  切换模型类型
 *

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



</script>
<template>
  <div class="header-wrapper">
    <el-space class="tools">
      <el-tooltip
        effect="dark"
        content="新增实体"
        placement="bottom"
      >
        <EjIcon @click="addNode" icon="table-add"/>
      </el-tooltip>
      <el-tooltip
        effect="dark"
        content="创建主键(一对一关系)"
        placement="bottom"
      >
        <EjIcon icon="primary"  @click="addLine(enumerate.lineTypes.primaryKey.value)" />
      </el-tooltip>
      <el-tooltip
        effect="dark"
        content="创建非主键(一对多关系)"
        placement="bottom"
      >
        <EjIcon icon="non-primary" @click="addLine(enumerate.lineTypes.foreignKey.value)"/>
      </el-tooltip>
      <el-tooltip
        effect="dark"
        content="subtype(根据分类器从父实体生成子实体)-待开放"
        placement="bottom"
      >
        <EjIcon class="is-disabled" icon="subtype" />
      </el-tooltip>
      <el-tooltip
        effect="dark"
        :content="enumerate.colorType.bg.name"
        placement="bottom"
      >
        <div>
          <el-color-picker
            model-value="#fff"
            size="small"
            @change="(val) => changeColor(val, enumerate.colorType.bg.value)"
          />
        </div>
      </el-tooltip>
      <el-tooltip
        effect="dark"
        :content="enumerate.colorType.border.name"
        placement="bottom"
      >
        <div>
          <el-color-picker
            model-value="#000"
            size="small"
            @change="(val) => changeColor(val, enumerate.colorType.border.value)"
          />
        </div>
      </el-tooltip>
      <el-tooltip
        effect="dark"
        :content="enumerate.colorType.text.name"
        placement="bottom"
      >
        <div>
          <el-color-picker
            model-value="#fff"
            size="small"
            @change="(val) => changeColor(val, enumerate.colorType.text.value)"
          />
        </div>
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
