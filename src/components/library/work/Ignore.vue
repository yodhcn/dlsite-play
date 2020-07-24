<style lang="scss" scoped>
@import '~components/settings/Form.scss';
@import '~@/AppMixin.scss';

$white: #fff7d5;
$orange: #ff9c1e;
$black: #333;
$gray: #8f8f8f;
$indigo: #00345f;

.ignore-area {
  height: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 15px auto;
  font-size: 12px;
  position: relative;
  color: $gray;
  max-width: 880px;

  > *:first-child {
    margin-right: 5px;
  }

  @include media-medium {
    z-index: 100;
    margin: 0;
    height: 20px;
    position: absolute;
    right: 10px;
    transform: translateY(-27px);
    width: 94%;
  }
}

.baloon {
  background-color: $white;
  border: solid 1px $orange;
  border-radius: 5px;
  position: absolute;
  right: 0;
  top: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  box-sizing: border-box;
  white-space: nowrap;
  color: $black;
  transition: opacity 0.2s;
  font-weight: normal;
  z-index: 1000;

  /deep/ a {
    color: #00345f;
    &:hover {
      text-decoration: underline;
    }
  }

  @include media-small {
    white-space: normal;
  }

  &::before {
    content: '';
    position: absolute;
    right: 10px;
    top: -5px;
    display: block;
    width: 0;
    height: 0;
    border: {
      right: 5px solid transparent;
      bottom: 5px solid $orange;
      left: 5px solid transparent;
    }
  }
}
</style>

<template>
  <div class="ignore-area">
    <span>{{ $t('ignore.label_switch') }}</span>
    <div class="control toggle" v-if="hasIgnore">
      <input type="checkbox" id="not-ignored" v-model="visible" />
      <label for="not-ignored"></label>
    </div>
    <transition name="fade">
      <strong class="baloon" v-if="baloonShown">
        <span v-html="$t('ignore.baloon_switch')"></span>
      </strong>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    workno: String
  },

  data() {
    return {
      visible: null,
      baloonShown: false
    }
  },

  computed: {},

  asyncComputed: {
    hasIgnore() {
      return this.$store.dispatch('ignore/fetch').then(ids => {
        this.visible = ids.indexOf(this.workno) === -1
        return true
      })
    }
  },

  watch: {
    visible(bool, old) {
      // 初期表示は何もしない
      if (old === null) return
      if (bool) {
        this.$store.dispatch('ignore/remove', this.workno)
        this.baloonShown = false
      } else {
        this.$store.dispatch('ignore/add', this.workno)
        this.baloonShown = true

        if (typeof this.timer === 'number') {
          clearTimeout(this.timer)
          this.timer = null
        }

        this.timer = setTimeout(() => {
          this.baloonShown = false
          this.timer = null
        }, 6000)
      }
    }
  },

  methods: {},

  mounted() {}
}
</script>
