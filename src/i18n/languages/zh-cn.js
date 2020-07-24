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
    close: '关闭',
    edit: '编辑',
    all_delete: '全部删除',
    delete: '删除',
    cancel: '取消',
    setting: '设定',
    not_found: '找不到页面',
    initalizeError: 'APP可能出现错误。若经过一段时间后依旧无法启动，请尝试将DLsite Play格式化。',
    dbError: '数据库受损。\n需将数据库清空并重筑。\n请问是否执行？',
    clearDatabase: 'DLsite Play格式化'
  },

  login: {
    head: '想使用DLsite Play必需登录DLsite。',
    login: '登录',
    login_msg: '想使用本服务，需先注册DLsite账号。',
    guide: '详细的使用方法、请参照<a href="/ja/">向导页面</a>'
  },

  slide_menu: {
    library: '媒体库',
    mylist: '我的列表',
    playlist: '播放列表',
    storage: '储存管理',
    setting: '设定',
    help: '帮助（日文）',
    sync_date: '同步{date}',
    sync_library: '同步媒体库',
    syncing: '同步中',
    synced: '同步完成',
    dlsite: '回到DLsite',
    logout: '登出',
    logout_msg: '是否移动到登出页面？'
  },

  library: {
    title: '媒体库',
    title_add_mylist: '添加到我的列表',
    title_add_playlist: '添加到播放列表',
    registDate: '{date} 上架',
    upgradeDate: '{date} 更新',
    purchasedDate: '{date} 购买',
    unknown: '不明',
    searchForItems: '搜索作品',
    searchForItemsMsg: '作品、社团、作者等',
    itemTotalCount: '合计: {total}作品',
    itemHitCount: '找到{total}作品',
    showMoreItems: '继续显示{count}作品',
    work_empty: '无已购买作品',
    work_empty_msg: '显示已在DLsite购买的作品',
    hidden_not_playwork: '（设定为不显示无法对应浏览器的作品）',
    no_hit: '无结果',
    clear_condition: '清楚搜索条件',
    change_sort_type: '变更排列顺序',
    filter_category: '详细设定作品类别',
    search_result: '搜索结果',
    purchase_history: '购买履历'
    // corrupted_file: 'ファイルに問題が発生しています。ページをリロードしても同じエラーが発生する場合、お手数ですがサポートまでお問い合わせ下さい。',
  },

  mylist: {
    mylist: '我的列表',
    input_mylist_name: '输入我的列表名',
    empty_mylist: '空的我的列表',
    empty_mylist_msg_edit: '点击右下角的「＋」追加作品。',
    empty_mylist_msg: '点击右上角的「编辑」追加作品。',
    new_mylist: '新建我的列表',
    mylist_delete_confirm: '是否删除这个我的列表',
    cannot_use_mylist: '无法使用我的列表功能',
    cannot_use_mylist_msg: '想使用我的列表功能，需登录账户。',
    no_mylist: '无我的列表',
    mylist_desc: '这是在整理作品时能派上用场的筛选功能。<br>点击右下角的「＋」制作我的列表吧。',
    total: '{total}作品',
    exceedMylistLimit: '可作成的我的列表的数量已达到上限',
    exceedMylistWorkLimit: '可追加到我的列表的作品数量已达到上限',
    duplicatedMylistWork: '本作品已追加到我的列表',
    updateMylistError: '无法编辑我的列表'
  },

  playlist: {
    playlist: '播放列表',
    input_playlist_name: '输入播放列表名称',
    empty_playlist: '空的播放列表',
    empty_playlist_msg_edit: '点击右下角的「＋」追加作品。',
    empty_playlist_msg: '点击右上角的「编辑」追加作品。',
    new_playlist: '新的播放列表',
    playlist_delete_confirm: '是否删除这个播放列表？',
    cannot_use_playlist: '无法使用播放列表功能',
    cannot_use_playlist_msg: '想使用播放列表功能，需登录账户。',
    no_playlist: '无播放列表',
    playlist_desc: '您可以收集自己喜欢的音声作品，制作播放列表。<br>点击右下角的「＋」制作播放列表吧。',
    total: '{total}曲',
    updatePlaylistError: '无法编辑播放列表',
    exceedPlaylistAudioLimit: '可加入播放列表的曲数已达上限（上限：500曲）',
    exceedPlaylistLimit: '可制作的播放列表数量已达上限（上限：500个）'
  },

  work: {
    total: '合计',
    file: '文档',
    item: '项目',
    add_playlist: '追加曲目',
    download: '下载',
    brand: '品牌',
    creator: '创作者',
    cien_for: '支援',
    rental: '租借',
    mywork: '我的作品',
    registDate: '{date} 上架',
    upgradeDate: '{date} 更新',
    reserve_download: '本作品<strong>上架后即可下载。 </strong>',
    download_start_at: '下载开始日期 : {start_at}',
    rental_expired: '本作品<strong>已到达租借日期。</strong>',
    rental_expired_2: '若还想再次游玩，请再度购买。',
    zip_download: '下载ZIP',
    rental_period: '借用期间 :自 {activate_date} 至 {expired_date}',
    rental_period_unused: '借用期间 : 未使用',
    rental_period_unused_2: '（有效期限至{expired_date} ）',
    pc_only: '本作品为电脑专用。<br>无法以手机阅览。',
    ready_error: '目前本作品正在准备进行显示。如果几小时后还出现同样错误，请咨询客服人员。',
    html_open: '请选择HTML文档的开启方式',
    html_open_reader: '以阅览模式开启',
    html_open_original: '开启原HTML',
    add_mylist: '追加到我的列表',
    no_mylist: '无我的列表',
    download_from_folder: '将显示的资料暂存于离线模式',
    download_all: '将整个作品暂存于离线模式',
    download_to_desktop: '下载至您的电脑',
    download_to_mobile: '前往下载页面',
    is_private: '想使用下载功能，请停止隐私浏览模式。',
    can_not_download: '此浏览器无法使用文件下载功能。',
    download_confirm: '共计下载{total}个文件，是否继续？'
  },

  download: {
    for: '下载"{name}"',
    remaining: '剩余{total}个文件',
    complete: '下载完毕'
  },

  photo: {
    close_viewer: '关闭阅览器',
    autoplay: '开始自动翻页',
    stop_autoplay: '结束自动翻页',
    spread_pages: '跨页',
    toggle: '切换'
  },

  audio: {
    add_playlist: '追加到播放列表',
    no_playlist: '无播放列表',
    playlist: '播放列表'
  },

  video: {
    repeat_on: '重复: ON',
    repeat_off: '重复: OFF'
  },

  storage: {
    storage_conf: '储存管理',
    cannot_use_storage: '无法使用储存功能',
    is_private: '想使用下载功能，请停止隐私浏览模式。',
    is_no_login: '想使用下载功能，需先登录账户。',
    is_no_browser: '目前的iOS只能在推荐浏览器下使用下载功能。',
    is_no_browser_pc: '目前的浏览器无法使用储存功能，请使用Google Chrome或Firefox。',
    used_storage: '合计正在使用{used}',
    image_cache: '缓存图片',
    clear_all_msg: '删除全部下载文件。\n是否继续删除全部文件？'
  },

  setting: {
    setting: '设定',
    image_viewer_setting: '设定图片阅览器',
    image_viewer: '图片阅览器',
    toggle_page_break: '切换跨页',
    spread_page: '显示跨页',
    autoplay_anim: '翻页动画',
    autoplay_delay: '自动翻页秒数',
    second: '{sec}秒',
    audio_player: '音频播放器',
    audio_seek_time: '快进・后退 秒数',
    library: '媒体库',
    hidden_not_playwork: '不显示无法对应浏览器的作品',
    hidden_recommend: '不显示推荐',
    cache: '缓存',
    image_cache: '作品图片缓存',
    system_clear: '全部数据格式化',
    system_clear_msg: '删除全部数据，将DLsite Play格式化。\n是否继续？'
  },

  help: {
    help: '帮助',
    frequently: '常见问题',
    about: '关于本软件',
    license: '版权标识'
  },

  categories: {
    all: '所有作品',
    book: '图像',
    music: '音频',
    video: '视频',
    game: '游戏',
    etc: '其他',
    ACN: '动作',
    ADV: '冒险',
    AMT: '声音素材',
    COM: '漫画',
    DNV: '电子小说',
    ET3: '其他',
    ETC: '其他游戏',
    ICG: 'CG・插画',
    IMT: '画像素材',
    MNG: '漫画',
    MOV: '视频',
    MUS: '音乐',
    NRE: '小说',
    PZL: '益智',
    QIZ: '解谜',
    RPG: '角色扮演',
    SCM: '剧画',
    SLN: '模拟',
    SOU: '音声',
    STG: '射击',
    TBL: '桌面',
    TOL: '道具/装饰',
    TYP: '打字',
    KSV: '官能小说'
  },

  sortTypes: {
    purchase: '购买日期由新到旧',
    purchase_asc: '购买日期由旧到新',
    release_desc: '上架日期由新到旧',
    release_asc: '上架日期由旧到新',
    upgrade: '上架·更新日排序',
    title_asc: '作品名（日语） 升序',
    title_desc: '作品名（日语） 降序',
    maker_asc: '社团名（日语） 升序',
    maker_desc: '社团名（日语） 降序',
    work_type: '作品种类排序'
  },

  tags: {
    created_by: '作家',
    scenario_by: '剧本',
    illust_by: '插画',
    voice_by: '声优',
    music_by: '音乐',
    other_by: '其他'
  },

  listitem: {
    item: '项目',
    file: '文件',
    pages: '页数',
    text: '文本',
    audio: '音频',
    video: '视频',
    image: '图像',
    pdf: 'PDF'
  },

  ignore: {
    label_switch: '显示于媒体库',
    baloon_switch:
      '设定为不显示的作品可从ˊ[<a href="#/settings">设定</a>] > [<a href="#/settings/ignore">不显示的作品列表</a >]确认。',
    title: '不显示的作品列表',
    confirm: '确认',
    visible_button: '显示于媒体库',
    header: '无不显示的作品',
    description: '这是能够将已购买的作品，设定为不显示的功能。 <br>可以从媒体库的作品详细处进行设定。'
  },

  recommend_you: {
    work: '推荐给您的作品',
    setting: '设定'
  },

  related_recommend: {
    work: '相关作品',
    circle_work: '同一个社团的作品',
    see_more: '查看更多',
    purchased: '已购买',
    work_list: '関連作品一覧',
    circle_work_list: '本社团的作品一览',
    unit: 'JPY',
    close: '关闭',
    close_viewer: '关闭阅览器'
  },

  next_recommend: {
    see_next: '继续阅览',
    purchase: '购买',
    reserve_work: '预约作品',
    reserve: '预约',
    release_schedule: '发售预定'
  }
}

export default {
  dateTimeFormat,
  message
}
