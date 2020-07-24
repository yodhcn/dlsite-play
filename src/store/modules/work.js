import Vue from 'vue'
import * as types from '@/store/mutation-types'
import forEach from 'lodash/forEach'
import filter from 'lodash/filter'
import sum from 'lodash/sum'
// import uniq from 'lodash/uniq'
import uniqBy from 'lodash/uniqBy'
// import indexOf from 'lodash/indexOf'
import cloneDeepWith from 'lodash/cloneDeepWith'
import work from '@/classes/work'
import moment from 'moment'

const promiseCache = {}

// initial state
const state = {
  images: {},
  works: {
    /*
     workno: {
      meta: {}
      tree: {}
      cacheFile: {},
      cacheFileStatus: {}
    }
*/
  },
  cacheFileInfo: null,
  cacheFileQueue: [],
  cacheFileIndex: 0,
  cacheFileQueueInfo: {}
}

// getters
const getters = {
  // 指定されたファイルがキャッシュ済みかどうか返す
  isCached: state => (workno, hashname) => {
    if (!state.works[workno]) {
      return null
    }

    let isCached = true
    let playfiles = []

    // hashname stringが渡されたとき
    if (typeof hashname === 'string') {
      let files = work.getDownloadFiles(workno, state.works[workno].tree.playfile[hashname])

      if (files.length > 0) {
        playfiles.push(files)
      }

      // childrenが渡されたとき
    } else {
      // childrenからhashnameを抽出する
      cloneDeepWith(hashname, val => {
        if (val.type === 'file' && val.hashname) {
          if (state.works[workno].tree.playfile[val.hashname]) {
            let files = work.getDownloadFiles(workno, state.works[workno].tree.playfile[val.hashname])

            if (files.length > 0) {
              playfiles.push(files)
            }
          }
        }
      })
    }

    if (playfiles.length === 0) {
      return false
    }

    // チェック
    forEach(playfiles, files => {
      forEach(files, file => {
        if (!(state.works[workno] && state.works[workno].cacheFile && state.works[workno].cacheFile[file.path])) {
          isCached = false
          return false
        }
      })
    })

    return isCached
  },

  // 指定されたファイルのダウンロード状態を返す
  isCacheQueued: state => (workno, hashname) => {
    return (state.works[workno].cacheFileStatus && state.works[workno].cacheFileStatus[hashname]) || {}
  }
}

