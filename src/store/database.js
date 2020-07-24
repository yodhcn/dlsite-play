import lf from 'lovefield'
import uniq from 'lodash/uniq'

const db = {
  connect: null,
  isPrivateMode: false,
  supportIndexedDb: true,
  supportBlob: true,
  lf: null,
  lfdb: null,
  table: {}
}

// methods
const methods = {
  /**
   * DB接続
   */
  connect(account) {
    const dbname = account.customer_id ? account.customer_id : account.production_id

    return methods
      .isPrivateMode()
      .then(isPrivate => {
        db.isPrivateMode = isPrivate

        if (account.customer_id) {
          return methods.detectIndexedDb()
        } else {
          return Promise.resolve('failure')
        }
      })
      .then(status => {
        if (status === 'failure') {
          db.supportIndexedDb = false
          db.supportBlob = false
        } else if (status === 'blob-failure') {
          db.supportBlob = false
        }

        return methods._connect(dbname)
      })
  },

  _connect(dbname) {
    if (db.lfdb) {
      return Promise.resolve(db)
    }

    // DB status
    console.group('DB status')
    console.log('privateMode', db.isPrivateMode)
    console.log('supportIndexedDB', db.supportIndexedDb)
    console.log('supportBlob', db.supportBlob)
    console.groupEnd()

    // localstorageにDB名を追記
    if (db.supportIndexedDb) {
      let dbNames = []

      if (localStorage.dbnames) {
        dbNames = JSON.parse(localStorage.dbnames)
      }

      dbNames.push(dbname)
      dbNames = uniq(dbNames)

      localStorage.dbnames = JSON.stringify(dbNames)
    }

    // Lovefield
    db.lf = lf

    let schemaBuilder = lf.schema.create(dbname, 1)

    // Config table
    schemaBuilder
      .createTable('Config')
      .addColumn('key', lf.Type.STRING)
      .addColumn('val', lf.Type.OBJECT)
      .addPrimaryKey(['key'])

    // Purchase table
    schemaBuilder
      .createTable('Purchase')
      .addColumn('workno', lf.Type.STRING)
      .addColumn('is_playwork', lf.Type.BOOLEAN)
      .addColumn('search', lf.Type.STRING)
      .addColumn('maker_id', lf.Type.STRING)
      .addColumn('maker_name_kana', lf.Type.STRING)
      .addColumn('work_name_kana', lf.Type.STRING)
      .addColumn('sales_date', lf.Type.NUMBER)
      .addColumn('regist_date', lf.Type.NUMBER)
      .addColumn('upgrade_date', lf.Type.NUMBER)
      .addColumn('work_type', lf.Type.STRING)
      .addColumn('work', lf.Type.OBJECT)
      .addPrimaryKey(['workno'])
      .addNullable(['sales_date', 'regist_date', 'upgrade_date'])
      .addIndex('idxSalesDate', ['sales_date'], false, lf.Order.ASC)
      .addIndex('idxRegistDate', ['regist_date'], false, lf.Order.ASC)
      .addIndex('idxUpgradeDate', ['upgrade_date'], false, lf.Order.ASC)
      .addIndex('idxWorkType', ['work_type'], false, lf.Order.ASC)

    // Ziptree table
    schemaBuilder
      .createTable('Ziptree')
      .addColumn('workno', lf.Type.STRING)
      .addColumn('json', lf.Type.STRING)
      .addPrimaryKey(['workno'])

    // CacheFile table
    schemaBuilder
      .createTable('CacheFile')
      .addColumn('id', lf.Type.STRING)
      .addColumn('workno', lf.Type.STRING)
      .addColumn('path', lf.Type.STRING)
      .addColumn('length', lf.Type.NUMBER)
      .addColumn('blob', lf.Type.OBJECT)
      .addPrimaryKey(['id'])
      .addIndex('idxWorkno', ['workno'], false, lf.Order.ASC)

    // Image table
    schemaBuilder
      .createTable('Image')
      .addColumn('id', lf.Type.STRING)
      .addColumn('workno', lf.Type.STRING)
      .addColumn('type', lf.Type.STRING)
      .addColumn('length', lf.Type.NUMBER)
      .addColumn('blob', lf.Type.OBJECT)
      .addPrimaryKey(['id'])
      .addIndex('idxWorkno', ['workno'], false, lf.Order.ASC)
      .addIndex('idxType', ['type'], false, lf.Order.ASC)

    // Mylist table
    schemaBuilder
      .createTable('Mylist')
      .addColumn('id', lf.Type.NUMBER)
      .addColumn('mylist_name', lf.Type.STRING)
      .addColumn('mylist_work_id', lf.Type.OBJECT)
      .addColumn('insert_date', lf.Type.NUMBER)
      .addPrimaryKey(['id'])
      .addIndex('idxInsertDate', ['insert_date'], false, lf.Order.ASC)

    // Mylist work table
    schemaBuilder
      .createTable('MylistWork')
      .addColumn('id', lf.Type.NUMBER)
      .addColumn('workno', lf.Type.STRING)
      .addPrimaryKey(['id'])

    // Playlist table
    schemaBuilder
      .createTable('Playlist')
      .addColumn('id', lf.Type.NUMBER)
      .addColumn('playlist_name', lf.Type.STRING)
      .addColumn('playlist_audio_id', lf.Type.OBJECT)
      .addColumn('insert_date', lf.Type.NUMBER)
      .addPrimaryKey(['id'])
      .addIndex('idxInsertDate', ['insert_date'], false, lf.Order.ASC)

    // Playlist audio table
    schemaBuilder
      .createTable('PlaylistAudio')
      .addColumn('id', lf.Type.NUMBER)
      .addColumn('workno', lf.Type.STRING)
      .addColumn('src', lf.Type.STRING)
      .addPrimaryKey(['id'])

    return schemaBuilder
      .connect({
        storeType: db.supportIndexedDb ? lf.schema.DataStoreType.INDEXED_DB : lf.schema.DataStoreType.MEMORY
      })
      .then(res => {
        db.lfdb = res

        // Tables
        db.table.config = db.lfdb.getSchema().table('Config')
        db.table.purchase = db.lfdb.getSchema().table('Purchase')
        db.table.ziptree = db.lfdb.getSchema().table('Ziptree')
        db.table.cacheFile = db.lfdb.getSchema().table('CacheFile')
        db.table.image = db.lfdb.getSchema().table('Image')
        db.table.mylist = db.lfdb.getSchema().table('Mylist')
        db.table.mylistWork = db.lfdb.getSchema().table('MylistWork')
        db.table.playlist = db.lfdb.getSchema().table('Playlist')
        db.table.playlistAudio = db.lfdb.getSchema().table('PlaylistAudio')

        return db
      })
  },

  isPrivateMode() {
    return new Promise(resolve => {
      const on = () => resolve(true) // is in private mode
      const off = () => resolve(false) // not private mode
      const testLocalStorage = () => {
        try {
          if (localStorage.length) off()
          else {
            localStorage.x = 1
            localStorage.removeItem('x')
            off()
          }
        } catch (e) {
          // Safari only enables cookie in private mode
          // if cookie is disabled then all client side storage is disabled
          // if all client side storage is disabled, then there is no point
          // in using private mode
          navigator.cookieEnabled ? on() : off()
        }
      }
      // Chrome & Opera
      if (window.webkitRequestFileSystem) {
        return void window.webkitRequestFileSystem(0, 0, off, on)
      }
      // Firefox
      if ('MozAppearance' in document.documentElement.style) {
        const db = indexedDB.open('test')
        db.onerror = on
        db.onsuccess = off
        return void 0
      }
      // Safari
      if (/constructor/i.test(window.HTMLElement)) {
        return testLocalStorage()
      }
      // IE10+ & Edge
      if (!window.indexedDB && (window.PointerEvent || window.MSPointerEvent)) {
        return on()
      }
      // others
      return off()
    })
  },

  /**
   * Indexed DB Blob TEST
   */
  detectIndexedDb() {
    // Edge と IE
    if (/Trident|MSIE|Edge/i.test(window.navigator.userAgent)) {
      return Promise.resolve('blob-failure')
    }

    return new Promise(resolve => {
      let dbname = 'play-indexeddb-detect'
      let indexeddb
      let openRequest
      let db
      let putRequest

      try {
        indexeddb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB

        indexeddb.deleteDatabase(dbname).onerror = function() {
          resolve('failure')
        }

        indexeddb.deleteDatabase(dbname).onsuccess = function() {
          openRequest = indexeddb.open(dbname, 1)
          openRequest.onupgradeneeded = function() {
            openRequest.result.createObjectStore('store')
          }
          openRequest.onsuccess = function() {
            db = openRequest.result
            try {
              putRequest = db
                .transaction('store', 'readwrite')
                .objectStore('store')
                .put(new Blob(), 'key')
              putRequest.onsuccess = function() {
                resolve('success')
              }
              putRequest.onerror = function() {
                resolve('blob-failure')
              }
            } catch (e) {
              resolve('blob-failure')
            } finally {
              db.close()
              indexeddb.deleteDatabase(dbname)
            }
          }
        }
      } catch (e) {
        resolve('failure')
      }
    })
  }
}

db.connect = methods.connect

export default db
