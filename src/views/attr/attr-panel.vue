<template>
  <drawer-panel :visible.sync="visible$" :max-height="maxHeight">
    <div class="attr-panel-view">
      <el-tabs v-model="activeName" type="card" size="mini" class="attr-tabs">
        <el-tab-pane label="属性" name="first">
          <el-form label-width="70px" :label-position="labelPosition">
            <el-form-item label="默认值">
              <el-input size="mini" v-model="params.defaultName"></el-input>
            </el-form-item>
            <el-form-item label="定义">
              <el-input size="mini" type="textarea" rows="5" v-model="params.desc"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="约束" name="second">
          <el-form label-width="70px" :label-position="labelPosition">
            <el-form-item label-width="0">
              <el-radio-group v-model="params.rule">
                <el-radio v-for="(it, idx) of attrRules" :key="idx" :label="it.value">{{it.name}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <div v-if="params.rule === attrRules.number.value">
              <el-form-item label="最大值">
                <el-input type="number" size="mini" v-model="params.max"></el-input>
              </el-form-item>
              <el-form-item label="最小值">
                <el-input type="number" size="mini" v-model="params.min"></el-input>
              </el-form-item>
            </div>
            <el-form-item v-else-if="params.rule === attrRules.enumerate.value" label="枚举值">
              <el-input type="number" size="mini" v-model="params.enumerate"></el-input>
            </el-form-item>
            <el-form-item v-else-if="params.rule === attrRules.expression.value" label="枚举值">
              <el-input type="number" size="mini" v-model="params.enumerate"></el-input>
            </el-form-item>
            <div v-else></div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane disabled label="枚举代码" name="third">
          数据源未知
        </el-tab-pane>
        <el-tab-pane disabled label="自定义属性" name="fourth">
          <el-form label-width="70px" :label-position="labelPosition">
            <el-form-item label="安全等级">
              <el-select size="mini" placeholder="请选择" v-model="params.level">
                <el-option v-for="(it, idx) of safetyLevels" :key="idx" :label="it.name" :value="it.value"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div class="flex panel-action">
        <a href="javascript:" @click="del" class="dqs-btn btn-panel px-3 py-1 ml-auto">删除字段</a>
        <a href="javascript:" @click="save" class="dqs-btn px-3 py-1 ml-5">确认</a>
      </div>
    </div>
  </drawer-panel>
</template>

<script>
  import Lodash from 'lodash'

  import enumerate from '~/js/enum'

  import DrawerPanel from '~/components/drawer-panel'

  export default {
    props: {
      visible: {
        type: Boolean,
      },

      data: {
        type: Object,
      },

      maxHeight: {
        type: Number,
      },
    },

    components: {
      DrawerPanel,
    },

    data() {
      return {
        row: {},
        params: {},
        activeName: 'first',
        labelPosition: 'left',
        attrRules: enumerate.attrRules,
        safetyLevels: enumerate.safetyLevels,
        disH: null,
      }
    },

    computed: {
      visible$: {
        get() {
          return this.visible
        },
        set(val) {
          this.$emit('update:visible', val)
        },
      },
    },

    created() {
    },

    watch: {
      data: {
        immediate: true,

        handler(val) {
          this.initData()
          if (val.columnInfo) {
            this.formatData()
          }
        },
      },
    },

    methods: {
      formatData() {
        this.params = Object.assign(this.params, JSON.parse(this.data.columnInfo))
      },

      save() {
        //  保存数据
        let row = Lodash.cloneDeep(this.data)
        row.columnInfo = JSON.stringify(this.params)
        this.$emit('save', row)
        this.close()
      },

      del() {
        //  删除字段
        this.$confirm(`确认删除字段：${this.data.attrName}`, '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
        }).then(() => {
          this.$emit('del', this.data)
          this.close()
        })

      },

      initData() {
        this.params = {
          // 默认值
          defaultName: '',
          // 定义
          desc: '',
          // 约束
          rule: 2,
          //最小值
          min: '',
          // 最大值
          max: '',
          // 表达式
          expression: '',
          // 枚举值
          enumerate: '',
          // 安全等级
          level: 1,
          // 枚举代码
          EnumerateCode: [],
        }
      },

      close () {
        this.visible$ = false
      },
    },
  }
</script>

<style lang="scss">
  .attr-panel-view {
    .attr-tabs {
      @apply px-3;

      .el-tabs__item {
        padding: 0 24px;
        height: 30px;
        line-height: 30px;

        &:before, &:after {
          width: 0;
        }
      }

      .el-tabs__header {
        @apply mb-3;
      }
    }

    .panel-action {
      @apply absolute;
      bottom: 20px;
      right: 10px;
      width: 100%;
    }
  }
</style>
