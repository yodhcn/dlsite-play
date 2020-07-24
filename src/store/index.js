import Vue from 'vue'
import Vuex from 'vuex'
import play from './modules/play'
import work from './modules/work'
import purchase from './modules/purchase'
import audio from './modules/audio'
import mylist from './modules/mylist'
import playlist from './modules/playlist'
import cien from './modules/cien'
import recommend from './modules/recommend'
import menu from './modules/menu'
import ignore from './modules/ignore'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  modules: {
    play,
    work,
    purchase,
    audio,
    mylist,
    playlist,
    cien,
    recommend,
    menu,
    ignore
  },
  strict: debug
  // strict: false
})

if (module.hot) {
  module.hot.accept(
    [
      './modules/play',
      './modules/work',
      './modules/purchase',
      './modules/audio',
      './modules/mylist',
      './modules/playlist',
      './modules/cien',
      './modules/recommend',
      './modules/menu',
      './modules/ignore'
    ],
    () => {
      store.hotUpdate({
        modules: {
          play: require('./modules/play').default,
          work: require('./modules/work').default,
          purchase: require('./modules/purchase').default,
          audio: require('./modules/audio').default,
          mylist: require('./modules/mylist').default,
          playlist: require('./modules/playlist').default,
          cien: require('./modules/cien').default,
          recommend: require('./modules/recommend').default,
          menu: require('./modules/menu').default,
          ignore: require('./modules/ignore').default
        }
      })
    }
  )
}

export default store
