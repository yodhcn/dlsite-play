<template>
  <router-view :meta="meta" :tree="tree"></router-view>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'work',

  props: ['workno'],

  computed: {
    ...mapState('purchase', ['workSyncing']),

    ...mapState('play', ['account']),

    ...mapState({
      meta(state) {
        return state.work.works[this.workno] && state.work.works[this.workno].meta
      },
      tree(state) {
        return state.work.works[this.workno] && state.work.works[this.workno].tree
      }
    })
  },

  watch: {
    workno() {
      this.initalize()
    },

    workSyncing() {
      this.initalize()
    }
  },

  methods: {
    initalize() {
      if (this.meta || this.workSyncing) {
        return
      }

      this.$store
        .dispatch('work/openWorkData', { workno: this.workno, is_super_user: this.account.is_super_user })
        .then(() => {
          if (this.meta && this.meta.is_playwork && !this.tree) {
            this.$alert(this.$t('work.ready_error')).then(() => {
              this.$router.replace('/library')
            })
          }
        })
        .catch(e => {
          if (e.message.indexOf('code 404') !== -1) {
            this.$alert(this.$t('work.ready_error')).then(() => {
              this.$router.replace('/library')
            })
          } else {
            this.$router.replace('/library')
          }
        })
    }
  },

  created() {
    this.initalize()
  },

  destroyed() {
    // TODO: audioPlayer再生中とダウンロード中ならcloseできない
    // this.$store.dispatch('work/closeWorkData ', this.workno)
    // console.log('destroyed: ' + this.workno)
  }
}
</script>
