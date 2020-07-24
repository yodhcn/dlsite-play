<style lang="scss" scoped>
.content-box {
  max-width: 880px;
  margin: 0 auto;
  padding: 14px;
  box-sizing: border-box;
}

h1 {
  padding-bottom: 0.3em;
  font-size: 1.65em;
  margin: 2em 0 0 0;

  &:first-child {
    margin: 0.3em 0 0 0;
  }
}

h2 {
  padding-bottom: 0.3em;
  font-size: 1.35em;
  border-bottom: 1px solid #ddd;
}

h3 {
  font-size: 1.1em;
}

ul,
ol {
  padding-left: 2em;
}

ul ul,
ul ol,
ol ol,
ol ul {
  margin-top: 0;
  margin-bottom: 0;
}

li > p {
  margin-top: 16px;
}

li + li {
  margin-top: 0.25em;
}
</style>

<template>
  <div class="page">
    <header class="navigation-bar">
      <div class="left pointer" @click="$router.go(-1)" v-touchfeedback>
        <svgicon name="prev" width="20" height="20" color="#fff"></svgicon>
        <span>{{ $t('app.back') }}</span>
      </div>
    </header>

    <div class="page-content page-bottom scroll">
      <div class="content-box">
        <div class="v5-0-0">
          <h1>Version 5.0.0</h1>

          <h2>新機能</h2>

          <h3>オフライン環境でもDLsite Playが利用可能になりました</h3>

          <ul>
            <li>機内モードなど、インターネットに接続されていない状態でもDLsite Playを利用可能になりました</li>
            <li>画像や作品情報は、一度オンラインで読み込んでおく必要があります</li>
            <li>作品をオフラインで閲覧したい場合、オンラインでファイルをダウンロードしておく必要があります</li>
            <li>マイリストやプレイリストは読み取り専用となり、変更を行うにはオンラインである必要があります</li>
          </ul>

          <h3>作品ファイルを端末にダウンロード可能になりました</h3>

          <ul>
            <li>ダウンロード済みのファイルは、オフライン環境でも閲覧することができます</li>
            <li>ダウンロード可能なファイル形式は、画像/音声/テキストファイルです</li>
            <li>ストレージ管理画面を追加し、ダウンロードしたファイルの管理や削除が行えるようにしました</li>
            <li>iOSの場合、この機能を利用するには推奨ブラウザを利用する必要があります</li>
          </ul>

          <h3>HTML作品の閲覧に対応しました</h3>

          <ul>
            <li>ファイル形式がHTMLの作品の閲覧が可能になりました</li>
            <li>スマートフォン等でHTMLを読みやすく表示する、リーダーモードを利用することができます</li>
          </ul>

          <h3>ブラウザプレイに対応したゲームを直接プレイ可能になりました</h3>

          <ul>
            <li>プレイ可能な作品は、サークルよりブラウザプレイの申請があった作品です</li>
          </ul>

          <h3>ブラウザの戻る/進むによるページ移動をサポートしました</h3>

          <ul>
            <li>さらに、その場でページを再読み込みしてもライブラリ画面に戻らなくなりました</li>
          </ul>

          <h1>機能強化</h1>

          <h2>ライブラリ</h2>

          <h3>作品検索を強化しました</h3>

          <ul>
            <li>作品にクリエイター名が登録されている場合は、クリエイター名で作品を検索可能になりました</li>
            <li>文字の入力をすると、自動的に検索が行われるようになりました</li>
            <li>作品形式による絞り込みを画像/音声/動画/ゲーム/その他にグループ化しました</li>
            <li>グループ名を2回タップすれば、従来通りの作品形式で検索することもできます</li>
          </ul>

          <h3>サムネイルグリッド表示を追加</h3>

          <ul>
            <li>作品メイン画像を一覧で表示することが可能になりました</li>
          </ul>

          <h2>作品詳細</h2>

          <h3>表示方法を強化しました</h3>

          <ul>
            <li>クリエイター名が表示されるようになりました</li>
            <li>サークル名、クリエイター名をクリックすると、ライブラリから該当作者の作品を検索可能になりました</li>
            <li>フォルダ階層をパンくずリストで表示し、クリックで上の階層に戻れるようになりました</li>
          </ul>

          <h2>マイリスト</h2>

          <h3>連続して作品を追加できる画面を追加しました</h3>

          <ul>
            <li>マイリストを開いて編集モードにすると、作品追加ボタンが表示されます</li>
          </ul>

          <h2>プレイリスト</h2>

          <h3>連続して音声を追加できる画面を追加しました</h3>

          <ul>
            <li>プレイリストを開いて編集モードにすると、音声追加ボタンが表示されます</li>
            <li>音声は同じファイルを複数追加することができます</li>
          </ul>

          <h2>画像ビューワー</h2>

          <h3>自動ページ送り機能を追加しました</h3>

          <ul>
            <li>設定画面からページ送り間隔秒数を設定できます</li>
          </ul>

          <h2>全般</h2>

          <h3>デザインをリニューアルしました</h3>

          <ul>
            <li>デザインやアイコンを刷新し、レスポンシブデザインを取り入れました</li>
          </ul>

          <h3>セキュリティを向上しました</h3>

          <ul>
            <li>サービス全体をHTTPS化し、全ての通信を暗号化しました</li>
          </ul>

          <h3>パフォーマンスを改善しました</h3>

          <ul>
            <li>
              ダウンロード機能に対応しているブラウザの場合、作品サムネイル等を自動的にブラウザにキャッシュし、通信の発生を抑えるようにしました
            </li>
            <li>その他、使い勝手の向上につながる変更や性能の向上を行いました</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'releaseNote'
}
</script>
