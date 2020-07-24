import cloneDeep from 'lodash/cloneDeep'
import api from '@/store/api'
import { CIEN_MAKERS } from '@/store/mutation-types'
import assign from 'lodash/assign'
import env from '@/utils/env'

export default {
  namespaced: true,

  state: {
    makers: {}
  },

  mutations: {
    [CIEN_MAKERS](state, { makerId, creators }) {
      state.makers = { ...state.makers, [makerId]: cloneDeep(creators) }
    }
  },

  actions: {
    /**
     * クリエイター情報取得
     * @param {function} commit
     * @param {object} state
     * @param {number} makerId
     */
    fetchCreators({ commit, state }, { makerId }) {
      if (!navigator.onLine) return
      if (Object.prototype.hasOwnProperty.call(state.makers, makerId)) return

      const mediaOrigin = /^(development|staging)$/.test(env)
        ? 'https://d1r3r3h539uaei.cloudfront.net'
        : 'https://media.ci-en.jp'

      api
        .ajax('GET', `${mediaOrigin}/dlsite/lookup/${makerId}.json`, {
          withCredentials: false,
          xsrfCookieName: null
        })
        .then(response => {
          const creators = (response.data || []).map(creator => {
            const domain = creator.rating === 'everyone' ? 'ci-en.net' : 'ci-en.dlsite.com'
            const sub = /^(development|staging)$/.test(env) ? 'stg.' : ''
            // リンク生成して追加
            return assign(creator, {
              link: `https://${sub}${domain}/creator/${creator.id}`
            })
          })
          commit(CIEN_MAKERS, { makerId, creators })
        })
        .catch(error => {
          // クリエイターいないときは404
          if (error.response.status === 404) {
            commit(CIEN_MAKERS, { makerId, creators: [] })
          } else {
            console.warn(error)
          }
        })
    }
  }
}
