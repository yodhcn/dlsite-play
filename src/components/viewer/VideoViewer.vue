<style src="plyr/dist/plyr.css"></style>
<style lang="scss" src="./VideoViewer.scss"></style>

<template>
  <div class="page video-viewer full">
    <transition name="navbar">
      <header v-show="isShowNavBar" class="navigation-bar">
        <div class="left pointer" @click="$router.go(-1)" v-touchfeedback>
          <svgicon name="prev" width="20" height="20" color="#fff"></svgicon>
          <span>{{ $t('app.back') }}</span>
        </div>
      </header>
    </transition>

    <video v-if="src" ref="video" height="600" controls crossorigin></video>
  </div>
</template>

<script>
import Plyr from 'plyr'
import RangeTouch from 'rangetouch/dist/rangetouch.js'
import Hls from 'hls.js/dist/hls'

let player = null
let range = null

export default {
  name: 'videoViewer',

  props: ['workno', 'item', 'playfile'],

  data: () => {
    return {
      isShowNavBar: true,
      src: null,
      token: null
    }
  },

  created() {
    let path = 'optimized/' + this.playfile.video.optimized.name

    this.$store
      .dispatch('work/getCacheFileUrl', { workno: this.workno, path })
      .then(fileUrl => {
        this.token = fileUrl.split('?')[1]
        this.src =
          (/^\/eng/.test(location.pathname) ? '/eng' : '') +
          '/api/video/playlist.m3u8?' +
          this.token +
          '&workno=' +
          this.workno +
          '&path=' +
          path

        return this.$nextTick()
      })
      .then(() => {
        let controls = `
        <div class="plyr__controls">
          <button type="button" class="plyr__control" aria-label="Play, {title}" data-plyr="play">
            <svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-pause"></use></svg>
            <svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-play"></use></svg>
          </button>
          <div class="plyr__menu">
            <button type="button" class="plyr__control" id="speed">
              <span id="speed-magnification">1.0×</span>
            </button>
            <div class="plyr__menu__container hide-control" id="speed-container">
              <div role="menu">
        `

        for (const magnification of Plyr.defaults.speed.options) {
          controls += `
                <button type="button" class="plyr__control speed-change-button" role="menuitemradio" aria-checked="false" value="${magnification}">
                  <span>${Number.isInteger(magnification) ? magnification + '.0×' : magnification + '×'}</span>
                </button>
          `
        }

        controls += `
              </div>
            </div>
          </div>
          <div class="plyr__progress">
            <input data-plyr="seek" type="range" min="0" max="100" step="0.01" value="0" autocomplete="off" role="slider" aria-label="Seek">
            <progress class="plyr__progress__buffer" min="0" max="100" value="0" role="progressbar" aria-hidden="true">% buffered</progress>
            <span role="tooltip" class="plyr__tooltip">00:00</span>
          </div>
          <div class="plyr__time plyr__time--current" aria-label="Current time">00:00</div>
          <div class="plyr__time plyr__time--duration" aria-label="Duration">00:00</div>
          <button type="button" class="plyr__control" id="loop">
            <svg role="presentation" id="loop-icon"></svg>
            <div id="loop-label">
              <span class="label--pressed plyr__tooltip" role="tooltip">${this.$t('video.repeat_on')}</span>
              <span class="label--not-pressed plyr__tooltip" role="tooltip">${this.$t('video.repeat_off')}</span>
            </div>
          </button>
          <div class="plyr__volume" id="volume">
            <button type="button" class="plyr__control" aria-label="Mute" data-plyr="mute" id="mute">
              <svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-muted"></use></svg>
              <svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-volume"></use></svg>
            </button>
            <input data-plyr="volume" type="range" role="slider" min="0" max="1" step="0.05" value="1" autocomplete="off" aria-label="Volume">
          </div>
          <button type="button" class="plyr__control" data-plyr="pip">
            <svg role="presentation"><use xlink:href="#plyr-pip"></use></svg>
          </button>
          <button type="button" class="plyr__control" data-plyr="airplay">
            <svg role="presentation"><use xlink:href="#plyr-airplay"></use></svg>
          </button>
          <button type="button" class="plyr__control" data-plyr="fullscreen">
            <svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-exit-fullscreen"></use></svg>
            <svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-enter-fullscreen"></use></svg>
          </button>
        </div>
        `

        player = new Plyr(this.$refs.video, {
          controls,
          loop: { active: this.$store.state.play.config.isLoopVideo }
        })

        if (!Hls.isSupported()) {
          this.$refs.video.src = this.src
        } else {
          const isChrome = /Chrome/.test(navigator.userAgent)

          const hls = new Hls({
            xhrSetup: function(xhr) {
              xhr.withCredentials = false
            },
            maxMaxBufferLength: isChrome ? 300 : 600
          })

          hls.loadSource(this.src)
          hls.attachMedia(this.$refs.video)
        }

        player.on('play', () => {
          this.isShowNavBar = false
          document.querySelector('#speed-container').classList.add('hide-control')
        })

        player.on('pause', () => {
          if (!player.ended || !player.loop) {
            this.isShowNavBar = true
          }
        })

        if (!this.$app.$data.isPc) {
          // Seek Bar
          range = new RangeTouch('[data-plyr="seek"]')

          // Volume
          document.querySelector('#volume').classList.add('hide-control')

          // Loop Label
          document.querySelector('#loop-label').classList.add('hide-loop-label')
        }

        // Loop Button
        const loopButtonObj = document.querySelector('#loop')
        loopButtonObj.addEventListener('click', this.toggleLoop)

        if (this.$store.state.play.config.isLoopVideo) {
          loopButtonObj.classList.add('plyr__control--pressed')
        }

        // Speed Menu Button
        document.querySelector('#speed').addEventListener('click', this.toggleSpeedMenu)

        // Speed Change Button
        for (const obj of document.querySelectorAll('.speed-change-button')) {
          obj.addEventListener('click', this.changeSpeed)
        }
      })
      .catch(ex => {
        throw new Error(ex)
      })
  },

  methods: {
    toggleLoop() {
      player.loop = !this.$store.state.play.config.isLoopVideo
      this.$store.dispatch('play/setConfig', { key: 'isLoopVideo', val: player.loop })

      document.querySelector('#loop').classList.toggle('plyr__control--pressed')

      if (!this.$app.$data.isPc) {
        // Loop Label
        document.querySelector('#loop-label').classList.remove('hide-loop-label')

        if (typeof this.timer === 'number') {
          clearTimeout(this.timer)
          this.timer = null
        }

        this.timer = setTimeout(() => {
          document.querySelector('#loop-label').classList.add('hide-loop-label')
          this.timer = null
        }, 1000)
      }
    },

    toggleSpeedMenu() {
      document.querySelector('#speed-container').classList.toggle('hide-control')
    },

    changeSpeed(event) {
      player.speed = Number(event.currentTarget.value)

      document.querySelector('#speed-magnification').innerHTML = Number.isInteger(player.speed)
        ? player.speed + '.0×'
        : player.speed + '×'

      for (const obj of document.querySelectorAll('.speed-change-button')) {
        obj.setAttribute('aria-checked', 'false')
      }

      event.currentTarget.setAttribute('aria-checked', 'true')
    }
  },

  destroyed() {
    if (range) {
      range.destroy()
    }

    range = null

    if (player) {
      player.destroy()
    }

    player = null
  }
}
</script>
