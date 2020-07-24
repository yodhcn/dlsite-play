import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import EnLanguage from './languages/en'
import JaLanguage from './languages/ja'
import ZhCnLanguage from './languages/zh-cn'
import ZhTwLanguage from './languages/zh-tw'
import Site from '@/utils/site'

// Intl 未対応ブラウザの場合 Intl polyfill を読み込む
// if (!global.Intl) {
//   import(/* webpackChunkName: "intl" */ './intl')
// }

Vue.use(VueI18n)

// フォールバックとなるデフォルト言語
const fallbackLocale = 'ja'

const acceptLocale = {
  // 翻訳済みの言語リスト
  locales: {
    ja: ['ja'], // 日本語
    en: ['en'], // 英語
    'zh-tw': ['zh-tw', 'zh-TW', 'zh-hant-tw'], // 中国語（繁体字）
    'zh-cn': ['zh-cn', 'zh-CN', 'zh-hans-cn'] // 中国語（簡体字）
  },

  // 翻訳済みの言語リストから該当のロケールを探す
  filterLocale(lang) {
    for (let locale of Object.keys(this.locales)) {
      for (let language of this.locales[locale]) {
        if (lang.indexOf(language) === 0) {
          return locale
        }
      }
    }
  }
}

// locale取得
const getLocale = () => {
  // URLのパス部分が /eng から始まるなら英語
  if (Site.isPathEnglish()) {
    return 'en'
  }

  const cookieLang = Cookies.get('locale')

  // Cookieの値を元にlocaleを取得
  if (cookieLang) {
    const cookieLocale = acceptLocale.filterLocale(cookieLang)

    if (cookieLocale) {
      return cookieLocale
    }
  }

  const browserLang = (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage

  // ブラウザの値を元にlocaleを取得
  if (browserLang) {
    const browserLocale = acceptLocale.filterLocale(browserLang)

    if (browserLocale) {
      return browserLocale
    }
  }

  return fallbackLocale
}

const i18n = new VueI18n({
  locale: getLocale(),

  fallbackLocale,

  dateTimeFormats: {
    ja: JaLanguage.dateTimeFormat,
    en: EnLanguage.dateTimeFormat,
    'zh-tw': ZhTwLanguage.dateTimeFormat,
    'zh-cn': ZhCnLanguage.dateTimeFormat
  },

  messages: {
    ja: JaLanguage.message,
    en: EnLanguage.message,
    'zh-tw': ZhTwLanguage.message,
    'zh-cn': ZhCnLanguage.message
  }
})

export default i18n
