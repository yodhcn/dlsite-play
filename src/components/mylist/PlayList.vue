<style lang="scss" src="./MyList.scss" scoped></style>

<template>
  <div class="page">
    <header class="navigation-bar">
      <div v-if="!$app.$data.isWide" class="menu" @click="$app.$data.isShowMenu = true" v-touchfeedback>
        <svgicon name="hamburger-menu" width="20" height="20" color="#fff"></svgicon>
      </div>
      <div class="title">{{ $t('playlist.playlist') }}</div>
    </header>

    <!-- コンテンツなし -->
    <div
      v-if="!account.customer_id || !playlistInfo || playlistInfo.length === 0"
      class="page-content page-bottom scroll"
    >
      <div class="empty-box">
        <div class="icon">
          <svgicon name="playlist" width="60" height="60" color="#999999"></svgicon>
        </div>

        <template v-if="!account.customer_id">
          <h2>{{ $t('playlist.cannot_use_playlist') }}</h2>
          <p>{{ $t('playlist.cannot_use_playlist_msg') }}</p>
        </template>

        <template v-else>
          <h1>{{ $t('playlist.no_playlist') }}</h1>
          <h2 v-html="$t('playlist.playlist_desc')"></h2>
        </template>
      </div>
    </div>

    <div v-else class="page-content page-bottom scroll">
      <ol class="list-work">
        <!-- eslint-disable vue/no-use-v-if-with-v-for -->
        <li
          v-if="playlistInfo"
          v-for="playlist in playlistInfo"
          @click="openPlaylist(playlist.id)"
          class="list"
          :key="playlist.id"
          v-touchfeedback
        >
          <!-- eslint-enable vue/no-use-v-if-with-v-for -->
          <div class="thumbnail">
            <div v-if="playlist.worknos.length === 0" class="blank">
              <svgicon name="blank" width="40" height="40" color="#eeeeee"></svgicon>
            </div>

            <transition name="fade">
              <span
                v-if="
                  playlist.worknos.length !== 0 && playlist.worknos.length < 4 && images[playlist.worknos[0] + '/thumb']
                "
                class="single"
                :style="{ 'background-image': 'url(' + images[playlist.worknos[0] + '/thumb'] + ')' }"
              >
              </span>
            </transition>

            <template v-if="playlist.worknos.length >= 4">
              <transition-group tag="span" name="fade">
                <template v-for="i in 4">
                  <span
                    v-if="images[playlist.worknos[i - 1] + '/thumb']"
                    :key="'child' + i"
                    class="four"
                    :class="'child' + i"
                    :style="{ 'background-image': 'url(' + images[playlist.worknos[i - 1] + '/thumb'] + ')' }"
                  >
                  </span>
                </template>
              </transition-group>
            </template>
          </div>
          <div class="work-name">{{ playlist.playlist_name }}</div>
          <div class="maker-name">{{ $t('playlist.total', { total: playlist.count }) }}</div>
        </li>
      </ol>
    </div>

    <div @click="createPlaylist()" class="new-button" v-touchfeedback>
      <svgicon name="add" width="20" height="20" color="#fff"></svgicon>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import forEach from 'lodash/forEach'

export default {
  name: 'playlist',

  computed: {
    ...mapState('play', ['account']),

    ...mapState('work', ['images']),

    ...mapState('playlist', ['playlists']),

    ...mapGetters('playlist', ['playlistInfo'])
  },

  watch: {
    playlistInfo() {
      this.getImages()
    }
  },

  methods: {
    openPlaylist: function(id) {
      this.$router.push('/playlist/' + id)
    },

    createPlaylist: function() {
      this.$router.push('/playlist/new')
    },

    getImages: function() {
      if (!this.playlistInfo) {
        return false
      }

      let worknos = []

      forEach(this.playlistInfo, playlist => {
        worknos = worknos.concat(playlist.worknos.slice(0, 4))
      })

      this.$store.dispatch('work/getImages', {
        workno: worknos,
        imageTypes: ['thumb']
      })
    }
  },

  created() {
    this.getImages()
  }
}
</script>
