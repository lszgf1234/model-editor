<script setup>
console.log(111)
</script>

<template>
  <div class="canvas-wrapper">
    <div class="header">header</div>
    <div class="main">
      <div class="left">left</div>
      <div class="right">right</div>
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
    }

    .main {
      min-height: calc(100vh - $head_height);
      display: flex;

      .left {
        width: 300px;
        border-right: 1px solid #ddd;
      }

      .right {
        flex: 1;
      }
    }
  }
</style>
