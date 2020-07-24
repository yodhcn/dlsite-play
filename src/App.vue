<style lang="scss" src="./App.scss"></style>
<style lang="scss" src="./AppUi.scss"></style>

<template>
  <!--<login v-if="isShowLogin"></login>-->

  <!-- App -->
  <div
    v-if="initialized"
    id="app"
    :class="{
      'has-mini-player': playerMode === 'mini',
      'has-download-status': isShowDlStatus,
      wide: isWide,
      'menu-collapse': appMenuCollapse
    }"
  >
    <!-- チュートリアル -->
    <transition name="modal" appear>
      <tutorial v-if="isShowTutorial"></tutorial>
    </transition>

    <transition name="fade">
      <div v-if="isShowTutorial" class="fade-overlay"></div>
    </transition>

    <!-- メインルーター -->
    <router-view />

    <!-- スライドメニュー -->
    <slide-menu v-if="isWide || isShowMenu" @close="isShowMenu = false"></slide-menu>

    <transition name="fade">
      <div v-if="!isWide && isShowMenu" @click="isShowMenu = false" @touchmove.prevent class="menu-overlay"></div>
    </transition>

    <!-- ダウンロードステータス -->
    <download-status></download-status>

    <!-- オーディオプレイヤー -->
    <mini-player v-if="playerMode === 'mini'"></mini-player>
    <audio-player v-if="playerMode === 'show'"></audio-player>
  </div>

  <div v-else class="loader">
    <loader></loader>
    <div class="initialize-message">
      <p>{{ $t('app.initalizeError') }}</p>
      <p>
        <a href="/clear.html">{{ $t('app.clearDatabase') }}</a>
      </p>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import Tutorial from 'components/help/Tutorial.vue'
import AudioPlayer from 'components/audio/AudioPlayer.vue'
import MiniPlayer from 'components/audio/MiniPlayer.vue'
import Loader from 'components/Loader.vue'
import SlideMenu from 'components/menu/SlideMenu.vue'
import DownloadStatus from 'components/library/DownloadStatus.vue'
import Site from '@/utils/site.js'

export default {
  name: 'app',

  data() {
    return {
      initialized: false,
      width: null,
      locale: Site.isPathEnglish() ? 'en' : 'ja',
      isPc: !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
      isWide: true,
      // isShowLogin: false,
      isShowTutorial: false,
      isShowDlStatus: false,
      isShowMenu: false,
      playerMode: 'hide'
    }
  },

  computed: {
    ...mapState('play', ['account', 'config']),

    appMenuCollapse: {
      get() {
        return this.$store.state.play.config.appMenuCollapse
      },
      set(val) {
        this.$store.dispatch('play/setConfig', { key: 'appMenuCollapse', val })
      }
    }
  },

  watch: {
    '$route.fullPath': function() {
      if (this.playerMode === 'show') {
        this.audioPlayerMode('mini')
      }
    }
  },

  methods: {
    // オーディオプレイヤーを表示 (显示音频播放器)
    audioPlayerMode: function(mode) {
      this.playerMode = mode
    },

    toggleCollapse: function() {
      this.appMenuCollapse = !this.appMenuCollapse
      this.$nextTick().then(() => {
        this.$app.fireResize()
      })
    },

    fireResize: function() {
      if (document.createEvent) {
        let ev = document.createEvent('Event')
        ev.initEvent('resize', true, true)
        window.dispatchEvent(ev)
      } else {
        let element = document.documentElement
        let event = document.createEventObject()
        element.fireEvent('onresize', event)
      }
    },

    onResize: function() {
      this.width = window.innerWidth || document.documentElement.clientWidth
      this.isWide = this.width > 760
      this.$emit('resize')
    },

    initialize: async function() {
      // 画面幅 (屏幕宽度)
      this.onResize()

      // チュートリアル
      // if (!this.config.lastSyncDatetime) {
      //   this.isShowTutorial = true
      // }

      // initialize
      await Promise.all([this.$store.dispatch('purchase/initialize'), this.$store.dispatch('audio/initialize')])

      // force sync
      let forceSyncDate = new Date('Wed Oct 10 2018 10:00:00 GMT+0900 (JST)')

      try {
        // sync
        await this.$store.dispatch('purchase/syncWork', new Date(this.config.lastSyncDatetime) < forceSyncDate)
      } catch (e) {
        console.log(e)
      }

      await Promise.all([this.$store.dispatch('mylist/syncMylist'), this.$store.dispatch('playlist/syncPlaylist')])
    },

    // ログイン (登录)
    login() {
      if (this.$app.locale === 'ja') {
        location.href = `${location.protocol}//${location.hostname}/login/`
      } else {
        location.href = `${location.protocol}//${location.hostname}/eng/login/`
      }
    },

    // ログアウト (注销)
    logut() {
      if (this.$app.locale === 'ja') {
        location.href = `${location.protocol}//${location.hostname}/logout/`
      } else {
        location.href = `${location.protocol}//${location.hostname}/eng/logout/`
      }
    }
  },

  created() {
    // alias
    Vue.prototype.$app = this

    // resize
    window.addEventListener('resize', () => {
      this.onResize()
    })

    // resize
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.fireResize()
        this.$emit('orientationchange')
      }, 500)
    })

    this.$store.dispatch('play/initialize').then(
      () => {
        return this.initialize().then(() => {
          this.initialized = true
        })
        // なんらかのエラーで初期化できなかった (由于某些错误无法初始化)
      },
      e => {
        // ログインが必要 (需要登录)
        if (e.message === '401') {
          // this.isShowLogin = true

          // DLsite環境混在によるログイン無限ループ対策 (通过混合DLsite环境实现无限登录循环的对策)
          try {
            const key = 'authentication-count'
            const n = sessionStorage.getItem(key) | 0

            if (n > 5) {
              sessionStorage.removeItem(key)
              this.logut()
              return
            } else {
              sessionStorage.setItem(key, n + 1)
            }
          } catch (error2) {
            console.warn(error2)
          }

          // this.login()

          // その他エラー (其他错误)
        } else {
          throw e
        }
      }
    )
  },

  components: {
    // Login,
    Loader,
    SlideMenu,
    AudioPlayer,
    MiniPlayer,
    DownloadStatus,
    Tutorial
  }
}
</script>
