<style lang="scss" scoped>
@import '~@/AppMixin.scss';

$blue: #1f9bff;

article {
  background: #eee;
  display: flex;
  flex-direction: column;
}

section {
  height: calc(100% - 44px);
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;

  .section-inner {
    box-sizing: border-box;
    padding: 44px;
    @include media-medium {
      padding: 0;
    }
  }
}

ul.works {
  flex-grow: 1;
  width: 100%;
  padding: 0;
  background: #fff;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.15);

  margin: {
    top: 0;
    bottom: 40px;
    left: auto;
    right: auto;
  }

  @media screen and (min-width: 1620px) {
    max-width: 850px;
  }

  @include media-medium {
    margin-bottom: 0;
  }

  > li {
    height: 80px;
    list-style: none;
    border-bottom: solid 1px #eee;
    display: flex;
    align-items: stretch;
    box-sizing: border-box;

    label {
      display: flex;
      width: 44px;
      min-width: 44px;
      justify-content: center;
      align-items: center;
      svg {
        cursor: pointer;
      }
    }

    a {
      flex: 1;
      display: flex;
      align-items: stretch;
      box-sizing: border-box;
      padding: {
        left: 0;
        right: 10px;
        top: 10px;
        bottom: 10px;
      }

      > :last-child {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
      }
    }

    input[type='checkbox'] {
      display: none;
    }

    img {
      width: 60px;
      min-width: 60px;
      height: 60px;
      object-fit: cover;
      margin-right: 10px;
    }

    .work-name {
      color: #000;
      font-weight: bold;
      font-size: 15px;
      line-height: 18px;
      display: block;
      max-height: 36px;
      overflow: hidden;
      margin-bottom: 4px;
    }

    .maker-name {
      font-size: 12px;
      color: #4f4f4f;
      display: block;
      line-height: 14px;
      max-height: 14px;
      overflow: hidden;
    }
  }
}

button.remove-ignores {
  width: 217px;
  height: 52px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 5px;
  color: #fff;
  background: #1f9bff;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);

  &:disabled {
    background: #bbb;
  }

  position: fixed;
  right: 20px;
  bottom: 20px;

  // 右上
  @media screen and (min-width: 1620px) {
    top: 44px + 44px;
    right: 30px;

    position: fixed;
  }

  svg {
    width: 21px;
    height: 16px;
    fill: #fff;
    margin-right: 8px;
  }
}

.section-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #666;
  svg {
    width: 60px;
    height: 60px;
    fill: #666;
    margin-top: 80px + 44px;
  }
  h2 {
    font-size: 2em;
    font-weight: normal;
    margin: 20px auto;
  }
  h3 {
    font-size: 20px;
    font-weight: normal;
    margin: 0 auto;
    text-align: center;
  }
}
</style>

<template>
  <article class="page">
    <settings-header :title="$t('ignore.title')"></settings-header>

    <template v-if="ignoredWorks">
      <section v-if="ignoredWorks.length > 0">
        <div class="section-inner">
          <ul class="works">
            <li v-for="work in ignoredWorks" :key="work.workno">
              <label @click="check(work.workno)">
                <svgicon
                  name="added-circle"
                  width="20"
                  height="20"
                  color="#1f9bff"
                  v-if="unignores.indexOf(work.workno) !== -1"
                ></svgicon>
                <svgicon name="added-circle" width="20" height="20" color="#e1e1e1" v-else></svgicon>
              </label>
              <a @click="$router.push('/work/' + work.workno)">
                <img :src="work.work_files.thumb" :alt="work.work_name" />
                <div>
                  <span class="work-name">{{ work.work_name }}</span>
                  <span class="maker-name">{{ work.maker_name }}</span>
                </div>
                <div>
                  <icon :work_type="work.work_type"></icon>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </section>

      <section class="section-empty" v-else>
        <svgicon class="icon" name="library" width="60" height="60" color="#999"></svgicon>
        <h2>{{ $t('ignore.header') }}</h2>
        <h3 v-html="$t('ignore.description')"></h3>
      </section>

      <button
        class="remove-ignores"
        :disabled="unignores.length === 0"
        @click="removeIgnores()"
        v-if="ignoredWorks.length > 0"
      >
        <svgicon class="icon" name="library2"></svgicon>
        {{ $t('ignore.visible_button') }}
      </button>
    </template>
  </article>
</template>

<script>
import PurchaseUtil from '@/classes/purchase'
import Icon from 'components/library/work/Icon.vue'
import SettingsHeader from 'components/settings/Header'

export default {
  data() {
    return {
      unignores: []
    }
  },

  asyncComputed: {
    ignoredWorks() {
      return this.$store.dispatch('ignore/fetch').then(ids => {
        return PurchaseUtil.getByIds(ids)
      })
    }
  },

  methods: {
    removeIgnores() {
      this.$store.dispatch('ignore/remove', this.unignores)
    },
    check(workno) {
      if (this.unignores.indexOf(workno) !== -1) {
        this.unignores = this.unignores.filter(w => w !== workno)
      } else {
        this.unignores.push(workno)
      }
    }
  },

  components: {
    Icon,
    SettingsHeader
  },

  mounted() {}
}
</script>
