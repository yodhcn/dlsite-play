<style lang="scss" src="./PhotoViewer.scss"></style>
<style lang="scss" src="@yodhcn/photoswipe/src/css/main.scss"></style>
<style lang="scss" src="@yodhcn/photoswipe/src/css/default-skin/default-skin.scss"></style>
<style lang="scss">
.disable-loading {
  .pswp__preloader__icn {
    display: none;
  }
}
</style>
<template>
  <div class="photo-viewer" :class="{ 'disable-loading': currentPage >= lastPage }">
    <!-- ナビゲーションバー -->
    <transition name="navbar">
      <header v-if="$app.initialized" v-show="isShowNavBar" class="navigation-bar photoviewer">
        <div class="left pointer" @click="$router.go(-1)" v-touchfeedback>
          <svgicon name="prev" width="20" height="20" color="#fff"></svgicon>
          <span>{{ $t('app.back') }}</span>
        </div>

        <div class="right">
          <div class="button" @click="isShowSetting = true" v-touchfeedback>
            <svgicon name="setting" width="20" height="20" color="#fff"></svgicon>
            <span>{{ $t('app.setting') }}</span>
          </div>
        </div>
      </header>
      <header v-else v-show="isShowNavBar" class="navigation-bar photoviewer">
        <div class="left pointer" @click="windowClose()" v-touchfeedback>
          <span>{{ $t('photo.close_viewer') }}</span>
        </div>
      </header>
    </transition>

    <!-- PhotoSwipe -->
    <div v-if="renderPswpElem" ref="pswp" class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="pswp__bg"></div>
      <div class="pswp__scroll-wrap">
        <div class="pswp__container">
          <div class="pswp__item"></div>
          <div class="pswp__item"></div>
          <div class="pswp__item"></div>
        </div>
        <div class="pswp__ui pswp__ui--hidden">
          <div class="pswp__top-bar">
            <div class="pswp__counter"></div>
            <div class="pswp__preloader">
              <div class="pswp__preloader__icn">
                <div class="pswp__preloader__cut">
                  <div class="pswp__preloader__donut"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
            <div class="pswp__share-tooltip"></div>
          </div>
          <button v-show="currentPage < lastPage" class="pswp__button pswp__button--arrow--left"></button>
          <button v-show="currentPage > 1" class="pswp__button pswp__button--arrow--right"></button>
          <div class="pswp__caption"><div class="pswp__caption__center"></div></div>
        </div>
      </div>
    </div>

    <!-- ページ進行度 -->
    <transition name="photo-toolbar">
      <div v-show="lastPage > 1 && isShowNavBar" class="photo-toolbar">
        <div v-if="sliderThumbs" class="photo-preview-box">
          <div class="thumb-wrap" :style="{ width: sliderThumbs.width + 'px', height: sliderThumbs.height + 'px' }">
            <div
              v-for="(item, i) in sliderThumbs.items"
              :key="i"
              class="thumbnail"
              :style="{
                width: item.width + 'px',
                height: item.height + 'px',
                'background-image': 'url(' + (/^play:/.test(item.src) ? '' : item.src) + ')'
              }"
            ></div>
          </div>
        </div>
        <div class="photo-page-controller">
          <div class="slider-wrap">
            <div ref="slider" class="photo-page-slider"></div>
            <div class="photo-page-count">
              {{ currentPage > lastPageOfBook ? lastPageOfBook : currentPage }} / {{ lastPageOfBook }}
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- 自動ページ送り -->
    <transition name="fade">
      <div
        v-if="$app.initialized && isShowNavBar && lastPage > 1"
        class="view-controls"
        @mouseleave="pageBreakToggleShown = false"
      >
        <!-- 改ページ切り替え -->
        <transition name="fade">
          <div class="toggle-pages-break" v-show="photoSpreadView && pageBreakToggleShown">
            <div class="balloon">
              <span>{{ $t('photo.toggle') }}</span>
              <div class="radio-group">
                <label>
                  <input type="radio" :value="true" v-model="photoFrontSingle" />
                  <span class="button">ON</span>
                </label>
                <label>
                  <input type="radio" :value="false" v-model="photoFrontSingle" />
                  <span class="button">OFF</span>
                </label>
              </div>
            </div>
          </div>
          <!-- 見開き -->
        </transition>
        <button
          v-if="$app.$data.isPc"
          class="toggle-spread-pages"
          :class="{ on: photoSpreadView }"
          @click="photoSpreadView = !photoSpreadView"
          @mouseenter="pageBreakToggleShown = true"
          v-touchfeedback
        >
          <svgicon name="spread-page" width="33" height="25" color="#fff"></svgicon>
          {{ $t('photo.spread_pages') }}
        </button>
        <!-- 自動ページ送り -->
        <button class="toggle-autoplay" @click="onToggleAutoplay()" v-touchfeedback>
          <svgicon v-if="autoplayTimerId" name="audio-pause" width="15" height="15" color="#fff"></svgicon>
          <svgicon v-else name="audio-play" width="15" height="15" color="#fff"></svgicon>
        </button>
      </div>
    </transition>

    <transition name="modal">
      <settings
        v-if="isShowSetting"
        @close="isShowSetting = false"
        class="setting-window"
        section="photo-viewer"
      ></settings>
    </transition>

    <!-- 関連作品 -->
    <transition name="modal">
      <RelationWorks
        v-if="isShowRelationWorks"
        @close="isShowRelationWorks = false"
        @windowClose="windowClose()"
        :workno="workno"
      ></RelationWorks>
    </transition>

    <transition name="fade">
      <div v-if="isShowRelationWorks" class="fade-overlay"></div>
    </transition>

    <!-- トースト -->
    <transition name="modal">
      <div v-if="toastMsg" class="toast">
        {{ toastMsg }}
      </div>
    </transition>
  </div>