// actions
const actions = {
  /**
   * workdataを準備
   */
  openWorkData({ state, commit, dispatch }, { workno, is_super_user }) {
    if (state.works[workno]) {
      return Promise.resolve(workno)
    } else {
      commit(types.OPEN_WORK_DATA, { workno })
    }

    return work
      .getMeta([workno])
      .then(meta => {
        meta = meta[0]

        // Admin Userの場合
        if (is_super_user && meta === undefined) {
          meta = {
            workno: workno,
            purchase_type: 1,
            work_name: workno,
            maker_name: '特権アカウント',
            work_type: 'ET3',
            is_playwork: true
          }
        }

        // 予約特典 暫定対応
        if (meta.workno === 'VJ012361') {
          meta.regist_date = meta.download_start_date = moment('Fri, 22 Feb 2019 00:00:00 +0900')
            .toDate()
            .getTime()
        }

        commit(types.RECEIVE_META, { workno, meta })

        if (!state.works[workno].meta) {
          return Promise.reject(new Error('failed'))
        }

        return Promise.all([
          state.works[workno].meta.is_playwork ? dispatch('_getZiptree', workno) : null,
          dispatch('_getCacheFileList', workno)
        ])
      })
      .then(() => {
        return workno
      })
  },

  /**
   * workdataのリソースを開放
   */
  closeWorkData() {
    // let playlistWorkno = uniq(rootState.audio.playlist.map(v => v.workno))
    // let downloadQueueWorkno = uniq(rootState.work.cacheFileQueue.map(v => v.workno))
    // if (indexOf(playlistWorkno, workno) === -1 && indexOf(downloadQueueWorkno, workno) === -1) {
    //   commit(types.CLOSE_WORK_DATA, { workno })
    // }
  },

  /**
   * ziptreeを取得
   */
  _getZiptree({ commit }, workno) {
    return work.getZiptree(workno).then(ziptree => {
      commit(types.RECEIVE_ZIPTREE, { workno, ziptree })
    })
  },

  /**
   * 画像を取得
   */
  getImages({ state, commit }, { workno, imageTypes }) {
    let items
    let _workno = []

    forEach(workno, v => {
      forEach(imageTypes, t => {
        if (!state.images[v + '/' + t]) {
          _workno.push(v)
        }
      })
    })

    if (_workno.length === 0) {
      return
    }

    return work
      .getMeta(_workno, true)
      .then(_items => {
        items = _items
        return work.getCahceImages(
          _items.map(v => v.workno),
          imageTypes
        )
      })
      .then(blobs => {
        let images = []

        // 画像取得処理
        forEach(items, meta => {
          forEach(imageTypes, type => {
            let key = meta.workno + '/' + type

            // 生成済みなら何もしない
            if (state.images[key]) {
              return true

              // 取得済みならobjectURLを生成
            } else if (blobs[meta.workno] && blobs[meta.workno][type]) {
              images.push({
                key,
                objectUrl:
                  typeof blob === 'string'
                    ? blobs[meta.workno][type]
                    : window.URL.createObjectURL(blobs[meta.workno][type])
              })

              // なければ取得
            } else if (meta.work_files[type]) {
              work.getImage(meta.workno, type, meta.work_files[type]).then(blob => {
                commit(types.GET_WORK_IMAGE, [
                  {
                    key,
                    objectUrl: typeof blob === 'string' ? blob : window.URL.createObjectURL(blob)
                  }
                ])
              })
            }
          })
        })

        if (images.length > 0) {
          commit(types.GET_WORK_IMAGE, images)
        }
      })
  },

  /**
   * cacheFileリストを取得
   */
  _getCacheFileList({ commit }, workno) {
    return work.getCacheFileList(workno).then(cacheFileList => {
      commit(types.ADD_CACHE_FILE_LIST, { workno, cacheFileList, clear: true })
    })
  },

  /**
   * cacheFileのあるWorkリストを取得
   */
  getCacheFileInfo({ commit }) {
    return work.getCacheFileInfo().then(info => {
      commit(types.RECIVE_CACHE_FILE_INFO, { info })
    })
  },

  /**
   * cacheFileを削除
   */
  deleteCacheFile({ dispatch }, workno) {
    return work.deleteCacheFile(workno).then(() => {
      return dispatch('getCacheFileInfo')
    })
  },

  /**
   * 画像キャッシュを削除
   */
  deleteImageCache({ dispatch }) {
    return work.deleteImageCache().then(() => {
      return dispatch('getCacheFileInfo')
    })
  },

  /**
   * システムキャッシュを削除
   */
  // deleteSystemCache ({ dispatch }) {
  //   return work.deleteSystemCache()
  // },

  /**
   * 全てのデータを削除
   */
  deleteAllCacheFile({ dispatch }) {
    return work.deleteAllCacheFile().then(() => {
      return dispatch('getCacheFileInfo')
    })
  },

  /**
   * cacheFileQueueにplayfileを追加
   */
  addCacheFileQueue({ state, getters, commit }, items) {
    items = filter(items, item => {
      // ダウンロード済みのアイテムを除外
      if (getters.isCached(item.workno, item.hashname)) {
        return false
      }

      // キューに入っているアイテムを除外
      if (state.works[item.workno] && state.works[item.workno].cacheFileStatus[item.hashname]) {
        return false
      }

      return true
    })

    // 重複アイテムを除外
    items = uniqBy(items, 'hashname')

    if (items.length > 0) {
      forEach(items, item => {
        item.files = work.getDownloadFiles(item.workno, state.works[item.workno].tree.playfile[item.hashname])
      })

      commit(types.ADD_CACHE_FILE_QUEUE, items)
    }
  },

  clearCacheFileQueue({ commit }) {
    commit(types.COMPLETE_CACHE_FILE_QUEUE)
  },

  /**
   * cacheFileQueueの処理を開始
   */
  startCacheFileQueue({ state, dispatch }) {
    if (state.cacheFileQueue.length === 0 || promiseCache.cacheFileQueue) {
      return Promise.resolve()
    }

    promiseCache.cacheFileQueue = new Promise((resolve, reject) => {
      promiseCache.cacheFileQueueResolve = resolve
      promiseCache.cacheFileQueueReject = reject
    })
      .catch(e => {
        delete promiseCache.cacheFileQueueResolve
        delete promiseCache.cacheFileQueueReject
        delete promiseCache.cacheFileQueue
        return Promise.reject(e)
      })
      .then(() => {
        delete promiseCache.cacheFileQueueResolve
        delete promiseCache.cacheFileQueueReject
        delete promiseCache.cacheFileQueue
        console.log('complete queue')
      })

    dispatch('_shiftCacheFileQueue')

    return promiseCache.cacheFileQueue
  },

  // ダウンロード再帰
  _shiftCacheFileQueue({ state, commit, dispatch }) {
    let item = state.cacheFileQueue[state.cacheFileIndex]

    // ファイルをダウンロード
    work
      .downloadItem({
        workno: item.workno,
        hashname: item.hashname,
        files: item.files,
        progress: function(workno, hashname, loaded, total) {
          commit(types.UPDATE_CACHE_FILE_STATUS, { workno, hashname, loaded, total })
        }
      })
      .then(() => {
        commit(types.ADD_CACHE_FILE_LIST, { workno: item.workno, cacheFileList: item.files.map(v => v.path) })

        setTimeout(() => {
          // cacheFileQueueが空になったら再帰を終了
          if (state.cacheFileIndex + 1 >= state.cacheFileQueue.length) {
            commit(types.COMPLETE_CACHE_FILE_QUEUE)
            return promiseCache.cacheFileQueueResolve()
          } else {
            commit(types.SHIFT_CACHE_FILE_QUEUE, { workno: item.workno, hashname: item.hashname })
            dispatch('_shiftCacheFileQueue')
          }
        }, 30)
      })
      .catch(e => {
        promiseCache.cacheFileQueueReject(e)
      })
  },

  /**
   * cacheFileUrlを返す
   */
  getCacheFileUrl({ commit }, { workno, path }) {
    // ダウンロードされてなければURLを返す
    if (!(state.works[workno] && state.works[workno].cacheFile && state.works[workno].cacheFile[path])) {
      return work.getFileUrl(workno, path)
    }

    let id = workno + '/' + path

    // databaseから取得中
    if (promiseCache[id]) {
      return promiseCache[id]
    }

    // 既にダウンロード済み
    if (state.works[workno] && state.works[workno].cacheFile && state.works[workno].cacheFile[path]) {
      let file = state.works[workno].cacheFile[path]

      // objectUrl生成済み
      if (typeof file === 'string') {
        return Promise.resolve(file)

        // objectUrlを生成する
      } else {
        promiseCache[id] = work.getCacheFile(workno, id).then(blob => {
          let objectUrl = window.URL.createObjectURL(blob)
          commit(types.UPDATE_CACHE_FILE_URL, { workno, path, objectUrl })

          delete promiseCache[id]
          return objectUrl
        })

        return promiseCache[id]
      }
    }
  }
}

