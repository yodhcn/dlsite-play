<style lang="scss" src="./Settings.scss" scoped></style>

<template>
  <div class="page">
    <header class="navigation-bar" :class="{ dark: section }">
      <div v-if="!$app.$data.isWide && !section" class="menu" @click="$app.$data.isShowMenu = true" v-touchfeedback>
        <svgicon name="hamburger-menu" width="20" height="20" color="#fff"></svgicon>
      </div>

      <div v-if="!section" class="title">{{ $t('setting.setting') }}</div>
      <div v-else-if="section === 'photo-viewer'" class="center setting-title">
        {{ $t('setting.image_viewer_setting') }}
      </div>

      <div v-if="section" class="right">
        <div class="button" @click="$emit('close')" v-touchfeedback>
          <span>{{ $t('app.close') }}</span>
        </div>
      </div>
    </header>

    <div class="page-content page-bottom scroll">
      <!-- 画像ビューア -->
      <section v-if="!section || section === 'photo-viewer'">
        <div class="header">{{ $t('setting.image_viewer') }}</div>
        <ol>
          <li>
            <span>{{ $t('setting.toggle_page_break') }}</span>
            <div class="right">
              <div class="pf-toggle">
                <input v-model="photoFrontSingle" type="checkbox" id="photoFrontSingle" name="photoFrontSingle" />
                <label for="photoFrontSingle"></label>
              </div>
            </div>
          </li>

          <li>
            <span>{{ $t('setting.spread_page') }}</span>
            <div class="right">
              <div class="pf-toggle">
                <input v-model="photoSpreadView" id="photoSpreadView" type="checkbox" name="photoSpreadView" />
                <label for="photoSpreadView"></label>
              </div>
            </div>
          </li>

          <li>
            <span>{{ $t('setting.autoplay_anim') }}</span>
            <div class="right">
              <div class="pf-toggle">
                <input v-model="photoMoveAnimation" id="photoMoveAnimation" type="checkbox" name="photoMoveAnimation" />
                <label for="photoMoveAnimation"></label>
              </div>
            </div>
          </li>

          <li @click="isShowPhotoAutoNextTime = true" class="pointer" v-touchfeedback>
            <span>{{ $t('setting.autoplay_delay') }}</span>
            <div class="right">
              <span>{{ $t('setting.second', { sec: photoAutoNextTime }) }}</span>
            </div>
          </li>
        </ol>
      </section>

      <!-- オーディオプレイヤー -->
      <section v-if="!section">
        <div class="header">{{ $t('setting.audio_player') }}</div>
        <ol>
          <li @click="isShowAudioSeekTime = true" class="pointer" v-touchfeedback>
            <span>{{ $t('setting.audio_seek_time') }}</span>
            <div class="right">
              <span>{{ $t('setting.second', { sec: audioSeekTime }) }}</span>
            </div>
          </li>
        </ol>
      </section>

      <!-- ライブラリ -->
      <section v-if="!section">
        <div class="header">{{ $t('setting.library') }}</div>
        <ol>
          <li>
            <span>{{ $t('setting.hidden_not_playwork') }}</span>
            <div class="right">
              <div class="pf-toggle">
                <input v-model="hideenNotPlayWork" id="hideenNotPlayWork" type="checkbox" name="hideenNotPlayWork" />
                <label for="hideenNotPlayWork"></label>
              </div>
            </div>
          </li>
          <li v-if="$app.locale === 'ja'">
            <span v-t="'setting.hidden_recommend'"></span>
            <div class="right">
              <div class="pf-toggle">
                <input
                  v-model="hideRecommendations"
                  id="hideRecommendations"
                  type="checkbox"
                  name="hideRecommendations"
                />
                <label for="hideRecommendations"></label>
              </div>
            </div>
          </li>
          <li @click="$router.push('/settings/ignore')">
            <span>{{ $t('ignore.title') }}</span>
            <div class="right">
              <span>{{ $t('ignore.confirm') }}</span>
            </div>
          </li>
        </ol>
      </section>

      <!-- キャッシュ -->
      <section v-if="!section">
        <div class="header">{{ $t('setting.cache') }}</div>
        <ol>
          <li>
            <span>{{ $t('setting.image_cache') }}</span>
            <div class="right">
              <div class="pf-toggle">
                <input
                  v-model="workImageThumbCahce"
                  id="workImageThumbCahce"
                  type="checkbox"
                  name="workImageThumbCahce"
                />
                <label for="workImageThumbCahce"></label>
              </div>
            </div>
          </li>
          <li @click="systemClear()" class="delete" v-touchfeedback>{{ $t('setting.system_clear') }}</li>
        </ol>
      </section>
    </div>

    <!-- オートプレイメニュー -->
    <dialog-box type="dialog" v-if="isShowPhotoAutoNextTime" @close="isShowPhotoAutoNextTime = false">
      <h3 slot="header">{{ $t('setting.autoplay_delay') }}</h3>
      <ol slot="body">
        <li v-for="i in 30" @click="setPhotoAutoNextTime(i)" :key="i" v-touchfeedback>
          <span>{{ $t('setting.second', { sec: i }) }}</span>
          <svgicon
            v-if="i === photoAutoNextTime"
            class="checked"
            name="check"
            width="20"
            height="20"
            color="#1f9aff"
          ></svgicon>
        </li>
      </ol>
    </dialog-box>

    <!-- 先送り・巻き戻しメニュー -->
    <dialog-box type="dialog" v-if="isShowAudioSeekTime" @close="isShowAudioSeekTime = false">
      <h3 slot="header">{{ $t('setting.audio_seek_time') }}</h3>
      <ol slot="body">
        <li v-for="i in [10, 20, 30, 60]" @click="setAudioSeekTime(i)" :key="i" v-touchfeedback>
          <span>{{ $t('setting.second', { sec: i }) }}</span>
          <svgicon
            v-if="i === audioSeekTime"
            class="checked"
            name="check"
            width="20"
            height="20"
            color="#1f9aff"
          ></svgicon>
        </li>
      </ol>
    </dialog-box>
  </div>
