/**
 * リンク関連mixin
 */

import categories from '@/store/categories'
import moment from 'moment'
import querystring from 'querystring'
import axios from 'axios'
import site from '@/utils/site'
import i18n from '@/i18n'

moment.locale(i18n.locale)

export default {
  computed: {
    dlsiteBaseUrl() {
      return site.getDLsiteBaseUrl()
    }
  },

  methods: {
    /**
     * PC・SP用に正規化したsiteIdを返す
     * @param {string} siteId
     * @returns {string}
     */
    normalizedSiteId(siteId) {
      if (this.$app.$data.isPc) {
        return siteId.replace('-touch', '')
      } else {
        return siteId === 'soft' ? siteId : siteId + '-touch'
      }
    },

    /**
     * DLsite作品詳細へのリンク生成
     * @param {object} product (meta)
     * @returns {string|null}
     */
    workUrl(product) {
      if (product && product.inservice === 1) {
        const siteId = this.normalizedSiteId(product.site_id)
        return `${this.dlsiteBaseUrl}/${siteId}/work/=/product_id/${product.workno}.html`
      } else {
        return ''
      }
    },

    /**
     * DLsite購入URL（カート投入）
     * @param {object} product
     * @returns {string|null}
     */
    buyUrl(product) {
      if (product && product.inservice === 1) {
        const siteId = this.normalizedSiteId(product.site_id)
        return `${this.dlsiteBaseUrl}/${siteId}/cart/=/product_id/${product.workno}.html`
      } else {
        return ''
      }
    },

    /**
     * DLsiteサークル・メーカーURL
     * @param {string} site_id
     * @param {string} maker_id
     * @returns {string}
     */
    makerUrl({ site_id, maker_id }) {
      return `${this.dlsiteBaseUrl}/${this.normalizedSiteId(site_id)}/circle/profile/=/maker_id/${maker_id}.html`
    },

    /**
     * DLsite著者URL
     * @param {string} site_id
     * @param {array} authors
     * @returns {string}
     */
    authorUrl({ site_id, authors }) {
      try {
        console.log(
          `${this.dlsiteBaseUrl}/${this.normalizedSiteId(site_id)}/fsr/=/keyword_maker_name/${authors.join('|')}`
        )
      } catch (e) {
        console.log(e)
      }

      return `${this.dlsiteBaseUrl}/${this.normalizedSiteId(site_id)}/fsr/=/keyword_maker_name/${authors.join('|')}`
    },

    /**
     * 作品種別 (game, book, video...)
     * @param {string} workType
     * @returns {string}
     */
    workCategory(workType) {
      return categories.workTypeToCategory(workType)
    },

    /**
     * わかり易い時間表示
     * @returns {date|string}
     */
    humanizeTime(date) {
      return moment(date).format('LLL')
    },

    /**
     * silver egg クリック応答
     * @param {string} productId
     * @param {string} cref
     */
    sendSilverEgg(productId, cref) {
      const cookies = querystring.parse(document.cookie, '; ', '=')
      const uniqId = cookies.uniqid || ''

      const spec = this.$app.$data.isPc ? 'pc612' : 'sp612'

      const domain = location.hostname !== 'play.dlsite.com' ? 'dlsite-test.silveregg.net' : 'dlsite.silveregg.net'

      const beaconUrl = `https://${domain}/pycre5/click?prod=${productId}&merch=dlsite&spec=${spec}&cookie=${uniqId}&cref=${cref}`

      if (navigator.sendBeacon && navigator.sendBeacon(beaconUrl)) {
        return
      }

      axios.post(beaconUrl)
    },

    /**
     * treeに移動
     * @param {string} workno
     */
    openTree(workno) {
      location.hash = `/work/${workno}/tree`
    }
  }
}
