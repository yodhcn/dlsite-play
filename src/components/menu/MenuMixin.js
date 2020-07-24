import { MENU_SHOWN_DOWNLOAD } from '@/store/mutation-types'

export default {
  methods: {
    /**
     * ダウンロードメニュー開く
     * @param {boolean} open
     */
    showDownloadMenu(open = true) {
      this.$store.commit(MENU_SHOWN_DOWNLOAD, open)
    },

    /**
     * ダウンロードメニュー閉じる
     * @returns {boolean}
     */
    hideDownloadMenu() {
      this.$store.commit(MENU_SHOWN_DOWNLOAD, false)
    },

    /**
     * ダウンロードメニュー状態
     * @returns {boolean}
     */
    isShownDownloadMenu() {
      return this.$store.state.menu.shownDownload
    }
  }
}
