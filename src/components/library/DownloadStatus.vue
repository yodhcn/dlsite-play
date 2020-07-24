<style lang="scss" src="./DownloadStatus.scss" scoped></style>

<template>
  <transition name="download-status">
    <div v-if="isShowDownloadStatus" class="download-status">
      <template v-if="cacheFileQueue.length > 0">
        <div class="info">{{ $t('download.for', { name: cacheFileQueue[cacheFileIndex].name }) }}</div>
        <div class="progress-wrap">
          <div class="progress" :style="{ width: (cacheFileQueueInfo.progress || 0) * 100 + '%' }"></div>
        </div>
        <div class="count">{{ $t('download.remaining', { total: cacheFileQueue.length - cacheFileIndex }) }}</div>
        <div class="size">
          {{ (cacheFileQueueInfo.loaded || 0) | bytes }} / {{ (cacheFileQueueInfo.total || 0) | bytes }}
        </div>
        <div class="per">{{ Math.floor((cacheFileQueueInfo.progress || 0) * 100, 10) }}%</div>
      </template>
      <template v-else>
        <div class="info">{{ $t('download.complete') }}</div>
        <div class="progress-wrap"><div class="progress" style="width: 100%;"></div></div>
        <div class="per">100%</div>
      </template>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'

let transTimer = null

export default {
  name: 'download-status',

  data() {
    return {
      hiddenTimer: 2000,
      completed: false
    }
  },

  computed: {
    ...mapState('work', ['cacheFileQueue', 'cacheFileIndex', 'cacheFileQueueInfo']),

    isShowDownloadStatus() {
      return this.completed || (this.cacheFileQueue && this.cacheFileQueue.length > 0)
    }
  },

  watch: {
    isShowDownloadStatus: function(val) {
      this.$app.$data.isShowDlStatus = val
    },

    cacheFileQueue: function(val, old) {
      if (val.length === 0 && old.length > 0) {
        this.completed = true

        clearTimeout(transTimer)
        transTimer = setTimeout(() => {
          this.completed = false
        }, this.hiddenTimer)
      }
    }
  }
}
</script>
