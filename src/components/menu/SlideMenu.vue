<style lang="scss" src="./SlideMenu.scss" scoped></style>

<template>
  <transition :name="!$app.$data.isWide ? 'slide-menu' : null">
    <nav class="slide-menu">
      <div class="title">
        <div v-if="$app.$data.isWide" @click="$app.toggleCollapse()" class="menu" v-touchfeedback>
          <svgicon name="hamburger-menu" width="20" height="20" color="#fff"></svgicon>
        </div>
        <div v-else @click="$emit('close')" class="menu" v-touchfeedback>
          <svgicon name="close" width="20" height="20" color="#fff"></svgicon>
        </div>

        <div class="logo">
          <svgicon name="dlsite-play" width="105" height="20" color="#fff"></svgicon>
        </div>
      </div>

      <div class="page-content page-bottom">
        <div class="item" @click="goPage('library')" v-touchfeedback>
          <svgicon class="icon" name="library" width="20" height="20" color="#525252"></svgicon
          ><span>{{ $t('slide_menu.library') }}</span>
        </div>
        <div class="item" @click="goPage('mylist')" v-touchfeedback>
          <svgicon class="icon" name="mylist-fill" width="20" height="20" color="#525252"></svgicon
          ><span>{{ $t('slide_menu.mylist') }}</span>
        </div>
        <div class="item" @click="goPage('playlist')" v-touchfeedback>
          <svgicon class="icon" name="playlist" width="20" height="20" color="#525252"></svgicon
          ><span>{{ $t('slide_menu.playlist') }}</span>
        </div>
        <div class="item" @click="goPage('storage')" v-touchfeedback>
          <svgicon class="icon" name="storage" width="20" height="20" color="#525252"></svgicon
          ><span>{{ $t('slide_menu.storage') }}</span>
        </div>
        <div class="item" @click="goPage('settings')" v-touchfeedback>
          <svgicon class="icon" name="setting" width="20" height="20" color="#525252"></svgicon
          ><span>{{ $t('slide_menu.setting') }}</span>
        </div>
        <hr />
        <div class="item" @click="syncWork()" v-touchfeedback>
          <svgicon
            class="icon"
            :class="{ rotating: syncState === 'syncing' }"
            name="sync"
            width="20"
            height="20"
            color="#525252"
          ></svgicon>
          <span class="sup">{{ $t('slide_menu.sync_library') }}</span>
          <span v-if="syncState === 'syncing'" class="sub">{{ $t('slide_menu.syncing') }}</span>
          <span v-else-if="syncState === 'synced'" class="sub">{{ $t('slide_menu.synced') }}</span>
          <span v-else-if="config.lastSyncDatetime" class="sub">{{
            $t('slide_menu.sync_date', { date: $d(new Date(config.lastSyncDatetime), 'long') })
          }}</span>
        </div>
        <hr />
        <div class="item" @click="goPage('help')" v-touchfeedback>
          <svgicon class="icon" name="help" width="20" height="20" color="#525252"></svgicon
          ><span>{{ $t('slide_menu.help') }}</span>
        </div>
        <div
          class="item"
          @click="
            goDLsite()
            $ga.event('side_menu', 'click', 'dlsite')
          "
          v-touchfeedback
        >
          <svgicon class="icon" name="prev" width="20" height="20" color="#525252"></svgicon
          ><span>{{ $t('slide_menu.dlsite') }}</span>
        </div>
        <!-- <div class="item" @click="goPage('feedback')" v-touchfeedback><svgicon class="icon" name="feedback" width="20" height="20" color="#525252"></svgicon><span>フィードバック</span></div> -->
        <div
          class="item"
          @click="
            logout()
            $ga.event('side_menu', 'click', 'logout')
          "
          v-touchfeedback
        >
          <svgicon class="icon" name="account" width="20" height="20" color="#525252"></svgicon>
          <span class="sup">{{ $t('slide_menu.logout') }}</span>
          <span class="sub">{{ account.login_id ? account.login_id : account.production_id }}</span>
        </div>
      </div>
    </nav>
  </transition>
</template>

<script>
import { mapState } from 'vuex'
import Site from '@/utils/site'

let syncStateTimer = null

export default {
  name: 'slide-menu',

  data() {
    return {
      syncState: ''
    }
  },

  computed: {
    ...mapState('play', ['config', 'account'])
  },

  methods: {
    goPage(name) {
      this.$ga.event('side_menu', 'click', name)

      this.$emit('close')
      this.$nextTick().then(() => {
        this.$router.push('/' + name)
      })
    },

    goDLsite() {
      location.href = `${Site.getDLsiteBaseUrl()}/${this.$app.locale === 'ja' ? 'home' : 'eng'}/mypage`
    },

    logout() {
      this.$confirm(this.$t('slide_menu.logout_msg')).then(dismiss => {
        if (dismiss) {
          location.href = `${location.protocol}//${location.hostname}/logout/`
        }
      })
    },

    syncWork() {
      if (this.syncState !== '' || !navigator.onLine) {
        return
      }

      this.syncState = 'syncing'
      clearTimeout(syncStateTimer)

      this.$ga.event('side_menu', 'click', 'sync')

      this.$store.dispatch('purchase/syncWork', true).then(() => {
        this.syncState = 'synced'

        syncStateTimer = setTimeout(() => {
          this.syncState = ''
        }, 2000)
      })
    }
  }
}
</script>
