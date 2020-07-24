'use strict'

import Vue from 'vue'

export const Filter = {
  /**
   * 文字列省略 (截断字符串)
   * @param {string} value
   * @param {number} len
   */
  ellipsis(value, len) {
    if (value.length <= len) return value
    return value.substr(0, len - 1) + '…'
  }
}

Object.keys(Filter).forEach(key => Vue.filter(key, Filter[key]))
