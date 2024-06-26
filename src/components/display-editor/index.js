import DisplayEditor from './display-editor.vue'

export default {
  ...DisplayEditor,
  install: Vue => Vue.component(DisplayEditor.name, DisplayEditor),
}
