<style lang="scss" scoped>
@import '~@/AppMixin.scss';

#next-books {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f4f6;

  @include media-small {
    &.clear-align {
      align-items: start;
      padding-top: 44 + 23px;
    }
  }
}

h2 {
  padding: 0;
  color: #333333;
  font-size: 20px;
  margin: {
    top: 0;
    bottom: 10px;
  }

  @include media-small {
    font-size: 16px;
  }
}

// 購入・続きボタン
a.button {
  width: 390px;
  height: 56px;
  line-height: 56px;
  font-size: 16px;
  background-color: #ffd54d;
  color: #333333;
  text-align: center;
  font-weight: 600;
  border-radius: 5px;
  &.bought {
    color: #fff;
    background-color: #1f9bff;
  }
  &.external {
    &::after {
      content: '';
      display: inline-block;
      width: 14px;
      height: 14px;
      /*margin-top: 5px;*/
      margin-left: 8px;
      background: {
        image: url('~assets/svg/external-window.svg');
        size: 14px 14px;
        repeat: no-repeat;
      }
    }
  }
}

// 次巻
.next-volume-article {
  color: #000;
  background: #fff;
  width: 630px;
  min-height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin: 0 12px;
  padding: 15px 10px;
  border: solid 1px #c2c2c2;
  border-radius: 5px;

  @include media-small {
    max-width: 375px;
    .button {
      width: 320px;
    }
  }

  .left {
    max-width: 158px;
    height: 225px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    margin: {
      top: 0;
      right: 28px;
    }

    @include media-small {
      height: auto;
      margin-bottom: 10px;
    }

    img {
      max-height: inherit;
      border: solid 1px #cccccc;
      max-width: 100%;
    }
  }

  .right {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    height: 225px;

    @include media-small {
      height: auto;
    }

    .info {
      line-height: 24px;
      max-width: 390px;
      @include media-small {
        margin-bottom: 14px;
      }
    }

    .reserve-info {
      max-width: 390px;
      line-height: 36px;
      font-size: 16px;
      background-color: #4aa986;
      color: #fff;
      text-align: center;
      font-weight: 600;
      border-radius: 5px;
    }

    h3 {
      padding: 0;
      color: #333333;
      margin: {
        top: 0;
        bottom: 15px;
      }
      a {
        color: inherit;
      }
    }
  }
}

// 関連作品
.related-books-article {
  background-color: #fff;
  border: solid 1px #ddd;
  border-radius: 6px;
  padding: 15px;
  width: 540px;

  @include media-small {
    width: calc(100% - 24px);
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    li {
      margin: 0;
      padding: 0;
      position: relative;
      width: 158px;
      color: #333333;
      @include media-small {
        width: 102px;
      }
    }

    .thumb {
      display: block;
      position: relative;
      width: 100%;
      height: 158px;
      box-sizing: border-box;
      overflow: hidden;
      margin-bottom: 4px;
      background: {
        color: #dfe4e8;
        size: contain;
        position: center center;
        repeat: no-repeat;
      }
      @include media-small {
        width: 102px;
        height: 102px;
      }
      // 購入済みリボン
      .ribbon {
        font: {
          size: 10px;
          /*weight: bold;*/
        }
        height: 18px;
        line-height: 18px;
        position: absolute;
        background-color: #3298fe;
        color: #fff;
        transform: rotate(-45deg) translate(-28px, -16px);
        width: 70px * 1.41;
        text-align: center;
      }
    }

    .title {
      display: block;
      font-size: 14px;
      line-height: 18px;
      text-overflow: ellipsis;
      margin-bottom: 16px;
      color: #333;
      @include media-small {
        font-size: 10px;
        line-height: 14px;
        margin-bottom: 10px;
      }
    }
  }

  footer {
    display: flex;
    justify-content: center;
    margin: 20px auto;
    @include media-small {
      margin: 0 auto;
    }
  }
}
</style>

