import cloneDeep from 'lodash/cloneDeep'
import assign from 'lodash/assign'
import api from '@/store/api'
import { RECOMMEND_FOR_PERSON, RECOMMEND_FOR_PRODUCT } from '@/store/mutation-types'
import db from '@/store/database'

export default {
  namespaced: true,

  state: {
    forPerson: null,
    forProduct: {}
  },

  mutations: {
    [RECOMMEND_FOR_PERSON](state, data) {
      state.forPerson = cloneDeep(data)
    },
    [RECOMMEND_FOR_PRODUCT](state, { workno, data }) {
      state.forProduct = { ...state.forProduct, [workno]: cloneDeep(data) }
    }
  },

  getters: {
    // 関連作品
    getRelatedItems: state => workno => {
      if (Object.prototype.hasOwnProperty.call(state.forProduct, workno)) {
        return state.forProduct[workno].items
      } else {
        return []
      }
    },
    // 次巻
    getNextVolume: state => workno => {
      if (!Object.prototype.hasOwnProperty.call(state.forProduct, workno)) {
        return null
      }

      const data = state.forProduct[workno]
      const items = data.items
      const nextId = data.next_workno

      // 関連作品の中から検索
      return items.find(b => b.workno === nextId)
    },
    // 関連種類
    getRelatedType: state => workno => {
      if (!Object.prototype.hasOwnProperty.call(state.forProduct, workno)) {
        return null
      }
      return state.forProduct[workno].type
    }
  },

  actions: {
    /**
     * おすすめ作品取得
     * @param {function} commit
     * @param {object} state
     * @returns {Promise <any>}
     */
    fetchForPerson({ commit, state }) {
      if (!navigator.onLine) {
        return Promise.resolve()
      }

      if (state.forPerson) {
        return Promise.resolve()
      }

      return api
        .get('/api/recommend/library?limit=10')
        .then(responce => {
          commit(RECOMMEND_FOR_PERSON, responce.data)
        })
        .catch(error => {
          if (error.response && error.response.status === 401) {
            return Promise.resolve()
          } else {
            return Promise.reject(error)
          }
        })
    },

    async fetchForProduct({ commit, state }, { workno }) {
      if (!navigator.onLine) {
        return Promise.resolve()
      }

      // eslint-disable-next-line no-prototype-builtins
      if (state.forProduct.hasOwnProperty(workno)) {
        return Promise.resolve()
      }

      const apiResult = await api
        .get(`/api/recommend/?workno=${workno}&limit=10`)
        .then(responce => responce.data)
        .catch(error => {
          console.warn(error)
          return {}
        })

      const data = assign(
        {
          items: [],
          next: null,
          next_workno: null,
          type: null,
          status: null
        },
        apiResult
      )

      const ids = data.items.map(item => item.workno)

      // 所持作品を検索
      const hasIds = await db.lfdb
        .select(db.table.purchase.workno)
        .from(db.table.purchase)
        .where(db.table.purchase.workno.in(ids))
        .exec()
        .then(rows => {
          return rows.map(r => r.workno)
        })
        .catch(error => {
          console.warn(error)
          return []
        })

      // 購入済み判定
      data.items.forEach(item => {
        item.bought = hasIds.indexOf(item.workno) !== -1
      })

      commit(RECOMMEND_FOR_PRODUCT, { workno, data })
    }
  }
}
