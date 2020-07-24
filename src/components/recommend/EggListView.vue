<style lang="scss" scoped>
@import './Recommend.scss';

.recommend {
  margin-top: 20px;
  header {
    height: 32px;
    color: #fff;
    font-weight: bold;
    font-size: 14px;
    display: flex;
    align-items: center;
    background: #4e4e4e;
    padding: 0 10px;
    justify-content: space-between;

    .link-settings {
      font-size: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;

      svg {
        width: 11px;
        height: 11px;
        margin-left: 2px;
        fill: white;
      }
    }
  }
}

.wide {
  header {
    margin: 20px 0;
    height: 41px;
    font-size: 16px;
    .link-settings {
      font-size: 14px;
    }
  }
}
</style>

<template>
  <div v-if="$route.name === 'library' && items.length > 0 && enable" class="recommend">
    <header>
      <span v-t="'recommend_you.work'"></span>
      <span
        class="link-settings"
        @click="
          $router.push('/settings')
          $ga.event('library', 'click', 'recommend_settings')
        "
      >
        <span v-t="'recommend_you.setting'"></span><svgicon name="link-arrow"></svgicon>
      </span>
    </header>

    <ul class="works">
      <li class="item" v-for="item in items" :key="item.workno" v-touchfeedback>
        <a
          :href="workUrl(item)"
          @click="
            sendSilverEgg(item.workno, cref)
            $ga.event('library', 'click', 'recommend_products')
          "
          target="_blank"
        >
          <span class="thumbnail" :style="`background-image: url('${item.work_files.sam}')`"></span>
          <div class="spec">
            <span class="work-name">{{ item.work_name }}</span>
            <span class="maker-name">{{ item.maker_name }}</span>
            <div class="work-type external">
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
  mixins: [Product],

  data() {
    return {}
  },

  computed: {
    enable() {
      return !this.$store.state.play.config.hideRecommendations
    },
    items() {
      if (this.$store.state.recommend.forPerson) {
        return this.$store.state.recommend.forPerson.items.slice(0, this.$app.isPc ? 5 : 3)
      } else {
        return []
      }
    },
    cref() {
      if (this.$store.state.recommend.forPerson) {
        return this.$store.state.recommend.forPerson.cref
      } else {
        return ''
      }
    }
  },

  methods: {
    //
  },

  mounted() {
    if (this.$app.locale === 'ja') {
      this.$store.dispatch('recommend/fetchForPerson')
    }
  }
}
</script>
