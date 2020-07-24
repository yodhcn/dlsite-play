import naturalSort from 'natural-compare-lite'
import indexOf from 'lodash/indexOf'
import forEach from 'lodash/forEach'
import cloneDeep from 'lodash/cloneDeep'
import keyBy from 'lodash/keyBy'
import uniqBy from 'lodash/uniqBy'
import fill from 'lodash/fill'
import sum from 'lodash/sum'
import api from '@/store/api'
import db from '@/store/database'
import store from '@/store'

export default {
  /**
   * Playに存在する作品のみ取得 (只获取Play中存在的作品)
   */
  getPlayWorknoList(worknoList) {
    return db.lfdb
      .select()
      .from(db.table.purchase)
      .where(db.table.purchase.workno.in(worknoList))
      .exec()
      .then(res => {
        return res.map(item => item.workno)
      })
  },

  /**
   * 作品メタデータを取得 (获取作品元数据)
   */
  getMeta(workno, imageOnly) {
    return db.lfdb
      .select()
      .from(db.table.purchase)
      .where(db.table.purchase.workno.in(workno))
      .exec()
      .then(res => {
        let works = (res || []).map(v => {
          let work

          if (imageOnly) {
            work = {
              workno: v.work.workno,
              work_files: v.work.work_files
            }
          } else {
            work = cloneDeep(v.work)
          }

          return work
        })

        return works
      })
  },

  /**
   * Ziptreeを取得
   */
  getZiptree(workno) {
    let data = null

    // DBにあればそっちから返す (如果在DB中已存在, 则返回DB中的Ziptree)
    return new Promise((resolve, reject) => {
      if (navigator.onLine) {
        resolve(false)
      } else {
        db.lfdb
          .select()
          .from(db.table.ziptree)
          .where(db.table.ziptree.workno.eq(workno))
          .exec()
          .then(res => {
            resolve(res)
          })
          .catch(e => {
            reject(e)
          })
      }
    }).then(res => {
      if (res && res.length > 0) {
        return JSON.parse(res[0].json)
      } else {
        return this.fetchZiptree(workno)
          .then(_data => {
            data = _data

            let row = db.table.ziptree.createRow({
              workno: workno,
              json: JSON.stringify(data)
            })

            return db.lfdb
              .insertOrReplace()
              .into(db.table.ziptree)
              .values([row])
              .exec()
          })
          .then(() => {
            return data
          })
      }
    })
  },

  fetchZiptree(workno, options) {
    return api.dlGet(workno, 'ziptree.json', options).then(res => {
      let data = res.data

      // 画像のサムネイル情報が不足しているので修正 (由于图像缩略图信息不足, 所以修正)
      if (data && data.playfile) {
        data.playfile = methods.fixPlayfile(data.playfile)
      }

      // ソート順や不要ファイルを修正 (修正排序和不需要的文件)
      if (data && data.tree) {
        data.tree = methods.fixTree(data.tree)
      }

      return data
    })
  },

  /**
   * キャッシュ一覧を取得 (获取缓存文件列表)
   */
  getCacheFileList(workno) {
    return db.lfdb
      .select(db.table.cacheFile.path)
      .from(db.table.cacheFile)
      .where(db.table.cacheFile.workno.eq(workno))
      .exec()
      .then(res => {
        return res ? res.map(v => v.path) : []
      })
  },

  /**
   * キャッシュされている作品のサイズを取得 (获得缓存作品的大小)
   */
  getCacheFileInfo() {
    let result

    let cacheFileSizeQuery = db.lfdb
      .select(db.table.cacheFile.workno, db.lf.fn.sum(db.table.cacheFile.length).as('size'))
      .from(db.table.cacheFile)
      .groupBy(db.table.cacheFile.workno)
      .orderBy(db.lf.fn.sum(db.table.cacheFile.length), db.lf.Order.DESC)

    let imageSizeQuery = db.lfdb.select(db.lf.fn.sum(db.table.image.length).as('size')).from(db.table.image)

    // TODO: 画像データやその他情報も返したい (也想返回图像数据和其他信息)
    return Promise.all([cacheFileSizeQuery.exec(), imageSizeQuery.exec()])
      .then(res => {
        result = res
        let workno = (res[0] || []).map(v => v.workno)

        return db.lfdb
          .select(db.table.purchase.work)
          .from(db.table.purchase)
          .where(db.table.purchase.workno.in(workno))
          .exec()
      })
      .then(res => {
        let works = cloneDeep(keyBy(res, 'work.workno'))
        let info = {
          total: result[1][0].size || 0,
          imageCacheSize: result[1][0].size || 0,
          works: cloneDeep(result[0]) || []
        }

        forEach(info.works, work => {
          if (works[work.workno]) {
            work.meta = works[work.workno].work
            work.meta.images = {}
          }

          info.total += work.size
        })

        return info
      })
  },

  /**
   * worknoを指定してcacheFileを削除 (根据指定的workno删除cacheFile)
   */
  deleteCacheFile(workno) {
    return db.lfdb
      .delete()
      .from(db.table.cacheFile)
      .where(db.table.cacheFile.workno.eq(workno))
      .exec()
  },

  /**
   * 画像キャッシュを削除 (删除图像缓存)
   */
  deleteImageCache() {
    return db.lfdb
      .delete()
      .from(db.table.image)
      .exec()
  },

  /**
   * システムキャッシュを削除
   */
  // deleteSystemCache () {
  //   return Promise.all([
  //     db.lfdb.delete().from(db.table.config).exec(),
  //     db.lfdb.delete().from(db.table.purchase).exec(),
  //     db.lfdb.delete().from(db.table.ziptree).exec(),
  //     db.lfdb.delete().from(db.table.mylist).exec(),
  //     db.lfdb.delete().from(db.table.mylistWork).exec(),
  //     db.lfdb.delete().from(db.table.playlist).exec(),
  //     db.lfdb.delete().from(db.table.playlistAudio).exec()
  //   ])
  // },

  /**
   * 全てのcacheFileを削除 (删除全部缓存文件)
   */
  deleteAllCacheFile() {
    return db.lfdb
      .delete()
      .from(db.table.cacheFile)
      .exec()
  },

  /**
   * キャッシュファイルを返す (返回缓存文件)
   */
  getCacheFile(workno, id) {
    return db.lfdb
      .select(db.table.blob)
      .from(db.table.cacheFile)
      .where(db.table.cacheFile.id.eq(id))
      .exec()
      .then(res => {
        if (res && res.length > 0) {
          return res[0].blob
        } else {
          return null
        }
      })
  },

  /**
   * 画像を取得
   */
  getImage(workno, type, url) {
    let data

    if (!store.state.play.config.workImageThumbCahce || !db.supportBlob) {
      return new Promise(resolve => {
        let img = new Image()
        img.src = url
        img.onload = () => {
          img = null
          resolve(url)
        }
      })
    }

    if (/no_img/.test(url)) {
      url = '/no_image.jpg'
    }

    return api
      .ajax('get', url, {
        responseType: 'blob'
      })
      .then(response => {
        data = response.data

        // レコードを作成 (创建记录)
        let row = db.table.image.createRow({
          id: workno + '/' + type,
          workno,
          type,
          length: data.size,
          blob: data
        })

        // DBに入れる (放入数据库)
        return db.lfdb
          .insertOrReplace()
          .into(db.table.image)
          .values([row])
          .exec()
      })
      .then(() => {
        return data
      })
  },

  /**
   * 画像キャッシュを取得 (获取缓存图像)
   */
  getCahceImages(worknos, imageTypes) {
    // 画像を取得
    return db.lfdb
      .select(db.table.image.workno, db.table.image.type, db.table.image.blob)
      .from(db.table.image)
      .where(db.lf.op.and(db.table.image.workno.in(worknos), db.table.image.type.in(imageTypes)))
      .exec()
      .then(res => {
        let blobs = {}

        forEach(res, row => {
          if (!blobs[row.workno]) {
            blobs[row.workno] = {}
          }

          blobs[row.workno][row.type] = row.blob
        })

        return blobs
      })
  },

  /**
   * playfile内のfileを全件ダウンロード (下载playfile内的全部file)
   */
  downloadItem(item) {
    item.index = 0
    item.fileLoadedArray = fill(Array(item.files.length), 0)
    item.fileTotalArray = item.files.map(v => v.length || 0)
    // item.fileLoadedSize = 0
    return this.downloadFile(item)
  },

  /**
   * キューに入っているファイルを全件ダウンロード (下载队列中的所有文件)
   */
  downloadFile(item) {
    if (!db.supportBlob) {
      return Promise.reject(new Error('blob not supported'))
    }

    return (() => {
      // 全件ダウンロードが完了していれば終了 (如果所有项目均已下载，则完成)
      if (item.index >= item.files.length) {
        return Promise.resolve()
      }

      // ファイルがダウンロード済みならロード完了として次へ (如果文件下载完毕，记作为载入完成，继续下载下一个)
      // TODO: これ動いてない
      if (item.fileLoadedArray[item.index] === item.fileTotalArray[item.index]) {
        item.index++
        return this.downloadFile()
      }

      let file = item.files[item.index]
      // let downloadProgressOnce = true

      return api
        .dlGet(item.workno, file.path, {
          responseType: 'blob',
          onDownloadProgress: function(progress) {
            // if (downloadProgressOnce) {
            //   // XHRで取得したcontent-lengthに修正
            //   if (item.fileTotalArray[item.index] !== progress.total) {
            //     item.fileTotalArray[item.index] = progress.total
            //     item.changeItemFileSize(item.workno, item.hashname, sum(item.fileTotalArray))
            //   }

            //   downloadProgressOnce = false
            // }

            item.fileLoadedArray[item.index] = progress.loaded
            item.fileTotalArray[item.index] = progress.total

            // TODO: ここはパフォーマンス改善出来るところかもしれない (这可能是可以提高性能的地方)
            let loaded = sum(item.fileLoadedArray)
            let total = sum(item.fileTotalArray)

            item.progress(item.workno, item.hashname, loaded, total)
          }
        })
        .then(response => {
          // レコードを作成 (创建记录)
          let row = db.table.cacheFile.createRow({
            id: file.workno + '/' + file.path,
            workno: file.workno,
            path: file.path,
            length: response.data.size,
            blob: response.data
          })

          // DBに入れる (放入数据库)
          return db.lfdb
            .insertOrReplace()
            .into(db.table.cacheFile)
            .values([row])
            .exec()
        })
        .then(() => {
          // 次のファイルへ
          item.index++
          file = null

          return this.downloadFile(item)
        })
    })()
  },

  /**
   * fileUrlを返す
   */
  getFileUrl(workno, path) {
    return api.dlAuth(workno).then(auth => {
      return auth.url + path + '?' + auth.querystring
    })
  },

  /**
   * playfileをパースしてファイルリストを返す (清除playfile并返回文件列表)
   */
  getDownloadFiles(workno, playfile) {
    let files = []

    if (!playfile) {
      return files
    }

    // 画像
    if (playfile.type === 'image') {
      files.push({
        workno,
        path: 'optimized/' + playfile.image.optimized.name,
        length: playfile.image.optimized.length
      })

      files.push({
        workno,
        path: 'thumbnails/' + playfile.image.thumbnails.name,
        length: playfile.image.thumbnails.length
      })

      // PDF
    } else if (playfile.type === 'pdf') {
      if (playfile.pdf && playfile.pdf.page) {
        forEach(playfile.pdf.page, v => {
          files.push({
            workno,
            path: 'optimized/' + v.optimized.name,
            length: v.optimized.length
          })

          files.push({
            workno,
            path: 'thumbnails/' + v.thumbnails.name,
            length: v.thumbnails.length
          })
        })
      }
    } else if (playfile.type === 'audio') {
      files.push({
        workno,
        path: 'optimized/' + playfile.audio.optimized.name,
        length: playfile.audio.optimized.length
      })
    } else if (playfile.type === 'text') {
      files.push({
        workno,
        path: 'optimized/' + playfile.text.optimized.name,
        length: playfile.text.optimized.length
      })
    }

    return uniqBy(files, 'path')
  }
}

