<style lang="scss" src="./AudioPlayer.scss"></style>

<template>
  <div class="audio">
    <transition name="audio-player" appear>
      <div class="audio-player" :class="$app.$data.isPc ? 'pc' : 'no-pc'" @touchmove.prevent>
        <div class="albumart-wrapper">
          <div class="albumart">
            <div class="option-buttons">
              <div class="hidden-button" @click="$app.audioPlayerMode('mini')">
                <svgicon name="prev" width="14" height="14" color="#000"></svgicon>
              </div>
              <div class="playlist-menu-button" @click="isShowPlaylistMenu = true">
                <svgicon name="audio-option-menu" width="24" height="24"></svgicon>
              </div>
            </div>
            <div class="seek-buttons" @click="showSeekButtons" @mousemove="showSeekButtons">
              <transition name="fade">
                <div
                  class="seek-backward-button"
                  :class="{ 'seeked-backward': isSeekedBackward }"
                  v-if="isShowSeekBackwardButton"
                  @click="playSeekBackward"
                >
                  <span>{{ this.$store.state.play.config.audioSeekTime }}</span>
                  <svgicon name="audio-forward" width="50" height="50" color="#fff"></svgicon>
                </div>
              </transition>
              <transition name="fade">
                <div
                  class="seek-forward-button"
                  :class="{ 'seeked-forward': isSeekedForward }"
                  v-if="isShowSeekForwardButton"
                  @click="playSeekForward"
                >
                  <span>{{ this.$store.state.play.config.audioSeekTime }}</span>
                  <svgicon name="audio-forward" width="50" height="50" color="#fff"></svgicon>
                </div>
              </transition>
            </div>
            <transition name="fade">
              <span
                v-if="images[currItem.workno + '/main']"
                :key="currItem.workno"
                :style="{ 'background-image': 'url(' + images[currItem.workno + '/main'] + ')' }"
              ></span>
            </transition>
            <transition name="fade">
              <div v-if="loading || !currItem.title" class="preload">
                <loader />
              </div>
            </transition>
          </div>
        </div>
        <div class="controls">
          <div ref="slider" class="duration-slider" />
          <div class="elapsed-time">{{ elapsedTime }}</div>
          <div class="remaining-time">{{ remainingTime }}</div>
          <div class="title">{{ currItem.title | stripExt }}</div>
          <div class="album">{{ currItem.work_name }}</div>
          <div class="control-buttons">
            <div @click="$store.dispatch('audio/setShuffle', !config.shuffle)" class="shuffle">
              <svgicon :class="{ active: config.shuffle }" name="audio-shuffle" width="20" height="20"></svgicon>
            </div>
            <div class="backward button" @click="backward" v-touchfeedback>
              <svgicon name="audio-next" width="36" height="36" color="#222" dir="right"></svgicon>
            </div>
            <div class="play-pause button" v-if="playing" @click="pause" v-touchfeedback>
              <svgicon name="audio-pause" width="28" height="28" color="#222"></svgicon>
            </div>
            <div class="play-pause button" v-else @click="play" v-touchfeedback>
              <svgicon name="audio-play" width="28" height="28" color="#222"></svgicon>
            </div>
            <div class="forward button" @click="forward" v-touchfeedback>
              <svgicon name="audio-next" width="36" height="36" color="#222"></svgicon>
            </div>
            <div @click="$store.dispatch('audio/setRepeat')" class="repeat">
              <svgicon
                v-if="config.repeat === 'song'"
                name="audio-repeat-song"
                width="20"
                height="20"
                color="#1f9aff"
              ></svgicon>
              <svgicon
                v-else
                :class="{ 'mode-playlist': config.repeat === 'playlist' }"
                name="audio-repeat-playlist"
                width="20"
                height="20"
              ></svgicon>
            </div>
          </div>
          <div v-if="$app.$data.isPc" class="volume-wrapper">
            <svgicon name="audio-pausing" class="lower" width="12" height="12" color="#333"></svgicon>
            <svgicon name="volume-on" class="higher" width="15" height="15" color="#333"></svgicon>
            <div ref="volslider" class="volume-slider" />
          </div>
        </div>
      </div>
    </transition>

    <!-- プレイリスト管理メニュー -->
    <dialog-box
      :class="[{ 'mini-dialog': $app.$data.isWide }, { 'no-pc': !$app.$data.isPc }]"
      :type="$app.$data.isWide ? 'dialog' : 'prompt'"
      v-if="isShowPlaylistMenu"
      @close="isShowPlaylistMenu = false"
    >
      <ol slot="body">
        <div v-if="!$app.$data.isWide" class="info">
          <span class="main">{{ currItem.title | stripExt }}</span>
          <span class="sub">{{ currItem.work_name }}</span>
        </div>
        <li @click="isShowPlaylist = true" v-touchfeedback>
          <span class="icon"><svgicon name="audio-playlist" width="20" height="20" color="#666666"></svgicon></span>
          <span class="text" v-t="'audio.playlist'"></span>
        </li>
        <li @click="isShowAddPlaylistMenu = true" v-touchfeedback>
          <span class="icon"><svgicon name="audio-add-playlist" width="20" height="20" color="#666666"></svgicon></span>
          <span class="text" v-t="'audio.add_playlist'"></span>
        </li>
        <li v-if="!$app.$data.isWide" @click="isShowPlaylistMenu = false" class="cancel" v-touchfeedback>
          <span class="icon"><svgicon name="close" width="16" height="16" color="#666666"></svgicon></span>
          <span class="text">{{ $t('app.close') }}</span>
        </li>
      </ol>
    </dialog-box>

    <!-- プレイリスト -->
    <dialog-box type="dialog" v-if="isShowPlaylist" @close="isShowPlaylist = false">
      <h3 slot="header">{{ $t('audio.playlist') }}</h3>
      <ol slot="body">
        <template v-if="playlist && playlist.length > 0">
          <template v-for="(song, i) in playlist">
            <li @click="load(i)" class="list" :key="i" v-touchfeedback>
              <div class="thumbnail">
                <transition name="fade">
                  <span
                    v-if="images[song.workno + '/thumb']"
                    :style="{ 'background-image': 'url(' + images[song.workno + '/thumb'] + ')' }"
                  >
                  </span>
                </transition>
              </div>
              <span class="text">{{ song.title | stripExt }}</span>
              <svgicon
                v-if="i === index"
                class="checked"
                name="volume-on"
                width="20"
                height="20"
                color="#1f9aff"
              ></svgicon>
            </li>
          </template>
        </template>
      </ol>
    </dialog-box>

    <!-- プレイリストに追加 -->
    <dialog-box type="dialog" v-if="isShowAddPlaylistMenu" @close="isShowAddPlaylistMenu = false">
      <h3 slot="header">{{ $t('audio.add_playlist') }}</h3>
      <ol slot="body">
        <template v-if="playlistInfo && playlistInfo.length > 0">
          <template v-for="playlist in playlistInfo">
            <li @click="addPlaylistAudio(playlist.id)" class="list" :key="playlist.id" v-touchfeedback>
              <span>{{ playlist.playlist_name }}</span>
            </li>
          </template>
        </template>
        <li v-if="!playlistInfo || playlistInfo.length === 0">{{ $t('audio.no_playlist') }}</li>
      </ol>
    </dialog-box>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import noUiSlider from 'nouislider'
