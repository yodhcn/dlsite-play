<style lang="scss" src="./GridView.scss" scoped></style>

<template>
  <div class="box-container">
    <div v-if="items" class="box">
      <template v-for="item in items">
        <div
          v-if="item.type === 'work'"
          class="box-item"
          :class="width > 600 ? (width > 1000 ? 'five' : 'four') : 'three'"
          @click.prevent="item.status !== 'disabled' && $emit('open', item.meta.workno)"
          :key="item.meta.workno"
          v-touchfeedback
        >
          <div class="thumbnail" :class="item.status" v-touchfeedback>
            <transition name="fade" appear>
              <span
                v-if="images[item.meta.workno + '/mainThumb']"
                :style="{ 'background-image': 'url(' + images[item.meta.workno + '/mainThumb'] + ')' }"
              ></span>
            </transition>

            <div v-if="item.status === 'add'" class="add-icon">
              <svgicon name="add" width="11" height="11" color="#2ecf34"></svgicon>
            </div>
            <div v-else-if="item.status === 'disabled'" class="disable-icon">
              <svgicon name="check" width="11" height="11" color="#fff"></svgicon>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'GridView',

  props: ['items'],

  computed: {
    ...mapState('work', ['images']),

    width: function() {
      let width = this.$app.$data.width
      return this.$app.$data.isMenuCollapse ? width : width - 175
    }
  }
}
</script>
