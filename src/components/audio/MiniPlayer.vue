<style lang="scss" src="./MiniPlayer.scss"></style>

<template>
  <transition name="mini-player">
    <div class="mini-player" @click="$app.audioPlayerMode('show')" @touchmove.prevent v-touchfeedback>
      <div class="thumbnail">
        <transition name="fade">
          <span
            v-if="images[currItem.workno + '/thumb']"
            :key="currItem.workno"
            :style="{ 'background-image': 'url(' + images[currItem.workno + '/thumb'] + ')' }"
          >
          </span>
        </transition>
      </div>
      <div class="title">{{ currItem.title | stripExt }}</div>
      <div class="album">{{ currItem.work_name }}</div>
      <div class="play-pause" v-if="playing" @click.stop="pause" v-touchfeedback>
        <svgicon name="audio-pause" width="18" height="18" color="#333"></svgicon>
      </div>
      <div class="play-pause" v-else @click.stop="play" v-touchfeedback>
        <svgicon name="audio-play" width="18" height="18" color="#333"></svgicon>
      </div>

      <div class="duration" :style="{ width: (position / duration) * 100 + '%' }" />
    </div>
  </transition>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import uniq from 'lodash/uniq'

export default {
  name: 'miniplayer',

  computed: {
    // 現在再生中のアイテム情報
    ...mapState('audio', ['playlist', 'playing', 'position']),

    ...mapState('audio', {
      duration: state => {
        return state.index !== null ? state.playlist[state.index].duration : null
      }
    }),

    ...mapGetters('audio', ['currItem']),

    ...mapState('work', ['images'])
  },

  watch: {
    playlist: function() {
      this.getImages()
    }
  },

  methods: {
    ...mapActions({
      play: 'audio/play',
      pause: 'audio/pause'
    }),

    getImages: function() {
      let worknos = uniq(this.playlist.map(v => v.workno))

      this.$store.dispatch('work/getImages', {
        workno: worknos,
        imageTypes: ['thumb']
      })
    }
  }
}
</script>
