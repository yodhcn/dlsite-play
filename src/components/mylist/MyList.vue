<style lang="scss" src="./MyList.scss" scoped></style>

<template>
  <div class="page">
    <header class="navigation-bar">
      <div v-if="!$app.$data.isWide" class="menu" @click="$app.$data.isShowMenu = true" v-touchfeedback>
        <svgicon name="hamburger-menu" width="20" height="20" color="#fff"></svgicon>
      </div>
      <div class="title">{{ $t('mylist.mylist') }}</div>
    </header>

    <!-- コンテンツなし -->
    <div v-if="!account.customer_id || !mylistInfo || mylistInfo.length === 0" class="page-content page-bottom scroll">
      <div class="empty-box">
        <div class="icon">
          <svgicon name="mylist-fill" width="60" height="60" color="#999999"></svgicon>
        </div>

        <template v-if="!account.customer_id">
          <h2>{{ $t('mylist.cannot_use_mylist') }}</h2>
          <p>{{ $t('mylist.cannot_use_mylist_msg') }}</p>
        </template>

        <template v-else>
          <h1>{{ $t('mylist.no_mylist') }}</h1>
          <h2 v-html="$t('mylist.mylist_desc')"></h2>
        </template>
      </div>
    </div>

    <div v-else class="page-content page-bottom scroll">
      <ol class="list-work">
        <!-- eslint-disable vue/no-use-v-if-with-v-for -->
        <li
          v-if="mylistInfo"
          v-for="mylist in mylistInfo"
          @click="openMylist(mylist.id)"
          class="list"
          :key="mylist.id"
          v-touchfeedback
        >
          <!-- eslint-enable vue/no-use-v-if-with-v-for -->
          <div class="thumbnail">
            <div v-if="mylist.worknos.length === 0" class="blank">
              <svgicon name="blank" width="40" height="40" color="#eeeeee"></svgicon>
            </div>

            <template v-if="mylist.worknos.length >= 4">
              <transition-group tag="span" name="fade">
                <template v-for="i in 4">
                  <span
                    v-if="images[mylist.worknos[i - 1] + '/thumb']"
                    :key="'child' + i"
                    class="four"
                    :class="'child' + i"
                    :style="{ 'background-image': 'url(' + images[mylist.worknos[i - 1] + '/thumb'] + ')' }"
                  >
                  </span>
                </template>
              </transition-group>
            </template>

            <transition name="fade">
              <span
                v-if="mylist.worknos.length !== 0 && mylist.worknos.length < 4 && images[mylist.worknos[0] + '/thumb']"
                class="single"
                :style="{ 'background-image': 'url(' + images[mylist.worknos[0] + '/thumb'] + ')' }"
              >
              </span>
            </transition>
          </div>
          <div class="work-name">{{ mylist.mylist_name }}</div>
          <div class="maker-name">{{ $t('mylist.total', { total: mylist.count }) }}</div>
        </li>
      </ol>
    </div>

    <div @click="createMylist()" class="new-button" v-touchfeedback>
      <svgicon name="add" width="20" height="20" color="#fff"></svgicon>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import forEach from 'lodash/forEach'

export default {
  name: 'mylist',

  computed: {
    ...mapState('play', ['account']),

    ...mapState('work', ['images']),

    ...mapState('mylist', ['mylists']),

    ...mapGetters('mylist', ['mylistInfo'])
  },

  watch: {
    mylistInfo() {
      this.getImages()
    }
  },

  methods: {
    openMylist: function(id) {
      this.$router.push('/mylist/' + id)
    },

    createMylist: function() {
      this.$router.push('/mylist/new')
    },

    getImages: function() {
      if (!this.mylistInfo) {
        return false
      }

      let worknos = []

      forEach(this.mylistInfo, mylist => {
        worknos = worknos.concat(mylist.worknos.slice(0, 4))
      })

      this.$store.dispatch('work/getImages', {
        workno: worknos,
        imageTypes: ['thumb']
      })
    }
  },

  created() {
    this.getImages()
  }
}
</script>
