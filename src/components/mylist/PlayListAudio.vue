<style lang="scss" src="./MyListWork.scss" scoped></style>
<style lang="scss" src="./MyList.scss" scoped></style>
<style lang="scss" src="components/library/ListView.scss" scoped></style>

<template>
  <div class="page">
    <div class="playlist-audio">
      <header class="navigation-bar">
        <div class="left" @click="$router.go(-1)" v-touchfeedback>
          <svgicon name="prev" width="20" height="20" color="#fff"></svgicon>
          <span v-if="!isEditMode">{{ $t('app.back') }}</span>
          <span v-else>{{ $t('app.back') }}</span>
        </div>

        <div class="right">
          <span v-if="!isEditMode" @click="isEditMode = !isEditMode" class="button" v-touchfeedback>{{
            $t('app.edit')
          }}</span>
          <span v-else @click="isEditMode = !isEditMode" class="button" v-touchfeedback>{{ $t('app.ok') }}</span>
        </div>
      </header>

      <div class="page-content page-bottom scroll">
        <div class="list-info">
          <div class="thumbnail-box">
            <div class="thumbnail">
              <div v-if="!worknos || worknos.length === 0" class="blank">
                <svgicon name="blank" width="80" height="80" color="#eeeeee"></svgicon>
              </div>

              <template v-if="worknos && worknos.length >= 4">
                <transition-group tag="span" name="fade">
                  <template v-for="i in 4">
                    <span
                      v-if="images[worknos[i - 1] + '/thumb']"
                      :key="worknos[i - 1]"
                      class="four"
                      :class="'child' + i"
                      :style="{ 'background-image': 'url(' + images[worknos[i - 1] + '/thumb'] + ')' }"
                    >
                    </span>
                  </template>
                </transition-group>
              </template>

              <transition name="fade">
                <span
                  v-if="worknos && worknos.length !== 0 && worknos.length < 4 && images[worknos[0] + '/thumb']"
                  class="single"
                  :style="{ 'background-image': 'url(' + images[worknos[0] + '/thumb'] + ')' }"
                >
                </span>
              </transition>
            </div>
          </div>

          <transition name="fade">
            <div v-if="isEditMode" class="list-name-box" key="input-playlist-name">
              <input
                type="text"
                :placeholder="$t('playlist.input_playlist_name')"
                v-model="inputPlaylistName"
                ref="inputPlaylistName"
              />
              <div class="delete" @click="deletePlaylist()" v-touchfeedback>
                <svgicon name="delete-all" width="14" height="14" color="#999"></svgicon>
                <span>{{ $t('app.delete') }}</span>
              </div>
            </div>
            <div v-else class="list-name-box" key="playlist-name">
              <div class="name">{{ playlistName }}</div>
              <div v-if="audios" class="count">{{ $t('playlist.total', { total: audios.length }) }}</div>
            </div>
          </transition>
        </div>

        <draggable
          v-if="audios && audios.length > 0"
          v-model="audios"
          v-bind="getSortOptions()"
          @start="dragging = true"
          @end="dragging = false"
        >
          <transition-group name="list" tag="ol" class="list-work" :class="{ editing: isEditMode }">
            <li v-for="audio in audios" @click.prevent="open(audio.id)" class="item" :key="audio.id" v-touchfeedback>
              <div class="meta">
                <!-- 再生中 -->
                <div v-if="currItem && currItem.playlist_id === audio.id" class="play-icon">
                  <svgicon v-if="playing" name="volume-on" width="20" height="20" color="#1f9aff"></svgicon>
                  <svgicon v-else name="audio-pausing" width="14" height="14" color="#1f9aff"></svgicon>
                </div>

                <div v-else class="thumbnail">
                  <transition name="fade">
                    <span
                      v-if="images[audio.meta.workno + '/thumb']"
                      :style="{ 'background-image': 'url(' + images[audio.meta.workno + '/thumb'] + ')' }"
                    >
                    </span>
                  </transition>
                </div>

                <div class="work-name">{{ audio.src | basename | stripExt }}</div>
                <div class="maker-name">{{ audio.meta.work_name }}</div>
              </div>

              <transition name="list">
                <div v-if="isEditMode" key="delete" @click.stop="deleteAudio(audio.id)" class="delete">
                  <svgicon name="delete-circle-1" width="20" height="20" color="#ff0000"></svgicon>
                </div>
              </transition>

              <transition name="list-right">
                <div v-if="isEditMode" key="handle" class="sort-handle">
                  <svgicon name="move" width="18" height="18" color="#999999"></svgicon>
                </div>
              </transition>
            </li>
          </transition-group>
        </draggable>

        <!-- コンテンツなし -->
        <div v-else-if="audios && audios.length === 0" class="empty-box">
          <div class="icon">
            <svgicon name="playlist" width="60" height="60" color="#999999"></svgicon>
          </div>
          <h1>{{ $t('playlist.empty_playlist') }}</h1>
          <h2 v-if="isEditMode">{{ $t('playlist.empty_playlist_msg_edit') }}</h2>
          <h2 v-else>{{ $t('playlist.empty_playlist_msg') }}</h2>
        </div>

        <loader v-else></loader>
      </div>

      <transition name="fade">
        <div v-if="isEditMode && !dragging" @click="openPicker()" class="new-button" v-touchfeedback>
          <svgicon name="add" width="20" height="20" color="#fff"></svgicon>
        </div>
      </transition>
    </div>

    <transition name="modal">
      <div v-if="$route.name !== 'playlistaudio'" class="picker">
        <router-view></router-view>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="$app.$data.isWide && $route.name !== 'playlistaudio'" class="fade-overlay"></div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Loader from 'components/Loader.vue'
