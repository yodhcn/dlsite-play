import forEach from 'lodash/forEach'
import indexOf from 'lodash/indexOf'
import filter from 'lodash/filter'

export default {
  workTypes: {
    book: ['COM', 'MNG', 'SCM', 'ET3', 'ICG', 'NRE', 'KSV'],
    music: ['SOU', 'MUS'],
    video: ['MOV'],
    game: ['ACN', 'ADV', 'DNV', 'ETC', 'PZL', 'QIZ', 'RPG', 'SLN', 'STG', 'TBL', 'TYP'],
    etc: ['TOL', 'AMT', 'IMT']
  },

  categories: ['all', 'book', 'music', 'video', 'game', 'etc'],

  formatWorkTypes: function(workTypes) {
    let wt = {}

    forEach(this.workTypes, (v, key) => {
      v = filter(v, o => {
        return indexOf(workTypes, o) !== -1
      })

      if (v.length > 0) {
        wt[key] = v
      }
    })

    return wt
  },

  // workTypeをカテゴリーに変換
  workTypeToCategory: function(workType) {
    let cat = 'etc'

    forEach(this.workTypes, (v, key) => {
      if (indexOf(v, workType) !== -1) {
        cat = key
        return false
      }
    })

    return cat
  }
}