import Loader from 'components/Loader.vue'
import DialogBox from 'components/DialogBox.vue'
import uniq from 'lodash/uniq'

let $slider = null
let $volSlider = null
let durationSliding = false

export default {
  name: 'audioPlayer',

  data: () => {
    return {
      slidePosition: null,
      isShowPlaylistMenu: false,
      isShowPlaylist: false,
      isShowAddPlaylistMenu: false,
      isShowSeekBackwardButton: false,
      isShowSeekForwardButton: false,
      isSeekedBackward: false,
      isSeekedForward: false
    }
  },

  computed: {
    // 現在再生中のアイテム情報
    ...mapState('audio', ['index', 'playlist', 'loading', 'playing', 'position', 'config']),

    ...mapGetters('audio', ['currItem', 'duration']),

    ...mapState('work', ['images']),

    ...mapGetters('playlist', ['playlistInfo']),

    elapsedTime: function() {
      return durationToTime(this.slidePosition === null ? this.position : this.slidePosition)
    },

    remainingTime: function() {
      return this.duration > 0
        ? durationToTime(this.duration - (this.slidePosition === null ? this.position : this.slidePosition))
        : ''
    }
  },

  watch: {
    // プレイリストが変更
    playlist: function() {
      this.getImages()
    },

    // 再生位置が変更
    position: function() {
      if ($slider && this.slidePosition === null) {
        // スライダーを更新
        $slider.set(this.position)
      }
    },

    // 再生長さが変更
    duration: function() {
      if ($slider && this.duration > 0) {
        // スライダーを更新
        $slider.updateOptions({
          range: {
            min: 0,
            max: this.duration
          }
        })
      }
    }
  },

  methods: {
    // オーディオコント−ロール
    ...mapActions({
      play: 'audio/play',
      pause: 'audio/pause',
      seek: 'audio/seek',
      volume: 'audio/volume',
      backward: 'audio/backward',
      forward: 'audio/forward',
      seekBackward: 'audio/seekBackward',
      seekForward: 'audio/seekForward'
    }),

    // 再生位置スライダーを初期化
    initPositionSlider: function() {
      if ($slider) {
        return
      }

      $slider = noUiSlider.create(this.$refs.slider, {
        start: this.position || 0,
        step: 0.01,
        animationDuration: 0,
        direction: 'ltr',
        behaviour: 'snap',
        connect: [true, false],
        range: {
          min: 0,
          max: this.duration || 0.01
        }
      })

      $slider.on('start', e => {
        if (!durationSliding) {
          durationSliding = true
          this.slidePosition = Number(e[0])
        }
      })

      $slider.on('slide', e => {
        if (durationSliding) {
          this.slidePosition = Number(e[0])
        }
      })

      $slider.on('end', e => {
        if (durationSliding) {
          this.slidePosition = Number(e[0])
          this.seek(this.slidePosition)
          this.$nextTick().then(() => {
            durationSliding = false
            this.slidePosition = null
          })
        }
      })
    },

    addPlaylistAudio: function(playlistId) {
      if (this.currItem) {
        this.$store
          .dispatch('playlist/updatePlaylistAudio', {
            type: 'add',
            playlist_id: playlistId,
            workno: this.currItem.workno,
            src: this.currItem.src
          })
          .catch(e => {
            this.$alert(e.message)
          })

        this.isShowAddPlaylistMenu = false
        this.isShowPlaylistMenu = false
      }
    },

    load: function(index) {
      this.$store.dispatch('audio/load', index).then(() => {
        this.$store.dispatch('audio/play')
      })

      this.isShowPlaylist = false
      this.isShowPlaylistMenu = false
    },

    getImages: function() {
      let worknos = uniq(this.playlist.map(v => v.workno))

      this.$store.dispatch('work/getImages', {
        workno: worknos,
        imageTypes: ['main']
      })
    },

    hideSeekButtons: function() {
      if (typeof this.timer === 'number') {
        clearTimeout(this.timer)
        this.timer = null
      }

      this.timer = setTimeout(() => {
        this.isShowSeekBackwardButton = false
        this.isShowSeekForwardButton = false
        this.timer = null
      }, 3000)
    },

    showSeekButtons: function() {
      this.isShowSeekForwardButton = true
      this.isShowSeekBackwardButton = true
      this.hideSeekButtons()
    },

    playSeekBackward: function() {
      this.seekBackward()

      this.isSeekedBackward = true

      if (typeof this.seekBackwardTimer === 'number') {
        clearTimeout(this.seekBackwardTimer)
        this.seekBackwardTimer = null
      }

      this.seekBackwardTimer = setTimeout(() => {
        this.isSeekedBackward = false
        this.seekBackwardTimer = null
      }, 400)
    },

    playSeekForward: function() {
      this.seekForward()

      this.isSeekedForward = true

      if (typeof this.seekForwardTimer === 'number') {
        clearTimeout(this.seekForwardTimer)
        this.seekForwardTimer = null
      }

      this.seekForwardTimer = setTimeout(() => {
        this.isSeekedForward = false
        this.seekForwardTimer = null
      }, 400)
    }
  },

  mounted() {
    this.initPositionSlider()

    if (this.$refs.volslider) {
      $volSlider = noUiSlider.create(this.$refs.volslider, {
        start: this.config.volume,
        step: 0.01,
        animationDuration: 0,
        direction: 'ltr',
        behaviour: 'snap',
        connect: [true, false],
        range: {
          min: 0,
          max: 1
        }
      })

      $volSlider.on('slide', e => {
        this.$store.dispatch('audio/volume', Number(e[0]))
      })

      $volSlider.on('end', e => {
        this.$store.dispatch('audio/volume', Number(e[0]))
      })
    }

    this.showSeekButtons()
  },

  destroyed() {
    if ($slider) {
      $slider.destroy()
      $slider = null
    }

    if ($volSlider) {
      $volSlider.destroy()
      $volSlider = null
    }
  },

  components: {
    Loader,
    DialogBox
  }
}

// 秒数を時間フォーマットに変換する
function durationToTime(duration) {
  duration = Math.round(duration)
  let hours = Math.floor(duration / 3600)
  let minutes = Math.floor((duration - hours * 3600) / 60)
  let seconds = duration - hours * 3600 - minutes * 60
  return (hours > 0 ? hours + ':' : '') + zeroFill(minutes, 2) + ':' + zeroFill(seconds, 2)
}

// 数値をゼロ埋めする
function zeroFill(num, length) {
  return (Array(length).join('0') + num).slice(-length)
}
</script>
