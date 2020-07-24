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
    cancel: 'Cancel'
  },

  app: {
    back: 'Return',
    ok: 'Complete',
    close: 'Close',
    edit: 'Edit',
    all_delete: 'Delete ALL',
    delete: 'Delete',
    cancel: 'Cancel',
    setting: 'Settings',
    not_found: 'The page could not be found.',
    initalizeError:
      'There is a possibility that something is wrong with the application. If the application does not startup after some time has passed, please "Reset DLsite Play Setting to Default".',
    dbError: 'The database is corrupted.\nIt must be cleared clean and reconstructed.\nDo you consent to this action?',
    clearDatabase: 'Reset DLsite Play Setting to Default'
  },

  login: {
    head: 'In order to use DLsite Play <br>you must be logged into DLsite.',
    login: 'Log in',
    login_msg: 'DLsite member registration is required to use this service.',
    guide: 'For further details, please refer to the <a href="/ja/">ガイドページ</a>'
  },

  slide_menu: {
    library: 'Library',
    mylist: 'My List',
    playlist: 'Playlist',
    storage: 'Offline Storage',
    setting: 'Settings',
    help: 'Help',
    sync_date: 'Synchronized: {date}',
    sync_library: 'Synchronize Library',
    syncing: 'Synchronizing...',
    synced: 'Synchronization Complete',
    dlsite: 'Back to DLsite',
    logout: 'Log out',
    logout_msg: 'Proceed to logout page?'
  },

  library: {
    title: 'Library',
    title_add_mylist: 'Add to My List',
    title_add_playlist: 'Add to Playlist',
    registDate: 'Released: {date}',
    upgradeDate: 'Updated: {date}',
    purchasedDate: 'Purchased: {date}',
    unknown: 'Unknown',
    searchForItems: 'Search...',
    searchForItemsMsg: 'Enter keywords here...',
    itemTotalCount: 'Total works: {total}',
    itemHitCount: 'Found {total} works',
    showMoreItems: 'Show {count} more works...',
    work_empty: 'You have no purchase history.',
    work_empty_msg: 'Products purchased on DLsite will be displayed.',
    hidden_not_playwork: '(Your settings are currently set to "Only display browser-compatible")',
    no_hit: 'No results',
    clear_condition: 'Clear search conditions',
    change_sort_type: 'Change sorting order',
    filter_category: 'Filter by Genre',
    search_result: 'Search Results',
    purchase_history: 'Purchase History'
    // corrupted_file: 'ファイルに問題が発生しています。ページをリロードしても同じエラーが発生する場合、お手数ですがサポートまでお問い合わせ下さい。',
  },

  mylist: {
    mylist: 'My List',
    input_mylist_name: 'Input My List name',
    empty_mylist: 'Empty My List',
    empty_mylist_msg_edit: 'Add works via the (+) button in the bottom right.',
    empty_mylist_msg: 'Add works via the Edit button in the top right.',
    new_mylist: 'New My List',
    mylist_delete_confirm: 'Do you really want to delete this My List?',
    cannot_use_mylist: 'You cannot utilize the My List feature.',
    cannot_use_mylist_msg: 'In order to utilize the My List feature, you must log in.',
    no_mylist: 'No My Lists',
    mylist_desc:
      'A convenient feature which allows you to manage your works into folders.<br>Add My Lists via the (+) button in the bottom right.',
    total: '{total} works',
    exceedMylistLimit: 'You have reached the maximum number of My Lists that can be created.',
    exceedMylistWorkLimit: 'You have reached the maximum number of works that can be added to a single My List.',
    duplicatedMylistWork: 'This work has already been added to this My List.',
    updateMylistError: 'Could not edit this My List.'
  },

  playlist: {
    playlist: 'Playlist',
    input_playlist_name: 'Input Playlist name',
    empty_playlist: 'Empty Playlist',
    empty_playlist_msg_edit: 'Add works via the (+) button in the bottom right.',
    empty_playlist_msg: 'Add works via the Edit button in the top right.',
    new_playlist: 'New Playlist',
    playlist_delete_confirm: 'Do you really want to delete this Playlist?',
    cannot_use_playlist: 'You cannot utilize the Playlist feature.',
    cannot_use_playlist_msg: 'In order to utilize the Playlist feature, you must log in.',
    no_playlist: 'No Playlists',
    playlist_desc:
      'You can add all your favorite tracks to one list.<br>Add Playlists via the (+) button in the bottom right.',
    total: '{total} tracks',
    updatePlaylistError: 'Could not edit this Playlist.',
    exceedPlaylistAudioLimit:
      'You have reached the maximum number of tracks that can be added to a single Playlist. (Maximum: 500)',
    exceedPlaylistLimit: 'You have reached the maximum number limit of Playlists you can create. (Maximum: 500)'
  },

  work: {
    total: 'File Size: ',
    file: ' File',
    item: ' file',
    add_playlist: 'Add track',
    download: 'Download',
    brand: 'Brand',
    creator: 'Creator',
    cien_for: 'Support ',
    rental: 'Rental',
    mywork: 'My Work',
    registDate: 'Released {date}',
    upgradeDate: 'Updated {date}',
    reserve_download: '<strong>This work will become available for downloading after it is released.</strong>',
    download_start_at: 'Release Date: {start_at}',
    rental_expired: '<strong>The rental period of this work has ended.</strong>',
    rental_expired_2: 'If you wish to continue playing, please purchase it.',
    zip_download: 'Download ZIP File',
    rental_period: 'Rental Period: From {activate_date} Until {expired_date}',
    rental_period_unused: 'Rental Period: Yet to be activated',
    rental_period_unused_2: '(Valid until: {expired_date})',
    pc_only: 'This work is available only for PC.<br>It is not compatible with smartphones.',
    ready_error:
      'We are currently preparing this work for viewing. If you get this error even after waiting a few hours, please contact DLsite support.',
    html_open: 'Select HTML file viewing method',
    html_open_reader: 'Open in Reader Mode',
    html_open_original: 'Open as Original HTML',
    add_mylist: 'Add to My List',
    no_mylist: 'There are no My Lists',
    download_from_folder: 'Make the listed data available offline',
    download_all: 'Make the whole product data available offline',
    download_to_desktop: 'Download onto your device',
    download_to_mobile: 'Go to Download page',
    is_private: 'The file download feature cannot be used during a private browsing session.',
    can_not_download: 'The file download feature cannot be used with this browser.',
    download_confirm: 'A total of {total} files will be downloaded. Do you wish to proceed?'
  },

  download: {
    for: 'Download "{name}"',
    remaining: '{total} files remaining',
    complete: 'Download Completed'
  },

  photo: {
    close_viewer: 'Close the viewer',
    autoplay: 'Begin auto page turning',
    stop_autoplay: 'Auto page turning ended',
    spread_pages: 'Spread-pages',
    toggle: 'Toggle'
  },

  audio: {
    add_playlist: 'Add to Playlist',
    no_playlist: 'There are no Playlists',
    playlist: 'Playlist'
  },

  video: {
    repeat_on: 'Repeat: ON',
    repeat_off: 'Repeat: OFF'
  },

  storage: {
    storage_conf: 'Offline Storage',
    cannot_use_storage: 'Unable to utilize storage.',
    is_private: 'The file download feature cannot be used during a private browsing session.',
    is_no_login: 'In order to use the file download feature, you must log in.',
    is_no_browser: 'Currently, the only file downloading method available on iOS is via the recommended browser.',
    is_no_browser_pc: 'The storage feature cannot be used with this browser. Please try with Google Chrome or Firefox.',
    used_storage: 'Storage Amount: {used} stored',
    image_cache: 'Image Cache',
    clear_all_msg: 'This will delete all DLsite Play offline storage data.\nDo you really wish to proceed?'
  },

  setting: {
    setting: 'Settings',
    image_viewer_setting: 'Image Viewer Settings',
    image_viewer: 'Image Viewer',
    toggle_page_break: 'Toggle spread-page view',
    spread_page: 'Display spread-pages',
    autoplay_anim: 'Enable page turning animation',
    autoplay_delay: 'Auto page turning wait time',
    second: '{sec} sec',
    audio_player: 'Audio Player',
    audio_seek_time: 'Fast forward / Rewind',
    library: 'Library',
    hidden_not_playwork: 'Only display browser-compatible',
    hidden_recommend: 'オススメを非表示',
    cache: 'Cache',
    image_cache: 'Cache Images',
    system_clear: 'Reset all data to defaults',
    system_clear_msg: 'This will reset all of your DLsite Play data to defaults.\nDo you consent to this action?'
  },

  help: {
    help: 'Help',
    frequently: 'よくある質問',
    about: 'このアプリについて',
    license: 'ライセンス表記'
  },

  categories: {
    all: 'All',
    book: 'Book',
    music: 'Audio',
    video: 'Video',
    game: 'Game',
    etc: 'Other',
    ACN: 'Action',
    ADV: 'Adventure',
    AMT: 'Audio Material',
    DNV: 'Digital Novel',
    ET3: 'Other Format',
    ETC: 'Other Games',
    ICG: 'CG / Illustrations',
    IMT: 'Image Material',
    MNG: 'Manga',
    MOV: 'Anime',
    MUS: 'Music',
    NRE: 'Novel',
    PZL: 'Puzzle',
    QIZ: 'Quiz',
    RPG: 'RPG',
    SLN: 'Simulation',
    SOU: 'Voice',
    STG: 'Shooter',
    TBL: 'Tabletop',
    TOL: 'Utility',
    TYP: 'Typing',
    KSV: '-'
  },

  sortTypes: {
    purchase: 'Sort by Newest Purchase',
    purchase_asc: 'Sort by Oldest Purchase',
    release_desc: 'Sort by Newest Release',
    release_asc: 'Sort by Oldest Release',
    upgrade: 'Sort by Release / Update Date',
    title_asc: 'Sort by Work Name A>Z',
    title_desc: 'Sort by Work Name Z>A',
    maker_asc: 'Sort by Circle Name A>Z',
    maker_desc: 'Sort by Circle Name Z>A',
    work_type: 'Sort by Work Type'
  },

  tags: {
    created_by: 'Author',
    scenario_by: 'Scenario',
    illust_by: 'Illustration',
    voice_by: 'Voice',
    music_by: 'Music',
    other_by: 'Other'
  },

  listitem: {
    item: ' items',
    file: ' file',
    pages: ' pages',
    text: 'TEXT',
    audio: ' audio',
    video: ' video',
    image: ' image',
    pdf: 'PDF '
  },

  ignore: {
    label_switch: 'Display in Library',
    baloon_switch:
      'You can check your list of hidden items via [ <a href="#/settings">Settings</a> ] > [ <a href="#/settings/ignore">Hidden items</a> ].',
    title: 'Hidden items',
    confirm: 'Confirm details',
    visible_button: 'Display in Library',
    header: 'No Hidden Items',
    description:
      'A convenient feature which allows you to hide items in your Library.<br>Add Hidden Items via the product details in Library.'
  },

  recommend_you: {
    work: 'あなたにオススメの作品',
    setting: '設定'
  },

  related_recommend: {
    work: '関連作品',
    circle_work: '同一サークル作品',
    see_more: 'もっと見る',
    purchased: '購入済',
    work_list: '関連作品一覧',
    circle_work_list: 'このサークルの作品一覧',
    unit: 'JPY',
    close: '閉じる',
    close_viewer: 'ビューワーを閉じる'
  },

  next_recommend: {
    see_next: '続きを見る',
    purchase: '購入する',
    reserve_work: '予約作品',
    reserve: '予約する',
    release_schedule: '発売予定'
  }
}

export default {
  dateTimeFormat,
  message
}
