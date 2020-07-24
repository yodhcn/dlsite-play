<style lang="scss" scoped>
@import '~@/AppMixin.scss';

header {
  height: 44px;
  width: 100%;
  color: #fff;
  font-weight: bold;
  background-color: #1f9aff;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  user-select: none;
  z-index: 5000;
  display: flex;
}

.menu {
  width: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  &.is-touch {
    background-color: #1084e4 !important;
  }
}

.title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  margin-left: 24px;

  @include media-medium {
    margin-left: 0;
  }
}
</style>

<template>
  <header>
    <div v-if="!$app.$data.isWide && !section" class="menu" @click="$app.$data.isShowMenu = true" v-touchfeedback>
      <svgicon name="hamburger-menu" width="20" height="20" color="#fff"></svgicon>
    </div>
    <div class="title" v-text="title || ''"></div>
  </header>
</template>

<script>
export default {
  props: {
    title: String
  }
}
</script>
