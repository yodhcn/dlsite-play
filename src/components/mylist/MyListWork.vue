<style lang="scss" src="./MyListWork.scss" scoped></style>
<style lang="scss" src="components/library/ListView.scss" scoped></style>

<template>
  <div class="page">
    <div class="mylist-work">
      <header class="navigation-bar">
        <div class="left" @click="$router.go(-1)" v-touchfeedback>
          <svgicon name="prev" width="20" height="20" color="#fff"></svgicon>
          <span v-if="!isEditMode">{{ $t('app.back') }}</span>
          <span v-else>{{ $t('app.back') }}</span>
        </div>

        <div class="right">
          <span v-if="!isEditMode" @click="isEditMode = !isEditMode" class="button" v-touchfeedback>{{
            $t('app.edit')
          }}</span>
          <span v-else @click="isEditMode = !isEditMode" class="button" v-touchfeedback>{{ $t('app.ok') }}</span>
        </div>
      </header>

      <div class="page-content page-bottom scroll">
        <div class="list-info">
          <div class="thumbnail-box">
            <div class="thumbnail">
              <div v-if="!works || works.length === 0" class="blank">
                <svgicon name="blank" width="80" height="80" color="#eeeeee"></svgicon>
              </div>

              <template v-if="works && works.length >= 4">
                <transition-group tag="span" name="fade">
                  <template v-for="i in 4">
                    <span
                      v-if="images[works[i - 1].meta.workno + '/thumb']"
                      :key="works[i - 1].meta.workno"
                      class="four"
                      :class="'child' + i"
                      :style="{ 'background-image': 'url(' + images[works[i - 1].meta.workno + '/thumb'] + ')' }"
                    >
                    </span>
                  </template>
                </transition-group>
              </template>

              <transition name="fade">
                <span
                  v-if="works && works.length !== 0 && works.length < 4 && images[works[0].meta.workno + '/thumb']"
                  class="single"
                  :style="{ 'background-image': 'url(' + images[works[0].meta.workno + '/thumb'] + ')' }"
                >
                </span>
              </transition>
            </div>
          </div>

          <transition name="fade">
            <div v-if="isEditMode" class="list-name-box" key="input-mylist-name">
              <input
                type="text"
                :placeholder="$t('mylist.input_mylist_name')"
                v-model="inputMylistName"
                ref="inputMylistName"
              />
              <div class="delete" @click="deleteMylist()" v-touchfeedback>
                <svgicon name="delete-all" width="14" height="14" color="#999"></svgicon>
                <span>{{ $t('app.delete') }}</span>
              </div>
            </div>
            <div v-else class="list-name-box" key="mylist-name">
              <div class="name">{{ mylistName }}</div>
              <div v-if="works" class="count">{{ $t('mylist.total', { total: works.length }) }}</div>
            </div>
          </transition>
        </div>

        <draggable
          v-if="works && works.length > 0"
          v-model="works"
          v-bind="getSortOptions()"
          @start="dragging = true"
          @end="dragging = false"
          class="work-box"
        >
          <transition-group name="list" tag="ol" class="list-work" :class="{ editing: isEditMode }">
            <li
              v-for="work in works"
              class="work"
              @click.prevent="open(work.meta.workno)"
              :key="work.id"
              v-touchfeedback
            >
              <div class="meta">
                <div class="thumbnail">
                  <transition name="fade">
                    <span
                      v-if="images[work.meta.workno + '/thumb']"
                      :style="{ 'background-image': 'url(' + images[work.meta.workno + '/thumb'] + ')' }"
                    >
                    </span>
                  </transition>
                </div>
                <div class="work-name">{{ work.meta.work_name }}</div>
                <div class="maker-name">{{ work.meta.maker_name }}</div>
              </div>

              <div class="icons">
                <svgicon v-if="!work.meta.is_playwork" name="pc-only" width="24" height="17" color="#999999"></svgicon>
                <div class="icon" :class="wt2cat(work.meta.work_type)">
                  {{ $t('categories.' + wt2cat(work.meta.work_type)) }}
                </div>
              </div>

              <transition name="list">
                <div v-if="isEditMode" key="delete" @click.stop="deleteWork(work.id)" class="delete">
                  <svgicon name="delete-circle-1" width="20" height="20" color="#ff0000"></svgicon>
                </div>
              </transition>

              <transition name="list-right">
                <div v-if="isEditMode" key="handle" class="sort-handle">
                  <svgicon name="move" width="18" height="18" color="#999999"></svgicon>
                </div>
              </transition>
            </li>
          </transition-group>
        </draggable>

        <!-- コンテンツなし -->
        <div v-else-if="works && works.length === 0" class="empty-box">
          <div class="icon">
            <svgicon name="library" width="60" height="60" color="#999999"></svgicon>
          </div>
          <h1>{{ $t('mylist.empty_mylist') }}</h1>
          <h2 v-if="isEditMode">{{ $t('mylist.empty_mylist_msg_edit') }}</h2>
          <h2 v-else>{{ $t('mylist.empty_mylist_msg') }}</h2>
        </div>

        <loader v-else></loader>
      </div>

      <transition name="fade">
        <div v-if="isEditMode && !dragging" @click="openPicker()" class="new-button" v-touchfeedback>
          <svgicon name="add" width="20" height="20" color="#fff"></svgicon>
        </div>
      </transition>
    </div>

    <transition name="modal">
      <div v-if="$route.name !== 'mylistwork'" class="picker">
        <router-view></router-view>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="$app.$data.isWide && $route.name !== 'mylistwork'" class="fade-overlay"></div>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from 'components/Loader.vue'
