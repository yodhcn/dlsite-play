const dateTimeFormat = {
  short: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour12: false
  },

  long: {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  }
}

const message = {
  confirm_dialog: {
    ok: 'OK',
    cancel: '取消'
  },

  app: {
    back: '返回',
    ok: '完成',
    close: '關閉',
    edit: '編輯',
    all_delete: '刪除所有內容',
    delete: '刪除',
    cancel: '取消',
    setting: '設定',
    not_found: '找不到頁面',
    initalizeError: 'APP可能發生問題。\n如經過一段時間後，APP還是無法啟動，\n請將DLsite Play格式化。',
    dbError: '資料庫損毀。\n必須清除所有資料庫，並再次建立。\n請問是否要執行？',
    clearDatabase: 'DLsite Play格式化'
  },

  login: {
    head: '欲使用DLsite Play<br>需登入DLsite。',
    login: '登入',
    login_msg: '使用本服務，需註冊DLsite帳號。',
    guide: '詳細使用方法，請閱讀<a href="/ja/">使用導覽頁面</a>。'
  },

  slide_menu: {
    library: '媒體庫',
    mylist: '我的最愛',
    playlist: '播放列表',
    storage: '儲存管理',
    setting: '設定',
    help: '幫助（日文）',
    sync_date: '同步{date}',
    sync_library: '同步媒體庫',
    syncing: '同步中',
    synced: '同步完成',
    dlsite: '回到DLsite',
    logout: '登出',
    logout_msg: '是否移動到登出頁面？'
  },

  library: {
    title: '媒體庫',
    title_add_mylist: '追加到我的最愛',
    title_add_playlist: '追加到播放列表',
    registDate: '{date} 上架',
    upgradeDate: '{date} 更新',
    purchasedDate: '{date} 購買',
    unknown: '不明',
    searchForItems: '搜尋作品',
    searchForItemsMsg: '作品、社團、作者等',
    itemTotalCount: '合計: {total}作品',
    itemHitCount: '搜尋到{total}作品',
    showMoreItems: '繼續顯示{count}作品',
    work_empty: '無已購買作品',
    work_empty_msg: '將顯示於DLsite購買的作品',
    hidden_not_playwork: '（設定為不顯示不對應瀏覽器的作品）',
    no_hit: '無搜尋結果',
    clear_condition: '清除搜尋條件',
    change_sort_type: '變更排列順序',
    filter_category: '縮小作品種類',
    search_result: '搜尋結果',
    purchase_history: '購買履歷'
    // corrupted_file: 'ファイルに問題が発生しています。ページをリロードしても同じエラーが発生する場合、お手数ですがサポートまでお問い合わせ下さい。',
  },

  mylist: {
    mylist: '我的最愛',
    input_mylist_name: '輸入我的最愛名稱',
    empty_mylist: '空的我的最愛',
    empty_mylist_msg_edit: '點擊右下角的「＋」追加作品。',
    empty_mylist_msg: '點擊右上角的「編輯」追加作品。',
    new_mylist: '新的我的最愛',
    mylist_delete_confirm: '是否刪除這個我的最愛？',
    cannot_use_mylist: '無法使用我的最愛',
    cannot_use_mylist_msg: '欲使用我的最愛功能，必須進行登入。',
    no_mylist: '無我的最愛',
    mylist_desc: '這是在整理作品時，能派上用場的篩選功能。<br>點擊右下角的「＋」製作我的最愛。',
    total: '{total}作品',
    exceedMylistLimit: '可製作的我的最愛數量已達上限',
    exceedMylistWorkLimit: '可追加到我的最愛的數量已達上限',
    duplicatedMylistWork: '本作品已追加到我的最愛',
    updateMylistError: '無法編輯我的最愛'
  },

  playlist: {
    playlist: '播放列表',
    input_playlist_name: '輸入播放列表名稱',
    empty_playlist: '空的播放列表',
    empty_playlist_msg_edit: '點擊右下角的「＋」追加作品。',
    empty_playlist_msg: '點擊右上角的「編輯」追加作品。',
    new_playlist: '新的播放列表',
    playlist_delete_confirm: '是否刪除這個播放列表？',
    cannot_use_playlist: '無法使用播放列表',
    cannot_use_playlist_msg: '欲使用播放列表，必須進行登入。',
    no_playlist: '無播放列表',
    playlist_desc: '您可以搜集自己喜歡的聲音作品，製作播放列表。<br>點擊右下角的「＋」製作播放列表。',
    total: '{total}曲',
    updatePlaylistError: '無法編輯播放列表',
    exceedPlaylistAudioLimit: '可加入播放列表的曲數已達上限（上限：500曲）',
    exceedPlaylistLimit: '可製作的播放列表數量已達上限（上限：500個）'
  },

  work: {
    total: '合計',
    file: '檔案',
    item: '項目',
    add_playlist: '追加曲子',
    download: '下載',
    brand: '品牌',
    creator: '創作者',
    cien_for: '支援',
    rental: '借用',
    mywork: '我的作品',
    registDate: '{date} 上架',
    upgradeDate: '{date} 更新',
    reserve_download: '本作品<strong>上架後即可下載。</strong>',
    download_start_at: '開放下載時間 : {start_at}',
    rental_expired: '本作品<strong>已過借用期限。</strong>',
    rental_expired_2: '如欲再次遊玩，請再度購買。',
    zip_download: '下載ZIP',
    rental_period: '借用期間 :自 {activate_date} 至 {expired_date} ',
    rental_period_unused: '借用期間 : 未使用',
    rental_period_unused_2: '（有效期限至{expired_date} ）',
    pc_only: '本作品為電腦專用作品。<br>無法以智慧型手機閱覽。',
    ready_error: '目前本作品正在準備進行顯示。如幾個小時之後，還是發生同樣的問題，請洽客服人員。',
    html_open: '請選擇HTML檔案的開啟方式',
    html_open_reader: '以唯讀模式開啟',
    html_open_original: '開啟HTML原始碼',
    add_mylist: '追加到我的最愛',
    no_mylist: '無我的最愛',
    download_from_folder: '將顯示的資料暫存於離線模式',
    download_all: '將整個作品暫存於離線模式',
    download_to_desktop: '下載至您的電腦',
    download_to_mobile: '前往下載頁面',
    is_private: '欲使用檔案下載功能，請關閉隱私模式。',
    can_not_download: '本瀏覽器無法使用檔案下載功能',
    download_confirm: '將下載共{total}個檔案。是否進行下載？'
  },

  download: {
    for: '下載"{name}" 中',
    remaining: '剩餘{total}個檔案',
    complete: '下載完成'
  },

  photo: {
    close_viewer: '關閉閱覽器',
    autoplay: '開始自動翻頁',
    stop_autoplay: '結束自動翻頁',
    spread_pages: '跨頁',
    toggle: '切換'
  },

  audio: {
    add_playlist: '追加到播放列表',
    no_playlist: '無播放列表',
    playlist: '播放列表'
  },

  video: {
    repeat_on: '重複: ON',
    repeat_off: '重複: OFF'
  },

  storage: {
    storage_conf: '儲存管理',
    cannot_use_storage: '無法使用儲存功能',
    is_private: '欲使用檔案下載功能，請關閉隱私模式。',
    is_no_login: '欲使用檔案下載功能，必須進行登入。',
    is_no_browser: '目前iOS只能在推薦的瀏覽器下使用檔案下載功能。',
    is_no_browser_pc: '目前的瀏覽器無法使用儲存功能。請使用Google Chrome或Firefox。',
    used_storage: '合計正在使用{used}',
    image_cache: '暫存圖片',
    clear_all_msg: '刪除所有下載的檔案。\n是否刪除所有檔案？'
  },

  setting: {
    setting: '設定',
    language: '語言',
    image_viewer_setting: '設定圖片閱覽器',
    image_viewer: '圖片閱覽器',
    toggle_page_break: '切換跨頁',
    spread_page: '顯示跨頁',
    autoplay_anim: '翻頁動畫',
    autoplay_delay: '自動翻頁秒數',
    second: '{sec}秒',
    audio_player: '音樂撥放器',
    audio_seek_time: '快進・倒帶 秒數',
    library: '媒體庫',
    hidden_not_playwork: '不顯示不對應瀏覽器的作品',
    hidden_recommend: '不顯示推薦',
    cache: '暫存',
    image_cache: '暫存作品圖片',
    system_clear: '格式化所有資料',
    system_clear_msg: '將刪除所有資料，並將DLsite Play格式化。\n是否繼續進行？'
  },

  help: {
    help: '幫助',
    frequently: '常見問題',
    about: '關於本軟件',
    license: '版權標識'
  },

  categories: {
    all: '所有作品',
    book: '圖片',
    music: '聲音',
    video: '影片',
    game: '遊戲',
    etc: '其他作品',
    ACN: '動作',
    ADV: '冒險',
    AMT: '聲音素材',
    COM: '漫畫',
    DNV: '電子小說',
    ET3: '其他',
    ETC: '其他遊戲',
    ICG: 'CG・插畫',
    IMT: '圖片素材',
    MNG: '漫畫',
    MOV: '影片',
    MUS: '音樂',
    NRE: '小說',
    PZL: '益智',
    QIZ: '解謎',
    RPG: '角色扮演',
    SCM: '劇畫',
    SLN: '模擬',
    SOU: '音聲',
    STG: '射擊',
    TBL: '桌面',
    TOL: '工具/配件',
    TYP: '打字',
    KSV: '成人小說'
  },

  sortTypes: {
    purchase: '購買日期由新到舊',
    purchase_asc: '購買日期由舊到新',
    release_desc: '上架日期由新到舊',
    release_asc: '上架日期由舊到新',
    upgrade: '上架、更新日之順序',
    title_asc: '作品名（日語） 升序',
    title_desc: '作品名（日語） 降序',
    maker_asc: '社團名（日語） 升序',
    maker_desc: '社團名（日語） 降序',
    work_type: '作品種類之順序'
  },

  tags: {
    created_by: '作家',
    scenario_by: '劇本',
    illust_by: '插畫',
    voice_by: '聲優',
    music_by: '音樂',
    other_by: '其他'
  },

  listitem: {
    item: '項目',
    file: '檔案',
    pages: '頁數',
    text: '文字',
    audio: '聲音',
    video: '影片',
    image: '圖片',
    pdf: 'PDF'
  },

  ignore: {
    label_switch: '顯示於媒體庫',
    baloon_switch:
      '設定為不顯示的作品可從ˊ[<a href="#/settings">設定</a>] > [<a href="#/settings/ignore">不顯示的作品列表</a>]確認。',
    title: '不顯示的作品列表',
    confirm: '確認',
    visible_button: '顯示於媒體庫',
    header: '無不顯示的作品',
    description: '這是能夠將已購買的作品，設定為不顯示的功能。<br>可以從媒體庫的作品詳細處進行設定。'
  },

  recommend_you: {
    work: '推薦給您的作品',
    setting: '設定'
  },

  related_recommend: {
    work: '相關作品',
    circle_work: '同一個社團的作品',
    see_more: '看更多',
    purchased: '已購買',
    work_list: '関連作品一覧',
    circle_work_list: '本社團的作品一覽',
    unit: 'JPY',
    close: '關閉',
    close_viewer: '關閉閱覽器'
  },

  next_recommend: {
    see_next: '往下看',
    purchase: '購買',
    reserve_work: '預約作品',
    reserve: '預約',
    release_schedule: '發售預定'
  }
}

export default {
  dateTimeFormat,
  message
}