</template>

<script>
import DialogBox from 'components/DialogBox.vue'

export default {
  name: 'settings',

  props: ['section'],

  data() {
    return {
      isShowPhotoAutoNextTime: false,
      isShowAudioSeekTime: false
    }
  },

  computed: {
    photoFrontSingle: {
      get() {
        return this.$store.state.play.config.photoFrontSingle
      },
      set(val) {
        this.$store.dispatch('play/setConfig', { key: 'photoFrontSingle', val })
      }
    },

    photoSpreadView: {
      get() {
        return this.$store.state.play.config.photoSpreadView
      },
      set(val) {
        this.$store.dispatch('play/setConfig', { key: 'photoSpreadView', val })
      }
    },

    photoMoveAnimation: {
      get() {
        return this.$store.state.play.config.photoMoveAnimation
      },
      set(val) {
        this.$store.dispatch('play/setConfig', { key: 'photoMoveAnimation', val })
      }
    },

    photoAutoNextTime: {
      get() {
        return this.$store.state.play.config.photoAutoNextTime
      },
      set(val) {
        this.$store.dispatch('play/setConfig', { key: 'photoAutoNextTime', val })
      }
    },

    audioSeekTime: {
      get() {
        return this.$store.state.play.config.audioSeekTime
      },
      set(val) {
        this.$store.dispatch('play/setConfig', { key: 'audioSeekTime', val })
      }
    },

    workImageThumbCahce: {
      get() {
        return this.$store.state.play.config.workImageThumbCahce
      },
      set(val) {
        this.$store.dispatch('play/setConfig', { key: 'workImageThumbCahce', val })
      }
    },

    hideenNotPlayWork: {
      get() {
        return this.$store.state.play.config.hideenNotPlayWork
      },
      set(val) {
        this.$store.dispatch('play/setConfig', { key: 'hideenNotPlayWork', val })
      }
    },

    hideRecommendations: {
      get() {
        return this.$store.state.play.config.hideRecommendations
      },
      set(val) {
        this.$store.dispatch('play/setConfig', { key: 'hideRecommendations', val })
      }
    }
  },

  methods: {
    setPhotoAutoNextTime: function(sec) {
      this.photoAutoNextTime = sec
      this.isShowPhotoAutoNextTime = false
    },

    setAudioSeekTime: function(sec) {
      this.audioSeekTime = sec
      this.isShowAudioSeekTime = false
    },

    systemClear: function() {
      this.$confirm(this.$t('setting.system_clear_msg')).then(dismiss => {
        if (dismiss) {
          window.location.replace('/clear.html')
        }
      })
    }
  },

  components: {
    DialogBox
  }
}
</script>
