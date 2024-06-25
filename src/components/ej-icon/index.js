import Icon from './icon.vue'

export default {
  ...Icon,
  install: Vue => {
    Vue.component(Icon.name, Icon)
  },
}
