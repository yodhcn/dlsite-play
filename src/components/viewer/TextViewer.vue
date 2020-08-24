<style lang="scss" src="./TextViewer.scss" scoped></style>

<template>
  <div class="page">
    <header class="navigation-bar">
      <div class="left pointer" @click="$router.go(-1)" v-touchfeedback>
        <svgicon name="prev" width="20" height="20" color="#fff"></svgicon>
        <span>{{ $t('app.back') }}</span>
      </div>

      <div class="center small">
        <span class="filename">{{ item.name | stripExt }}</span>
      </div>
    </header>

    <div class="page-content scroll">
      <transition name="fade">
        <pre v-if="text" v-html="text" class="textbox" />
      </transition>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import trim from 'lodash/trim'
import anchorme from 'anchorme'

export default {
  name: 'textViewer',

  props: ['workno', 'item', 'playfile'],

  data: () => {
    return {
      text: null
    }
  },

  created() {
    let path = 'optimized/' + this.playfile.text.optimized.name

    this.$store
      .dispatch('work/getCacheFileUrl', { workno: this.workno, path })
      .then(fileUrl => {
        return axios.get(fileUrl, {
          responseType: 'text'
        })
      })
      .then(res => {
        // URLをリンク化
        // 检测文本中的链接/URL/电子邮箱, 并将其转换为可点击的HTML超链接
        this.text = anchorme({
          input: trim(res.data),
          options: {
            attributes: {
              target: '_blank'
            }
          }
        })
      })
  },

  beforeDestroy() {
    // this.$store.dispatch('work/revokeFileUrl', { workno: this.workno })
  }
}
</script>
