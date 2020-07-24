import purchase from '@/classes/purchase'
import * as types from '@/store/mutation-types'
import forEach from 'lodash/forEach'
import defaults from 'lodash/defaults'
import isEqual from 'lodash/isEqual'
import cat from '@/store/categories'
import assign from 'lodash/assign'

// initial state
const state = {
  initialize: true,
  works: [],
  workTypes: [],
  workSyncing: false,
  page: 0,
  total: null,
  conditions: {
    limit: 30,
    search: '',
    filter: null,
    sort: null
  },
  sortTypes: [
    'purchase',
    'purchase_asc',
    'upgrade',
    'release_desc',
    'release_asc',
    'title_asc',
    'title_desc',
    'maker_asc',
    'maker_desc',
    'work_type'
  ]
}

// actions
const actions = {
  initialize({ commit, dispatch, rootState }) {
    // 条件初期化
    commit(
      types.UPDATE_CONDITIONS,
      defaults(
        {
          filter: rootState.play.config.purchaseCondFilter || 'all',
          sort: rootState.play.config.purchaseCondSort || 'purchase'
        },
        state.conditions
      )
    )

    return dispatch('search', { prefetch: true })
  },

  /**
   * 購入済み作品を同期
   */
  syncWork({ commit, dispatch, rootState }, all = false) {
    if (!navigator.onLine) {
      return Promise.reject(new Error('offline'))
    }

    commit(types.WORK_SYNCING, true)

    return purchase
      .syncWork(all ? null : rootState.play.config.lastSyncDatetime)
      .then(() => {
        return dispatch(
          'play/setConfig',
          {
            key: 'lastSyncDatetime',
            val: String(new Date())
          },
          { root: true }
        )
      })
      .then(() => {
        commit(types.WORK_SYNCING, false)
        return dispatch('search')
      })
      .catch(() => {
        commit(types.WORK_SYNCING, false)
        return Promise.reject(new Error('failed sync'))
      })
  },

  updateCondition({ commit, dispatch }, cond) {
    cond = defaults(cond, state.conditions)

    if (!isEqual(cond, state.conditions)) {
      // filterとsortはconfigに保存
      if (cond.filter !== state.conditions.filter) {
        dispatch('play/setConfig', { key: 'purchaseCondFilter', val: cond.filter }, { root: true })
      }

      if (cond.sort !== state.conditions.sort) {
        dispatch('play/setConfig', { key: 'purchaseCondSort', val: cond.sort }, { root: true })
      }

      // 変更
      commit(types.UPDATE_CONDITIONS, cond)

      return true
    }

    return false
  },

  /**
   * 購入済み作品を検索
   */
  async search({ commit, state }, options) {
    // 非表示作品を除外
    const ignores = await this.dispatch('ignore/fetch')

    // 検索
    return purchase.search(assign({ ignores }, state.conditions), state.page).then(result => {
      // prefetchで0件ならcommitしないでsyncを待つ
      if (options && options.prefetch && result.total === 0) {
        return
      }

      commit(types.RECEIVE_SEARCH_RESULT, result)
    })
  },

  moreSearch({ commit, dispatch }) {
    commit(types.INCREMENT_PAGE)
    return dispatch('search')
  }
}

// mutations
const mutations = {
  // 同期中
  [types.WORK_SYNCING](state, bool) {
    state.workSyncing = bool
  },

  // 検索結果
  [types.RECEIVE_SEARCH_RESULT](state, result) {
    if (state.page === 0) {
      state.works = result.works
    } else {
      state.works = state.works.concat(result.works)
    }

    state.total = result.total
    state.workTypes = cat.formatWorkTypes(result.work_types)
    state.initialize = false
  },

  // 検索条件を更新
  [types.UPDATE_CONDITIONS](state, conditions) {
    forEach(state.works, work => {
      if (work.images) {
        forEach(work.images, val => {
          console.debug('revoke', val)
          window.URL.revokeObjectURL(val)
        })
      }
    })

    state.total = null
    state.page = 0
    // state.works = []
    state.conditions = conditions
  },

  // 次のページ
  [types.INCREMENT_PAGE](state) {
    state.page = state.page + 1
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
