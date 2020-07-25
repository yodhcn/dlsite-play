<style lang="scss" scoped>
.recommend {
  header {
    height: 32px;
    margin-top: 20px;
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
        width: 12px;
        height: 12px;
        margin-left: 4px;
        fill: white;
      }
    }
  }
}
.grid {
  display: flex;
  flex-direction: row;
  overflow: hidden;
  margin-top: 14px;
  height: auto;
  flex-wrap: wrap;
  /*justify-content: space-between;*/
}
.item {
  width: calc((100% - 12px * 5) / 4);
  position: relative;
  margin-bottom: 12px;
  margin-left: 12px;

  &:before {
    display: block;
    content: '';
    padding-top: 100%;
  }

  &.three {
    position: relative;
    width: calc((100% - 12px * 4) / 3);
    height: auto;
  }

  &.four {
    position: relative;
    width: calc((100% - 12px * 5) / 4);
    height: auto;
  }

  &.five {
    position: relative;
    width: calc((100% - 12px * 6) / 5);
    height: auto;
  }

  .thumb {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background: {
      size: cover;
      position: center center;
      repeat: no-repeat;
    }
  }
  .external {
    display: inline-block;
    position: absolute;
    right: 0;
    bottom: 0;
    width: 25px;
    height: 25px;
    .bg {
      display: inline-block;
      background-color: #000;
      opacity: 0.6;
      width: 100%;
      height: 100%;
      position: absolute;
    }
    svg {
      position: absolute;
      display: inline-block;
      width: 15px;
      height: 15px;
      margin-top: 5px;
      margin-left: 5px;
      fill: white;
    }
  }
}

.wide {
  header {
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
      <!-- <span class="link-settings" @click="$router.push('/settings'); $ga.event('library', 'click', 'recommend_settings')"> -->
      <span class="link-settings" @click="$router.push('/settings')">
        <span v-t="'recommend_you.setting'"></span><svgicon name="link-arrow"></svgicon>
      </span>
    </header>

    <div class="grid">
      <template v-for="item in items">
        <div :key="item.workon" class="item" :class="width > 600 ? (width > 1000 ? 'five' : 'four') : 'three'">
          <!-- <a :href="workUrl(item)"
             @click="sendSilverEgg(item.workno, cref); $ga.event('library', 'click', 'recommend_products')"
             target="_blank" v-touchfeedback> -->
          <a :href="workUrl(item)" @click="sendSilverEgg(item.workno, cref)" target="_blank" v-touchfeedback>
            <div class="thumb" :style="`background-image: url(${item.work_files.main})`">
              <span class="external">
                <span class="bg"></span>
                <svgicon name="external-window"></svgicon>
              </span>
            </div>
          </a>
        </div>
      </template>
    </div>
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
    width() {
      let width = this.$app.$data.width
      return this.$app.$data.isMenuCollapse ? width : width - 175
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
