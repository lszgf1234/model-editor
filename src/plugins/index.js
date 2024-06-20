import ElementPlus from './elementPlus'

const plugins = [
  ElementPlus,
]

export default {
  install (app) {
    for(const it of plugins) {
      app.use(it)
    }
  }
}
