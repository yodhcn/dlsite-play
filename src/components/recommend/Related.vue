<style lang="scss" scoped>
@import './Recommend.scss';

.related-products {
  max-width: 880px;
  margin: 0 auto;
}

header {
  height: 32px;
  /*margin: 20px 0;*/
  color: #fff;
  background-color: #4e4e4e;
  font-weight: bold;
  font-size: 14px;
  display: flex;
  align-items: center;
  padding: 0 10px;
}

.wide header {
  height: 22px;
  margin-bottom: 20px;
  padding: 0;
  color: #4e4e4e;
  background-color: unset;
  font-weight: bold;
  font-size: 16px;
  display: flex;
  align-items: center;
}

.works {
  .item {
    overflow: hidden;

    .thumbnail {
      position: relative;
      // 購入済みリボン
      .ribbon {
        font: {
          size: 12px;
          weight: bold;
        }
        height: 20px;
        line-height: 20px;
        position: absolute;
        background-color: #3298fe;
        color: #fff;
        transform: rotate(-45deg) translate(-28px, -32px);
        width: 70px * 1.41;
        text-align: center;
      }
    }
  }
}
</style>

<template>
  <div class="related-products" v-if="items.length > 0">
    <header
      v-text="/^R/.test(workno) ? $t('related_recommend.circle_work_list') : $t('related_recommend.work_list')"
    ></header>
    <ul class="works">
      <li class="item" v-for="item in items" :key="item.workno">
        <a :href="workUrl(item)" target="_blank" @click="clickRecommendLink($event, item)" v-touchfeedback>
          <div class="thumbnail" :style="`background-image: url('${item.work_files.sam}')`">
            <span v-if="item.bought" v-t="'related_recommend.purchased'" class="ribbon"></span>
          </div>
          <div class="spec">
            <span class="work-name">{{ item.work_name }}</span>
            <span class="maker-name">{{ item.maker_name }}</span>
            <div class="work-type" :class="{ external: !item.bought }">
              <span class="icon" :class="workCategory(item.work_type)">{{
                $t('categories.' + workCategory(item.work_type))
              }}</span>
            </div>
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import Product from 'components/library/work/WorkMixin'

export default {
  props: ['workno'],

  mixins: [Product],

  computed: {
    items() {
      return this.$store.getters['recommend/getRelatedItems'](this.workno).slice(0, this.$app.isPc ? 5 : 3)
    },
    relatedType() {
      return this.$store.getters['recommend/getRelatedType'](this.workno)
    }
  },

  methods: {
    /**
     * 所持作品なら/treeに移動
     * @param {Event} event
     * @param {object} product
     */
    clickRecommendLink(event, product) {
      // this.$ga.event('work', 'click', this.relatedType)
      if (product.bought) {
        event.preventDefault()
        this.openTree(product.workno)
      }
    },
    /**
     * レコメンド作品取得
     */
    fetchItems() {
      if (this.$app.locale === 'ja') {
        this.$store.dispatch('recommend/fetchForProduct', {
          workno: this.workno
        })
      }
    }
  },

  watch: {
    workno() {
      this.fetchItems()
    }
  },

  mounted() {
    this.fetchItems()
  }
}
</script>
