import { MENU_SHOWN_DOWNLOAD } from '@/store/mutation-types'

export default {
  state: {
    shownDownload: false
  },

  mutations: {
    [MENU_SHOWN_DOWNLOAD](state, open = true) {
      state.shownDownload = open
    }
  }
}
