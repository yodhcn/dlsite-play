<style lang="scss" scoped>
.wide {
  .text {
    text-align: center;
    font-size: 15px;

    p {
      margin: 3px 0;
    }
  }
}

.text {
  text-align: justify;
  text-justify: inter-ideograph;
  margin: 30px 10px;

  p {
    margin: 6px 0;
  }
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
      <div class="empty-box">
        <div class="icon">
          <svgicon name="feedback" width="80" height="80" color="#999999"></svgicon>
        </div>
        <div class="text">
          <p>DLsite Playをご利用いただきありがとうございます。</p>
          <p>機能、デザイン、サービス等、どんなことでも自由にご意見をお寄せください。</p>
          <p>なるべく多くのご意見を取り入れられるよう努めてまいります。</p>
        </div>
        <div @click="openOpinion()" class="button" v-touchfeedback>ご意見BOXを開く</div>

        <div class="text">
          <p>以前のバージョンは<a href="/light">こちらから</a>ご利用になれます。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'feedback',

  methods: {
    openOpinion() {
      window.open(
        'https://www.dlsite.com/home' +
          (this.$app.$data.isPc ? '' : '-touch') +
          '/opinion/contribution/=/feedback/play',
        'play-opinion'
      )
    }
  }
}
</script>
