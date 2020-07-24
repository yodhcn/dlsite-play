import '@/classes/sentry'
import 'normalize.css/normalize.css'
import 'custom-event-polyfill'
import Vue from 'vue'
import App from './App.vue'
import i18n from './i18n'
import router from './router'
import store from './store'
import 'vue-svgicon/dist/polyfill'
import './assets/icon'
import './classes/iefix'
import './classes/install-plugins'
import './classes/filter'

window.DLSITE_PLAY = true

// init vue
new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
