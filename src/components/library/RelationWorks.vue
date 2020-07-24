<style lang="scss" src="components/library/ListView.scss" scoped></style>
<style lang="scss" scoped>
.relation-works-modal {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.relation-works {
  position: relative;
  width: 100%;
  height: 100%;
  box-shadow: 2px 4px 15px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  overflow: hidden;

  hr {
    border: none;
    border-top: 1px solid #ccc;
    margin: 0;
  }
}

.wide {
  .relation-works {
    width: 480px;
    height: 640px;
  }

  .list-work {
    margin-top: 20px;
  }

  hr {
    display: none;
  }
}

.work-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.work.is-touch {
  background-color: #f1fbff;
}

.work a {
  display: inline-block;
  width: 100%;
  height: 100%;
}

.buttons {
  text-align: center;

  .close {
    display: inline-block;
    margin: 20px 10px;
    padding: 0 16px;
    height: 34px;
    line-height: 34px;
    font-size: 15px;
    background-color: #4195fd;
    border-radius: 5px;
    color: #fff;
    cursor: pointer;
    font-weight: bold;

    &.is-touch {
      background-color: #1084e4 !important;
      text-decoration: none;
    }
  }
}
</style>

<template>
  <div class="relation-works-modal">
    <div class="relation-works">
      <header class="navigation-bar dark">
        <div class="center"><span v-t="'related_recommend.work'"></span></div>

        <div class="right">
          <div class="button" @click="$emit('close')" v-touchfeedback>
            <span v-t="'related_recommend.close'"></span>
          </div>
        </div>
      </header>

      <div class="page-content page-bottom scroll">
        <ol v-if="works" class="list-work">
          <li v-for="work in works" :key="work.workno" class="work" v-touchfeedback>
            <a :href="workUrl(work)" target="_blank">
              <div class="thumbnail">
                <span :style="{ 'background-image': 'url(' + work.work_files.sam + ')' }"></span>
              </div>
              <div class="work-name">{{ work.work_name }}</div>
              <div v-if="work.author_name" class="author-name">{{ work.author_name }}</div>
              <div v-else class="maker-name">{{ work.maker_name }}</div>
              <div class="price">{{ addTax(work.price) }}<span v-t="'related_recommend.unit'"></span></div>
              <div class="icons">
                <svgicon v-if="!work.is_playwork" name="pc-only" width="24" height="17" color="#999999"></svgicon>
                <span class="icon" :class="wt2cat(work.work_type.value)">{{
                  $t('categories.' + work.work_type.value)
                }}</span>
              </div>
            </a>
          </li>
        </ol>

        <loader v-else />

        <hr />

        <div class="buttons">
          <span
            @click="$emit('windowClose')"
            class="close"
            v-t="'related_recommend.close_viewer'"
            v-touchfeedback
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from 'components/Loader.vue'
import api from '@/store/api'
import cat from '@/store/categories'

export default {
  name: 'relation-works',

  props: ['workno'],

  data() {
    return {
      works: null,
      taxRate: 1.08
    }
  },

  methods: {
    workUrl(work) {
      if (work && work.inservice === 1) {
        let siteId = this.$app.$data.isPc ? work.site_id : work.touch_site_id
        return 'https://www.dlsite.com/' + siteId + '/work/=/product_id/' + work.workno + '.html'
      } else {
        return null
      }
    },

    addTax: function(price) {
      return Math.ceil(price * this.taxRate)
    },

    wt2cat: function(workType) {
      return cat.workTypeToCategory(workType)
    }
  },

  created() {
    api.get('/api/dlsite/relation_works?workno=' + this.workno).then(res => {
      this.works = res.data
    })
  },

  components: {
    Loader
  }
}
</script>