// mutations
const mutations = {
  // get image
  [types.GET_WORK_IMAGE](state, images) {
    forEach(images, v => {
      Vue.set(state.images, v.key, v.objectUrl)
    })
  },

  // workdataをopen
  [types.OPEN_WORK_DATA](state, { workno }) {
    Vue.set(state.works, workno, {
      meta: null,
      tree: null,
      cacheFile: {},
      cacheFileStatus: {}
    })
  },

  // workdataをclose
  [types.CLOSE_WORK_DATA](state, { workno }) {
    // objectUrlがあったら開放する
    forEach(state.works[workno].cacheFile, objectUrl => {
      if (typeof objectUrl === 'string') {
        console.debug('revoke', objectUrl)
        window.URL.revokeObjectURL(objectUrl)
      }
    })

    forEach(state.works[workno].meta.images, objectUrl => {
      if (typeof objectUrl === 'string') {
        console.debug('revoke', objectUrl)
        window.URL.revokeObjectURL(objectUrl)
      }
    })

    Vue.delete(state.works, workno)
  },

  // メタデータを受信
  [types.RECEIVE_META](state, { workno, meta }) {
    Vue.set(state.works[workno], 'meta', meta)
  },

  // ziptreeを受信
  [types.RECEIVE_ZIPTREE](state, { workno, ziptree }) {
    Vue.set(state.works[workno], 'tree', {
      hash: ziptree.hash,
      updated_at: ziptree.updated_at,
      children: ziptree.tree,
      playfile: ziptree.playfile
    })
  },

  // キャッシュ済みリストに追加
  [types.ADD_CACHE_FILE_LIST](state, { workno, cacheFileList, clear }) {
    if (clear) {
      Vue.set(state.works[workno], 'cacheFile', {})
    }

    forEach(cacheFileList, path => {
      Vue.set(state.works[workno].cacheFile, path, true)
    })
  },

  // cacheFileUrlを受信
  [types.UPDATE_CACHE_FILE_URL](state, { workno, path, objectUrl }) {
    Vue.set(state.works[workno].cacheFile, path, objectUrl)
  },

  // ダウンロードキューに追加
  [types.ADD_CACHE_FILE_QUEUE](state, items) {
    forEach(items, item => {
      // キューに追加
      state.cacheFileQueue.push(item)

      // ダウンロード情報を更新
      Vue.set(state.works[item.workno].cacheFileStatus, item.hashname, {
        status: 'waiting',
        loaded: 0,
        total: sum(item.files.map(v => v.length || 0)),
        progress: null
      })
    })

    // ダウンロードキュー情報を更新
    let total = 0

    forEach(state.cacheFileQueue, item => {
      total += state.works[item.workno].cacheFileStatus[item.hashname].total
    })

    Vue.set(state.cacheFileQueueInfo, 'total', total)
  },

  // ダウンロード情報を更新
  [types.UPDATE_CACHE_FILE_STATUS](state, { workno, hashname, loaded, total }) {
    let progress = loaded / total

    if (state.works[workno].cacheFileStatus[hashname].status !== 'progress') {
      Vue.set(state.works[workno].cacheFileStatus[hashname], 'status', 'progress')
    }

    if (state.works[workno].cacheFileStatus[hashname].status !== 'total') {
      Vue.set(state.works[workno].cacheFileStatus[hashname], 'total', total)
    }

    Vue.set(state.works[workno].cacheFileStatus[hashname], 'loaded', loaded)
    Vue.set(state.works[workno].cacheFileStatus[hashname], 'progress', progress > 1 ? 1 : progress)

    // ダウンロードキュー情報を更新
    let _loaded = 0
    let _total = 0

    forEach(state.cacheFileQueue, item => {
      _loaded += state.works[item.workno].cacheFileStatus[item.hashname].loaded
      _total += state.works[item.workno].cacheFileStatus[item.hashname].total
    })

    progress = _loaded / _total

    Vue.set(state.cacheFileQueueInfo, 'loaded', _loaded)
    Vue.set(state.cacheFileQueueInfo, 'total', _total)
    Vue.set(state.cacheFileQueueInfo, 'progress', progress > 1 ? 1 : progress)
  },

  // ダウンロードキューをシフト
  [types.SHIFT_CACHE_FILE_QUEUE](state, { workno, hashname }) {
    state.cacheFileIndex++
    Vue.set(state.works[workno].cacheFileStatus[hashname], 'status', 'complete')
  },

  // ダウンロードキューが完了
  [types.COMPLETE_CACHE_FILE_QUEUE](state) {
    forEach(state.cacheFileQueue, item => {
      Vue.delete(state.works[item.workno].cacheFileStatus, item.hashname)
    })

    state.cacheFileIndex = 0
    state.cacheFileQueue = []
    state.cacheFileQueueInfo = {}
  },

  // cacheFile情報を更新
  [types.RECIVE_CACHE_FILE_INFO](state, { info }) {
    if (state.cacheFileInfo) {
      forEach(state.cacheFileInfo.works, work => {
        if (work.meta && work.meta.images && typeof work.meta.images.thumb === 'string') {
          console.debug('revoke', work.meta.images.thumb)
          window.URL.revokeObjectURL(work.meta.images.thumb)
        }
      })
    }

    Vue.set(state, 'cacheFileInfo', info)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
