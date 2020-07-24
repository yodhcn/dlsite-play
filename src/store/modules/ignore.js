import cloneDeep from 'lodash/cloneDeep'
import api from '@/store/api'
import { IGNORED_WORKS } from '@/store/mutation-types'
import Storage from '@/utils/storage'
import uniq from 'lodash/uniq'
import difference from 'lodash/difference'
import isEqual from 'lodash/isEqual'

export default {
  namespaced: true,

  state: {
    works: null
  },

  mutations: {
    [IGNORED_WORKS](state, works) {
      state.works = cloneDeep(works)
    }
  },

  actions: {
    /**
     * 除外作品取得
     * @param {function} commit
     * @param {object} state
     * @returns {Promise<any>}
     */
    fetch({ commit, state }) {
      // Library初期化時の無限ループ注意
      if (state.works !== null) {
        return Promise.resolve(state.works)
      }

      const ignoredWorks = Storage.getItem('ignoredWorks') || []

      // 比較用
      ignoredWorks.sort()
      commit(IGNORED_WORKS, ignoredWorks)

      api
        .get('/api/ignore')
        .then(req => {
          const works = req.data.works || []
          works.sort()

          if (!isEqual(ignoredWorks, works)) {
            commit(IGNORED_WORKS, works)
            Storage.setItem('ignoredWorks', works)
          }
        })
        .catch(error => {
          console.error(error)
        })

      return Promise.resolve(ignoredWorks)
    },

    /**
     * 除外作品追加
     * @param {function} commit
     * @param {object} state
     * @param {string|array} workno
     */
    async add({ commit, state }, workno) {
      const works = workno instanceof Array ? workno : [workno]
      const ignoredWorks = uniq((state.works || []).concat(workno))

      commit(IGNORED_WORKS, ignoredWorks)
      Storage.setItem('ignoredWorks', ignoredWorks)
      await this.dispatch('purchase/search')

      return api.post('/api/ignore', { works })
    },

    /**
     * 除外作品削除
     * @param {function} commit
     * @param {object} state
     * @param {string|array} workno
     */
    async remove({ commit, state }, workno) {
      const works = workno instanceof Array ? workno : [workno]
      const ignoredWorks = difference(state.works || [], works)

      commit(IGNORED_WORKS, ignoredWorks)
      Storage.setItem('ignoredWorks', ignoredWorks)
      await this.dispatch('purchase/search')

      return api.delete('/api/ignore', { works })
    }
  }
}
