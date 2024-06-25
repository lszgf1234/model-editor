<script setup>
import {defineProps} from 'vue'
import svg4everybody from 'svg4everybody'

import {getFlag, setFlag} from './flags'
import icons from './symbol-defs.svg'

// 第一次注册组件时应用 SVG polyfill（伺候老不死的 IE 用）
if (!getFlag('installed')) {
  svg4everybody()
  setFlag('installed', true)
}

const props = defineProps({
  iconSet: {
    type: String
  },
  icon: {
    type: String,
    default: ''
  },
})

const $useAttrs = {
  'xlink:href': props.icon.indexOf('#') > 0 ? props.icon : `${props.iconSet || icons}#${props.icon}`,
}
</script>

<template>
  <svg
    v-bind="$attrs"
    class="ej-icon"
  >
    <use v-bind="$useAttrs"/>
  </svg>
</template>

<style scoped>
.ej-icon {
  width: 24px;
  height: 24px;
}
</style>