import draggable from 'vuedraggable'
import forEach from 'lodash/forEach'
import uniq from 'lodash/uniq'

export default {
  name: 'playlist-audio',

  props: ['id'],

  data() {
    return {
      initialized: false,
      dragging: false,
      inputPlaylistName: null,
      sortOptions: {
        disabled: true,
        draggable: '.item',
        handle: '.sort-handle'
      }
    }
  },

  watch: {
    playlists: function() {
      this.initialize()
    },

    audios: function() {
      this.getImages()
    },

    '$route.name': function(v) {
      if (this.initialized) {
        if (v === 'playlistaudio') {
          this.$store.dispatch('playlist/openPlaylist', this.id)
        } else {
          // waiting modal transition
          setTimeout(() => {
            this.$store.dispatch('playlist/closePlaylist', this.id)
          }, 500)
        }
      }
    }
  },

  computed: {
    // 現在再生中の曲
    ...mapState('audio', ['playing']),

    ...mapGetters('audio', ['currItem']),

    ...mapState('work', ['images']),

    ...mapState('playlist', ['playlists', 'playlistWorks']),

    isEditMode: {
      get() {
        return !this.sortOptions.disabled
      },
      set(val) {
        if (val) {
          this.inputPlaylistName = this.playlistName
        } else {
          this.updatePlaylistName(this.inputPlaylistName)
        }

        this.sortOptions.disabled = !val
      }
    },

    playlistName() {
      return this.playlists && this.playlists[this.id] ? this.playlists[this.id].playlist_name : ''
    },

    audios: {
      get() {
        // ソートしてmeta情報を組み合わせて返す
        if (this.playlists && this.playlists[this.id] && this.playlistWorks[this.id]) {
          let audios = []

          forEach(this.playlists[this.id].playlist_audio_id, id => {
            let v = this.playlists[this.id].playlist_audio_map[id]

            if (this.playlistWorks[this.id][v.workno]) {
              audios.push({
                id,
                src: v.src,
                meta: this.playlistWorks[this.id][v.workno]
              })
            }
          })

          return audios
        } else {
          return null
        }
      },
      set(val) {
        this.$store
          .dispatch('playlist/updatePlaylistAudio', {
            type: 'order',
            playlist_id: this.id,
            new_order: val.map(v => v.id)
          })
          .catch(e => {
            this.$alert(e.message)
          })
      }
    },

    worknos() {
      if (this.playlists && this.playlists[this.id]) {
        return uniq(
          this.playlists[this.id].playlist_audio_id.map(v => this.playlists[this.id].playlist_audio_map[v].workno)
        ).slice(0, 4)
      }

      return null
    }
  },

  methods: {
    getSortOptions() {
      return this.sortOptions
    },

    open: function(start_id) {
      if (!this.isEditMode) {
        let audiolist = this.playlists[this.id].playlist_audio_id.map(v => {
          const audiodata = this.playlists[this.id].playlist_audio_map[v]
          audiodata.playlist_id = v
          return audiodata
        })

        this.$app.audioPlayerMode('show')
        this.$store.dispatch('audio/setAudiolist', { audiolist, start: start_id }).then(() => {
          return this.$store.dispatch('audio/play')
        })
      }
    },

    openPicker: function() {
      this.$router.push('/playlist/' + this.id + '/add')
    },

    updatePlaylistName: function(name) {
      if (name !== '' && name !== this.playlistName) {
        this.$store.dispatch('playlist/updatePlaylist', {
          type: 'rename',
          playlist_id: this.id,
          playlist_name: name
        })
      }
    },

    deletePlaylist: function(force) {
      if (force) {
        this.$store
          .dispatch('playlist/closePlaylist', this.id)
          .then(() => {
            return this.$store.dispatch('playlist/updatePlaylist', {
              type: 'delete',
              playlist_id: this.id
            })
          })
          .then(() => {
            return this.$router.go(-1)
          })

        // 確認ダイアログ
      } else {
        this.$confirm(this.$t('playlist.playlist_delete_confirm')).then(dismiss => {
          if (dismiss) {
            this.deletePlaylist(true)
          }
        })
      }
    },

    deleteAudio: function(playlistAudioId) {
      this.$store
        .dispatch('playlist/updatePlaylistAudio', {
          type: 'delete',
          playlist_id: this.id,
          playlist_audio_id: playlistAudioId
        })
        .catch(e => {
          this.$alert(e.message)
        })
    },

    getImages: function() {
      if (this.audios) {
        this.$store.dispatch('work/getImages', {
          workno: this.audios.map(v => v.meta.workno),
          imageTypes: ['thumb']
        })
      }
    },

    initialize: function() {
      if (this.playlists !== null && !this.initialized && this.$route.name === 'playlistaudio') {
        // 新しいプレイリストを作成する
        if (this.id === 'new') {
          this.$store
            .dispatch('playlist/updatePlaylist', {
              type: 'create',
              playlist_name: this.$t('playlist.new_playlist')
            })
            .then(data => {
              this.$router.replace('/playlist/' + data.playlist_id, () => {
                this.$nextTick()
                  .then(() => {
                    this.isEditMode = true
                    this.inputPlaylistName = ''
                    return this.$store.dispatch('playlist/openPlaylist', data.playlist_id)
                  })
                  .then(() => {
                    setTimeout(() => {
                      if (this.$refs.inputPlaylistName) {
                        this.$refs.inputPlaylistName.focus()
                      }
                    }, 500)
                  })
              })
            })
            .catch(e => {
              this.$router.back()
              this.$alert(e.message)
            })

          // マイリストを開く
        } else {
          this.$store.dispatch('playlist/openPlaylist', this.id)
        }

        this.initialized = true
      }
    }
  },

  created() {
    this.initialize()
  },

  destroyed() {
    if (this.playlistWorks[this.id]) {
      this.$store.dispatch('playlist/closePlaylist', this.id)
    }
  },

  components: {
    draggable,
    Loader
  }
}
</script>
