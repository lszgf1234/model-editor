import {reactive} from '@vue/composition-api'
import Lodash from "lodash";

export const state = reactive({
  themeId: null,
  themeIdStatus: 1,
  panelVisible: false,
  initDrawDataStatus: 1,
  themes: [],
  delThemeId: '',
  editTheme: {
    status: 1,
    item: {},
  },
})

export function setEditTheme (it) {
  it = Lodash.cloneDeep(data)
  state.editTheme = {
    status: state.editTheme.status + 1,
    item: it,
  }
}
