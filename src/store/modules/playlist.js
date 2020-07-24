import Vue from 'vue'
import * as types from '@/store/mutation-types'
import naturalSort from 'natural-compare-lite'
import work from '@/classes/work'
import playlist from '@/classes/playlist'
import i18n from '@/i18n'
import forEach from 'lodash/forEach'
import pull from 'lodash/pull'
import map from 'lodash/map'
import uniq from 'lodash/uniq'
import filter from 'lodash/filter'
import cloneDeep from 'lodash/cloneDeep'

// initial state
const state = {
  playlists: null,
  playlistWorks: {}
}

// getters
const getters = {
  playlistInfo: state => {
    if (state.playlists) {
      let playlistInfo = []

      forEach(state.playlists, playlist => {
        playlistInfo.push({
          id: playlist.id,
          playlist_name: playlist.playlist_name,
          worknos: uniq(playlist.playlist_audio_id.map(v => playlist.playlist_audio_map[v].workno)),
          count: playlist.playlist_audio_id.length
        })
      })

      // 自然順ソート
      playlistInfo = playlistInfo.sort((a, b) => {
        return naturalSort(a.playlist_name, b.playlist_name)
      })

      return playlistInfo
    } else {
      return null
    }
  }
}

// actions
const actions = {
  syncPlaylist({ commit }) {
    return playlist
      .syncPlaylist()
      .then(() => {
        return playlist.getPlaylist()
      })
      .catch(() => {
        return playlist.getPlaylist()
      })
      .then(playlists => {
        commit(types.RECEIVE_PLAYLIST, playlists)
      })
  },

  openPlaylist({ state, commit }, playlistId) {
    if (!state.playlists[playlistId]) {
      return Promise.reject(new Error('no list'))
    }

    let worknos = uniq(map(state.playlists[playlistId].playlist_audio_map, v => v.workno))

    return work.getMeta(worknos).then(meta => {
      let works = {}

      forEach(meta, v => {
        works[v.workno] = v
      })

      commit(types.RECEIVE_PLAYLIST_WORK, { playlistId, works })
    })
  },

  closePlaylist({ commit }, playlistId) {
    commit(types.CLOSE_PLAYLIST, playlistId)
  },

  updatePlaylist({ dispatch, commit }, payload) {
    // 作成
    if (payload.type === 'create') {
      if (!payload.playlist_name || payload.playlist_name === '') {
        return Promise.reject(new Error('empty'))
      }

      // 削除
    } else if (payload.type === 'delete') {
      commit(types.UPDATE_PLAYLIST, { playlistId: payload.playlist_id, playlist: null })

      // リネーム
    } else if (payload.type === 'rename') {
      let playlistClone = cloneDeep(state.playlists[payload.playlist_id])
      playlistClone.playlist_name = payload.playlist_name

      commit(types.UPDATE_PLAYLIST, { playlistId: payload.playlist_id, playlist: playlistClone })
    }

    // API通信
    return playlist.updatePlaylist(payload).then(data => {
      if (payload.type === 'create') {
        return dispatch('syncPlaylist').then(() => {
          // DB側のmasterとslaveの同期が間に合っていない場合は、空のプレイリストを作成
          if (!Object.prototype.hasOwnProperty.call(state.playlists, data.playlist_id)) {
            const newPlaylist = {
              id: data.playlist_id,
              insert_date: new Date().getTime(),
              playlist_name: i18n.t('playlist.new_playlist'),
              playlist_audio_id: [],
              playlist_audio_map: {}
            }

            commit(types.INSERT_PLAYLIST, { [data.playlist_id]: newPlaylist })
          }

          return data
        })
      } else {
        return data
      }
    })
  },

  // プレイリスト音声を更新する
  updatePlaylistAudio({ state, commit }, payload) {
    if (!state.playlists[payload.playlist_id]) {
      return Promise.reject(new Error('unknown playlist'))
    }

    // vuex storeを即時更新する
    let playlistClone = cloneDeep(state.playlists[payload.playlist_id])
    let playlistRollback = cloneDeep(state.playlists[payload.playlist_id])
    let uniqKey = 'tmp' + Number(new Date())

    // 順序
    if (payload.type === 'order') {
      playlistClone.playlist_audio_id = payload.new_order

      // 削除
    } else if (payload.type === 'delete') {
      playlistClone.playlist_audio_id = filter(playlistClone.playlist_audio_id, id => {
        return id !== payload.playlist_audio_id
      })

      delete playlistClone.playlist_audio_map[payload.playlist_audio_id]

      // 追加
    } else if (payload.type === 'add') {
      // 通信が完了するまでテンポラリとして突っ込んでおく
      playlistClone.playlist_audio_id.push(uniqKey)
      playlistClone.playlist_audio_map[uniqKey] = {
        workno: payload.workno,
        src: payload.src
      }
    }

    commit(types.UPDATE_PLAYLIST, { playlistId: payload.playlist_id, playlist: playlistClone })

    // API通信
    return playlist
      .updatePlaylistAudio(payload)
      .then(data => {
        // 追加の場合はplaylistAudioIdを正しい値に更新
        if (payload.type === 'add') {
          let playlistClone = cloneDeep(state.playlists[payload.playlist_id])

          // テンポラリデータを削除
          pull(playlistClone.playlist_audio_id, uniqKey)
          delete playlistClone.playlist_audio_map[uniqKey]

          // 正しいデータを入れ直す
          playlistClone.playlist_audio_id.push(data.playlist_audio_id)
          playlistClone.playlist_audio_map[data.playlist_audio_id] = {
            workno: payload.workno,
            src: payload.src
          }

          commit(types.UPDATE_PLAYLIST, { playlistId: payload.playlist_id, playlist: playlistClone })
        }
      })
      .catch(e => {
        // 失敗したらロールバックする
        commit(types.UPDATE_PLAYLIST, { playlistId: payload.playlist_id, playlist: playlistRollback })

        throw e
      })
  }
}

// mutations
const mutations = {
  [types.RECEIVE_PLAYLIST](state, playlists) {
    state.playlists = playlists
  },

  [types.INSERT_PLAYLIST](state, playlist) {
    state.playlists = { ...state.playlists, ...playlist }
  },

  [types.UPDATE_PLAYLIST](state, { playlistId, playlist }) {
    if (playlist === null) {
      Vue.delete(state.playlists, playlistId)
    } else {
      Vue.set(state.playlists, playlistId, playlist)
    }
  },

  [types.RECEIVE_PLAYLIST_WORK](state, { playlistId, works }) {
    Vue.set(state.playlistWorks, playlistId, works)
  },

  [types.CLOSE_PLAYLIST](state, playlistId) {
    Vue.delete(state.playlistWorks, playlistId)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
