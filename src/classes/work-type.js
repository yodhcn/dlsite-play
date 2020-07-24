const workType = {
  // その他同人誌
  ET3: {
    category: 'book',
    gaLabel: 'wc_book_wt_other_format'
  },
  // CG・イラスト
  ICG: {
    category: 'book',
    gaLabel: 'wc_book_wt_cg_Illustrations'
  },
  // 官能小説
  KSV: {
    category: 'book',
    gaLabel: 'wc_book_wt_erotic_novel'
  },
  // マンガ
  MNG: {
    category: 'book',
    gaLabel: 'wc_book_wt_manga'
  },
  // ノベル
  NRE: {
    category: 'book',
    gaLabel: 'wc_book_wt_novel'
  },
  // 劇画
  SCM: {
    category: 'book',
    gaLabel: 'wc_book_wt_strip_cartoon'
  },
  // 音楽作品
  MUS: {
    category: 'music',
    gaLabel: 'wc_music_wt_music'
  },
  // 音声作品
  SOU: {
    category: 'music',
    gaLabel: 'wc_music_wt_voice'
  },
  // 動画作品
  MOV: {
    category: 'video',
    gaLabel: 'wc_video_wt_anime'
  },
  // アクションゲーム
  ACN: {
    category: 'game',
    gaLabel: 'wc_game_wt_action'
  },
  // アドベンチャーゲーム
  ADV: {
    category: 'game',
    gaLabel: 'wc_game_wt_adventure'
  },
  // デジタルノベル
  DNV: {
    category: 'game',
    gaLabel: 'wc_game_wt_digital_novel'
  },
  // その他ゲーム
  ETC: {
    category: 'game',
    gaLabel: 'wc_game_wt_other_games'
  },
  // パズルゲーム
  PZL: {
    category: 'game',
    gaLabel: 'wc_game_wt_puzzle'
  },
  // クイズゲーム
  QIZ: {
    category: 'game',
    gaLabel: 'wc_game_wt_quiz'
  },
  // ロールプレイングゲーム
  RPG: {
    category: 'game',
    gaLabel: 'wc_game_wt_rpg'
  },
  // シミュレーションゲーム
  SLN: {
    category: 'game',
    gaLabel: 'wc_game_wt_simulation'
  },
  // シューティングゲーム
  STG: {
    category: 'game',
    gaLabel: 'wc_game_wt_shooter'
  },
  // テーブルゲーム
  TBL: {
    category: 'game',
    gaLabel: 'wc_game_wt_tabletop'
  },
  // タイピングゲーム
  TYP: {
    category: 'game',
    gaLabel: 'wc_game_wt_typing'
  },
  // 音素材
  AMT: {
    category: 'etc',
    gaLabel: 'wc_etc_wt_audio_material'
  },
  // 画像素材
  IMT: {
    category: 'etc',
    gaLabel: 'wc_etc_wt_image_material'
  },
  // ツール / アクセサリ
  TOL: {
    category: 'etc',
    gaLabel: 'wc_etc_wt_utility'
  }
}

export default class WorkType {
  static getGaLabel(key) {
    if (Object.prototype.hasOwnProperty.call(workType, key)) {
      return workType[key].gaLabel
    }
    return ''
  }
}
