<style lang="scss" src="./Info.scss" scoped></style>

<template>
  <div class="workinfo">
    <div v-if="!$app.$data.isWide" class="bgimage">
      <transition name="fade">
        <span
          v-if="images[meta.workno + '/main']"
          :style="{ 'background-image': 'url(' + images[meta.workno + '/main'] + ')' }"
        ></span>
      </transition>
    </div>

    <div class="content-box">
      <div class="thumbnail">
        <transition name="fade">
          <span
            v-if="$app.$data.isWide && images[meta.workno + '/main']"
            :style="{ 'background-image': 'url(' + images[meta.workno + '/main'] + ')' }"
          ></span>
          <span
            v-if="!$app.$data.isWide && images[meta.workno + '/thumb']"
            :style="{ 'background-image': 'url(' + images[meta.workno + '/thumb'] + ')' }"
          ></span>
        </transition>
      </div>

      <div class="meta-box">
        <a v-if="meta.inservice === 1" :href="workUrl(meta)" target="_blank" class="work-name" v-touchfeedback>{{
          meta.work_name
        }}</a>
        <div v-else class="work-name">{{ meta.work_name }}</div>

        <div v-if="meta.author_name" class="author-name">{{ meta.author_name }}</div>

        <a v-if="meta.maker_id" :href="makerUrl(meta)" target="_blank" class="maker-name" v-touchfeedback>{{
          meta.maker_name
        }}</a>
        <div v-else class="maker-name">{{ meta.maker_name }}</div>

        <template v-if="creators.length > 0">
          <div v-for="creator in creators" :key="creator.id" class="link_cien">
            [
            <a :href="creator.link" target="_blank"
              ><span
                >{{ meta.site_id === 'pro' ? $t('work.brand') : $t('work.creator') }}{{ $t('work.cien_for') }}</span
              ></a
            >
            ]
          </div>
        </template>

        <hr />

        <ol v-if="tags" class="tags">
          <li v-for="(tag, key) in tags" :key="key">
            <span class="tag-class">{{ $t('tags.' + key) }}: </span>
            <span v-for="t in tag" :key="t.name" @click="search(t.name)" class="tag-name" v-touchfeedback
              >{{ t.name }}<span v-if="t.sub_class" class="tag-sub-class">({{ t.sub_class }})</span></span
            >
          </li>
        </ol>
      </div>

      <div class="meta2">
        <div>
          <div class="icons">
            <span class="r18" v-if="meta.age_category === 3">R18</span>
            <span class="rental" v-if="meta.rental_id">{{ $t('work.rental') }}</span>
            <span class="work-type" :class="wt2cat(meta.work_type)">{{ $t('categories.' + meta.work_type) }}</span>
          </div>

          <div v-if="meta.regist_date" class="regist-date">
            {{ $t('work.registDate', { date: this.$d(meta.regist_date, 'short') }) }}
          </div>
          <div v-if="meta.upgrade_date" class="upgrade-date">
            {{ $t('work.upgradeDate', { date: this.$d(meta.upgrade_date, 'short') }) }}
          </div>
        </div>

        <div>
          <div
            v-if="
              meta.dl_format !== 17 &&
                !meta.rental_id &&
                !(meta.download_start_date && new Date(meta.download_start_date) > new Date()) &&
                (meta.inservice === 1 || meta.inservice === -1) &&
                $app.$data.isWide &&
                $app.$data.isPc
            "
            class="download"
          >
            <a
              :href="downloadZipUrl"
              target="_blank"
              class="button"
              @click.prevent="showDownloadMenu()"
              v-touchfeedback
            >
              <svgicon name="download-pc" width="18" height="18" color="#fff"></svgicon>
              {{ $t('work.download') }}
            </a>
            <span v-if="meta.content_length > 0"
              >{{ meta.content_count > 1 ? $t('work.total') + ' ' : '' }} {{ meta.content_length | bytes }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import forEach from 'lodash/forEach'
import cat from '@/store/categories'
import api from '@/store/api'
import WorkMixin from 'components/library/work/WorkMixin'
import MenuMixin from 'components/menu/MenuMixin'

export default {
  name: 'workinfo',

  mixins: [WorkMixin, MenuMixin],

  props: {
    meta: Object
  },

  data() {
    return {
      cienCreators: []
    }
  },

  computed: {
    ...mapState('work', ['images']),

    downloadZipUrl() {
      return api.apiPath + 'dlsite/download?workno=' + this.meta.workno
    },

    tags() {
      if (!this.meta || !this.meta.tags) {
        return null
      }

      let tags = {}

      forEach(this.meta.tags, tag => {
        if (!tags[tag['class']]) {
          tags[tag['class']] = []
        }

        tags[tag['class']].push({
          name: tag['name'],
          sub_class: tag['sub_class']
        })
      })

      return tags
    },

    /**
     * Ci-en クリエイター
     * @returns {*}
     */
    creators() {
      if (Object.prototype.hasOwnProperty.call(this.$store.state.cien.makers, this.meta.maker_id)) {
        return this.$store.state.cien.makers[this.meta.maker_id]
      } else {
        return []
      }
    }
  },

  methods: {
    search: function(keyword) {
      const res = keyword.match(/\((.+?)\)/)
      if (res) {
        keyword = keyword.replace(res[0], '|' + res[1])
      }

      this.$store.dispatch('purchase/updateCondition', {
        filter: 'all',
        search: keyword
      })
      this.$store.dispatch('purchase/search')
      this.$router.push('/library')
    },

    openUrl: function(url) {
      window.open(url, 'play-dlsite')
    },

    wt2cat: function(workType) {
      return cat.workTypeToCategory(workType)
    }
  },

  created() {
    this.$store.dispatch('work/getImages', {
      workno: [this.meta.workno],
      imageTypes: ['main', 'thumb']
    })

    if (this.meta.maker_id) {
      this.$store.dispatch('cien/fetchCreators', {
        makerId: this.meta.maker_id
      })
    }
  }
}
</script>
