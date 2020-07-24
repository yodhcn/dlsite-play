<style lang="scss" scoped>
.content-box {
  max-width: 880px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

.logo {
  margin-top: 6px;
  margin-bottom: 12px;
  display: flex;
  justify-content: center;

  img {
    margin-right: 6px;
  }
}

.masthead {
  text-align: center;
}

.head {
  margin: 12px 0 0 0;
}

.head-text {
  margin: 4px 0 20px 0;
}

p {
  margin: 0;
}

pre {
  word-wrap: break-word;
  white-space: -moz-pre-wrap;
  white-space: pre-wrap;
}
</style>

<template>
  <div class="page">
    <header class="navigation-bar">
      <div class="left pointer" @click="$router.go(-1)" v-touchfeedback>
        <svgicon name="prev" width="20" height="20" color="#fff"></svgicon>
        <span>{{ $t('app.back') }}</span>
      </div>
    </header>

    <div class="page-content page-bottom scroll">
      <div class="content-box">
        <div class="masthead">
          <div class="logo">
            <img src="~assets/svg/appicon.svg" width="30" height="30" alt="" />
            <svgicon name="dlsite-play" width="175" height="38" color="#1f9aff"></svgicon>
          </div>
          <p>
            Version {{ version }}
            <br />
            &copy; 1996 DLsite
          </p>
        </div>

        <h2 class="head">Acknowledgements</h2>
        <p class="head-text">This application makes use of the following third party libraries.</p>

        <hr />

        <div class="licenses">
          <h2>anchorme</h2>
          <pre>{{ anchorme }}</pre>
          <h2>axios</h2>
          <pre>{{ axios }}</pre>
          <h2>bytes</h2>
          <pre>{{ bytes }}</pre>
          <h2>hamsterjs</h2>
          <pre>{{ hamsterjs }}</pre>
          <h2>lazysizes</h2>
          <pre>{{ lazysizes }}</pre>
          <h2>lodash</h2>
          <pre>{{ lodash }}</pre>
          <h2>lovefield</h2>
          <pre>{{ lovefield }}</pre>
          <h2>natural-compare-lite</h2>
          <pre>{{ naturalCompareLite }}</pre>
          <h2>normalize-css</h2>
          <pre>{{ normalizeCss }}</pre>
          <h2>nouislider</h2>
          <pre>{{ nouislider }}</pre>
          <h2>photoswipe</h2>
          <pre>{{ photoswipe }}</pre>
          <h2>querystring</h2>
          <pre>{{ querystring }}</pre>
          <h2>plyr</h2>
          <pre>{{ plyr }}</pre>
          <h2>rangetouch</h2>
          <pre>{{ rangetouch }}</pre>
          <h2>hls.js</h2>
          <pre>{{ hls }}</pre>
          <h2>vswipe</h2>
          <pre>{{ vswipe }}</pre>
          <h2>vue</h2>
          <pre>{{ vue }}</pre>
          <h2>vue-analytics</h2>
          <pre>{{ vueAnalytics }}</pre>
          <h2>vue-i18n</h2>
          <pre>{{ vueI18n }}</pre>
          <h2>vue-infinite-loading</h2>
          <pre>{{ vueInfiniteLoading }}</pre>
          <h2>vue-loader</h2>
          <pre>{{ vueLoader }}</pre>
          <h2>vue-router</h2>
          <pre>{{ vueRouter }}</pre>
          <h2>vue-scroll-behavior</h2>
          <pre>{{ vueScrollBehavior }}</pre>
          <h2>vue-svgicon</h2>
          <pre>{{ vueSvgicon }}</pre>
          <h2>vue-touchfeedback</h2>
          <pre>{{ vueTouchfeedback }}</pre>
          <h2>vue-zydialog</h2>
          <pre>{{ vueZydialog }}</pre>
          <h2>vuedraggable</h2>
          <pre>{{ vuedraggable }}</pre>
          <h2>vuex</h2>
          <pre>{{ vuex }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import anchorme from 'anchorme/LICENSE.md'
import axios from 'axios/LICENSE'
import bytes from 'bytes/LICENSE'
import lazysizes from 'lazysizes/LICENSE'
import lodash from 'lodash/LICENSE'
import lovefield from 'lovefield/LICENSE'
import normalizeCss from 'normalize.css/LICENSE.md'
import nouislider from 'nouislider/LICENSE.md'
import photoswipe from '@yodhcn/photoswipe/LICENSE'
import querystring from 'querystring/License.md'
import plyr from 'plyr/license.md'
import rangetouch from 'rangetouch/license.md'
import hls from 'hls.js/LICENSE'
import vue from 'vue/LICENSE'
import vueAnalytics from 'vue-analytics/LICENCE'
import vueI18n from 'vue-i18n/LICENSE'
import vueInfiniteLoading from 'vue-infinite-loading/LICENSE'
import vueLoader from 'vue-loader/LICENSE'
import vueRouter from 'vue-router/LICENSE'
import vueScrollBehavior from 'vue-scroll-behavior/LICENSE'
import vueSvgicon from 'vue-svgicon/LICENSE'
import vueTouchfeedback from 'vue-touchfeedback/LICENSE'
import vueZydialog from 'vue-zydialog/LICENSE'
import vuedraggable from 'vuedraggable/LICENSE'
import vuex from 'vuex/LICENSE'

const hamsterjs = 'MIT License'
const naturalCompareLite = 'MIT License'
const vswipe = 'MIT License'

export default {
  name: 'acknowledgements',

  data() {
    return {
      version: process.env.VERSION || 'dev',
      anchorme,
      axios,
      bytes,
      hamsterjs,
      lazysizes,
      lodash,
      lovefield,
      naturalCompareLite,
      normalizeCss,
      nouislider,
      photoswipe,
      querystring,
      plyr,
      rangetouch,
      hls,
      vswipe,
      vue,
      vueAnalytics,
      vueI18n,
      vueInfiniteLoading,
      vueLoader,
      vueRouter,
      vueScrollBehavior,
      vueSvgicon,
      vueTouchfeedback,
      vueZydialog,
      vuedraggable,
      vuex
    }
  }
}
</script>
