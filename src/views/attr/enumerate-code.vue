<template>
  <div class="enumerate-code-view">
    枚举代码功能
  </div>
</template>

<script>
  /*
  * 监听枚举代码数据，立即执行
  * 自动更新，sync方式
  * */
  /*
 * todo: 枚举代码功能， 等数据标准上线后再做
 *   1. 来源：
 *     自定义：
 *       增删改
 *     公共代码
 *        从标准中拉取，可选择
 * */
  export default {
    props: {
      data: {
        type: Object,
      },
    },

    data () {
      return {
        data$: {
          statue: 1,
          data: [],
        },
      }
    },

    watch: {
      data: {
        immediate: true,
        handler (val) {
        },
      },
    },
  }
</script>

<style scoped>

</style>
