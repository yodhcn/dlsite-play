<style lang="scss" src="./Tree.scss"></style>

<template>
  <div class="page">
    <header class="navigation-bar" :class="{ dark: playlistId }">
      <div v-if="!$app.$data.isWide && !playlistId" class="menu" @click="$app.$data.isShowMenu = true" v-touchfeedback>
        <svgicon name="hamburger-menu" width="20" height="20" color="#fff"></svgicon>
      </div>
      <div v-else class="left pointer" @click="$router.go(-1)" v-touchfeedback>
        <svgicon name="prev" width="20" height="20" color="#fff"></svgicon>
        <span>{{ $t('app.back') }}</span>
      </div>

      <div v-if="playlistId" class="center small">{{ $t('work.add_playlist') }}</div>

      <div v-if="playlistId" class="right">
        <div class="button done" @click="$router.go((breadcrumbs.length + 1) * -1)" v-touchfeedback>
          {{ $t('app.ok') }}
        </div>
      </div>
      <div v-else class="right">
        <div class="button" @click="isShowMylistMenu = true" v-touchfeedback>
          <svgicon name="mylist-stroke" width="20" height="20" color="#fff"></svgicon>
          <span v-if="$app.$data.isWide">{{ $t('mylist.mylist') }}</span>
        </div>

        <div
          v-if="
            meta &&
              meta.dl_format !== 17 &&
              !(meta.download_start_date && new Date(meta.download_start_date) > new Date())
          "
          class="button"
          @click="showDownloadMenu()"
          v-touchfeedback
        >
          <svgicon name="download" width="20" height="20" color="#fff"></svgicon>
          <span v-if="$app.$data.isWide">{{ $t('work.download') }}</span>
        </div>
      </div>
    </header>

    <div ref="content" class="page-content page-bottom scroll">
      <!-- 作品情報ボックス -->
      <work-info v-if="meta" :meta="meta" :key="workno"></work-info>

      <!-- 非表示設定 -->
      <work-ignore v-if="meta" :workno="meta.workno"></work-ignore>

      <div class="work-tree">
        <!-- ziptreeがある -->
        <div v-if="meta" :key="path" class="children">
          <!-- パンくずリスト -->
          <div class="breadcrumb" ref="breadcrumb">
            <ul class="location-path">
              <li
                v-for="(dir, i) in breadcrumbs"
                :key="i"
                @click="breadcrumbs.length !== i + 1 && $router.go((breadcrumbs.length - (i + 1)) * -1)"
                class="path-item"
                v-touchfeedback
              >
                <span>{{ dir }}</span>
              </li>
            </ul>
          </div>

          <!-- 予約作品 -->
          <div
            v-if="meta.download_start_date && new Date(meta.download_start_date) > new Date()"
            class="empty-box content"
          >
            <div class="icon">
              <svgicon name="zip-download" width="80" height="80" color="#999999"></svgicon>
            </div>
            <p v-html="$t('work.reserve_download')"></p>
            <strong>{{ $t('work.download_start_at', { start_at: humanizeTime(meta.download_start_date) }) }}</strong>
          </div>

          <!-- レンタル作品 -->
          <template v-else-if="meta.rental_id">
            <div
              v-if="meta.rental_expired_date && new Date(meta.rental_expired_date) < new Date()"
              class="empty-box content"
            >
              <p v-html="$t('work.rental_expired')"></p>
              <p v-if="meta.inservice === 1">
                <small>{{ $t('work.rental_expired_2') }}</small>
              </p>
            </div>

            <div v-else class="empty-box content">
              <div class="icon">
                <svgicon name="zip-download" width="80" height="80" color="#999999"></svgicon>
              </div>
              <a :href="downloadZipUrl" target="_blank" class="button" v-touchfeedback>{{ $t('work.zip_download') }}</a>

              <strong v-if="meta.rental_activate_date">{{
                $t('work.rental_period', {
                  active_date: new Date(meta.rental_activate_date),
                  expired_date: new Date(meta.rental_expired_date)
                })
              }}</strong>
              <strong v-else
                >{{ $t('work.rental_period_unused')
                }}<small>{{
                  $t('work.rental_period_unused_2', { expired_date: new Date(meta.rental_expired_date) })
                }}</small></strong
              >
            </div>
          </template>

          <!-- ziptree -->
          <ol v-else-if="children" class="tree">
            <li
              v-for="(item, i) in children"
              :key="i"
              @click="openItem(item)"
              class="item"
              :class="{
                disabled:
                  (playlistId && item.type === 'file' && item.info.type !== 'audio') ||
                  item.info.type === 'file' ||
                  (item.info.type === 'text' && item.info.text.slice(-1) !== 'B')
              }"
              v-touchfeedback
            >
              <!-- 再生中 -->
              <div v-if="currItem && currItem.hashname && currItem.hashname === item.hashname" class="thumbnail">
                <svgicon v-if="playing" name="volume-on" width="20" height="20" color="#1f9aff"></svgicon>
                <svgicon v-else name="audio-pausing" width="14" height="14" color="#1f9aff"></svgicon>
              </div>

              <div v-else class="thumbnail">
                <svgicon v-if="item.type === 'folder'" name="folder" width="30" height="30" color="#ffcc33"></svgicon>
                <svgicon
                  v-else-if="item.info.type === 'text'"
                  name="file-text"
                  width="30"
                  height="30"
                  color="#999999"
                ></svgicon>
                <svgicon
                  v-else-if="item.info.type === 'video'"
                  name="file-video"
                  width="30"
                  height="30"
                  color="#ff85c2"
                ></svgicon>
                <svgicon
                  v-else-if="item.info.type === 'audio'"
                  name="file-audio"
                  width="30"
                  height="30"
                  color="#ffb04b"
                ></svgicon>
                <svgicon
                  v-else-if="item.info.type === 'html'"
                  name="file-html"
                  width="30"
                  height="30"
                  color="#b98fea"
                ></svgicon>
                <svgicon
                  v-else-if="item.info.type === 'pdf'"
                  name="file-pdf"
                  width="30"
                  height="30"
                  color="#ff6957"
                ></svgicon>
                <template v-else-if="item.info.type === 'image'">
                  <transition name="delayfade" appear>
                    <svgicon
                      :data-workno="workno"
                      :data-hashname="item.hashname"
                      class="lazyload"
                      name="file-image"
                      width="30"
                      height="30"
                      color="#59ca8f"
                    ></svgicon>
                  </transition>
                </template>
                <svgicon v-else name="file" width="30" height="30" color="#999999"></svgicon>
              </div>

              <div v-if="item.type === 'folder'" class="filename">{{ item.name }}</div>
              <div v-else class="filename">{{ item.name | stripExt }}</div>

              <div class="iteminfo">{{ item.info.text }}</div>

              <!-- プレイリストピッカーステータス -->
              <template v-if="item.type === 'file' && playlistId">
                <div
                  v-if="item.info.type === 'audio' && addedAudios && addedAudios[(path ? path + '/' : '') + item.name]"
                  class="added-icon"
                >
                  <span v-if="addedAudios[(path ? path + '/' : '') + item.name] === 1">
                    <svgicon name="check" width="12" height="12" color="#fff"></svgicon>
                  </span>
                  <span v-else>{{ addedAudios[(path ? path + '/' : '') + item.name] }}</span>
                </div>
                <div v-else-if="item.info.type === 'audio'" class="add-icon">
                  <svgicon name="add" width="11" height="11" color="#2ecf34"></svgicon>
                </div>
              </template>

              <!-- ファイルステータス -->
              <template v-else-if="item.type === 'file'">
                <!-- ダウンロード待ち -->
                <div class="download" v-if="isCacheQueued(workno, item.hashname).status === 'waiting'">
                  <svgicon class="rotating" name="download-waiting" width="20" height="20" color="#1f9aff"></svgicon>
                </div>
                <!-- ダウンロード中 -->
                <div class="download" v-else-if="isCacheQueued(workno, item.hashname).status === 'progress'">
                  <div class="progress-wrap">
                    <div
                      class="progress"
                      :style="{ width: isCacheQueued(workno, item.hashname).progress * 100 + '%' }"
                    ></div>
                  </div>
                </div>
                <!-- ダウンロード済み -->
                <div class="download" v-else-if="isCached(workno, item.hashname)">
                  <svgicon name="downloaded" width="20" height="20" color="#1f9aff"></svgicon>
                </div>
              </template>

              <!-- フォルダ内ダウンロード済み -->
              <div v-if="item.type === 'folder' && isCached(workno, item.children)" class="download">
                <svgicon name="downloaded" width="20" height="20" color="#1f9aff"></svgicon>
              </div>
            </li>
          </ol>

          <!-- Play非対応作品 -->
          <template v-else-if="!meta.is_playwork">
            <div v-if="downloadable" class="empty-box content">
              <div class="icon">
                <svgicon name="zip-download" width="80" height="80" color="#999999"></svgicon>
              </div>
              <a :href="downloadZipUrl" target="_blank" class="button" v-touchfeedback>{{ $t('work.zip_download') }}</a>
              <strong v-if="meta.content_length > 0"
                >{{ meta.content_count > 1 ? $t('work.total') + ' ' : '' }} {{ meta.content_length | bytes }}</strong
              >
            </div>

            <div v-else class="empty-box content">
              <div class="icon">
                <svgicon name="pc-only" width="80" height="80" color="#999999"></svgicon>
              </div>
              <h3 v-html="$t('work.pc_only')"></h3>
            </div>
          </template>
        </div>

        <!-- ziptreeが読み込み中 -->
        <loader v-if="meta && !children && meta.is_playwork"></loader>
      </div>
      <!-- /tree-wrapper -->

      <!-- サークル・メーカー関連作品 -->
      <related-products :workno="workno"></related-products>
    </div>

    <!-- HTMLメニュー -->
    <form ref="openhtml">
      <dialog-box type="prompt" v-if="htmlMenuItem" @close="htmlMenuItem = null">
        <h3 slot="header">{{ $t('work.html_open') }}</h3>
        <ol slot="body">
          <li v-if="!htmlMenuItem.noreader" @click="openHtml(htmlMenuItem, 'reader')" v-touchfeedback>
            <span class="icon"><svgicon name="open-reader" width="20" height="20" color="#666666"></svgicon></span>
            <span class="text">{{ $t('work.html_open_reader') }}</span>
          </li>
          <li @click="openHtml(htmlMenuItem, 'html')" v-touchfeedback>
            <span class="icon"><svgicon name="open-html" width="20" height="20" color="#666666"></svgicon></span>
            <span class="text">{{ $t('work.html_open_original') }}</span>
          </li>
          <li @click="htmlMenuItem = null" class="cancel" v-touchfeedback>
            <span class="icon"><svgicon name="close" width="16" height="16" color="#666666"></svgicon></span>
            <span class="text">{{ $t('app.cancel') }}</span>
          </li>
        </ol>
      </dialog-box>
    </form>

    <!-- マイリストメニュー -->
    <dialog-box type="dialog" v-if="isShowMylistMenu" @close="isShowMylistMenu = false">
      <h3 slot="header">{{ $t('work.add_mylist') }}</h3>
      <ol slot="body">
        <!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
        <template v-if="mylistInfo && mylistInfo.length > 0" v-for="mylist in mylistInfo">
          <li
            v-if="mylist.worknos.indexOf(workno) === -1"
            @click="addMylistWork(mylist.id)"
            class="list"
            :key="mylist.id"
            v-touchfeedback
          >
            <span>{{ mylist.mylist_name }}</span>
          </li>
          <li v-else class="list" :key="mylist.id">
            <span>{{ mylist.mylist_name }}</span>
            <svgicon class="checked" name="check" width="20" height="20" color="#1f9aff"></svgicon>
          </li>
        </template>
        <li v-if="!mylistInfo || mylistInfo.length === 0">{{ $t('work.no_mylist') }}</li>
      </ol>
    </dialog-box>

    <!-- ダウンロードメニュー -->
    <dialog-box type="prompt" v-if="isShownDownloadMenu()" @close="showDownloadMenu(false)">
      <ol slot="body">
        <li @click="downloadItem('children')" v-touchfeedback>
          <span class="icon"><svgicon name="folder" width="20" height="20" color="#666666"></svgicon></span>
          <span class="text">{{ $t('work.download_from_folder') }}</span>
        </li>
        <li @click="downloadItem('all')" v-touchfeedback>
          <span class="icon"><svgicon name="download" width="20" height="20" color="#666666"></svgicon></span>
          <span class="text">{{ $t('work.download_all') }}</span>
        </li>
        <li v-if="downloadable" @click="downloadZip()" v-touchfeedback>
          <span class="icon"><svgicon name="zip-download" width="20" height="20" color="#666666"></svgicon></span>
          <span class="text">{{
            $app.$data.isPc ? $t('work.download_to_desktop') : $t('work.download_to_mobile')
          }}</span>
        </li>
        <li @click="hideDownloadMenu()" class="cancel" v-touchfeedback>
          <span class="icon"><svgicon name="close" width="16" height="16" color="#666666"></svgicon></span>
          <span class="text">{{ $t('app.cancel') }}</span>
        </li>
      </ol>
    </dialog-box>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
