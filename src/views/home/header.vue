<script setup>
import {ref} from 'vue'

import EjIcon from '@/components/ej-icon'

import {addNode, addLine, changeColor, addNote, addMark, exportData, setScale, setEditable} from '@/js/state/draw'
import enumerate from '@/js/enum'
import avatar from '@/assets/img/avatar.png'
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
 *  背景色 1
 *  文本颜色 1
 *  边框颜色 1
 *
 *  新增过滤器--待开放
 *  备注 1
 *  创建矩形选框
 *
 *  切换分辨率
 *  只读/编辑
 *
 *  生成ddl
 *  切换模型类型
 *
 *  */

const scaleVal = ref('100%')

</script>
<template>
  <div class="header-wrapper px-5">
    <div class="logo flex align-items">
      <EjIcon class="icon" icon="erwin-import" />
      <span class="ml-2">模型工具</span>
    </div>
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
      <el-divider direction="vertical" />
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
      <el-divider direction="vertical" />
      <el-tooltip
        effect="dark"
        content="备注"
        placement="bottom"
      >
        <EjIcon icon="text"  @click="addNote" />
      </el-tooltip>
      <el-tooltip
        effect="dark"
        content="创建矩形选框"
        placement="bottom"
      >
        <EjIcon icon="rectangle"  @click="addMark" />
      </el-tooltip>
      <el-divider direction="vertical" />
      <el-tooltip
        effect="dark"
        content="导出json"
        placement="bottom"
      >
        <EjIcon icon="json-export"  @click="exportData" />
      </el-tooltip>
      <el-tooltip
        effect="dark"
        content="导入json-待开放"
        placement="bottom"
      >
        <EjIcon class="is-disabled" icon="json-import" />
      </el-tooltip>
      <el-tooltip
        effect="dark"
        content="导入excel-待开放"
        placement="bottom"
      >
        <EjIcon class="is-disabled" icon="excel-import" />
      </el-tooltip>
      <el-tooltip
        effect="dark"
        content="导入ErWin-待开放"
        placement="bottom"
      >
        <EjIcon class="is-disabled" icon="erwin-import" />
      </el-tooltip>
      <el-divider direction="vertical" />
      <el-tooltip
        effect="dark"
        content="生成ddl-待开放"
        placement="bottom"
      >
        <EjIcon class="is-disabled" icon="save-ddl" />
      </el-tooltip>
      <el-tooltip
        effect="dark"
        content="逆向工程-待开放"
        placement="bottom"
      >
        <EjIcon class="is-disabled" icon="reverse" />
      </el-tooltip>
      <el-tooltip
        effect="dark"
        content="生成物理模型-待开放"
        placement="bottom"
      >
        <EjIcon class="is-disabled" icon="generate" />
      </el-tooltip>
      <el-tooltip
        effect="dark"
        content="模型检查-待开放"
        placement="bottom"
      >
        <EjIcon class="is-disabled" icon="examine" />
      </el-tooltip>
      <el-divider direction="vertical" />
      <el-tooltip
        effect="dark"
        content="只读"
        placement="bottom"
      >
        <EjIcon icon="lock" @click="setEditable(2)"
        />
      </el-tooltip>
      <el-tooltip
        effect="dark"
        content="可编辑"
        placement="bottom"
      >
        <EjIcon icon="unlock" @click="setEditable(1)"/>
      </el-tooltip>
      <el-tooltip
        effect="dark"
        content="缩放"
        placement="bottom"
      >
        <el-select
          v-model="scaleVal"
          placeholder="Select"
          size="small"
          style="width: 80px"
          @change="setScale"
        >
          <el-option
            v-for="n of ['60%', '80%', '100%', '120%', '140%', '160%', '180%', '200%']"
            :key="n"
            :label="n"
            :value="n"
          />
        </el-select>

      </el-tooltip>
    </el-space>
    <el-dropdown class="ml-auto header-dropdown">
      <div class="el-dropdown-link flex items-center">
        <el-avatar :size="30" :src="avatar" />
        <span class="ml-2">lszgf</span>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
<style scoped lang="scss">
.header-wrapper {
  display: flex;
  flex: 1;
  align-items: center;
  color: #fff;

  .logo {
    width: 280px;
    .icon {
      fill: white;
    }
  }

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

  .header-dropdown {
    color: #fff;

    .el-dropdown-link {
      outline: none;
    }
  }
}
</style>
