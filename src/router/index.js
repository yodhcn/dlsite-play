import Vue from 'vue'
import VueRouter from 'vue-router'
import Library from 'components/library/Library.vue'
import MyList from 'components/mylist/MyList.vue'
import MyListWork from 'components/mylist/MyListWork.vue'
import Playlist from 'components/mylist/PlayList.vue'
import PlaylistAudio from 'components/mylist/PlayListAudio.vue'
import Settings from 'components/settings/Settings.vue'
import Storage from 'components/settings/Storage.vue'
import Work from 'components/library/work/Work.vue'
import WorkTree from 'components/library/work/Tree.vue'
import Viewer from 'components/viewer/Viewer.vue'
import Help from 'components/help/Help.vue'
import Acknowledgements from 'components/help/Acknowledgements.vue'
import ReleaseNote from 'components/help/ReleaseNote.vue'
import Feedback from 'components/help/Feedback.vue'
import NotFound from 'components/NotFound.vue'
import Ignore from 'components/settings/Ignore.vue'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'hash',
  scrollBehavior() {
    return {
      x: 0,
      y: 0
    }
  },
  routes: [
    {
      path: '/',
      redirect: {
        name: 'library'
      }
    },
    {
      path: '/library',
      name: 'library',
      component: Library
    },
    {
      path: '/mylist',
      name: 'mylist',
      component: MyList
    },
    {
      path: '/mylist/:id+',
      name: 'mylistwork',
      component: MyListWork,
      props: true,
      children: [
        {
          path: 'add',
          name: 'mylist-library',
          component: Library,
          props: {
            mode: 'add-mylist'
          }
        }
      ]
    },
    {
      path: '/playlist',
      name: 'playlist',
      component: Playlist
    },
    {
      path: '/playlist/:id+',
      name: 'playlistaudio',
      component: PlaylistAudio,
      props: true,
      children: [
        {
          path: 'add',
          name: 'playlist-library',
          component: Library,
          props: {
            mode: 'add-playlist'
          }
        },
        {
          path: 'add/:workno',
          props: true,
          redirect: {
            name: 'add-playlist'
          },
          component: Work,
          children: [
            {
              path: 'tree/:path*',
              name: 'add-playlist',
              component: WorkTree,
              props: true
            }
          ]
        }
      ]
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    },
    {
      path: '/settings/ignore',
      component: Ignore
    },
    {
      path: '/storage',
      name: 'storage',
      component: Storage
    },
    {
      path: '/work/:workno',
      props: true,
      redirect: {
        name: 'worktree'
      },
      component: Work,
      children: [
        {
          path: 'tree/:path*',
          name: 'worktree',
          component: WorkTree,
          props: true
        },
        {
          path: 'view/:path+',
          name: 'viewer',
          component: Viewer,
          props: true
        }
      ]
    },
    {
      path: '/help',
      name: 'help',
      component: Help
    },
    {
      path: '/help/acknowledgements',
      name: 'acknowledgements',
      component: Acknowledgements
    },
    {
      path: '/help/release-note',
      name: 'release-note',
      component: ReleaseNote
    },
    {
      path: '/feedback',
      name: 'feedback',
      component: Feedback
    },
    {
      path: '*',
      name: 'not-found',
      component: NotFound
    }
  ]
})
