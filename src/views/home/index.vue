<script setup>
import Header from './header.vue'
import PanelCenter from './PanelCenter.vue'
import PanelLeft from './PanelLeft.vue'
</script>

<template>
  <div class="canvas-wrapper">
    <div class="header">
      <Header></Header>
    </div>
    <div class="main">
      <div class="left">
        <PanelLeft />
      </div>
      <div class="content">
        <PanelCenter />
      </div>
    </div>

  </div>
</template>
<style lang="scss">
  $head_height: 50px;
  .canvas-wrapper {
    height: 100vh;

    .header {
      height: $head_height;
      background: #2c3e50;
      display: flex;
      align-items: center;
    }

    .main {
      min-height: calc(100vh - $head_height);
      display: flex;

      .left {
        width: 300px;
        border-right: 1px solid #ddd;
      }

      .content {
        flex: 1;
      }
    }

    .canvas {
      height: calc(100vh - $head_height);
    }
  }
</style>
