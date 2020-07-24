<style lang="scss" scoped>
.icon {
  display: inline-block;
  height: 17px;
  min-width: 40px;
  margin-left: 4px;
  padding: 0 4px;
  overflow: hidden;
  color: #fff;
  background-color: #999;
  font-size: 10px;
  text-align: center;
  line-height: 17px;
  font-weight: bold;
  border-radius: 2px;
  box-sizing: border-box;

  &.book {
    background-color: #14c369;
  }

  &.music {
    background-color: #ff9c1e;
  }

  &.video {
    background-color: #ef489b;
  }

  &.game {
    background-color: #9e56df;
  }

  &.etc {
    background-color: #9e9e9e;
  }

  &.r18 {
    background-color: #fa2d67;
  }

  &.rental {
    background-color: #f17700;
  }

  &.play {
    background-color: #1f9aff;
  }
}
</style>
<template>
  <span class="icon" :class="workCategory(work_type)">
    {{ $t('categories.' + workCategory(work_type)) }}
  </span>
</template>
<script>
import WorkMixin from 'components/library/work/WorkMixin'
export default {
  props: ['work_type'],
  mixins: [WorkMixin]
}
</script>
