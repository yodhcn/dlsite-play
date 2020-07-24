import axios from 'axios'
import { stringify } from 'querystring'
import { join } from 'path'

// const debug = process.env.NODE_ENV !== 'production'
const basePath = /^\/eng/.test(location.pathname) ? '/eng' : ''
const apiPath = basePath + '/api/'
const promises = {}

export default {
  apiPath,

  /**
   * APIサーバー用GET (API服务器专用的GET)
   * @deprecated
   */
  apiGet(url, options) {
    return this.ajax('get', join(apiPath, url), options)
  },

  /**
   * APIサーバー用POST (API服务器专用的POST)
   * @deprecated
   */
  apiPost(url, options) {
    if (options.data) {
      options.data = stringify(options.data)
    }

    // POSTは二重リクエスト防止処理を入れない
    return axios({
      method: 'post',
      url: join(apiPath, url),
      ...options
    })
  },

  /**
   * GET
   * @param {string} url
   * @param {object} data
   * @returns {*}
   */
  get(url, data = {}) {
    return this.ajax('get', join(basePath, url), { data })
  },

  /**
   * POST
   * @param {string} url
   * @param {object} data
   * @returns {AxiosPromise<any>}
   */
  post(url, data) {
    return axios.post(join(basePath, url), data)
  },

  /**
   * DELETE
   * @param {string} url
   * @param {object} data
   * @returns {AxiosPromise<any>}
   */
  delete(url, data) {
    return axios.delete(join(basePath, url), { data })
  },

  /**
   * ダウンロードサーバー用GET (下载服务器专用的GET)
   */
  dlGet(workno, filePath, options) {
    return this.dlAuth(workno, options).then(auth => {
      return this.ajax('get', auth.url + filePath + '?' + auth.querystring, options)
    })
  },

  /**
   * 二重リクエスト防止入りのaxiosのラッパー
   * @param {string} method
   * @param {string} url
   * @param {object} config
   * @returns {Promise<any>|*}
   */
  ajax(method, url, config = {}) {
    if (!navigator.onLine) {
      return Promise.reject(new Error('offline'))
    }

    if (promises[url]) {
      return promises[url]
    }

    promises[url] = axios({
      method,
      url,
      ...config
    })
      .then(res => {
        promises[url] = null
        delete promises[url]
        return res
      })
      .catch(error => {
        // 上に倣え (エラーはキャッシュしない)
        promises[url] = null
        delete promises[url]
        return Promise.reject(error)
      })

    return promises[url]
  },

  /**
   * ダウンロードサーバーの認証キーを取得
   */
  dlAuthCache: {},

  dlAuth(workno, options = {}) {
    // 既に取得済みなら
    if (this.dlAuthCache[workno] && this.dlAuthCache[workno]) {
      // 期限切れでないか確認して、切れてなければキャッシュから返す
      if (new Date(this.dlAuthCache[workno].expires_at) > new Date()) {
        return Promise.resolve(this.dlAuthCache[workno])
      }
    }

    options.workno = workno
    options = stringify(options)

    return this.apiGet('dlsite/download_token?' + options).then(res => {
      let auth = {
        workno: workno,
        url: res.data.url,
        querystring: stringify(res.data.params),
        expires_at: res.data.expires_at
      }

      this.dlAuthCache[workno] = auth

      return auth
    })
  }
}