import draggable from 'vuedraggable'
import forEach from 'lodash/forEach'
import cat from '@/store/categories'

export default {
  name: 'mylist-work',

  props: ['id'],

  data() {
    return {
      initialized: false,
      dragging: false,
      showPicker: false,
      inputMylistName: null,
      sortOptions: {
        disabled: true,
        draggable: '.work',
        handle: '.sort-handle'
      }
    }
  },

  watch: {
    mylists: function() {
      this.initialize()
    },

    works: function() {
      this.getImages()
    },

    '$route.name': function(v) {
      if (v === 'mylistwork') {
        this.$store.dispatch('mylist/openMylist', this.id)
      } else {
        // waiting modal transition
        setTimeout(() => {
          this.$store.dispatch('mylist/closeMylist', this.id)
        }, 500)
      }
    }
  },

  computed: {
    ...mapState('work', ['images']),

    ...mapState('mylist', ['mylists', 'mylistWorks']),

    isEditMode: {
      get() {
        return !this.sortOptions.disabled
      },
      set(val) {
        if (val) {
          this.inputMylistName = this.mylistName
        } else {
          this.updateMylistName(this.inputMylistName)
        }

        this.sortOptions.disabled = !val
      }
    },

    mylistName() {
      return this.mylists && this.mylists[this.id] ? this.mylists[this.id].mylist_name : ''
    },

    works: {
      get() {
        // ソートしてmeta情報を組み合わせて返す
        if (this.mylists && this.mylists[this.id] && this.mylistWorks[this.id]) {
          let works = []

          forEach(this.mylists[this.id].mylist_work_id, id => {
            if (this.mylistWorks[this.id][this.mylists[this.id].mylist_work_map[id]]) {
              works.push({
                id,
                meta: this.mylistWorks[this.id][this.mylists[this.id].mylist_work_map[id]]
              })
            }
          })
          return works
        } else {
          return null
        }
      },
      set(val) {
        this.$store.dispatch('mylist/updateMylistWork', {
          type: 'order',
          mylist_id: this.id,
          new_order: val.map(v => v.id)
        })
      }
    }
  },

  methods: {
    getSortOptions() {
      return this.sortOptions
    },

    open: function(workno) {
      if (!this.isEditMode) {
        this.$router.push('/work/' + workno)
      }
    },

    openPicker: function() {
      this.$router.push('/mylist/' + this.id + '/add')
    },

    updateMylistName: function(name) {
      if (name !== '' && name !== this.mylistName) {
        this.$store.dispatch('mylist/updateMylist', {
          type: 'rename',
          mylist_id: this.id,
          mylist_name: name
        })
      }
    },

    deleteMylist: function(force) {
      if (force) {
        this.$store
          .dispatch('mylist/closeMylist', this.id)
          .then(() => {
            return this.$store.dispatch('mylist/updateMylist', {
              type: 'delete',
              mylist_id: this.id
            })
          })
          .then(() => {
            return this.$router.go(-1)
          })

        // 確認ダイアログ
      } else {
        this.$confirm(this.$t('mylist.mylist_delete_confirm')).then(dismiss => {
          if (dismiss) {
            this.deleteMylist(true)
          }
        })
      }
    },

    deleteWork: function(mylistWorkId) {
      this.$store.dispatch('mylist/updateMylistWork', {
        type: 'delete',
        mylist_id: this.id,
        mylist_work_id: mylistWorkId
      })
    },

    wt2cat: function(workType) {
      return cat.workTypeToCategory(workType)
    },

    getImages: function() {
      if (this.works) {
        this.$store.dispatch('work/getImages', {
          workno: this.works.map(v => v.meta.workno),
          imageTypes: ['thumb']
        })
      }
    },

    initialize: function() {
      if (this.mylists !== null && !this.initialized && !this.showPicker) {
        // 新しいマイリストを作成する
        if (this.id === 'new') {
          this.$store
            .dispatch('mylist/updateMylist', {
              type: 'create',
              mylist_name: this.$t('mylist.new_mylist')
            })
            .then(data => {
              this.$router.replace('/mylist/' + data.mylist_id, () => {
                this.$nextTick()
                  .then(() => {
                    this.isEditMode = true
                    this.inputMylistName = ''
                    return this.$store.dispatch('mylist/openMylist', data.mylist_id)
                  })
                  .then(() => {
                    setTimeout(() => {
                      if (this.$refs.inputMylistName) {
                        this.$refs.inputMylistName.focus()
                      }
                    }, 500)
                  })
              })
            })
            .catch(e => {
              this.$router.back()
              this.$alert(e.message)
            })

          // マイリストを開く
        } else {
          this.$store.dispatch('mylist/openMylist', this.id)
        }

        this.initialized = true
      }
    }
  },

  created() {
    this.initialize()
  },

  destroyed() {
    if (this.mylistWorks[this.id]) {
      this.$store.dispatch('mylist/closeMylist', this.id)
    }
  },

  components: {
    draggable,
    Loader
  }
}
</script>
