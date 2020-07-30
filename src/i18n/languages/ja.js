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
    cancel: 'キャンセル'
  },

  app: {
    back: '戻る',
    ok: '完了',
    close: '閉じる',
    edit: '編集',
    all_delete: '全て削除',
    delete: '削除',
    cancel: 'キャンセル',
    setting: '設定',
    not_found: 'ページが見つかりませんでした',
    initalizeError:
      'アプリに問題が発生している可能性があります。しばらく経ってもアプリが起動しない場合は、DLsite Playの初期化をお試しください。',
    dbError:
      'データベースが破損しています。\n一度データベースを全てクリアして再構築を行う必要があります。\n実行してよろしいですか？',
    clearDatabase: 'DLsite Playの初期化'
  },

  login: {
    head: 'DLsite Playの利用には<br>DLsiteへのログインが必要です。',
    login: 'ログイン',
    login_msg: 'ご利用にはDLsiteのユーザー登録が必要です。',
    guide: '詳しい使い方は、<a href="/ja/">ガイドページ</a>をご覧ください。'
  },

  slide_menu: {
    library: 'ライブラリ',
    mylist: 'マイリスト',
    playlist: 'プレイリスト',
    storage: 'ストレージ管理',
    setting: '設定',
    help: 'ヘルプ',
    sync_date: '{date}に同期',
    sync_library: 'ライブラリを同期',
    syncing: '同期中',
    synced: '同期しました',
    dlsite: 'DLsiteに戻る',
    logout: 'ログアウト',
    logout_msg: 'ログアウトページへ移動しますか？'
  },

  library: {
    title: 'ライブラリ',
    title_add_mylist: 'マイリストに追加',
    title_add_playlist: 'プレイリストに追加',
    registDate: '{date} 発売',
    upgradeDate: '{date} アップデート',
    purchasedDate: '{date} 購入',
    unknown: '不明',
    searchForItems: '作品を検索',
    searchForItemsMsg: '作品、サークル、作家名など',
    itemTotalCount: '合計: {total}作品',
    itemHitCount: '{total}作品がヒット',
    showMoreItems: 'さらに{count}作品を表示する',
    work_empty: '購入済み作品なし',
    work_empty_msg: 'DLsiteで購入した作品が表示されます。',
    hidden_not_playwork: '（設定でブラウザ非対応作品が非表示になっています）',
    no_hit: '該当なし',
    clear_condition: '検索条件をクリア',
    change_sort_type: 'ソート順変更',
    filter_category: 'ジャンル絞り込み',
    search_result: '検索結果',
    purchase_history: '購入履歴',
    corrupted_file:
      'ファイルに問題が発生しています。ページをリロードしても同じエラーが発生する場合、お手数ですがサポートまでお問い合わせ下さい。'
  },

  mylist: {
    mylist: 'マイリスト',
    input_mylist_name: 'マイリスト名を入力',
    empty_mylist: '空のマイリスト',
    empty_mylist_msg_edit: '右下の「＋」から作品を追加しましょう。',
    empty_mylist_msg: '右上の「編集」から作品を追加しましょう。',
    new_mylist: '新しいマイリスト',
    mylist_delete_confirm: 'このマイリストを削除してよろしいですか？',
    cannot_use_mylist: 'マイリストを利用することができません',
    cannot_use_mylist_msg: 'マイリスト機能を利用するには、ユーザーログインが必要です。',
    no_mylist: 'マイリストなし',
    mylist_desc: '作品の整理に役立つフォルダ分け機能です。<br>右下の「＋」からマイリストを作成しましょう。',
    total: '{total}作品',
    exceedMylistLimit: '作成できるマイリスト数が上限に達しました',
    exceedMylistWorkLimit: 'マイリストに追加できる作品数が上限に達しました',
    duplicatedMylistWork: 'この作品は既にマイリストに追加されています',
    updateMylistError: 'マイリストを編集できませんでした'
  },

  playlist: {
    playlist: 'プレイリスト',
    input_playlist_name: 'プレイリスト名を入力',
    empty_playlist: '空のプレイリスト',
    empty_playlist_msg_edit: '右下の「＋」から作品を追加しましょう。',
    empty_playlist_msg: '右上の「編集」から作品を追加しましょう。',
    new_playlist: '新しいプレイリスト',
    playlist_delete_confirm: 'このプレイリストを削除してよろしいですか？',
    cannot_use_playlist: 'プレイリストを利用することができません',
    cannot_use_playlist_msg: 'プレイリスト機能を利用するには、ユーザーログインが必要です。',
    no_playlist: 'プレイリストなし',
    playlist_desc: '好きな音声をまとめて再生リストを作成できます。<br>右下の「＋」からプレイリストを作成しましょう。',
    total: '{total}曲',
    updatePlaylistError: 'プレイリストを編集できませんでした',
    exceedPlaylistAudioLimit: 'プレイリストに入れられる曲数が上限に達しました（上限 : 500件）',
    exceedPlaylistLimit: '作成出来るプレイリストの上限数を超えています（上限 : 500件）'
  },

  work: {
    total: '合計',
    file: 'ファイル',
    item: '項目',
    add_playlist: '曲を追加',
    download: 'ダウンロード',
    brand: 'ブランド',
    creator: 'クリエイター',
    cien_for: 'を支援する',
    rental: 'レンタル',
    mywork: 'マイ作品',
    registDate: '{date} 発売',
    upgradeDate: '{date} アップデート',
    reserve_download: 'この作品は<strong>発売日になるとダウンロードができるようになります。</strong>',
    download_start_at: 'ダウンロード開始日時 : {start_at}',
    rental_expired: 'この作品は<strong>レンタル期限が終了しています。</strong>',
    rental_expired_2: '再度プレイしたい場合は再購入してください。',
    zip_download: 'ZIPダウンロード',
    rental_period: 'レンタル期間 : {activate_date} から {expired_date} まで',
    rental_period_unused: 'レンタル期間 : 未使用',
    rental_period_unused_2: '（{expired_date} まで有効）',
    pc_only: 'この作品はパソコン専用作品です。<br>スマートフォンでは閲覧できません。',
    ready_error:
      '現在、この作品を表示出来るよう準備しています。数時間以上たっても同じエラーが発生する場合、お手数ですがサポートまでお問い合わせ下さい。',
    html_open: 'HTMLファイルの開き方を選択',
    html_open_reader: 'リーダーモードで開く',
    html_open_original: 'オリジナルのHTMLを開く',
    add_mylist: 'マイリストに追加',
    no_mylist: 'マイリストがありません',
    download_from_folder: '表示のデータをオフラインに一時保存',
    download_all: '作品全体をオフラインに一時保存',
    download_to_desktop: 'ご利用のパソコンにダウンロード',
    download_to_mobile: 'ダウンロードページへ',
    is_private: 'ファイルのダウンロード機能を利用するには、プライベートブラウジングを終了してください。',
    can_not_download: 'このブラウザではファイルのダウンロード機能をご利用になれません。',
    download_confirm: '合計{total}のデータをダウンロードします。続行しますか？'
  },

  download: {
    for: '"{name}" をダウンロード',
    remaining: '残り{total}ファイル',
    complete: 'ダウンロードが完了しました'
  },

  photo: {
    close_viewer: 'ビューワーを閉じる',
    autoplay: '自動ページめくり開始',
    stop_autoplay: '自動ページめくりを終了しました',
    spread_pages: '見開き',
    toggle: '切り替え'
  },

  audio: {
    add_playlist: 'プレイリストに追加',
    no_playlist: 'プレイリストがありません',
    playlist: 'プレイリスト'
  },

  video: {
    repeat_on: 'リピート: ON',
    repeat_off: 'リピート: OFF'
  },

  storage: {
    storage_conf: 'ストレージ管理',
    cannot_use_storage: 'ストレージを利用することができません',
    is_private: 'ファイルのダウンロード機能を利用するには、プライベートブラウジングを終了してください。',
    is_no_login: 'ファイルのダウンロード機能を利用するには、ユーザーログインが必要です。',
    is_no_browser: '現時点のiOSでは、ファイルのダウンロード機能は推奨ブラウザでのみ利用することができます。',
    is_no_browser_pc: 'お使いのブラウザではストレージをご利用いただけません。Google ChromeやFirefoxをご利用ください。',
    used_storage: '合計{used}を使用中',
    image_cache: '画像キャッシュ',
    clear_all_msg: 'ダウンロードした全てのデータを削除します。\n全件削除を続行しますか？'
  },

  setting: {
    setting: '設定',
    language: '言語',
    image_viewer_setting: '画像ビューア設定',
    image_viewer: '画像ビューア',
    toggle_page_break: '見開きページの切り替え',
    spread_page: '見開き表示',
    autoplay_anim: 'ページめくりアニメーション',
    autoplay_delay: '自動ページめくり秒数',
    second: '{sec}秒',
    audio_player: 'オーディオプレイヤー',
    audio_seek_time: '先送り・巻き戻し秒数',
    library: 'ライブラリ',
    hidden_not_playwork: 'ブラウザ非対応作品を非表示',
    hidden_recommend: 'オススメを非表示',
    cache: 'キャッシュ',
    image_cache: '作品画像をキャッシュ',
    system_clear: '全てのデータを初期化',
    system_clear_msg: '全てのデータを削除してDLsite Playを初期化します。\n続行しますか？'
  },

  help: {
    help: 'ヘルプ',
    frequently: 'よくある質問',
    about: 'このアプリについて',
    license: 'ライセンス表記'
  },

  categories: {
    all: 'すべて',
    book: '画像',
    music: '音声',
    video: '動画',
    game: 'ゲーム',
    etc: 'その他',
    ACN: 'アクション',
    ADV: 'アドベンチャー',
    AMT: '音素材',
    COM: 'マンガ',
    DNV: 'デジタルノベル',
    ET3: 'その他',
    ETC: 'その他ゲーム',
    ICG: 'CG・イラスト',
    IMT: '画像素材',
    MNG: 'マンガ',
    MOV: '動画',
    MUS: '音楽',
    NRE: 'ノベル',
    PZL: 'パズル',
    QIZ: 'クイズ',
    RPG: 'ロールプレイング',
    SCM: '劇画',
    SLN: 'シミュレーション',
    SOU: '音声',
    STG: 'シューティング',
    TBL: 'テーブル',
    TOL: 'ツール/アクセサリ',
    TYP: 'タイピング',
    KSV: '官能小説'
  },

  sortTypes: {
    purchase: '購入日の新しい順',
    purchase_asc: '購入日の古い順',
    release_desc: '発売日の新しい順',
    release_asc: '発売日の古い順',
    upgrade: '発売日・アップデート日順',
    title_asc: '作品名 昇順',
    title_desc: '作品名 降順',
    maker_asc: 'サークル名 昇順',
    maker_desc: 'サークル名 降順',
    work_type: '作品タイプ順'
  },

  tags: {
    created_by: '作家',
    scenario_by: 'シナリオ',
    illust_by: 'イラスト',
    voice_by: '声優',
    music_by: '音楽',
    other_by: 'その他'
  },

  listitem: {
    item: '項目',
    file: 'ファイル',
    pages: 'ページ',
    text: 'テキスト',
    audio: 'オーディオ',
    video: 'ビデオ',
    image: '画像',
    pdf: 'PDF'
  },

  ignore: {
    label_switch: 'ライブラリに表示',
    baloon_switch:
      '非表示にした作品は[<a href="#/settings">設定</a>] > [<a href="#/settings/ignore">非表示作品リスト</a>]からご確認いただけます。',
    title: '非表示作品リスト',
    confirm: '確認する',
    visible_button: 'ライブラリに表示する',
    header: '非表示作品なし',
    description: '購入済み作品を非表示にできる機能です。<br>ライブラリの作品詳細より設定できます。'
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
