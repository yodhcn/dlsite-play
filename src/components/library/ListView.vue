<style lang="scss" src="./ListView.scss" scoped></style>

<template>
  <div v-if="items">
    <template v-for="(item, index) in itemGroup">
      <div v-if="item.type === 'header'" class="header" :key="item.header">{{ item.header }}</div>
      <ol v-else :key="index" class="list-work">
        <li
          v-for="item in item.items"
          class="work"
          :class="item.status"
          @click.prevent="item.status !== 'disabled' && $emit('open', item.meta.workno)"
          :key="item.meta.workno"
          v-touchfeedback
        >
          <div class="thumbnail">
            <transition name="fade" appear>
              <span
                v-if="images[item.meta.workno + '/thumb']"
                :style="{ 'background-image': 'url(' + images[item.meta.workno + '/thumb'] + ')' }"
              ></span>
            </transition>
          </div>
          <div class="work-name">{{ item.meta.work_name }}</div>
          <div v-if="item.meta.author_name" class="author-name">{{ item.meta.author_name }}</div>
          <div class="maker-name">{{ item.meta.maker_name }}</div>
          <div class="icons">
            <svgicon v-if="!item.meta.is_playwork" name="pc-only" width="24" height="17" color="#999999"></svgicon>
            <span v-if="item.meta.rental_id" class="icon rental">{{ $t('work.rental') }}</span>
            <span v-if="item.meta.purchase_type === 2" class="icon play">{{ $t('work.mywork') }}</span>
            <span class="icon" :class="wt2cat(item.meta.work_type)">{{
              $t('categories.' + wt2cat(item.meta.work_type))
            }}</span>
          </div>
          <div v-if="item.status === 'add'" class="add-icon">
            <svgicon name="add" width="11" height="11" color="#2ecf34"></svgicon>
          </div>
          <div v-else-if="item.status === 'disabled'" class="disable-icon">
            <svgicon name="check" width="11" height="11" color="#fff"></svgicon>
          </div>
        </li>
      </ol>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import forEach from 'lodash/forEach'
import cat from '@/store/categories'

export default {
  name: 'ListView',

  props: ['items'],

  computed: {
    ...mapState('work', ['images']),

    itemGroup() {
      let group = []

      forEach(this.items, item => {
        if (item.type === 'header') {
          group.push(item)
          group.push({
            type: 'group',
            items: []
          })
        } else {
          group[group.length - 1].items.push(item)
        }
      })

      return group
    }
  },

  methods: {
    wt2cat: function(workType) {
      return cat.workTypeToCategory(workType)
    }
  }
}
</script>
