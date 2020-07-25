<style lang="scss" src="./Library.scss"></style>
<style lang="scss" scoped>
.link-settings {
  font-size: 14px;
  font-weight: normal;
  cursor: pointer;
  display: flex;
  align-items: center;
  position: absolute;
  right: 12px;
  top: 0;
  bottom: 0;
  color: #245074;

  &::after {
    content: '';
    display: inline-block;
    width: 11px;
    height: 11px;
    margin-left: 2px;
    background: {
      image: url('~assets/svg/link-arrow.svg');
      size: 11px 11px;
      repeat: no-repeat;
    }
  }
}
</style>

<template>
  <div class="page library">
    <header
      class="navigation-bar"
      :class="[isShowSearchBox && !$app.$data.isWide ? 'has-large-toolbar' : 'has-toolbar', { dark: mode }]"
    >
      <!-- left menu -->
      <div v-if="!$app.$data.isWide && !mode" class="menu" @click="$app.$data.isShowMenu = true" v-touchfeedback>
        <svgicon name="hamburger-menu" width="20" height="20" color="#fff"></svgicon>
      </div>

      <!-- title -->
      <div v-if="mode === 'add-mylist'" class="left small">
        <span>{{ $t('library.title_add_mylist') }}</span>
      </div>
      <div v-else-if="mode === 'add-playlist'" class="left small">
        <span>{{ $t('library.title_add_playlist') }}</span>
      </div>
      <div v-else class="title">{{ $t('library.title') }}</div>

      <!-- right buttons -->
      <div class="right">
        <!-- 検索欄 -->
        <div v-if="$app.$data.isWide" class="nav-search-box" key="search-box">
          <div class="search-input">
            <svgicon class="search-icon" name="search" width="16" height="16" color="#fff"></svgicon>
            <!-- <input
              type="text"
              @change="updateCondition"
              @input="changeInput"
              @focus="onSearchFocus"
              @blur="onSearchBlur"
              @click="$ga.event('library', 'click', 'search')"
              ref="search"
              :class="{ active: isSearchFocus }"
              :placeholder="isSearchFocus ? $t('library.searchForItemsMsg') : $t('library.searchForItems')" /> -->
            <input
              type="text"
              @change="updateCondition"
              @input="changeInput"
              @focus="onSearchFocus"
              @blur="onSearchBlur"
              ref="search"
              :class="{ active: isSearchFocus }"
              :placeholder="isSearchFocus ? $t('library.searchForItemsMsg') : $t('library.searchForItems')"
            />
            <transition name="fade">
              <div v-if="conditions.search" @click="clearInput" class="clear-icon">
                <svgicon name="delete-circle-1" width="20" height="20" color="#fff"></svgicon>
              </div>
            </transition>
          </div>
        </div>
        <div
          v-else
          class="button"
          @click="toggleSearchBox()"
          key="search-button"
          :class="{ active: isShowSearchBox }"
          v-touchfeedback
        >
          <svgicon name="search" width="20" height="20" color="#fff"></svgicon>
        </div>

        <!-- 表示切り替え -->
        <div class="button" @click="changeImageType('mainThumb')" v-if="purchaseImageType === 'thumb'" v-touchfeedback>
          <svgicon name="grid-layout" width="20" height="20" color="#fff"></svgicon>
        </div>
        <div class="button" @click="changeImageType('thumb')" v-else v-touchfeedback>
          <svgicon name="list-layout" width="20" height="20" color="#fff"></svgicon>
        </div>

        <!-- 並び順 -->
        <!-- <div class="button" @click="isShowSortBox = true; $ga.event('library', 'click', 'order')" v-touchfeedback> -->
        <div class="button" @click="isShowSortBox = true" v-touchfeedback>
          <svgicon name="sort" width="20" height="20" color="#fff"></svgicon>
        </div>

        <div v-if="mode" class="button done" @click="$router.go(-1)" v-touchfeedback>{{ $t('app.ok') }}</div>
      </div>

      <!-- 作品タイプフィルター -->
      <div class="filter-box">
        <ol>
          <!-- <li v-for="cat in categories"
            @click="changeFilter(cat, $event); $ga.event('library', 'click', 'wc_' + cat)"
            :class="[cat, { active: currCategory === cat }, { filtered: (currCategory === cat && conditions.filter !== currCategory) }]" v-touchfeedback> -->
          <li
            v-for="cat in categories"
            :key="cat"
            @click="changeFilter(cat, $event)"
            :class="[
              cat,
              { active: currCategory === cat },
              { filtered: currCategory === cat && conditions.filter !== currCategory }
            ]"
            v-touchfeedback
          >
            <template v-if="currCategory === cat && conditions.filter !== currCategory">{{
              $t('categories.' + conditions.filter)
            }}</template>
            <template v-else>{{ $t('categories.' + cat) }}</template>
          </li>
        </ol>
      </div>

      <!-- 検索ボックス -->
      <div v-if="isShowSearchBox && !$app.$data.isWide" class="search-box">
        <div class="search-input">
          <svgicon class="search-icon" name="search" width="16" height="16" color="#999"></svgicon>
          <input
            type="text"
            @change="updateCondition"
            @input="changeInput"
            @focus="onSearchFocus"
            @blur="onSearchBlur"
            ref="search"
            :class="{ active: isSearchFocus }"
            :placeholder="isSearchFocus ? $t('library.searchForItemsMsg') : $t('library.searchForItems')"
          />
          <transition name="fade">
            <div v-if="conditions.search" @click="clearInput" class="clear-icon">
              <svgicon name="delete-circle-1" width="20" height="20" color="#999"></svgicon>
            </div>
          </transition>
        </div>
      </div>
    </header>

    <!-- 同期中 -->
    <div v-if="initialize" class="page-content page-bottom scroll">
      <div class="empty-box">
        <loader></loader>
      </div>
    </div>

    <!-- コンテンツなし -->
    <div v-else-if="categories.length === 1" class="page-content page-bottom scroll">
      <div class="empty-box">
        <div class="icon">
          <svgicon name="library" width="60" height="60" color="#999999"></svgicon>
        </div>
        <h1>{{ $t('library.work_empty') }}</h1>
        <h2>{{ $t('library.work_empty_msg') }}</h2>
        <p v-if="config.hideenNotPlayWork">{{ $t('library.hidden_not_playwork') }}</p>
      </div>
    </div>

    <!-- コンテンツ -->
    <div v-else class="page-content">
      <swipe class="swipe-container" ref="swipe" :options="swipeOptions">
        <swipe-item v-for="cat in categories" :key="cat" ref="scroll" :class="{ scroll: cat === currCategory }">
          <div class="filter-result">
            <div class="content">
              <span>
                <span v-if="conditions.search"
                  >&quot;{{ conditions.search }}&quot; {{ $t('library.search_result') }}</span
                ><span v-else>{{ $t('library.purchase_history') }}</span>
              </span>
              <span class="hit-count">{{ $t('library.itemTotalCount', { total: total || 0 }) }}</span>
            </div>
          </div>

          <transition name="fade">
            <div v-if="cat === currCategory && items && items.length > 0" class="content">
              <!-- 作品一覧（リスト） -->
              <list-view v-if="purchaseImageType === 'thumb'" @open="open" :items="items"></list-view>
              <!-- 作品一覧（グリッド） -->
              <grid-view v-else-if="purchaseImageType === 'mainThumb'" @open="open" :items="items"></grid-view>

              <infinite-loading @infinite="onInfinite" ref="infinite" :distance="500" :class="{ init: total === null }">
                <div slot="no-more"></div>
                <div slot="no-results"></div>
              </infinite-loading>

              <!-- 合計 -->
              <div class="work-item-count">
                <span>{{ $t('library.itemTotalCount', { total: total || 0 }) }}</span>
                <span
                  v-if="$app.locale === 'ja' && $store.state.play.config.hideRecommendations"
                  class="link-settings"
                  @click="$router.push('/settings')"
                  v-t="'app.setting'"
                ></span>
              </div>

              <!-- レコメンド（リスト） -->
              <recommend-egg-list v-if="purchaseImageType === 'thumb'"></recommend-egg-list>
              <!-- レコメンド（グリッド） -->
              <recommend-egg-grid v-if="purchaseImageType === 'mainThumb'"></recommend-egg-grid>
            </div>

            <div v-else-if="cat === currCategory && total === 0" class="empty-box">
              <div class="icon">
                <svgicon name="search" width="60" height="60" color="#999999"></svgicon>
              </div>
              <h1>{{ $t('library.no_hit') }}</h1>
              <h2 class="link" @click="clearCondition()" v-touchfeedback>{{ $t('library.clear_condition') }}</h2>
              <p v-if="config.hideenNotPlayWork">{{ $t('library.hidden_not_playwork') }}</p>
            </div>
          </transition>
        </swipe-item>
      </swipe>
    </div>

    <!-- ソート順ポップアップ -->
    <dialog-box type="dialog" v-if="isShowSortBox" @close="isShowSortBox = false">
      <h3 slot="header">{{ $t('library.change_sort_type') }}</h3>
      <ol slot="body">
        <li
          v-for="val in sortTypes"
          :key="val"
          @click="selectSort(val)"
          :class="{ active: val === conditions.sort }"
          v-touchfeedback
        >
          {{ $t('sortTypes.' + val) }}
          <svgicon
            v-if="val === conditions.sort"
            class="checked"
            name="check"
            width="20"
            height="20"
            color="#1f9aff"
          ></svgicon>
        </li>
      </ol>
    </dialog-box>

    <!-- 絞り込みポップアップ -->
    <dialog-box type="dialog" v-if="isShowFilterBox" @close="isShowFilterBox = false">
      <h3 slot="header">{{ $t('library.filter_category') }}</h3>
      <ol slot="body">
        <li @click="selectFilter(currCategory)" :class="{ active: currCategory === conditions.filter }" v-touchfeedback>
          <span>{{ $t('categories.' + currCategory) }}</span>
          <svgicon
            v-if="currCategory === conditions.filter"
            class="checked"
            name="check"
            width="20"
            height="20"
            color="#1f9aff"
          ></svgicon>
        </li>
        <!-- 作品形式の選択肢が1つしかないときは非表示 -->
        <template v-if="workTypes[currCategory] && workTypes[currCategory].length > 1">
          <li
            v-for="workType in workTypes[currCategory]"
            :key="workType"
            @click="selectFilter(workType)"
            :class="{ active: workType === conditions.filter }"
            v-touchfeedback
          >
            <span>{{ $t('categories.' + workType) }}</span>
            <svgicon
              v-if="workType === conditions.filter"
              class="checked"
              name="check"
              width="20"
              height="20"
              color="#1f9aff"
            ></svgicon>
          </li>
        </template>
      </ol>
    </dialog-box>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import InfiniteLoading from 'vue-infinite-loading'