<template>
  <section id="next-books" v-if="meta" :class="{ 'clear-align': !nextVolume }">
    <!-- 次の作品 -->
    <article class="next-volume-article" v-if="nextVolume">
      <div class="left">
        <!-- 画像 -->
        <a :href="workUrl(nextVolume)" target="_blank" @click="clickNextLink($event, nextVolume)">
          <img :src="nextVolume.work_files.main" />
        </a>
      </div>
      <div class="right" v-if="nextVolume">
        <!-- 予約作品:予約作品アイコン-->
        <div v-if="reserveWork" class="reserve-info">
          <span>{{ $app.$t('next_recommend.reserve_work') }}</span>
        </div>
        <!-- 作品名 -->
        <div class="info">
          <h3>
            <a :href="workUrl(nextVolume)" @click="clickNextLink($event, nextVolume)" target="_blank">{{
              nextVolume.work_name
            }}</a>
          </h3>
          <span v-text="nextVolume.author_name || nextVolume.maker_name"></span>
        </div>
        <!-- 予約作品:発売日-->
        <div v-if="reserveWork">
          <span
            >{{ nextVolume.reserve_end_date.split(' ')[0].replace(/-/g, '/') }}
            {{ $app.$t('next_recommend.release_schedule') }}</span
          >
        </div>
        <!-- 購入ボタン -->
        <a v-if="nextVolume.bought" class="button bought" @click="clickNextLink($event, nextVolume)">{{
          $app.$t('next_recommend.see_next')
        }}</a>
        <a
          v-else
          class="button external"
          :href="buyUrl(nextVolume)"
          @click="clickNextLink($event, nextVolume)"
          target="_blank"
        >
          <span v-if="reserveWork">{{ $app.$t('next_recommend.reserve') }}</span>
          <span v-else>{{ $app.$t('next_recommend.purchase') }}</span>
        </a>
      </div>
    </article>

    <!-- 関連作品 -->
    <article class="related-books-article" v-else-if="relatedBooks">
      <h2 v-if="/^R/.test(workno)">{{ $app.$t('related_recommend.circle_work') }}</h2>
      <h2 v-else>{{ $app.$t('related_recommend.work') }}</h2>
      <ul class="list" v-if="relatedBooks.length > 0">
        <li class="item" v-for="book in relatedBooks" :key="book.workno">
          <a
            class="thumb"
            :style="`background-image: url('${book.work_files.main}')`"
            :href="workUrl(book)"
            target="_blank"
            @click="clickRecommendLink($event, book)"
          >
            <span v-if="book.bought" class="ribbon">{{ $app.$t('related_recommend.purchased') }}</span>
          </a>
          <a class="title" :href="workUrl(book)" target="_blank" @click="clickRecommendLink($event, book)">{{
            book.work_name | ellipsis(20)
          }}</a>
        </li>
        <!-- 空き埋め -->
        <template v-if="relatedBooks.length % 3 > 0">
          <li class="item" v-for="n in 3 - (relatedBooks.length % 3)" :key="n"><!-- empty --></li>
        </template>
      </ul>
      <footer>
        <!-- <a class="button external" :href="readMoreUrl()" @click="$ga.event('viewer', 'click', readMoreGaLabel)" target="_blank">{{ $app.$t('related_recommend.see_more') }}</a> -->
        <a class="button external" :href="readMoreUrl()" target="_blank">{{ $app.$t('related_recommend.see_more') }}</a>
      </footer>
    </article>
  </section>
</template>

<script>
import Product from 'components/library/work/WorkMixin'
import store from '@/store'
import cloneDeep from 'lodash/cloneDeep'

export default {
  mixins: [Product],

  store,

  props: {
    workno: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      nextVolume: null,
      reserveWork: null,
      relatedBooks: [],
      readMoreGaLabel: ''
    }
  },

  computed: {
    // 作品情報
    meta() {
      if (Object.prototype.hasOwnProperty.call(this.$store.state.work.works, this.workno)) {
        return this.$store.state.work.works[this.workno].meta
      }
      return null
    },
    relatedType() {
      return this.$store.getters['recommend/getRelatedType'](this.workno)
    }
  },

  methods: {
    /**
     * 著者または出版社検索URLを返す
     * @returns {string}
     */
    readMoreUrl() {
      let authors = (this.meta.author_name || '').split(' / ')

      const foundAuthor = authors.some(author => {
        if (this.relatedBooks.length > 0) {
          return author === this.relatedBooks[0].author_name || ''
        }
      })

      if (foundAuthor) {
        this.readMoreGaLabel = 'more_author'
        return this.authorUrl({
          site_id: this.meta.site_id,
          authors
        })
      }

      if (/^R/.test(this.workno)) {
        this.readMoreGaLabel = 'more_circle'
      } else {
        this.readMoreGaLabel = 'more_publisher'
      }

      return this.makerUrl(this.meta)
    },

    /**
     * 関連作品リンク
     * @param {Event} event
     * @param {object} product
     */
    clickRecommendLink(event, product) {
      // this.$ga.event('viewer', 'click', this.relatedType)

      // 所持作品なら/treeに移動
      if (product.bought) {
        event.preventDefault()
        this.openTree(product.workno)
      }
    },

    /**
     * 次巻リンク
     * @param {Event} event
     * @param {object} product
     */
    clickNextLink(event, product) {
      // this.$ga.event('viewer', 'click', 'next')

      if (product.bought) {
        event.preventDefault()
        this.openTree(product.workno)
      }
    }
  },

  mounted() {
    this.nextVolume = this.$store.getters['recommend/getNextVolume'](this.workno)
    this.relatedBooks = this.$store.getters['recommend/getRelatedItems'](this.workno).slice(
      0,
      innerHeight > 600 ? 9 : 6
    )

    // 予約作品
    this.reserveWork =
      this.nextVolume && this.nextVolume.reserve_status && new Date(this.nextVolume.reserve_end_date) > new Date()

    // 関連作品が1件しかない場合は次巻表示にする
    if (!this.nextVolume && this.relatedBooks.length === 1) {
      this.nextVolume = cloneDeep(this.relatedBooks[0])
    }
  }
}
</script>
