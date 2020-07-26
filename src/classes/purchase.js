import forEach from 'lodash/forEach'
import cloneDeep from 'lodash/cloneDeep'
import isEmpty from 'lodash/isEmpty'
import differenceBy from 'lodash/differenceBy'
import escapeRegExp from 'lodash/escapeRegExp'
import api from '@/store/api'
import db from '@/store/database'
import cat from '@/store/categories'
import store from '@/store/index'
import * as Sentry from '@sentry/browser'

export default {
  /**
   * 購入済み作品を検索 (搜索已购买作品)
   * @param {object} conditions
   * @param {number} page
   * @returns {Promise<{total: *, works: *[], work_types: Array}>}
   * @see store/modules/purchase
   */
  search(conditions, page) {
    let skip = page * conditions.limit
    // let filter
    // let search
    // let isPlayWork
    let where = []

    // 合計件数を取得するクエリ (取得合计件数的查询)
    let countQuery = db.lfdb.select(db.lf.fn.count().as('count')).from(db.table.purchase)

    // 作品情報を取得するクエリ (取得作品信息的查询)
    let selectQuery = db.lfdb.select(db.table.purchase.work).from(db.table.purchase)

    // 全体に含まれるwork_typeを取得するクエリ (获得全部作品中包含的work_type的查询)
    let workTypeQuery = db.lfdb
      .select(db.lf.fn.distinct(db.table.purchase.work_type).as('work_type'))
      .from(db.table.purchase)

    // 作品タイプフィルタ (作品类型过滤器)
    if (conditions.filter !== 'all') {
      if (/^[A-Z0-9]{3}/.test(conditions.filter)) {
        where.push(db.table.purchase.work_type.eq(conditions.filter))
      } else {
        where.push(db.table.purchase.work_type.in(cat.workTypes[conditions.filter]))
      }
    }

    // キーワードフィルタ (关键字过滤器)
    if (conditions.search !== '') {
      where.push(db.table.purchase.search.match(new RegExp(escapeRegExp(this.kana2hiragana(conditions.search)), 'ig')))
    }

    // isPlayWorkフィルタ (isPlayWork过滤器)
    if (store.state.play.config.hideenNotPlayWork) {
      where.push(db.table.purchase.is_playwork.eq(true))
    }

    // 非表示作品 (不显示的作品)
    if (!isEmpty(conditions.ignores)) {
      where.push(db.lf.op.not(db.table.purchase.workno.in(conditions.ignores)))
    }

    // whereオペレータを生成
    if (where.length > 0) {
      if (where.length === 1) {
        where = where[0]
      } else {
        where = db.lf.op.and.apply(this, where)
      }

      countQuery = countQuery.where(where)
      selectQuery = selectQuery.where(where)
    }

    // ソート順を追加 (添加排序)
    if (conditions.sort === 'purchase') {
      selectQuery = selectQuery
        .orderBy(db.table.purchase.sales_date, db.lf.Order.DESC)
        .orderBy(db.table.purchase.workno, db.lf.Order.DESC)
    } else if (conditions.sort === 'purchase_asc') {
      selectQuery = selectQuery
        .orderBy(db.table.purchase.sales_date, db.lf.Order.ASC)
        .orderBy(db.table.purchase.workno, db.lf.Order.DESC)
    } else if (conditions.sort === 'upgrade') {
      selectQuery = selectQuery
        .orderBy(db.table.purchase.upgrade_date, db.lf.Order.DESC)
        .orderBy(db.table.purchase.workno, db.lf.Order.DESC)
    } else if (conditions.sort === 'release_asc') {
      selectQuery = selectQuery
        .orderBy(db.table.purchase.regist_date, db.lf.Order.ASC)
        .orderBy(db.table.purchase.workno, db.lf.Order.DESC)
    } else if (conditions.sort === 'release_desc') {
      selectQuery = selectQuery
        .orderBy(db.table.purchase.regist_date, db.lf.Order.DESC)
        .orderBy(db.table.purchase.workno, db.lf.Order.DESC)
    } else if (conditions.sort === 'maker_asc') {
      selectQuery = selectQuery
        .orderBy(db.table.purchase.maker_name_kana, db.lf.Order.ASC)
        .orderBy(db.table.purchase.workno, db.lf.Order.ASC)
    } else if (conditions.sort === 'maker_desc') {
      selectQuery = selectQuery
        .orderBy(db.table.purchase.maker_name_kana, db.lf.Order.DESC)
        .orderBy(db.table.purchase.workno, db.lf.Order.DESC)
    } else if (conditions.sort === 'title_asc') {
      selectQuery = selectQuery
        .orderBy(db.table.purchase.work_name_kana, db.lf.Order.ASC)
        .orderBy(db.table.purchase.workno, db.lf.Order.ASC)
    } else if (conditions.sort === 'title_desc') {
      selectQuery = selectQuery
        .orderBy(db.table.purchase.work_name_kana, db.lf.Order.DESC)
        .orderBy(db.table.purchase.workno, db.lf.Order.DESC)
    } else if (conditions.sort === 'work_type') {
      selectQuery = selectQuery
        .orderBy(db.table.purchase.work_type, db.lf.Order.ASC)
        .orderBy(db.table.purchase.workno, db.lf.Order.DESC)
    }

    console.time('search')

    // 3クエリを実行 (执行这3个查询)
    return Promise.all([
      countQuery.exec(),
      selectQuery
        .skip(skip)
        .limit(conditions.limit)
        .exec(),
      workTypeQuery.exec()
    ]).then(res => {
      let works = (res[1] || []).map(v => {
        let work = cloneDeep(v.work)
        work.images = {}
        return work
      })

      if (store.state.purchase.page !== 0) {
        // storeにないworkのみに絞る (只限于store中没有的work)
        works = differenceBy(works, store.state.purchase.works, 'workno')
      }

      console.timeEnd('search')

      return {
        total: res[0][0].count,
        works,
        work_types: res[2] ? res[2].map(v => v.work_type) : []
      }
    })
  },

  /**
   * 購入済み作品データを全件同期 (同步全部已购买作品的数据)
   */
  lastSyncDatetime: null,
  syncWorkIndex: 1,
  syncWorkTotal: null,
  syncWorkLimit: 1000,

  syncWork(lastSync) {
    this.syncWorkTotal = null
    this.syncWorkIndex = 1
    this.syncWorkLimit = 1000

    // 最終取得日時を持っていれば差分のみ取得 (如果持有最终同步日期, 则只获取差分)
    if (lastSync) {
      this.lastSyncDatetime = new Date(lastSync)
      return this.getAllWork()
    }

    this.lastSyncDatetime = null

    return Promise.all([
      db.lfdb
        .delete()
        .from(db.table.purchase)
        .exec(),
      db.lfdb
        .delete()
        .from(db.table.ziptree)
        .exec()
    ]).then(() => {
      return this.getAllWork()
    })
  },

  /**
   * 購入済み作品データをページングしつつ全件取得 (以分页的方式, 获取全部已购买作品的数据)
   */
  getAllWork() {
    return (() => {
      // 全件取得が完了していれば終了 (如果全部获取完成, 则停止请求)
      if (this.syncWorkTotal !== null && (this.syncWorkIndex - 1) * this.syncWorkLimit > this.syncWorkTotal) {
        return Promise.resolve()
      }

      console.time('sync')

      // 最終同期日時をUNIXTIMEにする (将最终同步日期设为UNIXTIME)
      let lastSyncDatetime = this.lastSyncDatetime ? '&last=' + Math.floor(this.lastSyncDatetime.getTime() / 1000) : ''
      let data
      // let checkImageCache = []

      // API通信
      return api
        .get(
          '/api/dlsite/purchases?sync=true&limit=' +
            this.syncWorkLimit +
            '&page=' +
            this.syncWorkIndex +
            lastSyncDatetime
        )
        .then(res => {
          data = res.data

          if (!data.works) {
            return Promise.reject(new Error('empty work'))
          }

          let worknos = []

          // データ修正 (数据修正)
          forEach(data.works, work => {
            worknos.push(work.workno)

            // 日付をNumberにしておく (把日期格式化为Number)
            forEach(work, (v, i) => {
              if (v && i.indexOf('_date') !== -1) {
                work[i] = Number(new Date(v))
              }
            })

            // work_filesを正規化 (格式化work_files)
            if (work.work_files) {
              if (work.work_files.sam) {
                work.work_files.thumb = work.work_files.sam
                delete work.work_files.sam
              }

              if (work.work_files.main) {
                work.work_files.mainThumb = work.work_files.main
                  .replace('/modpub/', '/resize/')
                  .replace('.jpg', '_300x300.jpg')
              }

              forEach(work.work_files, (v, k) => {
                let tmp = v.split('#')

                if (tmp.length > 1) {
                  // checkImageCache.push({
                  //   workno: work.workno,
                  //   type:k,
                  //   length: Number(tmp[1])
                  // })

                  work.work_files[k] = tmp[0]
                }
              })
            }
          })

          // return db.lfdb.select(
          //   db.table.image.workno,
          //   db.table.image.type,
          //   db.table.image.length
          // ).from(db.table.image).where(db.table.image.workno.in(worknos))
        })
        .then(() => {
          // レコードを作成 (创建记录)
          let row = []

          forEach(data.works, work => {
            let tags = []

            if (work.tags) {
              forEach(work.tags, tag => {
                tags.push(tag.name)
              })
            }

            row.push(
              db.table.purchase.createRow({
                workno: work.workno,
                is_playwork: work.is_playwork || false,
                search: this.kana2hiragana(
                  [
                    work.workno,
                    work.maker_id || '',
                    work.work_name || '',
                    work.work_name_kana || '',
                    work.maker_name || '',
                    work.maker_name_kana || '',
                    work.author_name || ''
                  ]
                    .concat(tags)
                    .join('|')
                ),
                maker_id: work.maker_id || '',
                work_name_kana: work.work_name_kana || '',
                maker_name_kana: work.maker_name_kana || '',
                sales_date: work.sales_date || 0,
                regist_date: work.regist_date || 0,
                upgrade_date: work.upgrade_date || work.regist_date || 0,
                work_type: work.work_type || '',
                work: work
              })
            )
          })

          // DBに入れる (放入数据库)
          return db.lfdb
            .insertOrReplace()
            .into(db.table.purchase)
            .values(row)
            .exec()
        })
        .then(() => {
          // ページング処理 (分页处理)
          if (this.syncWorkIndex === 1) {
            this.syncWorkTotal = data.total
          }

          this.syncWorkIndex++
          data = null

          console.timeEnd('sync')

          // 次のページへ (到下一页)
          return this.getAllWork()
        })
        .catch(error => {
          // 通信エラー (通信错误)
          if (error.response) {
            if (error.response.status !== 401) {
              Sentry.withScope(scope => {
                scope.setLevel(Sentry.Severity.Info)
                Sentry.captureException(error)
              })
            }
          } else {
            return Promise.reject(error)
          }
        })
    })()
  },

  /**
   * 作品番号からindexedDB内の所持作品を検索 (通过作品号检索indexedDB内所持作品)
   * @param {array} ids
   * @returns {Promise<Array>}
   */
  getByIds(ids) {
    return db.lfdb
      .select(db.table.purchase.work)
      .from(db.table.purchase)
      .where(db.table.purchase.workno.in(ids))
      .exec()
      .then(rows => {
        return rows.map(r => r.work)
      })
      .catch(error => {
        console.warn(error)
        return []
      })
  },

  /**
   * ログイン中ユーザーの設定値を返す (返回登录中用户的设定值)
   */
  getConfig(key) {
    return db.lfdb
      .select()
      .from(db.table.config)
      .where(db.table.config.key.eq(key))
      .exec()
      .then(res => {
        return res && res.length > 0 ? res[0].val : null
      })
  },

  /**
   * ログイン中ユーザーの設定値をセットする (设定登录中用户的设定值)
   */
  setConfig(key, val) {
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
   * カタカナをひらがなに変換 (将片假名转换成平假名)
   */
  kana2hiragana(word) {
    return word.replace(/[\u30a1-\u30f6]/g, match => {
      let chr = match.charCodeAt(0) - 0x60
      return String.fromCharCode(chr)
    })
  }
}
