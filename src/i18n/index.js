import Vue from 'vue'
import VueI18n from 'vue-i18n'
import EnLanguage from './languages/en'
import JaLanguage from './languages/ja'
import ZhCnLanguage from './languages/zh-cn'
import ZhTwLanguage from './languages/zh-tw'
import Storage from '@/utils/storage'

Vue.use(VueI18n)

const locale = Storage.getItem('locale') || 'zh-cn'
const fallbackLocale = 'zh-cn'

const i18n = new VueI18n({
  locale,

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
