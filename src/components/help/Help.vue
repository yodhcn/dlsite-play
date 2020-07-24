<style lang="scss" scoped>
.page-content {
  background-color: #eee;
}

.wide ol {
  margin: 0 auto;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.15);
}

.header {
  color: #666666;
  font-size: 14px;
  height: 40px;
  margin: 0 auto;
  padding: 0 12px;
  line-height: 45px;
  max-width: 880px;
  box-sizing: border-box;
  cursor: default;

  &:first-child {
    margin-top: 0;
  }
}

ol {
  padding: 0;
  margin: 0 auto;
  list-style: none;
  max-width: 880px;

  li {
    padding: 13px 12px;
    font-size: 16px;
    line-height: 22px;
    list-style: none;
    border-bottom: 1px solid #d5d5d5;
    background-color: #fff;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    align-items: center;
    min-height: 50px;

    &.two-line {
      font-size: 15px;
    }

    a {
      display: block;
      color: #000;
    }
  }
}

.version {
  text-align: center;
  font-size: 12px;
  padding: 12px;
  color: #444;
}
</style>

<template>
  <div class="page">
    <header class="navigation-bar">
      <div v-if="!$app.$data.isWide" class="menu" @click="$app.$data.isShowMenu = true" v-touchfeedback>
        <svgicon name="hamburger-menu" width="20" height="20" color="#fff"></svgicon>
      </div>
      <div class="title">{{ $t('help.help') }}</div>
    </header>

    <div v-if="$app.locale === 'ja'" class="page-content page-bottom scroll">
      <div class="header"><span v-t="'help.frequently'"></span></div>
      <ol v-if="$app.isPc">
        <li v-touchfeedback>
          <a href="https://www.dlsite.com/home/faq/detail/=/type/user/mid/3/did/389" target="_blank"
            >読み込みが終わらない・画面が白いまま</a
          >
        </li>
        <li v-touchfeedback>
          <a href="https://www.dlsite.com/home/faq/detail/=/type/user/mid/3/did/392" target="_blank"
            >ライブラリに購入した作品が反映されない</a
          >
        </li>
        <li v-touchfeedback>
          <a href="https://www.dlsite.com/home/faq/detail/=/type/user/mid/3/did/456" target="_blank"
            >ライブラリから特定の作品を非表示にしたい</a
          >
        </li>
        <li v-touchfeedback>
          <a href="https://www.dlsite.com/home/faq/detail/=/type/user/mid/3/did/457" target="_blank"
            >ライブラリから非表示にした作品を解除したい</a
          >
        </li>
      </ol>

      <ol v-else>
        <li v-touchfeedback>
          <a href="https://www.dlsite.com/home-touch/faq/detail/=/type/user/mid/3/did/389" target="_blank"
            >読み込みが終わらない・画面が白いまま</a
          >
        </li>
        <li v-touchfeedback>
          <a href="https://www.dlsite.com/home-touch/faq/detail/=/type/user/mid/3/did/392" target="_blank"
            >ライブラリに購入した作品が反映されない</a
          >
        </li>
        <li v-touchfeedback>
          <a href="https://www.dlsite.com/home-touch/faq/detail/=/type/user/mid/3/did/439" target="_blank"
            >次のトラックに進まない、連続再生できない</a
          >
        </li>
        <li v-touchfeedback>
          <a href="https://www.dlsite.com/home-touch/faq/detail/=/type/user/mid/3/did/456" target="_blank"
            >ライブラリから特定の作品を非表示にしたい</a
          >
        </li>
        <li v-touchfeedback>
          <a href="https://www.dlsite.com/home-touch/faq/detail/=/type/user/mid/3/did/457" target="_blank"
            >ライブラリから非表示にした作品を解除したい</a
          >
        </li>
      </ol>

      <div class="header"><span v-t="'help.about'"></span></div>
      <ol>
        <li v-touchfeedback><a href="/ja/">DLsite Playの概要</a></li>
        <li @click="$app.$data.isShowTutorial = true" v-touchfeedback>チュートリアルを表示</li>
        <li @click="$router.push('/feedback')" v-touchfeedback>フィードバックを送る</li>
        <li @click="$router.push('/help/release-note')" v-touchfeedback>新機能の紹介</li>
        <li @click="$router.push('/help/acknowledgements')" v-touchfeedback><span v-t="'help.license'"></span></li>
      </ol>

      <div class="version">Version {{ version }}</div>
    </div>

    <div v-else class="page-content page-bottom scroll">
      <div class="header">Help</div>
      <ol v-if="$app.isPc">
        <li v-touchfeedback>
          <a href="https://www.dlsite.com/eng/faq/list/=/type/user/mid/7/sid/56" target="_blank">Troubleshooting</a>
        </li>
      </ol>

      <ol v-else>
        <li v-touchfeedback>
          <a href="https://www.dlsite.com/eng-touch/faq/list/=/type/user/mid/7/sid/56" target="_blank"
            >Troubleshooting</a
          >
        </li>
      </ol>

      <div class="header">About</div>
      <ol>
        <li @click="$router.push('/help/acknowledgements')" v-touchfeedback>Acknowledgements</li>
      </ol>

      <div class="version">Version {{ version }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'help',

  data() {
    return {
      version: process.env.VERSION ? process.env.VERSION : 'dev'
    }
  }
}
</script>
