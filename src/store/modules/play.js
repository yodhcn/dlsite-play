import Vue from 'vue'
// import * as Sentry from '@sentry/browser'
import * as types from '@/store/mutation-types'
import db from '@/store/database'
import api from '@/store/api'
import cloneDeep from 'lodash/cloneDeep'
import forEach from 'lodash/forEach'
// import i18n from '@/i18n'
import Storage from '@/utils/storage'

// initial state
const state = {
  account: null,
  config: {
    // app
    appMenuCollapse: false,
    isPrivateMode: false,
    supportBlob: false,

    // library
    hideenNotPlayWork: false,
    hideRecommendations: false,

    // storage
    workImageThumbCahce: true,

    // purchase
    lastSyncDatetime: null,
    purchaseCondFilter: 'all',
    purchaseCondSort: 'purchase',
    purchaseImageType: 'thumb',

    // image viewer
    photoFrontSingle: true,
    photoSpreadView: true,
    photoMoveAnimation: true,
    photoAutoNextTime: 3,

    // video viewer
    isLoopVideo: false,

    // audio player
    audioSeekTime: 10
  }
}

// actions
const actions = {
  initialize({ state, commit, dispatch }) {
    return dispatch('getAuthorize')
      .then(() => {
        /* Sentry.configureScope(scope => {
          scope.setUser({
            id: state.account.customer_id,
            login_id: state.account.login_id,
            production_id: state.account.production_id,
            is_super_user: state.account.is_super_user,
            sid: state.account.sid
          })

          scope.setTag('locale', i18n.locale)

          scope.setExtra('Window', {
            outerWidth,
            outerHeight,
            navigator: {
              cookieEnabled: navigator.cookieEnabled,
              language:
                (navigator.languages && navigator.languages[0]) || navigator.language || navigator.browserLanguage
            }
          })
        }) */

        return db.connect(state.account)
      })
      .then(() => {
        return db.lfdb
          .select()
          .from(db.table.config)
          .exec()
      })
      .then(res => {
        let config = cloneDeep(state.config)

        forEach(res, v => {
          config[v.key] = v.val
        })

        config.supportBlob = db.supportBlob
        config.isPrivateMode = db.isPrivateMode

        /* Sentry.configureScope(scope => {
          scope.setExtra('DB', {
            privateMode: db.isPrivateMode,
            supportIndexedDB: db.supportIndexedDb,
            supportBlob: db.supportBlob
          })
        }) */

        // global config
        commit(types.RECEIVE_CONFIG, config)
      })
  },

  /**
   * ログイン情報を取得 (获取登录信息)
   * @param function commit
   * @returns {Promise}
   * @throws {Error} error.message = (string) statusCode
   */
  getAuthorize({ commit }) {
    const local = Storage.getItem('play')

    return api
      .get('/api/dlsite/authorize')
      .then(res => {
        if (res.data.production_id || res.data.customer_id) {
          Storage.setItem('play', res.data)
          commit(types.RECEIVE_ACCOUNT, res.data)
        } else {
          throw new Error('401')
        }
      })
      .catch(e => {
        // 401が返ってきたらローカルを削除 (如果返回401, 则删除local数据)
        if (e.response && e.response.status === 401) {
          Storage.removeItem('play')
          commit(types.RECEIVE_ACCOUNT, null)
          throw new Error(e.response.status)

          // オフラインかつローカルがあればそれを使う (如果离线且local数据存在, 则使用local数据)
        } else if (e.message === 'offline' && local) {
          commit(types.RECEIVE_ACCOUNT, local)

          // なければエラー (否则抛出错误)
        } else {
          if (e.response && e.response.status) {
            throw new Error(e.response.status)
          } else {
            throw e
          }
        }
      })
  },

  clearAuthorize({ commit }) {
    Storage.removeItem('play')
    commit(types.RECEIVE_ACCOUNT, null)
  },

  setConfig({ commit }, { key, val }) {
    commit(types.UPDATE_CONFIG, { key, val })

    let row = db.table.config.createRow({
      key,
      val
    })

    return db.lfdb
      .insertOrReplace()
      .into(db.table.config)
      .values([row])
      .exec()
      .then(res => {
        return res && res.length > 0
      })
  },

  /**
   * データベースを削除する
   */
  deleteDatabase({ state }) {
    let DB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
    let DBDeleteRequest = DB.deleteDatabase(state.customerId)

    DBDeleteRequest.onerror = () => {
      window.alert('Error deleting database.')
    }

    DBDeleteRequest.onsuccess = () => {
      window.alert('Database deleted successfully')
    }
  }
}

// mutations
const mutations = {
  // アカウント情報を取得
  [types.RECEIVE_ACCOUNT](state, account) {
    Vue.set(state, 'account', account)
  },

  // configを初期化
  [types.RECEIVE_CONFIG](state, config) {
    Vue.set(state, 'config', config)
  },

  // configをアップデート
  [types.UPDATE_CONFIG](state, { key, val }) {
    Vue.set(state.config, key, val)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
