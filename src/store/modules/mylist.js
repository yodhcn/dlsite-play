import Vue from 'vue'
import * as types from '@/store/mutation-types'
import naturalSort from 'natural-compare-lite'
import work from '@/classes/work'
import mylist from '@/classes/mylist'
import i18n from '@/i18n'
import forEach from 'lodash/forEach'
import pull from 'lodash/pull'
import uniq from 'lodash/uniq'
import values from 'lodash/values'
import filter from 'lodash/filter'
import cloneDeep from 'lodash/cloneDeep'

// initial state
const state = {
  mylists: null,
  mylistWorks: {}
}

// getters
const getters = {
  mylistInfo: state => {
    if (state.mylists) {
      let mylistInfo = []

      forEach(state.mylists, mylist => {
        mylistInfo.push({
          id: mylist.id,
          mylist_name: mylist.mylist_name,
          worknos: uniq(mylist.mylist_work_id.map(v => mylist.mylist_work_map[v])),
          count: mylist.mylist_work_id.length
        })
      })

      // 自然順ソート
      mylistInfo = mylistInfo.sort((a, b) => {
        return naturalSort(a.mylist_name, b.mylist_name)
      })

      return mylistInfo
    } else {
      return null
    }
  }
}

// actions
const actions = {
  syncMylist({ commit }) {
    return mylist
      .syncMylist()
      .then(() => {
        return mylist.getMylist()
      })
      .catch(() => {
        return mylist.getMylist()
      })
      .then(mylists => {
        commit(types.RECEIVE_MYLIST, mylists)
      })
  },

  openMylist({ state, commit }, mylistId) {
    if (!state.mylists[mylistId]) {
      return Promise.reject(new Error('no list'))
    }

    let worknos = uniq(values(state.mylists[mylistId].mylist_work_map))

    return work.getMeta(worknos).then(meta => {
      let works = {}

      forEach(meta, v => {
        works[v.workno] = v
      })

      commit(types.RECEIVE_MYLIST_WORK, { mylistId, works })
    })
  },

  closeMylist({ commit }, mylistId) {
    commit(types.CLOSE_MYLIST, mylistId)
  },

  updateMylist({ dispatch, commit }, payload) {
    // 作成
    if (payload.type === 'create') {
      if (!payload.mylist_name || payload.mylist_name === '') {
        return Promise.reject(new Error('empty'))
      }

      // 削除
    } else if (payload.type === 'delete') {
      commit(types.UPDATE_MYLIST, { mylistId: payload.mylist_id, mylist: null })

      // リネーム
    } else if (payload.type === 'rename') {
      let mylistClone = cloneDeep(state.mylists[payload.mylist_id])
      mylistClone.mylist_name = payload.mylist_name

      commit(types.UPDATE_MYLIST, { mylistId: payload.mylist_id, mylist: mylistClone })
    }

    // API通信
    return mylist.updateMylist(payload).then(data => {
      if (payload.type === 'create') {
        return dispatch('syncMylist').then(() => {
          // DB側のmasterとslaveの同期が間に合っていない場合は、空のマイリストを作成
          if (!Object.prototype.hasOwnProperty.call(state.mylists, data.mylist_id)) {
            const newMylist = {
              id: data.mylist_id,
              insert_date: new Date().getTime(),
              mylist_name: i18n.t('mylist.new_mylist'),
              mylist_work_id: [],
              mylist_work_map: {}
            }

            commit(types.INSERT_MYLIST, { [data.mylist_id]: newMylist })
          }

          return data
        })
      } else {
        return data
      }
    })
  },

  // マイリスト作品を更新する
  updateMylistWork({ state, commit }, payload) {
    if (!state.mylists[payload.mylist_id]) {
      return Promise.reject(new Error('unknown mylist'))
    }

    // vuex storeを即時更新する
    let mylistClone = cloneDeep(state.mylists[payload.mylist_id])
    let mylistRollback = cloneDeep(state.mylists[payload.mylist_id])
    let uniqKey = 'tmp' + Number(new Date())

    // 順序
    if (payload.type === 'order') {
      mylistClone.mylist_work_id = payload.new_order

      // 削除
    } else if (payload.type === 'delete') {
      mylistClone.mylist_work_id = filter(mylistClone.mylist_work_id, id => {
        return id !== payload.mylist_work_id
      })

      delete mylistClone.mylist_work_map[payload.mylist_work_id]

      // 追加
    } else if (payload.type === 'add') {
      // 通信が完了するまでテンポラリとして突っ込んでおく
      mylistClone.mylist_work_id.push(uniqKey)
      mylistClone.mylist_work_map[uniqKey] = payload.workno
    }

    commit(types.UPDATE_MYLIST, { mylistId: payload.mylist_id, mylist: mylistClone })

    // API通信
    return mylist
      .updateMylistWork(payload)
      .then(data => {
        // 追加の場合はmylistWorkIdを正しい値に更新
        if (payload.type === 'add') {
          let mylistClone = cloneDeep(state.mylists[payload.mylist_id])

          // テンポラリデータを削除
          pull(mylistClone.mylist_work_id, uniqKey)
          delete mylistClone.mylist_work_map[uniqKey]

          // 正しいデータを入れ直す
          mylistClone.mylist_work_id.push(data.mylist_work_id)
          mylistClone.mylist_work_map[data.mylist_work_id] = payload.workno
          commit(types.UPDATE_MYLIST, { mylistId: payload.mylist_id, mylist: mylistClone })
        }
      })
      .catch(e => {
        // 失敗したらロールバックする
        commit(types.UPDATE_MYLIST, { mylistId: payload.mylist_id, mylist: mylistRollback })

        throw e
      })
  }
}

// mutations
const mutations = {
  [types.RECEIVE_MYLIST](state, mylists) {
    state.mylists = mylists
  },

  [types.INSERT_MYLIST](state, mylist) {
    state.mylists = { ...state.mylists, ...mylist }
  },

  [types.UPDATE_MYLIST](state, { mylistId, mylist }) {
    if (mylist === null) {
      Vue.delete(state.mylists, mylistId)
    } else {
      Vue.set(state.mylists, mylistId, mylist)
    }
  },

  [types.RECEIVE_MYLIST_WORK](state, { mylistId, works }) {
    Vue.set(state.mylistWorks, mylistId, works)
  },

  [types.CLOSE_MYLIST](state, mylistId) {
    Vue.delete(state.mylistWorks, mylistId)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