</template>

<script>
import Vue from 'vue'
import work from '@/classes/work'
import Site from '@/utils/site'
import Settings from 'components/settings/Settings.vue'
import RelationWorks from 'components/library/RelationWorks.vue'
import RecommendBooks from 'components/recommend/Books.vue'
import PhotoSwipe from '@yodhcn/photoswipe/dist/photoswipe'
import PhotoSwipeUiDefault from '@yodhcn/photoswipe/dist/photoswipe-ui-default'
import noUiSlider from 'nouislider'
import Hamster from 'hamsterjs'
import cloneDeep from 'lodash/cloneDeep'
import indexOf from 'lodash/indexOf'
import forEach from 'lodash/forEach'
import throttle from 'lodash/throttle'
import maxBy from 'lodash/maxBy'
import sumBy from 'lodash/sumBy'

let pswp = null
let wheelHandler = null
let toastTimer = null

export default {
  name: 'photoviewer',

  props: ['workno', 'item', 'playfile', 'tree', 'children'],

  data() {
    return {
      toastMsg: null,
      renderPswpElem: true,
      isShowNavBar: true,
      enableNavBarHide: true,
      isShowSetting: false,
      isShowRelationWorks: false,
      sliderThumbs: null,
      items: [],
      currentPage: 0, // スライダーの現在頁番号
      lastPage: 0, // スライダーの最終頁番号
      lastPageOfBook: 0, // 作品の最終頁番号
      // currItem: null,
      autoplayTimerId: null,
      pageBreakToggleShown: false
    }
  },

  computed: {
    config() {
      return this.$store
        ? this.$store.state.play.config
        : {
            photoMoveAnimation: true
          }
    },

    // 見開き表示
    photoSpreadView: {
      get() {
        return this.$store.state.play.config.photoSpreadView
      },
      set(val) {
        this.$store.dispatch('play/setConfig', { key: 'photoSpreadView', val })
      }
    },

    // 見開き切り替え
    photoFrontSingle: {
      get() {
        return this.$store.state.play.config.photoFrontSingle
      },
      set(val) {
        this.$store.dispatch('play/setConfig', { key: 'photoFrontSingle', val })
      }
    }
  },

  watch: {
    // 設定変更時再描画
    photoFrontSingle() {
      this.renderGallery()
    },

    // 設定変更時再描画
    photoSpreadView() {
      this.renderGallery()
    } /*
    },
*/, // ファイルのレンダリング要求があったタイミングでURLを返す

    /*
    currItem () {
      if (!this.currItem) {
        return false
      }

      // スライダー更新
      this.$refs.slider.noUiSlider.set(this.currentPage)

      // console.log('getNumItemsFn', viewer.options.getNumItemsFn())
      // console.log(this.currentPage, this.lastPage, this.$app.initialized)

      // 最終ページならツールバーを出す
      if (this.currentPage >= this.lastPage) {
        // console.log('last');
        viewer.ui.setIdle(false)

        // 1秒後に関連作品を表示
        if (this.lastPage > 0 && !this.$app.initialized) {
          setTimeout(() => {
            this.isShowRelationWorks = true
          }, 500)
        }
      }

      // ファイルパス書き換え（PDF以外）
      /*
      if (this.currItem.filename && this.$route.path) {
        let routePath = this.$route.path.split('/')
        let path = decodeURIComponent(routePath.pop())
        path = path.split('/')

        if (path && path.length > 0) {
          path.pop()
          path.push(this.currItem.filename)
          this.$router.replace(routePath.join('/') + '/' + encodeURIComponent(path.join('/')))
        }
      }
      */ sliderThumbs() {
      if (this.sliderThumbs && this.sliderThumbs.items) {
        forEach(this.sliderThumbs.items, item => {
          if (/^play:/.test(item.src)) {
            let path = item.src.split('/')
            path = path[3] + '/' + path[4]

            let promise = this.$store
              ? this.$store.dispatch('work/getCacheFileUrl', { workno: this.workno, path })
              : work.getFileUrl(this.workno, path)

            promise.then(fileUrl => {
              this.$set(item, 'src', fileUrl)
            })
          }
        })
      }
    }
  },

  methods: {
    /**
     * アイテムリストを生成
     * @return Array
     */
    initItems() {
      let items = []
      let playfiles = []

      // プレイリストに加えるアイテム抽出
      if (this.playfile.type === 'image') {
        forEach(this.children, v => {
          let playfile = this.tree.playfile[v.hashname]

          if (playfile && playfile.image) {
            playfile.image.optimized.filename = v.name
            playfiles.push({
              ...playfile.image.optimized,
              thumbnail: {
                src: 'play://' + this.workno + '/thumbnails/' + playfile.image.thumbnails.name,
                width: playfile.image.thumbnails.width,
                height: playfile.image.thumbnails.height
              }
            })
          }
        })
      } else if (this.playfile.type === 'pdf') {
        if (this.playfile.pdf) {
          forEach(this.playfile.pdf.page, page => {
            if (page.optimized) {
              playfiles.push({
                ...page.optimized,
                thumbnail: {
                  src: 'play://' + this.workno + '/thumbnails/' + page.thumbnails.name,
                  width: page.thumbnails.width,
                  height: page.thumbnails.height
                }
              })
            }
          })
        } else {
          throw new Error('failed open pdf')
        }
      }

      // アイテム配列を作成
      forEach(playfiles, playfile => {
        let src = 'play://' + this.workno + '/optimized/' + playfile.name
        let name = playfile.name

        if (playfile.width <= 100 && playfile.height <= 100) {
          let ext = name.split('.')

          if (ext.length > 1) {
            name = ext[0] + '.' + (indexOf(['png', 'pic', 'pi', 'mag', 'maki'], ext[1]) !== -1 ? 'png' : 'jpg')
          }

          src = 'play://' + this.workno + '/thumbnails/' + name
        }

        items.push({
          src,
          filename: playfile.filename,
          key: playfile.name,
          w: playfile.width,
          h: playfile.height,
          crypt: playfile.crypt,
          thumbnail: playfile.thumbnail
        })
      })

      return items
    },

    /**
     * PhotoSwipeビューワーを初期化
     * @return Promise
     */
    renderGallery() {
      // 既に存在していたらclose
      if (pswp) {
        pswp.close()
        pswp = null
      }

      this.renderPswpElem = false
      // DOMを一旦クリアして再レンダリング
      return this.$nextTick()
        .then(() => {
          this.renderPswpElem = true
          return this.$nextTick()
        })
        .then(() => {
          // PhotoSwipe生成
          pswp = this.genPhotoSwipe()

          // ファイルのレンダリング要求があったタイミングでURLを返す
          pswp.getImageUrl = src => {
            let path = src.split('/')
            path = path[3] + '/' + path[4]
            return this.$store
              ? this.$store.dispatch('work/getCacheFileUrl', { workno: this.workno, path })
              : work.getFileUrl(this.workno, path)
          }

          // ページ変更イベント (页面更改事件)
          pswp.listen('beforeChange', this.pswpBeforeChange.bind(this))

          // 既に存在していたらunwheel (如果wheelHandler已经存在, unwheel)
          if (wheelHandler) {
            wheelHandler.unwheel()
          }

          // マウスホイール制御 (鼠标滚轮控制)
          wheelHandler = Hamster(window.document).wheel((event, delta, deltaX, deltaY) => {
            this.mousewheel(event, delta, deltaX, deltaY)
            event.stopPropagation()
          })

          // contextmenuを無効化（ソースから文字列検索されるのが嫌なので、なんちゃって難読化してる）
          // 使用Unicode混淆字符串contextmenu
          // let ctx = 'contextmenu'
          let ctx = String.fromCharCode(99, 111, 110, 116, 101, 120, 116, 109, 101, 110, 117)
          this.$refs.pswp.addEventListener(ctx, event => {
            event.preventDefault()
          })

          return pswp.init()
        })
        .then(() => {
          this.lastPage = pswp.options.getNumItemsFn()

          // 作品そのものの最終頁 (作品的最后一页)
          if (this.isEnableRecommend()) {
            this.lastPageOfBook = this.lastPage - 1
          } else {
            this.lastPageOfBook = this.lastPage
          }

          // 1枚以上画像があったらスライダーを作成 (如果有一张以上的图像, 就创建滑块)
          if (this.lastPage > 1) {
            this.$refs.slider.noUiSlider.updateOptions({
              start: this.currentPage,
              range: {
                min: 1,
                max: this.lastPage
              }
            })
          }
        })
    },

    /**
     * オートプレイ
     */
    onToggleAutoplay() {
      // 解除
      if (this.autoplayTimerId) {
        this.toast(this.$t('photo.stop_autoplay'))

        clearTimeout(this.autoplayTimerId)
        this.autoplayTimerId = null

        // 開始
      } else {
        this.toast(this.$t('photo.autoplay'))
        ;(function callee() {
          this.autoplayTimerId = setTimeout(() => {
            if (pswp && this.currentPage < this.lastPage) {
              pswp.prev()
              callee.call(this)
            }

            if (!pswp || this.currentPage === this.lastPage) {
              this.onToggleAutoplay()
            }
          }, this.config.photoAutoNextTime * 1000)
        }.call(this))
      }
    },

    /**
     * Throttle処理済みのマウスホイール制御
     * （最低50msの間隔を開けて実行）
     */
    mousewheel: throttle(function(event, delta, deltaX, deltaY) {
      if (!pswp || !pswp.getCurrentIndex) {
        return
      }

      let index = pswp.getCurrentIndex()

      if (deltaY < 0) {
        index--
      } else if (deltaY > 0) {
        index++
      }

      // ホイールに合わせて画像を進めたり戻したり
      if (this.lastPage > index && index >= 0) {
        this.enableNavBarHide = false
        pswp.goTo(index)
        this.$nextTick().then(() => {
          this.enableNavBarHide = true
        })
      }
    }, 50),

    /**
     * スライダーUIを初期化 (初始化滑块UI)
     */
    initSliderUI() {
      noUiSlider.create(this.$refs.slider, {
        start: 1,
        step: 1,
        direction: 'rtl',
        behaviour: 'snap',
        connect: [true, false],
        range: {
          min: 0,
          max: 1
        }
      })

      // スライダーサムネイルを更新
      this.$refs.slider.noUiSlider.on('start', e => {
        if (pswp) {
          let index = this.lastPage - parseInt(e[0], 10)
          let items = pswp.getItemAt(index)
          this.sliderThumbs = this.getSliderThumbOptions(items)
        }
      })

      // スライダーサムネイルを更新
      this.$refs.slider.noUiSlider.on('slide', e => {
        if (pswp) {
          let index = parseInt(e[0], 10)
          this.currentPage = index
          index = this.lastPage - index
          let items = pswp.getItemAt(index)
          this.sliderThumbs = this.getSliderThumbOptions(items)
        }
      })

      // PhotoSwipeの位置を変更
      this.$refs.slider.noUiSlider.on('end', e => {
        if (pswp) {
          this.enableNavBarHide = false
          let index = this.lastPage - parseInt(e[0], 10)
          this.sliderThumbs = null
          pswp.goTo(index)
          this.$nextTick().then(() => {
            this.enableNavBarHide = true
          })
        }
      })
    },

    /**
     * スライダーサムネイルの高さや幅を計算して返す
     * @return Object
     */
    getSliderThumbOptions(items) {
      let sliderThumbs = {
        width: 0,
        height: 0,
        items: []
      }

      if (items.page) {
        items = items.page
      } else {
        items = [items]
      }

      forEach(items, item => {
        sliderThumbs.width += item.thumbnail.width
        sliderThumbs.height = item.thumbnail.height > sliderThumbs.height ? item.thumbnail.height : sliderThumbs.height
        sliderThumbs.items.push(item.thumbnail)
      })

      return sliderThumbs
    },

    /**
     * PhotoSwipeを生成
     * @return {Object}
     */
    genPhotoSwipe() {
      let items = cloneDeep(this.items)
      let initKey = this.item.hashname.split('.')[0]
      let images = []
      let index = 0
      let canDeviceSpread = this.$app.$data.isPc || window.innerHeight < window.innerWidth

      console.log('initKey', initKey)

      // 設定
      for (let i = 0, l = items.length; i < (l | 0); i = (i + 1) | 0) {
        let canSpread = false

        do {
          if (!canDeviceSpread) break
          // 単ページ表示
          if (!this.photoSpreadView) break
          // 次がない
          if (i + 1 >= (l | 0)) break
          // PDFの場合、表1 裏1は見開きにしない
          if (this.photoFrontSingle && (i < 1 || l - i < 2)) break
          // アニメーションGIFが壊れるので単一表示のみ
          if (items[i] && items[i].filename && /\.gif$/i.test(items[i].filename)) break
          // 見開き許可
          canSpread = true
          // eslint-disable-next-line no-constant-condition
        } while (0)

        // 見開きにする
        if (canSpread) {
          let page = [items[i]]

          if (items[i + 1]) {
            page.unshift(items[i + 1])
          }

          forEach(page, v => {
            if (v.key.split('.')[0] === initKey) {
              index = images.length
              return true
            }
          })

          images.push({
            src: 'play://blank',
            filename: items[i].filename,
            key: items[i].key,
            // w: maxBy(page, p => p.w).w * 2,
            w: sumBy(page, p => p.w),
            h: maxBy(page, p => p.h).h,
            crypt: true,
            page: page
          })

          ++i

          // 単一ページ
        } else {
          if (items[i].key.split('.')[0] === initKey) {
            index = images.length
          }

          images.push(items[i])
        }
      }

      // 関連作品ページ用
      if (!this.$app.initialized) {
        images.push({
          src: '/lastpage.png',
          filename: 'lastpage.jpg',
          key: 'lastpage.jpg',
          w: 768,
          h: 1024,
          crypt: false,
          thumbnail: {
            src: '/lastpage.png',
            width: 150,
            height: 200
          }
        })
      }

      if (this.isEnableRecommend()) {
        images.push({
          html: '<div id="next-books"></div>',
          w: '100%',
          h: '100%',
          thumbnail: {
            src: '/lastpage.png',
            width: 150,
            height: 200
          }
        })
      }

      images.reverse()

      if (this.currentPage) {
        index = this.currentPage - 1
      }

      return new PhotoSwipe(this.$refs.pswp, PhotoSwipeUiDefault, images, {
        _index: index,
        index: images.length - index - 1,
        preload: [4, 2],
        disableMouse: true,
        maxSpreadZoom: 1.3,
        bgOpacity: 0,
        loop: false,
        pinchToClose: false,
        closeOnScroll: false,
        closeOnVerticalDrag: false,
        clickToCloseNonZoomable: false,
        escKey: false,
        history: false,
        closeEl: false,
        captionEl: true,
        timeToIdle: 500,
        timeToIdleOutside: 500,
        useLocalforage: false,
        barsSize: {
          top: 0,
          bottom: 0
        },
        loadingIndicatorDelay: 500,
        fullscreenEl: false,
        zoomEl: false,
        counterEl: false,
        shareEl: false,
        preloaderEl: false,
        modal: false,
        enableToolbarHide: () => {
          return this.enableNavBarHide
        },
        isMoveAnimation: () => {
          return this.config.photoMoveAnimation
        },
        onIdleChange: isIdle => {
          if (isIdle) {
            this.isShowNavBar = false
          } else {
            this.isShowNavBar = true

            if (this.autoplayTimerId) {
              this.onToggleAutoplay()
            }
          }
        }
      })
    },

    toast(text) {
      clearTimeout(toastTimer)
      this.toastMsg = text

      toastTimer = setTimeout(() => {
        this.toastMsg = null
      }, 2000)
    },

    windowClose() {
      window.close()
    },

    /**
     * PhotoSwipe変更監視
     */
    pswpBeforeChange() {
      if (!pswp || !pswp.getCurrentIndex) return

      this.currentPage = pswp.options.getNumItemsFn() - pswp.getCurrentIndex()
      this.lastPage = pswp.options.getNumItemsFn()

      // トラックバー更新
      this.$refs.slider.noUiSlider.set(this.currentPage)

      // 最終頁
      if (this.currentPage >= this.lastPage) {
        this.$nextTick(() => {
          // ツールバー表示
          pswp.ui.setIdle(false)

          // 次作品表示mount
          if (this.isEnableRecommend() && document.querySelector('#next-books')) {
            const Component = Vue.extend(RecommendBooks)
            new Component({
              el: '#next-books',
              propsData: {
                workno: this.workno
              }
            })
          }
        })
      }
    },

    /**
     * 次巻有効確認
     * @returns {boolean}
     */
    isEnableRecommend() {
      return !Site.isPathEnglish() && this.$store.getters['recommend/getRelatedItems'](this.workno).length > 0
    }
  },

  mounted() {
    // アイテム配列を作る
    // eslint-disable-next-line no-useless-catch
    try {
      this.items = this.initItems()

      // スライダーUIを初期化 (初始化滑块UI)
      this.initSliderUI()
    } catch (e) {
      throw e
      // this.$alert('このファイルは表示できません')
      //   .then(() => {
      //     this.$router.go(-1)
      //   })
    }

    this.$store
      .dispatch('recommend/fetchForProduct', {
        workno: this.workno
      })
      .catch(() => {})
      .then(() => {
        // PhotoSwipeを起動
        this.renderGallery()

        // デバイスが回転されたらページの見開きを再計算 (设备被旋转后, 重新计算页面)
        this.$app.$on('orientationchange', this.renderGallery)
      })
  },

  beforeDestroy() {
    if (pswp) {
      pswp.close()
      pswp = null
    }

    // this.$store.dispatch('work/revokeFileUrl', { workno: this.workno })

    this.$app.$off('orientationchange', this.renderGallery)
  },

  components: {
    Settings,
    RelationWorks
  }
}
</script>
