import Vue from 'vue'
import axios from 'axios'
import * as types from '@/store/mutation-types'
import forEach from 'lodash/forEach'
import shuffle from 'lodash/shuffle'
import uniq from 'lodash/uniq'
import play from '@/store/modules/play'

// var
let $audio = null
let loadingTimer = null

const isPcChrome =
  navigator.userAgent.indexOf('Chrome') !== -1 &&
  (navigator.userAgent.indexOf('Windows') !== -1 || navigator.userAgent.indexOf('Mac OS') !== -1)

// initial state
const state = {
  // オーディオコンポーネント
  loading: false,
  playing: false,
  position: 0,
  _duration: null,

  // プレイリスト
  playlist: [],
  origin_playlist: [],
  index: null,

  // 設定
  config: {
    volume: 1,
    repeat: 'none',
    shuffle: false
  }
}

// getters
const getters = {
  // 現在セットされている曲情報を返す
  currItem: state => {
    return state.index !== null ? state.playlist[state.index] : {}
  },

  // メタデータが取得出来るまではplayfile情報を使う
  duration: state => {
    if (state._duration === null) {
      return state.index !== null ? state.playlist[state.index].duration : null
    } else {
      return state._duration
    }
  }
}

// actions
const actions = {
  /**
   * オーディオコンポーネント
   */

  // Audioを初期化してイベントをバインドする
  initialize({ rootState, dispatch, commit }) {
    $audio = new Audio()
    $audio.autoplay = false
    $audio.preload = 'auto'
    $audio.autobuffer = true
    $audio.playbackRate = 1

    $audio.addEventListener('timeupdate', () => {
      commit(types.DURATION, $audio.duration + 1)
      commit(types.POSITION, $audio.currentTime)
    })
    $audio.addEventListener('play', () => {
      commit(types.PLAYING, true)
    })
    $audio.addEventListener('pause', () => {
      commit(types.PLAYING, false)
    })
    $audio.addEventListener('ended', () => {
      dispatch('forward')
    })
    $audio.addEventListener('loadstart', () => {
      dispatch('startLoading')
    })
    $audio.addEventListener('wating', () => {
      dispatch('startLoading')
    })
    $audio.addEventListener('seeking', () => {
      dispatch('startLoading')
    })
    $audio.addEventListener('playing', () => {
      dispatch('LoadFinished')
    })
    $audio.addEventListener('suspend', () => {
      dispatch('LoadFinished')
    })
    $audio.addEventListener('seeked', () => {
      dispatch('LoadFinished')
    })
    $audio.addEventListener('canplay', () => {
      dispatch('LoadFinished')
    })

    // state初期化
    commit(types.SET_CONFIG, { key: 'repeat', val: rootState.play.config.audioRepeat || 'none' })
    commit(types.SET_CONFIG, { key: 'shuffle', val: rootState.play.config.audioShuffle || false })
    commit(types.SET_CONFIG, { key: 'volume', val: rootState.play.config.audioVolume || 1 })

    // Media Session API
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => {
        dispatch('play')
      })
      navigator.mediaSession.setActionHandler('pause', () => {
        dispatch('pause')
      })
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        dispatch('backward')
      })
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        dispatch('forward')
      })
      navigator.mediaSession.setActionHandler('seekbackward', () => {
        dispatch('seekBackward')
      })
      navigator.mediaSession.setActionHandler('seekforward', () => {
        dispatch('seekForward')
      })
    }
  },

  // データのロードが開始されたとき呼び出される
  startLoading({ state, commit }) {
    if (isPcChrome) {
      return
    }

    if (!state.loading) {
      // 300ms以内にfinishが呼ばれたらloading状態にしない
      clearTimeout(loadingTimer)
      loadingTimer = setTimeout(() => {
        commit(types.LOADING_STATUS, true)
      }, 300)
    }
  },

  // データのロードが終了したとき呼び出される
  LoadFinished({ state, commit }) {
    if (isPcChrome) {
      return
    }

    clearTimeout(loadingTimer)

    if (state.loading) {
      commit(types.LOADING_STATUS, false)
    }
  },

  // 再生開始
  play() {
    if (!$audio) {
      return false
    }

    $audio.play()
  },

  // 再生停止
  pause() {
    if (!$audio) {
      return false
    }

    $audio.pause()
  },

  stop() {
    $audio.pause()

    if (!isNaN($audio.duration)) {
      $audio.currentTime = 0
    }

    $audio._duration = null
  },

  // シーク
  seek({ commit }, position) {
    if (!$audio) {
      return false
    }

    if (!isNaN($audio.duration)) {
      $audio.currentTime = position
    }

    commit(types.POSITION, position)
  },

  // ボリューム設定
  volume({ dispatch, commit }, volume) {
    if (!$audio) {
      return false
    }

    $audio.volume = volume

    dispatch(
      'play/setConfig',
      {
        key: 'audioVolume',
        val: volume
      },
      { root: true }
    )

    commit(types.SET_CONFIG, { key: 'volume', val: volume })
  },

  // リセット
  reset({ dispatch, commit, state }, item) {
    $audio.pause()

    if (!isNaN($audio.duration)) {
      $audio.currentTime = 0
    }

    $audio._duration = null
    $audio.volume = state.config.volume

    if (isPcChrome && $audio.src) {
      window.URL.revokeObjectURL($audio.src)
    }

    // 曲ロード開始
    return dispatch(
      'work/getCacheFileUrl',
      {
        workno: item.workno,
        path: item.path
      },
      { root: true }
    ).then(fileUrl => {
      $audio.title = item.title

      // Media Session API
      if ('mediaSession' in navigator && window.MediaMetadata) {
        navigator.mediaSession.metadata = new window.MediaMetadata({
          title: item.title,
          artist: item.work_name,
          album: item.maker_name
          // artwork: [{ src: item.albumart }]
        })
      }

      commit(types.POSITION, 0)
      commit(types.DURATION, item.duration)

      if (isPcChrome) {
        commit(types.LOADING_STATUS, true)

        return axios
          .get(fileUrl, {
            responseType: 'blob'
          })
          .then(response => {
            if ($audio) {
              $audio.src = window.URL.createObjectURL(response.data)
              commit(types.LOADING_STATUS, false)
            }
          })
      } else {
        $audio.src = fileUrl
      }
    })
  },

  /**
   * プレイリスト操作
   */

  // プレイリストをセット
  setAudiolist({ state, dispatch, commit, rootState }, { audiolist, start }) {
    let worknos = uniq(audiolist.map(v => v.workno))
    let playlist = []
    let index = 0

    return Promise.all(
      worknos.map(workno =>
        dispatch(
          'work/openWorkData',
          { workno: workno, is_super_user: play.state.account.is_super_user },
          { root: true }
        )
      )
    ).then(() => {
      forEach(audiolist, v => {
        let meta = rootState.work.works[v.workno].meta
        let children = rootState.work.works[v.workno].tree.children
        let playfile = rootState.work.works[v.workno].tree.playfile
        let filename = v.src.split('/').pop()
        let item = null

        // 階層移動
        forEach(v.src.trim('/').split('/'), name => {
          forEach(children, item => {
            if (item.name === name && item.children) {
              children = item.children
              return false
            }
          })
        })

        // アイテム特定
        item = children.find(data => data.name === filename)

        // プレイリストを生成
        if (item && playfile[item.hashname] && playfile[item.hashname].audio) {
          playfile = playfile[item.hashname].audio.optimized

          playlist.push({
            playlist_id: v.playlist_id,
            workno: v.workno,
            hashname: item.hashname,
            src: v.src,
            path: 'optimized/' + playfile.name,
            title: filename,
            work_name: meta.work_name,
            maker_name: meta.maker_name,
            duration: playfile.duration
          })
        }
      })

      index = playlist.findIndex(data => data.playlist_id === start)

      commit(types.SET_ORIGIN_PLAYLIST, playlist)

      // シャッフル
      if (state.config.shuffle) {
        const indexTrack = state.origin_playlist[index]

        let newPlaylist = shuffle(state.origin_playlist.filter((data, i) => i !== index))

        index = 0

        // 現在再生しているトラックを1曲目にして、残りはシャッフル
        commit(types.SET_PLAYLIST, [indexTrack, ...newPlaylist])
      } else {
        commit(types.SET_PLAYLIST, playlist)
      }

      return dispatch('load', index)
    })
  },

  // プレイリスト位置を指定して曲をセット
  load({ state, dispatch, commit }, index) {
    commit(types.SET_INDEX, index)

    return dispatch('reset', state.playlist[index])
  },

  // 1曲戻る
  backward({ state, dispatch }) {
    // 1曲リピート
    let index = state.index

    // プレイリストリピート
    if (state.config.repeat === 'playlist') {
      index = state.index - 1
      index = index < 0 ? state.playlist.length - 1 : index

      // リピートしない
    } else if (state.config.repeat === 'none') {
      index = state.index - 1

      if (index < 0) {
        return dispatch('stop')
      }
    }

    return dispatch('load', index).then(() => {
      dispatch('play')
    })
  },

  // 1曲進む
  forward({ state, dispatch }) {
    // 1曲リピート
    let index = state.index

    // プレイリストリピート
    if (state.config.repeat === 'playlist') {
      index = state.index + 1
      index = index >= state.playlist.length ? 0 : index

      // リピートしない
    } else if (state.config.repeat === 'none') {
      index = state.index + 1

      if (index >= state.playlist.length) {
        return dispatch('stop')
      }
    }

    return dispatch('load', index).then(() => {
      dispatch('play')
    })
  },

  // 指定秒数だけ巻き戻し
  seekBackward({ commit }) {
    if (!$audio) {
      return false
    }

    if (!isNaN($audio.duration)) {
      const seekTime =
        play.state.config.audioSeekTime < $audio.currentTime ? play.state.config.audioSeekTime : $audio.currentTime
      $audio.currentTime = $audio.currentTime - seekTime
    }

    commit(types.POSITION, $audio.currentTime)
  },

  // 指定秒数だけ先送り
  seekForward({ commit }) {
    if (!$audio) {
      return false
    }

    if (!isNaN($audio.duration)) {
      const remainingTime = $audio.duration - $audio.currentTime
      const seekTime = play.state.config.audioSeekTime < remainingTime ? play.state.config.audioSeekTime : remainingTime
      $audio.currentTime = $audio.currentTime + seekTime
    }

    commit(types.POSITION, $audio.currentTime)
  },

  // リピートを設定 （なし => 全曲 => 1曲 => なし => ...）
  setRepeat({ state, dispatch, commit }) {
    let type = 'playlist'

    if (state.config.repeat === 'playlist') {
      type = 'song'
    }

    if (state.config.repeat === 'song') {
      type = 'none'
    }

    dispatch(
      'play/setConfig',
      {
        key: 'audioRepeat',
        val: type
      },
      { root: true }
    )

    commit(types.SET_CONFIG, { key: 'repeat', val: type })
  },

  // プレイリストをシャッフル
  shufflePlaylist({ state, dispatch, commit }, isShuffle) {
    let index = 0
    const indexTrack = state.playlist[state.index]

    if (isShuffle) {
      let playlist = shuffle(state.playlist.filter((data, i) => i !== state.index))

      // 現在再生しているトラックを1曲目にして、残りはシャッフル
      commit(types.SET_PLAYLIST, [indexTrack, ...playlist])
    } else {
      index = state.origin_playlist.findIndex(n => n.path === indexTrack.path)

      // 元々のプレイリストの順序にする
      commit(types.SET_PLAYLIST, state.origin_playlist)
    }

    return dispatch('load', index).then(() => {
      dispatch('play')
    })
  },

  // シャッフルを設定
  setShuffle({ dispatch, commit }, isShuffle) {
    dispatch('shufflePlaylist', isShuffle)

    dispatch(
      'play/setConfig',
      {
        key: 'audioShuffle',
        val: isShuffle
      },
      { root: true }
    )

    commit(types.SET_CONFIG, { key: 'shuffle', val: isShuffle })
  }
}

// mutations
const mutations = {
  // ローディング状態が変更
  [types.LOADING_STATUS](state, loading) {
    state.loading = loading
  },

  // 曲再生位置が変更
  [types.POSITION](state, position) {
    state.position = position
  },

  // 曲長さが変更
  [types.DURATION](state, duration) {
    state._duration = duration + 0.5
  },

  // 曲再生状態が変更
  [types.PLAYING](state, playing) {
    state.playing = playing

    // Media Session API
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = playing ? 'playing' : 'paused'
    }
  },

  // プレイリストが変更
  [types.SET_PLAYLIST](state, playlist) {
    state.index = null
    state.playlist = playlist
  },

  // 元々のプレイリストをセット
  [types.SET_ORIGIN_PLAYLIST](state, playlist) {
    state.origin_playlist = playlist
  },

  // プレイリスト位置が変更
  [types.SET_INDEX](state, index) {
    state.index = index
  },

  // 設定が変更
  [types.SET_CONFIG](state, { key, val }) {
    Vue.set(state.config, key, val)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