import Loader from 'components/Loader.vue'
import ListView from 'components/library/ListView.vue'
import GridView from 'components/library/GridView.vue'
import DialogBox from 'components/DialogBox.vue'
import RecommendEggList from 'components/recommend/EggListView'
import RecommendEggGrid from 'components/recommend/EggGridView'
import cat from '@/store/categories'
import indexOf from 'lodash/indexOf'
import forEach from 'lodash/forEach'
import values from 'lodash/values'
import keys from 'lodash/keys'
import debounce from 'lodash/debounce'
// import WorkType from '@/classes/work-type'

export default {
  name: 'Library',

  props: ['mode'],

  data: function() {
    return {
      isShowSortBox: false,
      isShowFilterBox: false,
      isShowSearchBox: false,
      isSearchFocus: false,
      swipeOptions: {
        callback: this.changeFilter
      }
    }
  },

  watch: {
    works: function() {
      this.getImages()
    }
  },

  computed: {
    ...mapState('play', ['config']),

    ...mapState('purchase', ['initialize', 'works', 'total', 'workTypes', 'sortTypes', 'conditions']),

    ...mapState('mylist', ['mylists', 'mylistWorks']),

    purchaseImageType: {
      get() {
        return this.$store.state.play.config.purchaseImageType
      },
      set(val) {
        this.$store.dispatch('play/setConfig', { key: 'purchaseImageType', val })
      }
    },

    id() {
      return this.$parent && this.$parent.$props && this.$parent.$props.id
    },

    categories() {
      return ['all'].concat(keys(this.workTypes))
    },

    currCategory() {
      return /^[A-Z0-9]{3}/.test(this.conditions.filter)
        ? cat.workTypeToCategory(this.conditions.filter)
        : this.conditions.filter
    },

    swipeIndex() {
      return indexOf(this.categories, this.currCategory)
    },

    items() {
      const items = []

      let header = ''
      let lastHeader = null
      let disabledWorknos = null

      if (this.total === null && this.conditions.search === '') {
        return items
      }

      if (this.mode === 'add-mylist' && this.mylists && this.mylists[this.id]) {
        disabledWorknos = values(this.mylists[this.id].mylist_work_map)
      }

      if (this.conditions.sort === 'title_asc' || this.conditions.sort === 'title_desc') {
        header = this.$t('sortTypes.' + this.conditions.sort)
      }

      forEach(this.works, meta => {
        // テーブルヘッダーを生成
        if (this.conditions.sort === 'purchase' || this.conditions.sort === 'purchase_asc') {
          header = this.$t('library.purchasedDate', { date: this.$d(meta.sales_date, 'short') })
        } else if (this.conditions.sort === 'upgrade') {
          if (meta.upgrade_date) {
            header = this.$t('library.upgradeDate', { date: this.$d(meta.upgrade_date, 'short') })
          } else {
            header = this.$t('library.registDate', { date: this.$d(meta.regist_date, 'short') })
          }
        } else if (this.conditions.sort === 'release_asc' || this.conditions.sort === 'release_desc') {
          if (meta.regist_date) {
            header = this.$t('library.registDate', { date: this.$d(meta.regist_date, 'short') })
          } else {
            header = this.$t('library.unknown')
          }
        } else if (this.conditions.sort === 'maker_asc' || this.conditions.sort === 'maker_desc') {
          header = meta.maker_name
        } else if (this.conditions.sort === 'work_type') {
          header = this.$t('categories.' + meta.work_type)
        }

        if (lastHeader !== header) {
          lastHeader = header
          items.push({ type: 'header', header })
        }

        // マイリスト追加状態を追加
        let status = null

        if (disabledWorknos) {
          if (indexOf(disabledWorknos, meta.workno) !== -1) {
            status = 'disabled'
          } else {
            status = 'add'
          }
        }

        items.push({ type: 'work', meta, status })
      })

      return items
    }
  },

  methods: {
    // アイテムを読み込んで表示
    onInfinite: function($state) {
      if (this.total === this.works.length && this.$refs.infinite && this.$refs.infinite[0]) {
        $state.complete()
        return false
      }

      ;(this.total === null
        ? this.$store.dispatch('purchase/search')
        : this.$store.dispatch('purchase/moreSearch')
      ).then(() => {
        if (!$state) {
          return
        }

        if (this.total > this.works.length) {
          $state.loaded()
        } else {
          $state.complete()
        }
      })
    },

    // 検索ボックスの表示切り替え
    toggleSearchBox: function() {
      this.isShowSearchBox = !this.isShowSearchBox

      if (this.isShowSearchBox) {
        // this.$ga.event('library', 'click', 'search')

        this.$nextTick().then(() => {
          if (this.$refs.search) {
            this.$refs.search.focus()
          }
        })
      } else {
        this.clearInput()
        this.updateCondition()
      }
    },

    // ソート順を変更
    selectSort: function(val) {
      this.isShowSortBox = false
      this.$nextTick().then(() => {
        this.updateCondition({ sort: val })
      })
    },

    // フィルタを変更
    selectFilter: function(workType) {
      /* const gaLabel = WorkType.getGaLabel(workType)
      if (gaLabel) {
        this.$ga.event('library', 'click', gaLabel)
      } */
      this.isShowFilterBox = false
      this.updateCondition({ filter: workType })
    },

    // スワイプ
    changeFilter: function(index, event) {
      if (typeof index !== 'number') {
        index = indexOf(this.categories, index)
      }

      if (event && event.currentTarget) {
        if (index === this.swipeIndex && this.categories[index] !== 'all') {
          this.isShowFilterBox = true
        }
      }

      if (index === this.swipeIndex) {
        return false
      }

      if (this.$refs.swipe) {
        this.$refs.swipe.slide(index)
      }

      if (event) {
        this.updateCondition({ filter: this.categories[index] })
      }
    },

    // 検索条件を変更して検索
    updateCondition: function(cond = {}) {
      this.$store
        .dispatch('purchase/updateCondition', {
          search: this.searchInput,
          filter: cond.filter,
          sort: cond.sort
        })
        .then(res => {
          if (res) {
            if (this.$refs.scroll && this.$refs.scroll[this.swipeIndex]) {
              this.$refs.scroll[this.swipeIndex].$el.scrollTop = 0
            }

            this.onInfinite()
          }
        })
    },

    onSearchFocus: function() {
      window.scrollTo(0, 0)
      this.isSearchFocus = true
    },

    onSearchBlur: function() {
      window.scrollTo(0, 0)
      this.isSearchFocus = false
    },

    // 検索テキストを変更
    changeInput: debounce(function() {
      if (this.$refs.search) {
        this.searchInput = this.$refs.search.value.replace(/^(.+)[ａ-ｚ]$/, '$1')
        this.updateCondition()
      }
    }, 200),

    clearInput: function() {
      this.searchInput = ''

      if (this.$refs.search) {
        this.$refs.search.value = ''
        this.$refs.search.focus()
      }

      this.updateCondition()
    },

    clearCondition: function() {
      this.changeFilter(0)
      this.clearInput()
    },

    changeImageType: function(imageType) {
      if (this.$refs.scroll && this.$refs.scroll[this.swipeIndex]) {
        this.$refs.scroll[this.swipeIndex].$el.scrollTop = 0
      }

      this.purchaseImageType = imageType
      // this.$ga.event('library', 'click', 'show_type')

      if (this.$refs.infinite && this.$refs.infinite[0]) {
        this.$nextTick().then(() => {
          this.getImages()
          this.$refs.infinite[0].$emit('$InfiniteLoading:reset')
        })
      }
    },

    open: function(workno) {
      // 作品ピッカー
      if (this.mode === 'add-mylist' && this.id) {
        this.addMylistWork(workno)

        // 音声ファイルピッカー
      } else if (this.mode === 'add-playlist' && this.id) {
        this.$router.push('/playlist/' + this.id + '/add/' + workno)

        // 作品を開く
      } else {
        this.$router.push('/work/' + workno)
      }
    },

    // マイリストに作品を追加
    addMylistWork: function(workno) {
      if (this.mode === 'add-mylist') {
        this.$store
          .dispatch('mylist/updateMylistWork', {
            type: 'add',
            mylist_id: this.id,
            workno
          })
          .catch(e => {
            this.$alert(e.message)
          })
      }
    },

    getImages: function() {
      this.$store.dispatch('work/getImages', {
        workno: this.works.map(v => v.workno),
        imageTypes: [this.purchaseImageType]
      })
    }
  },

  created() {
    this.getImages()
  },

  mounted() {
    if (this.$refs.swipe) {
      this.$refs.swipe.slide(this.swipeIndex, 1)
    }

    if (this.conditions.search !== '') {
      this.isShowSearchBox = true
      this.$nextTick().then(() => {
        this.$refs.search.value = this.conditions.search
      })
    }
  },

  components: {
    Loader,
    ListView,
    GridView,
    DialogBox,
    InfiniteLoading,
    RecommendEggGrid,
    RecommendEggList
  }
}
</script>
