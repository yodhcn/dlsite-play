import api from '@/store/api'
import work from '@/classes/work'
import forEach from 'lodash/forEach'
import keyBy from 'lodash/keyBy'
import cloneDeep from 'lodash/cloneDeep'
import pull from 'lodash/pull'
import uniq from 'lodash/uniq'
import db from '@/store/database'
import i18n from '@/i18n'

export default {
  syncMylist() {
    let data

    return api
      .apiGet('mylist/mylists?sync=true')
      .then(res => {
        data = res.data

        return Promise.all([
          db.lfdb
            .delete()
            .from(db.table.mylist)
            .exec(),
          db.lfdb
            .delete()
            .from(db.table.mylistWork)
            .exec()
        ])
      })
      .then(() => {
        // レコードを作成 (创建记录)
        let mylistRow = []
        let mylistWorkRow = []

        forEach(data.mylists, mylist => {
          mylistRow.push(
            db.table.mylist.createRow({
              id: mylist.id,
              mylist_name: mylist.mylist_name,
              mylist_work_id: mylist.mylist_work_id,
              insert_date: Number(new Date(mylist.insert_date))
            })
          )
        })

        forEach(data.mylist_works, (workno, id) => {
          mylistWorkRow.push(db.table.mylistWork.createRow({ id, workno }))
        })

        // DBに入れる (放入数据库)
        return Promise.all([
          db.lfdb
            .insertOrReplace()
            .into(db.table.mylist)
            .values(mylistRow)
            .exec(),
          db.lfdb
            .insertOrReplace()
            .into(db.table.mylistWork)
            .values(mylistWorkRow)
            .exec()
        ])
      })
  },

  getMylist() {
    return Promise.all([
      db.lfdb
        .select()
        .from(db.table.mylist)
        .exec(),
      db.lfdb
        .select()
        .from(db.table.mylistWork)
        .exec()
    ]).then(res => {
      return work.getPlayWorknoList(uniq(res[1].map(item => item.workno))).then(worknoList => {
        let mylists = keyBy(res[0], 'id')
        let worknoMap = {}

        forEach(res[1], v => {
          if (worknoList.includes(v.workno)) {
            worknoMap[v.id] = v.workno
          }
        })

        forEach(mylists, mylist => {
          mylist.mylist_work_map = {}

          forEach(mylist.mylist_work_id, (id, i) => {
            if (worknoMap[id]) {
              mylist.mylist_work_map[id] = worknoMap[id]

              // 不整合データを削除 (删除不匹配的数据)
            } else {
              mylist.mylist_work_id[i] = null
              delete mylist.mylist_work_map[id]
            }
          })

          pull(mylist.mylist_work_id, null)
        })

        return mylists
      })
    })
  },

  updateMylist(payload) {
    return api
      .apiPost('mylist/update_mylist', {
        data: payload
      })
      .then(res => {
        if (res.data && res.data.result) {
          return res.data
        }

        if (res.data.error === 'exceedMylistLimit') {
          throw new Error(i18n.t('mylist.exceedMylistLimit'))
        }

        if (res.data.error === 'createMylistError') {
          throw new Error(i18n.t('mylist.updateMylistError'))
        }

        throw new Error('UpdateMylistError')
      })
  },

  updateMylistWork(payload) {
    payload = cloneDeep(payload)

    if (payload.new_order) {
      payload.new_order = payload.new_order.join(',')
    }

    return api
      .apiPost('mylist/update_mylist_work', {
        data: payload
      })
      .then(res => {
        if (res.data && res.data.result) {
          return res.data
        }

        if (res.data.error === 'exceedMylistWorkLimit') {
          throw new Error(i18n.t('mylist.exceedMylistWorkLimit'))
        }

        if (res.data.error === 'duplicatedMylistWork') {
          throw new Error(i18n.t('mylist.duplicatedMylistWork'))
        }

        throw new Error('UpdateMylistWorkError')
      })
  }
}