// methods
const methods = {
  /**
   * ソート順や不要ファイルを修正 (修正排序和不需要的文件)
   */
  fixTree: function(tree) {
    return methods.deleteItem(tree)
  },

  /**
   * 再帰的に不要ファイルを削除 (递归删除不需要的文件)
   */
  deleteItem: function(tree) {
    for (let i = tree.length - 1; i >= 0; i--) {
      if (tree[i].type === 'folder') {
        tree[i].children = methods.deleteItem(tree[i].children)

        // ファイル名最初のスペースは無視
        // eslint-disable-next-line no-irregular-whitespace
        tree[i].name = tree[i].name.replace(/^[ |　]+/, '')
        // eslint-disable-next-line no-irregular-whitespace
        tree[i].path = tree[i].path.replace(/^[ |　]+/, '')

        if (tree[i].children.length === 0) {
          tree.splice(i, 1)
        }
      } else if (tree[i].type === 'hidden') {
        tree.splice(i, 1)

        // 認証についてファイルは削除 (删除认证文件)
      } else if (
        tree[i].name.indexOf('専用ビューアについて') !== -1 ||
        tree[i].name.indexOf('認証について') !== -1 ||
        tree[i].name.indexOf('Thumbs.db') !== -1 ||
        tree[i].name.indexOf('.DS_Store') !== -1
      ) {
        tree.splice(i, 1)
      }
    }

    return methods.naturalSort(tree)
  },

  /**
   * 自然順でソート (按自然顺序排序)
   */
  naturalSort: function(tree) {
    // 前処理
    for (let i = 0; i < tree.length; i++) {
      // 全角を半角に変換 (将全角转换为半角)
      tree[i].sortname = tree[i].name.replace(/[\uFF01-\uFF5F]/g, s => {
        return String.fromCharCode(s.charCodeAt(0) - 65248)
      })

      // フォルダは先頭へ (文件夹放在最前面)
      if (tree[i].type === 'folder') {
        tree[i].sortname = '!' + tree[i].sortname

        // 拡張子を先頭に移動 (把扩展名移动到最前面)
      } else {
        tree[i].sortname = tree[i].sortname.split('.')
        tree[i].sortname = tree[i].sortname.pop() + tree[i].sortname.join('.')
      }
    }

    // 自然順ソート (自然排序)
    tree = tree.sort((a, b) => {
      return naturalSort(a.sortname, b.sortname)
    })

    // 不要データ削除 (删除不需要的数据)
    for (let i = 0; i < tree.length; i++) {
      delete tree[i].sortname
    }

    return tree
  },

  /**
   * 画像のサムネイル情報を追加（本来はZiptreeに持っているべきであった…）
   * (添加图像的缩略图信息)
   */
  fixPlayfile: function(playfile) {
    forEach(playfile, (item, key) => {
      if (item.type === 'image') {
        if (item.image.optimized) {
          let ext = key.split('.').pop()
          item.image.thumbnails = {
            ...methods.resizeCalc(item.image.optimized.width, item.image.optimized.height, 200, 200),
            name: key.replace('.' + ext, indexOf(['png', 'pic', 'pi', 'mag', 'maki'], ext) === -1 ? '.jpg' : '.png'),
            length: 4096
          }
        } else {
          item.type = 'file'
        }
      } else if (item.type === 'pdf') {
        if (item.pdf && item.pdf.page) {
          forEach(item.pdf.page, page => {
            page.thumbnails = {
              ...methods.resizeCalc(page.optimized.width, page.optimized.height, 200, 200),
              name: page.optimized.name,
              length: 4096
            }
          })
        }
      }
    })

    return playfile
  },

  /**
   * 縦横比を保ったままリサイズしたときの高さや幅を計算 (计算在保持纵横比的情况下调整大小时的高度和宽度)
   */
  resizeCalc: function(width, height, maxWidth, maxHeight) {
    let ratio = 1

    if (width > maxWidth || height > maxHeight) {
      if (width >= height) {
        ratio = maxWidth / width

        return {
          width: Math.round(maxWidth),
          height: Math.round(height * ratio)
        }
      }

      if (height > width) {
        ratio = maxHeight / height

        return {
          width: Math.round(width * ratio),
          height: Math.round(maxHeight)
        }
      }
    }

    return {
      width: width,
      height: height
    }
  }
}
