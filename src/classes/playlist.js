import api from '@/store/api'
import work from '@/classes/work'
import forEach from 'lodash/forEach'
import keyBy from 'lodash/keyBy'
import cloneDeep from 'lodash/cloneDeep'
import pull from 'lodash/pull'
import uniq from 'lodash/uniq'
import db from '@/store/database'
import i18n from '@/i18n'

export default {
  syncPlaylist() {
    let data

    return api
      .apiGet('playlist/playlists?sync=true')
      .then(res => {
        data = res.data

        return Promise.all([
          db.lfdb
            .delete()
            .from(db.table.playlist)
            .exec(),
          db.lfdb
            .delete()
            .from(db.table.playlistAudio)
            .exec()
        ])
      })
      .then(() => {
        // レコードを作成 (创建记录)
        let playlistRow = []
        let playlistAudioRow = []

        forEach(data.playlists, playlist => {
          playlistRow.push(
            db.table.playlist.createRow({
              id: playlist.id,
              playlist_name: playlist.playlist_name,
              playlist_audio_id: playlist.playlist_audio_id,
              insert_date: Number(new Date(playlist.insert_date))
            })
          )
        })

        forEach(data.playlist_audios, (v, id) => {
          playlistAudioRow.push(
            db.table.playlistAudio.createRow({
              id,
              workno: v.workno,
              src: v.src
            })
          )
        })

        // DBに入れる (放入数据库)
        return Promise.all([
          db.lfdb
            .insertOrReplace()
            .into(db.table.playlist)
            .values(playlistRow)
            .exec(),
          db.lfdb
            .insertOrReplace()
            .into(db.table.playlistAudio)
            .values(playlistAudioRow)
            .exec()
        ])
      })
  },

  getPlaylist() {
    return Promise.all([
      db.lfdb
        .select()
        .from(db.table.playlist)
        .exec(),
      db.lfdb
        .select()
        .from(db.table.playlistAudio)
        .exec()
    ]).then(res => {
      return work.getPlayWorknoList(uniq(res[1].map(item => item.workno))).then(worknoList => {
        let playlists = keyBy(res[0], 'id')
        let audioMap = {}

        forEach(res[1], v => {
          if (worknoList.includes(v.workno)) {
            audioMap[v.id] = {
              workno: v.workno,
              src: v.src
            }
          }
        })

        forEach(playlists, playlist => {
          playlist.playlist_audio_map = {}

          forEach(playlist.playlist_audio_id, (id, i) => {
            if (audioMap[id]) {
              playlist.playlist_audio_map[id] = audioMap[id]

              // 不整合データを削除 (删除不匹配的数据)
            } else {
              playlist.playlist_audio_id[i] = null
              delete playlist.playlist_audio_map[id]
            }
          })

          pull(playlist.playlist_audio_id, null)
        })

        return playlists
      })
    })
  },

  updatePlaylist(payload) {
    return api
      .apiPost('playlist/update_playlist', {
        data: payload
      })
      .then(res => {
        if (res.data && res.data.result) {
          return res.data
        }

        if (res.data.error === 'exceedPlaylistLimit') {
          throw new Error(i18n.t('playlist.exceedPlaylistLimit'))
        }

        if (res.data.error === 'createPlaylistError') {
          throw new Error(i18n.t('playlist.updatePlaylistError'))
        }

        throw new Error('UpdatePlaylistError')
      })
  },

  updatePlaylistAudio(payload) {
    payload = cloneDeep(payload)

    if (payload.new_order) {
      payload.new_order = payload.new_order.join(',')
    }

    return api
      .apiPost('playlist/update_playlist_audio', {
        data: payload
      })
      .then(res => {
        if (res.data && res.data.result) {
          return res.data
        }

        if (res.data.error === 'exceedPlaylistAudioLimit') {
          throw new Error(i18n.t('playlist.exceedPlaylistAudioLimit'))
        }

        throw new Error('UpdatePlaylistAudioError')
      })
  }
}
