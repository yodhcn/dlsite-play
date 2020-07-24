/**
 * Site Util
 */
export default class Site {
  /**
   * DLsiteのurlを返す
   * @returns {string}
   */
  static getDLsiteBaseUrl() {
    const m = location.hostname.match(/^play\.([a-z]+)\.dlsite\.[a-z]+$/)
    if (m) {
      return `https://www.${m[1]}.dlsite.com`
    } else {
      return 'https://www.dlsite.com'
    }
  }

  /**
   * URLのパス部分が /eng から始まるかどうかを返す
   * @returns {boolean}
   */
  static isPathEnglish() {
    return /^\/eng/.test(location.pathname)
  }
}