// import * as Sentry from '@sentry/browser'
import FileFormat from '@/classes/file-format'
import Loader from 'components/Loader.vue'
import WorkInfo from 'components/library/work/Info.vue'
import DialogBox from 'components/DialogBox.vue'
import RelatedProducts from 'components/recommend/Related'
import cloneDeepWith from 'lodash/cloneDeepWith'
import cloneDeep from 'lodash/cloneDeep'
import forEach from 'lodash/forEach'
import api from '@/store/api'
import WorkMixin from 'components/library/work/WorkMixin'
import MenuMixin from 'components/menu/MenuMixin'
import WorkIgnore from 'components/library/work/Ignore.vue'
import env from '@/utils/env'

export default {
  name: 'worktree',

  mixins: [WorkMixin, MenuMixin],

  props: ['workno', 'path', 'meta', 'tree'],

  data() {
    return {
      htmlMenuItem: null,
      isShowMylistMenu: false
    }
  },

  computed: {
    ...mapState('play', ['account', 'config']),

    // 現在再生中の曲
    ...mapState('audio', ['playing']),

    ...mapGetters('audio', ['currItem']),

    ...mapState('work', ['images', 'cacheFileIndex', 'cacheFileQueueInfo']),

    ...mapGetters('work', ['isCached', 'isCacheQueued']),

    ...mapGetters('mylist', ['mylistInfo']),

    ...mapState('playlist', ['playlists']),

    downloadable() {
      if (this.$app.$data.isPc) {
        return true
      } else {
        return this.meta && [-1, 1].indexOf(this.meta.touch_inservice) !== -1 && this.meta.touch_content_count > 0
      }
    },

    downloadZipUrl() {
      return api.apiPath + 'dlsite/download?workno=' + this.workno
    },

    playlistId() {
      return this.$parent && this.$parent.$parent && this.$parent.$parent.$props ? this.$parent.$parent.$props.id : null
    },

    addedAudios() {
      if (!this.playlistId || !this.playlists[this.playlistId]) {
        return null
      }

      let src = {}

      forEach(this.playlists[this.playlistId].playlist_audio_map, v => {
        if (src[v.src]) {
          src[v.src] += 1
        } else {
          src[v.src] = 1
        }
      })

      return src
    },

    // レンダリング上の正しいパスを返す
    breadcrumbs() {
      if (!this.tree || !this.tree.children) {
        return [this.meta.work_name]
      }

      let path = []
      let children = this.tree.children

      if (this.path) {
        if (!(children.length === 1 && children[0].type === 'folder')) {
          path.push(this.meta.work_name)
        }

        forEach(this.path.trim('/').split('/'), name => {
          forEach(children, item => {
            if (item.name.trim() === name.trim() && item.children) {
              children = item.children

              if (!(children.length === 1 && children[0].type === 'folder')) {
                path.push(path.length === 0 ? this.meta.work_name : name)
              }

              return false
            }
          })
        })
      } else {
        path.push(this.meta.work_name)
      }

      return path
    },

    // 現在のパスのファイルやディレクトリ情報を返す
    children() {
      if (!this.tree) {
        return null
      }

      let path = ''
      let children = this.tree.children

      // path指定された階層へ移動
      if (this.path) {
        forEach(this.path.trim('/').split('/'), name => {
          forEach(children, item => {
            if (item.name.trim() === name.trim() && item.children) {
              children = item.children
              path = item.path
              return false
            }
          })
        })
      }

      // 1ディレクトリのみだった場合は、そのディレクトリの中にスキップ
      let isDirSkip = false
      while (children.length === 1 && children[0].type === 'folder') {
        isDirSkip = true
        path = children[0].path
        children = children[0].children
      }

      // URLをziptreeから取得した正しいパスに書き換え（適当なURL入力されてもここで修正する）
      let urlpath = this.path ? this.path : ''

      // スキップされたパスへ移動
      if (isDirSkip || urlpath !== path) {
        if (this.playlistId) {
          this.$router.replace(
            '/playlist/' + this.playlistId + '/add/' + this.workno + '/tree/' + encodeURIComponent(path)
          )
        } else {
          this.$router.replace('/work/' + this.workno + '/tree/' + encodeURIComponent(path))
        }
        return null
      }

      children = cloneDeep(children)

      forEach(children, item => {
        item.info = this.playfileInfo(item)
      })

      return children
    }
  },

  methods: {
    /**
     * アイテムを開く
     */
    openItem: function(item) {
      // ディレクトリを開く
      if (item.children) {
        if (this.playlistId) {
          this.$router.push(
            '/playlist/' + this.playlistId + '/add/' + this.workno + '/tree/' + encodeURIComponent(item.path)
          )
        } else {
          this.$router.push('/work/' + this.workno + '/tree/' + encodeURIComponent(item.path))
        }

        // ファイル
      } else {
        let playfile = this.tree.playfile[item.hashname]

        // 非対応ファイル
        if (!playfile) {
          return false
        }

        // ファイルの拡張子からファイルタイプを判別
        const filetype = FileFormat.getFiletype(item.hashname.split('.').pop())

        // html は playfile.type を持たないためファイル破損チェック対象から除外
        if (filetype && filetype != 'html') {
          // ファイル破損チェック
          if (!playfile[playfile.type]) {
            this.$alert(this.$t('library.corrupted_file'))

            // Sentry.configureScope(scope => {
            //   scope.setExtra('workno', this.workno)
            // })

            throw new Error('The file is corrupted')
          }
        }

        // プレイリストに追加
        if (this.playlistId) {
          if (playfile.type === 'audio') {
            let src = (this.path ? this.path + '/' : '') + item.name
            this.addPlaylistAudio(this.playlistId, src)
          }

          return false
        }

        // ファイルを開く
        if (
          playfile.type === 'image' ||
          playfile.type === 'pdf' ||
          playfile.type === 'video' ||
          (playfile.type === 'text' && playfile.length > 0)
        ) {
          this.$router.push(
            '/work/' + this.workno + '/view/' + encodeURIComponent((this.path ? this.path + '/' : '') + item.name)
          )

          // HTMLファイル かつ 作品のファイル形式がHTML
        } else if (playfile.type === 'html' && ['HTE', 'HTI', 'HMO', 'HTF'].includes(this.meta.file_type)) {
          this.htmlMenuItem = { noreader: !!playfile.html && !!playfile.html.noreader, ...item }

          // 音声ファイル
        } else if (playfile.type === 'audio') {
          this.$app.audioPlayerMode('show')
          this.$store.dispatch('audio/setAudiolist', this.getAudiolistByTree(item.hashname)).then(() => {
            return this.$store.dispatch('audio/play')
          })
        }
      }
    },

    // HTMLを開く
    openHtml: function(item, type) {
      const authUrls = {
        test: 'http://auth.play.dlsite.fun/auth',
        development: 'https://auth.play.dlsite.fun/auth',
        staging: 'https://auth.play.dlsite.fun/auth',
        production: 'https://auth.play.dlsite.fun/auth'
      }

      const dirpath = 'html/' + (this.path ? this.path + '/' : '')
      const basepath = type === 'reader' ? 'r-' + item.name : item.name

      let urlparams = new URLSearchParams()

      urlparams.append('workno', this.workno)
      urlparams.append('path', dirpath + basepath)
      if (this.$app.locale === 'en') {
        urlparams.append('lang', 'eng')
      }

      let inputdata = document.createElement('input')
      inputdata.setAttribute('type', 'hidden')
      inputdata.setAttribute('name', '__DLsite_SID')
      inputdata.setAttribute('value', this.account.sid)

      window.open('', 'htmlviewer')
      this.$refs.openhtml.action = authUrls[env] + '?' + urlparams.toString()
      this.$refs.openhtml.method = 'post'
      this.$refs.openhtml.target = 'htmlviewer'
      this.$refs.openhtml.appendChild(inputdata)
      this.$refs.openhtml.submit()

      this.htmlMenuItem = null
    },

    // マイリストに作品を追加
    addMylistWork: function(id) {
      if (this.mode === 'add-mylist') {
        this.$store
          .dispatch('mylist/updateMylistWork', {
            type: 'add',
            mylist_id: this.id,
            workno: id
          })
          .catch(e => {
            this.$alert(e.message)
          })
      } else {
        this.$store
          .dispatch('mylist/updateMylistWork', {
            type: 'add',
            mylist_id: id,
            workno: this.workno
          })
          .catch(e => {
            this.$alert(e.message)
          })

        this.isShowMylistMenu = false
      }
    },

    // プレイリストに音声を追加
    addPlaylistAudio: function(playlistId, src) {
      // this.isShowMylistMenu = false
      this.$store
        .dispatch('playlist/updatePlaylistAudio', {
          type: 'add',
          playlist_id: playlistId,
          workno: this.workno,
          src: src
        })
        .catch(e => {
          this.$alert(e.message)
        })
    },

    /**
     * ZIPをダウンロード
     */
    downloadZip: function() {
      this.hideDownloadMenu()
      const downloadUrl = api.apiPath + 'dlsite/download?workno=' + this.workno
      if (env === 'test') {
        // 実機確認できないのでselfで開く
        location.href = downloadUrl
      } else {
        open(downloadUrl)
      }
    },

    /**
     * アイテムをダウンロードキューに入れる
     */
    downloadItem: function(type) {
      let items = []

      this.hideDownloadMenu()

      if (this.config.isPrivateMode) {
        return this.$alert(this.$t('work.is_private'))
      }

      if (!this.config.supportBlob) {
        return this.$alert(this.$t('work.can_not_download'))
      }

      // いまのディレクトリのみ
      if (type === 'children') {
        forEach(this.children, item => {
          if (item.type === 'file') {
            items.push({
              workno: this.workno,
              name: item.name,
              hashname: item.hashname
            })
          }
        })

        // すべてのファイル
      } else if (type === 'all') {
        // childrenからhashnameを抽出する
        cloneDeepWith(this.tree.children, item => {
          if (item.type === 'file') {
            items.push({
              workno: this.workno,
              name: item.name,
              hashname: item.hashname
            })
          }
        })
      }

      this.$store
        .dispatch('work/addCacheFileQueue', items)
        .then(() => {
          if (this.cacheFileIndex === 0 && this.cacheFileQueueInfo.total > 1024 * 1024 * 10) {
            return this.$confirm(
              this.$t('work.download_confirm', { total: this.$options.filters.bytes(this.cacheFileQueueInfo.total) })
            )
          } else {
            return Promise.resolve(true)
          }
        })
        .then(dismiss => {
          if (dismiss) {
            return this.$store.dispatch('work/startCacheFileQueue')
          } else {
            return this.$store.dispatch('work/clearCacheFileQueue')
          }
        })
        .catch(() => {
          this.$alert(this.$t('work.can_not_download'))
          return this.$store.dispatch('work/clearCacheFileQueue')
        })
    },

    /**
     * ファイルツリーからプレイリストを生成してセットする
     */
    getAudiolistByTree(startHashname) {
      let audiolist = []
      let start = null

      forEach(this.children, (item, index) => {
        let playfile = this.tree.playfile[item.hashname]
        let src = (this.path ? this.path + '/' : '') + item.name

        if (startHashname === item.hashname) {
          start = index
        }

        if (playfile && playfile.audio) {
          audiolist.push({
            playlist_id: index,
            workno: this.workno,
            src
          })
        }
      })

      return { audiolist, start }
    },

    // ファイル情報の概要を返す
    playfileInfo: function(item) {
      if (item.children) {
        return { type: 'folder', text: item.children.length + this.$t('work.item') }
      }

      let playfile = this.tree.playfile[item.hashname]
      let ext = item.hashname.split('.').pop()

      if (!playfile) {
        if (ext.length > 5) {
          ext = 'unknown'
        }

        return { type: 'file', text: ext + this.$t('listitem.file') }
      }

      let filesize = playfile.size
      let time = ''

      const filetype = FileFormat.getFiletype(ext)

      if (!filetype) {
        return { type: 'file', text: ext + this.$t('listitem.file') + ' - ' + filesize }
      }

      switch (filetype) {
        case 'text': {
          let textfilesize = playfile.length > 0 ? ' - ' + filesize : ''

          return { type: 'text', text: this.$t('listitem.text') + this.$t('listitem.file') + textfilesize }
        }

        case 'audio':
          if (playfile.audio && playfile.audio.optimized) {
            time = ' - ' + this.secondToTime(playfile.audio.optimized.duration)
          }

          return { type: 'audio', text: ext.toUpperCase() + this.$t('listitem.audio') + time }

        case 'video':
          if (playfile.video && playfile.video.optimized) {
            time = ' - ' + this.secondToTime(playfile.video.optimized.duration)
          }

          return { type: 'video', text: ext.toUpperCase() + this.$t('listitem.video') + time }

        case 'html':
          return { type: 'html', text: 'HTML' + this.$t('work.file') }

        case 'pdf':
          var pages = ''

          if (playfile.pdf) {
            pages = ' - ' + playfile.pdf.page.length + this.$t('listitem.pages')
          }

          return { type: 'pdf', text: this.$t('listitem.pdf') + this.$t('listitem.file') + pages }

        case 'image':
          var size = ''
          ext = ext === 'jpg' ? 'jpeg' : ext

          if (playfile.image) {
            if (playfile.image.files && ext !== 'gif') {
              size = ' - ' + playfile.image.files.width + 'x' + playfile.image.files.height
            } else if (playfile.image.optimized) {
              size = ' - ' + playfile.image.optimized.width + 'x' + playfile.image.optimized.height
            }
          }

          return { type: 'image', text: ext.toUpperCase() + this.$t('listitem.image') + size }
      }
    },

    // 秒を時間表記に
    secondToTime: function(sec) {
      sec = Math.round(sec)
      var hours = Math.floor(sec / 3600)
      var minutes = Math.floor((sec - hours * 3600) / 60)
      var seconds = sec - hours * 3600 - minutes * 60

      return (hours > 0 ? hours + ':' : '') + this.zeroFill(minutes, 2) + ':' + this.zeroFill(seconds, 2)
    },

    // ゼロ埋め
    zeroFill: function(number, length) {
      return (Array(length).join('0') + number).slice(-length)
    }
  },

  components: {
    Loader,
    WorkInfo,
    WorkIgnore,
    DialogBox,
    RelatedProducts
  }
}
</script>
