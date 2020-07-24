<style lang="scss" src="./Tutorial.scss"></style>

<template>
  <div class="tutorial-modal">
    <div class="tutorial">
      <transition name="fade">
        <div v-if="index === 0 || index === 4" class="bg type1" key="bg1"></div>
        <div v-else-if="index === 1" class="bg type2" key="bg2"></div>
        <div v-else-if="index === 2" class="bg type3" key="bg3"></div>
        <div v-else-if="index === 3" class="bg type4" key="bg4"></div>
      </transition>

      <swipe class="swipe-container" ref="swipe" :options="swipeOptions">
        <swipe-item class="item1">
          <transition name="fade">
            <div v-if="index === 0" class="content">
              <div class="img logo"></div>
              <h1>DLsite Play は DLsite で購入した作品を、ブラウザ上で閲覧できるWebアプリです。</h1>
              <div class="chara1 img"></div>
              <div class="chara2 img"></div>
            </div>
          </transition>
        </swipe-item>

        <swipe-item class="item2">
          <transition name="fade">
            <div v-if="index === 1" class="content">
              <div class="device img"></div>
              <div class="textbox">
                ライブラリでは購入した作品を一覧できます。さらに作品の種類で絞り込んだり、キーワードで検索ができます。
              </div>
            </div>
          </transition>
        </swipe-item>

        <swipe-item class="item3">
          <transition name="fade">
            <div v-if="index === 2" class="content">
              <div class="device img"></div>
              <div class="textbox">
                ブラウザ視聴に対応している作品なら、ファイルを選択すればビューワーが起動して閲覧できます。
              </div>
            </div>
          </transition>
        </swipe-item>

        <swipe-item class="item4">
          <transition name="fade">
            <div v-if="index === 3" class="content">
              <div class="device img"></div>
              <div class="textbox">
                ファイルをダウンロードすると、オフラインで閲覧したり、データ通信量を節約したりできるようになります。
              </div>
            </div>
          </transition>
        </swipe-item>

        <swipe-item class="item5">
          <transition name="fade">
            <div v-if="index === 4" class="content">
              <h2>さらに詳しい機能については、<br />ガイドページをご覧ください。</h2>
              <div @click="link('guide')" class="button" v-touchfeedback>ガイドページ</div>

              <div v-if="!config.supportBlob && config.lastSyncDatetime" class="browsers">
                <h1>推奨ブラウザ</h1>

                <div class="icons">
                  <div @click="link('opera')" class="icon opera" v-touchfeedback>Opera Mini</div>
                  <div @click="link('dolphin')" class="icon dolphin" v-touchfeedback>Dolphin<br />Browser</div>
                  <div @click="link('uc')" class="icon uc" v-touchfeedback>UC<br />Browser</div>
                </div>

                <p>現時点のiOSでは、以下の機能は推奨ブラウザでのみ利用することができます。</p>
                <p>・ファイルのダウンロード機能<br />・画面ロック中の音声連続再生</p>
              </div>

              <transition name="fade">
                <div v-if="!config.lastSyncDatetime" key="loading" class="lowerbox">
                  <loader></loader>
                  <p>初回ロード完了まで、もうしばらくお待ち下さい</p>
                </div>
                <div v-else-if="config.supportBlob" key="chara" class="lowerbox">
                  <div class="chara3 img"></div>
                </div>
              </transition>
            </div>
          </transition>
        </swipe-item>
      </swipe>

      <ol class="pager">
        <li v-for="i in 5" :key="i" :class="{ active: index === i - 1 }"></li>
      </ol>

      <transition name="fade">
        <div v-if="index !== 4" key="next" class="next" @click="$refs.swipe.next()" v-touchfeedback>次へ</div>
        <div
          v-else-if="config.lastSyncDatetime"
          key="start"
          class="next"
          @click="$app.$data.isShowTutorial = false"
          v-touchfeedback
        >
          はじめる
        </div>
        <div v-else key="waiting" class="next disable">はじめる</div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from 'components/Loader.vue'

export default {
  name: 'tutorial',

  data() {
    return {
      swipeOptions: {
        continuous: false,
        callback: this.changePage
      },
      index: 0
    }
  },

  computed: {
    ...mapState('play', ['config'])
  },

  methods: {
    changePage: function(index) {
      this.index = index
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
    }
  },

  components: {
    Loader
  }
}
</script>
