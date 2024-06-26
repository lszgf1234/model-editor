<template>
  <div class="ej-display-edit base-input-wrap">
    <div v-if="!edit" @click="gotoEdit" class="min-height">{{val$}}</div>
    <div v-else>
      <input v-if="type === 'input'"
             ref="input"
             type="text"
             v-model="val$"
             @blur="change()"
             @keyup.enter="change()"
             class="my-input">
      <el-autocomplete v-else
                       ref="autocomplete"
                       v-model="val$"
                       :fetch-suggestions="fetchSuggestions"
                       placeholder="请输入内容"
                       @keyup.enter.native="change()"
                       @blur="change()"
                       @select="(itD) => {select(itD.id)}">
        <template #default="{item}">{{`${item.chName}-${item.enName}`}}</template>
      </el-autocomplete>
    </div>

  </div>
</template>

<script>
  /*
  * 支持组件
  * input
  * autocomplete
  *   需要传入筛选方法`fetch-suggestions`
  * 在触发enter，和选择是，同步触发了失去焦点事件，如何禁止
  *   用一个异步状态，300ms内不可以重复触发
  * */
  export default {
    name: 'EjDisplayEdit',

    props: {

      /*组件类型
      * input 默认
      * autocomplete
      * */
      type: {
        type: String,
        default: 'input',
      },

      val: {
        type: [String, Number],
      },

      disabled: {
        type: Boolean,
        default: false,
      },

      disabledDrag: {
        type: Boolean,
        default: true,
      },

      fetchSuggestions: {
        type: Function,
        default: null,
      },
    },

    data () {
      return {
        edit: false,
        timer: null,
        timer1: null,
        changeSatus: false,
      }
    },

    computed: {
      val$: {
        get () {
          return this.val
        },
        set (val) {
          this.$emit('update:val', val)
        },
      },
    },

    methods: {
      change (val) {
        if (this.changeSatus) return
        const clearT = () => {
          clearTimeout(this.timer1)
          this.timer1 = null
        }

        if (this.timer1) {
          clearT()
        }
        this.timer1 = setTimeout(() => {
          clearT()
          this.$emit('change', val || this.val$)
          this.clearState()
        }, 500)
      },

      clearState () {
        this.changeEdit()
        this.startDrag()
      },

      select (dictionaryId) {
        const clearT = () => {
          clearTimeout(this.timer1)
          this.timer1 = null
        }

        if (this.timer1) {
          clearT()
        }
        this.changeSatus = true
        this.$emit('select', dictionaryId)
        this.clearState()
        setTimeout(() => {
          this.changeSatus = false
        }, 100)
      },

      gotoEdit () {
        if (this.timer) {
          clearTimeout(this.timer)
          this.timer = null
        } else {
          this.timer = setTimeout(() => {
            this.edit = true
            this.endDrag()
            this.$nextTick(() => {
              const getInput = () => {
                let input = null

                if (this.$refs.input) {
                  input = this.$refs.input
                } else if (this.$refs.autocomplete) {
                  input = this.$refs.autocomplete.$el.querySelector('input')
                }
                return input
              }

              const input = getInput()

              if (input) {
                input.focus()
                input.select()
              }

            })
          }, 200)
        }
      },

      changeEdit () {
        this.edit = false
      },

      // 启用拖拽
      startDrag () {
        this.$emit('update:disabledDrag', false)
      },

      // 禁用拖拽
      endDrag () {
        this.$emit('update:disabledDrag', true)
      },
    },
  }
</script>

<style lang="scss">
  .ej-display-edit {
    .my-input {
      width: 100%;
    }

    .min-height {
      min-height: 23px;
    }
  }
</style>
