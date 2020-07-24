<style lang="scss" src="./Storage.scss" scoped></style>

<template>
  <div class="page">
    <header class="navigation-bar">
      <template v-if="!isEditMode">
        <div v-if="!$app.$data.isWide" class="menu" @click="$app.$data.isShowMenu = true" key="menu" v-touchfeedback>
          <svgicon name="hamburger-menu" width="20" height="20" color="#fff"></svgicon>
        </div>
        <div class="title">{{ $t('storage.storage_conf') }}</div>
      </template>
      <div v-else key="del" class="left">
        <div @click="deleteAllCache()" class="button delete" v-touchfeedback>{{ $t('app.all_delete') }}</div>
      </div>

      <div v-if="config.supportBlob" class="right">
        <div v-if="!isEditMode" @click="isEditMode = true" class="button" v-touchfeedback>{{ $t('app.edit') }}</div>
        <div v-else @click="isEditMode = false" class="button" v-touchfeedback>{{ $t('app.ok') }}</div>
      </div>
    </header>

    <div class="page-content page-bottom scroll">
      <div v-if="config.isPrivateMode || !config.supportBlob">
        <div class="empty-box">
          <div class="icon">
            <svgicon name="storage" width="60" height="60" color="#999999"></svgicon>
          </div>
          <h2>{{ $t('storage.cannot_use_storage') }}</h2>
          <div v-if="config.isPrivateMode">
            <p>{{ $t('storage.is_private') }}</p>
          </div>
          <div v-else-if="!account.customer_id">
            <p>{{ $t('storage.is_no_login') }}</p>
          </div>
          <div v-else-if="!$app.isPc">
            <p>{{ $t('storage.is_no_browser') }}</p>
            <div class="browser-icons">
              <div @click="link('uc')" class="icon uc" v-touchfeedback>UC<br />Browser</div>
            </div>
          </div>
          <div v-else>
            <p>{{ $t('storage.is_no_browser_pc') }}</p>
          </div>
        </div>
      </div>

      <div v-else-if="cacheFileInfo">
        <div class="used-storage">
          {{ $t('storage.used_storage', { used: $options.filters.bytes(cacheFileInfo.total || 0) }) }}
        </div>

        <div class="content-box">
          <ol class="list-work" :class="{ editing: isEditMode }">
            <li v-for="work in cacheFileInfo.works" :key="work.workno" @click="open(work.meta.workno)" v-touchfeedback>
              <transition name="fade">
                <div v-if="isEditMode" class="delete" @click.stop="deleteCacheFile(work.workno)" v-touchfeedback>
                  <svgicon name="delete-circle-1" width="20" height="20" color="#ff0000"></svgicon>
                </div>
              </transition>

              <div class="meta" v-if="work.meta">
                <div class="thumbnail">
                  <transition name="fade">
                    <span
                      v-if="images[work.meta.workno + '/thumb']"
                      :style="{ 'background-image': 'url(' + images[work.meta.workno + '/thumb'] + ')' }"
                    ></span>
                  </transition>
                </div>
                <div class="work-name">{{ work.meta.work_name }}</div>
                <div class="maker-name">{{ work.meta.maker_name }}</div>
              </div>
              <div class="size">{{ work.size | bytes }}</div>
            </li>
          </ol>

          <ol class="list-work setting" :class="{ editing: isEditMode }">
            <li>
              <transition name="fade">
                <div v-if="isEditMode" class="delete" @click.stop="deleteImageCache()" v-touchfeedback>
                  <svgicon name="delete-circle-1" width="20" height="20" color="#ff0000"></svgicon>
                </div>
              </transition>

              <div class="meta">
                <div class="thumbnail">
                  <svgicon name="system" width="28" height="28" color="#999999"></svgicon>
                </div>
                <div class="work-name">{{ $t('storage.image_cache') }}</div>
              </div>

              <div class="size">{{ (cacheFileInfo.imageCacheSize || 0) | bytes }}</div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'storage',

  data() {
    return {
      isEditMode: false
    }
  },

  watch: {
    cacheFileInfo: function() {
      this.getImages()
    }
  },

  computed: {
    ...mapState('play', ['account', 'config']),

    ...mapState('work', ['images', 'cacheFileInfo'])
  },

  methods: {
    open: function(workno) {
      this.$router.push('/work/' + workno)
    },

    getCacheFileInfo: function() {
      this.$store.dispatch('work/getCacheFileInfo')
    },

    // 作品削除
    deleteCacheFile: function(workno) {
      this.$store.dispatch('work/deleteCacheFile', workno)
    },

    // 画像キャッシュ削除
    deleteImageCache: function() {
      this.$store.dispatch('work/deleteImageCache')
    },

    // 全て削除
    deleteAllCache: function() {
      this.$confirm(this.$t('storage.clear_all_msg')).then(dismiss => {
        if (dismiss) {
          return Promise.all([
            this.$store.dispatch('work/deleteAllCacheFile'),
            this.$store.dispatch('work/deleteImageCache')
          ]).then(() => {
            this.isEditMode = false
          })
        }
      })
    },

    link: function(type) {
      let url = ''

      if (type === 'guide') {
        url = '/ja/'
      } else if (type === 'opera') {
        url = 'https://itunes.apple.com/jp/app/id363729560?mt=8'
      } else if (type === 'dolphin') {
        url = 'https://itunes.apple.com/jp/app/id482508913?mt=8'
      } else if (type === 'uc') {
        url = 'https://itunes.apple.com/jp/app/id1048518592?mt=8'
      }

      window.open(url)
    },

    getImages: function() {
      if (this.cacheFileInfo) {
        this.$store.dispatch('work/getImages', {
          workno: this.cacheFileInfo.works.map(v => v.workno),
          imageTypes: ['thumb']
        })
      }
    }
  },

  created() {
    this.getCacheFileInfo()
    this.getImages()
  }
}
</script>
