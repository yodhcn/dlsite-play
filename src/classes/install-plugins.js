import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import AsyncComputed from 'vue-async-computed'
import ZyDialog from 'vue-zydialog'
import VueTouchFeedback from 'vue-touchfeedback'
import VSwipe from 'vswipe'
import VueScrollBehavior from 'vue-scroll-behavior'
import * as svgicon from 'vue-svgicon'
import lazySizes from 'lazysizes'
import FastClick from 'fastclick'
import bytes from 'bytes'
import indexOf from 'lodash/indexOf'
import i18n from '@/i18n'
import store from '@/store'
import router from '@/router'

const debug = process.env.NODE_ENV !== 'production'

// Vue config
Vue.config.performance = debug
Vue.config.productionTip = debug

// Vue Plugins
Vue.use(ZyDialog, { lbLabel: i18n.t('confirm_dialog.cancel'), rbLabel: i18n.t('confirm_dialog.ok') })
Vue.use(VueTouchFeedback)
Vue.use(VSwipe)
Vue.use(VueScrollBehavior, { router })
Vue.use(svgicon, { tagName: 'svgicon' })
Vue.use(AsyncComputed)

// Google Analytics（devも無いと死ぬ）
Vue.use(VueAnalytics, {
  id: 'UA-22723883-9',
  router
})

// Vue filter
Vue.filter('basename', function(val) {
  return val ? val.replace(/^.+\//, '') : val
})

Vue.filter('stripExt', function(val) {
  return val ? val.replace(/\.[^/.]+$/, '') : val
})

Vue.filter('bytes', function(val) {
  try {
    return bytes(val, {
      decimalPlaces: 1,
      fixedDecimals: true,
      unitSeparator: ' '
    })
  } catch (e) {
    // IE11
    return ((val / 1024) | 0) + ' KB'
  }
})

// lazyload
lazySizes.cfg.expand = 800
lazySizes.init()

document.addEventListener('lazybeforeunveil', e => {
  let hashname = e.target.getAttribute('data-hashname')
  let workno = e.target.getAttribute('data-workno')
  let img = document.createElement('img')
  let parent = e.target.parentElement
  let ext = hashname.split('.')

  if (ext.length > 1) {
    hashname = ext[0] + '.' + (indexOf(['png', 'pic', 'pi', 'mag', 'maki'], ext[1]) !== -1 ? 'png' : 'jpg')
  }

  e.preventDefault()

  store
    .dispatch('work/getCacheFileUrl', { workno, path: 'thumbnails/' + hashname })
    .then(url => {
      img.setAttribute('src', url)

      return new Promise((resolve, reject) => {
        img.onload = () => {
          resolve()
        }
        img.onerror = () => {
          reject(new Error('image load error'))
        }
      })
    })
    .then(() => {
      parent.removeChild(e.target)
      parent.appendChild(img)

      setTimeout(() => {
        img.className = 'active'
      }, 30)
    })
    .catch(() => {})
})

// Fastclick
FastClick.attach(document.body)
