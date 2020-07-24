<template>
  <text-viewer
    v-if="playfile && playfile.type === 'text'"
    :workno="workno"
    :item="item"
    :playfile="playfile"
  ></text-viewer>
  <photo-viewer
    v-else-if="playfile && (playfile.type === 'image' || playfile.type === 'pdf')"
    :workno="workno"
    :item="item"
    :playfile="playfile"
    :tree="tree"
    :children="children"
  ></photo-viewer>
  <video-viewer
    v-else-if="playfile && playfile.type === 'video'"
    :workno="workno"
    :item="item"
    :playfile="playfile"
  ></video-viewer>
</template>

<script>
import TextViewer from 'components/viewer/TextViewer.vue'
import PhotoViewer from 'components/viewer/PhotoViewer.vue'
import forEach from 'lodash/forEach'

// VideoViewerはコードサイズがでかいので遅延ローディングする
const VideoViewer = () => import(/* webpackChunkName: "video" */ 'components/viewer/VideoViewer.vue')

export default {
  name: 'viewer',

  props: ['workno', 'path', 'meta', 'tree'],

  computed: {
    children() {
      if (!this.tree) {
        return null
      }

      let path = this.path ? this.path.trim('/').split('/') : []
      let children = this.tree.children

      // path指定された階層へ移動
      forEach(path, name => {
        forEach(children, item => {
          if (item.name === name && item.children) {
            children = item.children
            path = item.path
            return false
          }
        })
      })

      return children
    },

    item() {
      if (!this.children) {
        return null
      }

      let filename = this.path.split('/').pop()
      let item = null

      forEach(this.children, v => {
        if (filename === v.name) {
          item = v
          return false
        }
      })

      return item
    },

    playfile() {
      return this.item && this.tree.playfile[this.item.hashname]
    }
  },

  created() {
    // itemが見つからなかったら作品トップにリダイレクト
    // if (!this.item) {
    //   this.$router.replace('/work/' + this.workno + '/tree/')
    // }
  },

  components: {
    TextViewer,
    PhotoViewer,
    VideoViewer
  }
}
</script>
