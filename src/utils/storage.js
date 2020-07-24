/**
 * LocalStorage Util
 */
const mockStorage = {}

export default class Storage {
  /**
   * set
   * @param {string} key
   * @param {*} item
   */
  static setItem(key, item) {
    const value = JSON.stringify(item)

    try {
      localStorage.setItem(key, value)
      return
    } catch (error) {
      console.warn(error)
    }

    mockStorage[key] = value
  }

  /**
   * get
   * @param {string} key
   * @returns {*}
   */
  static getItem(key) {
    let value = null

    if (Object.keys(mockStorage).length > 0) {
      value = mockStorage[key] || null
    }
    // 初回
    else {
      try {
        value = localStorage.getItem(key)
      } catch (error) {
        console.warn(error)
        value = mockStorage[key] || null
      }
    }

    try {
      return JSON.parse(value)
    } catch (error) {
      console.warn(error)
      return value
    }
  }

  /**
   * remove
   * @param {string} key
   */
  static removeItem(key) {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn(error)
      delete mockStorage[key]
    }
  }

  /**
   * clear
   */
  static clear() {
    try {
      localStorage.clear()
    } catch (error) {
      console.warn(error)
      Object.keys(mockStorage).forEach(key => {
        delete mockStorage[key]
      })
    }
  }
}
