import Vue from 'vue'
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'
import UAParser from 'ua-parser-js'
import env from '@/utils/env'

const ignoreErrors = [
  'null',
  'undefined',
  /^AbortError/, // plyr.js
  /^NotSupportedError/, // audio.js
  /^NotAllowedError/, // audio.js
  'Unexpected end of input', // 謎Syntax error
  'offline', // offline
  'Network Error', // Network Error
  'Script error.', // 外部起因
  '[object Event]', // svg
  '[object CustomEvent]',
  '[object ErrorEvent]',
  '"Event"',
  '"CustomEvent"',
  'Object.defineProperty: invalid modification of non-configurable property', // IE11稀
  'The operation is insecure.', // Google Translate
  'OperaIce', // Opera Coast起因
  /GoogleTranslate/,
  /NaverTranslator/,
  'The request is not allowed by the user agent or the platform in the current context, possibly because the user denied permission.', // safari auto play
  /adblock/i, // AdBlock, fuckAdBlock
  'The operation was aborted.', // xhrキャンセル
  /^https?:\/\/google\.github\.io\/lovefield/, // indexedDB
  /^moz-extension:/,
  /^chrome:/,
  "SecurityError: Failed to read the 'localStorage' property from 'Window': Access is denied for this document.", // 設定でブロックされた
  /Microsoft Internet Extension/,
  /Opera/i,
  /UCBrowser/i,
  "Can't find variable: $",
  '0'
]

// 動作保証ブラウザ
const supportedBrowsers = [
  // およそ1年前の安定版まで対応
  {
    // Google Chrome
    pattern: /^Chrome/,
    version: 55
  },
  {
    // Firefox
    pattern: /Firefox/,
    version: 60
  },
  {
    // Safari & iOS Mobile Safari
    pattern: /^(Mobile )?Safari$/,
    version: 10
  },
  {
    // Microsoft Edge
    pattern: /Edge/,
    version: 17
  },
  {
    // Internet Exproler
    pattern: /IE/,
    version: 11
  },
  // 以降のブラウザはバージョンまでは確認しない
  {
    // QQBrowser
    pattern: /QQBrowser/,
    version: 1
  },
  {
    // Opera
    pattern: /^Opera/,
    version: 1
  },
  {
    // Dolphin
    pattern: /Dolphin/,
    version: 1
  },
  {
    // UCBrowser
    pattern: /UCBrowser/,
    version: 1
  }
]

const capturedErrors = []

if (env !== 'production') {
  Vue.config.devtools = true
}

;(() => {
  // テスト送信したいときは外す
  if (/^(development|test)$/.test(env)) {
    Vue.config.errorHandler = function(err) {
      console.error(err)
    }
    Vue.config.warnHandler = function(msg) {
      console.warn(msg)
    }
    return
  }

  // 外部サイト経由（翻訳等）
  if (!/^play(\.[a-z]+)?\.dlsite\.com$/.test(location.hostname)) {
    return
  }

  const ua = new UAParser()
  const { os, browser } = ua.getResult()

  // iOS9以下はサポート対象外
  if (!os || (os.name === 'iOS' && os.version.split('.')[0] <= 9)) {
    console.info('not supported os', os.name, os.version)
    return
  }

  if (
    !browser ||
    !supportedBrowsers.some(supportedBrowser => {
      return supportedBrowser['pattern'].test(browser.name) && browser.major >= supportedBrowser['version']
    })
  ) {
    console.info('not supported browser', browser.name, browser.major)
    return
  }

  console.group('Sentry')

  Sentry.init({
    dsn: 'https://2b8e4ee84cd44f609a6b59e9a6433423@sentry.io/1245937',
    environment: env,
    debug: env !== 'production',
    release: process.env.SENTRY_RELEASE || '',
    integrations: [new Integrations.Vue({ Vue, attachProps: true })],
    ignoreErrors,
    whitelistUrls: [/^https?:\/\/play(\.[a-z]+)?\.dlsite\.com/, /^webpack-internal:/],
    sampleRate: env === 'production' ? 0.2 : 1,
    beforeSend(event, hint) {
      if (hint && hint.originalException) {
        const { message } = hint.originalException

        // 多重送信しない
        if (capturedErrors.indexOf(message) !== -1) {
          return null
        }

        capturedErrors.push(message)
      }

      return event
    }
  })

  console.groupEnd()
})()

// global error
window.addEventListener('error', e => {
  if (e.message && (e.message.indexOf('transaction') !== -1 || e.message.indexOf('NotFoundError') !== -1)) {
    if (
      window.confirm(
        'データベースが破損しています。\n一度データベースを全てクリアして再構築を行う必要があります。\n実行してよろしいですか？'
      )
    ) {
      window.location.href = '/clear.html'
    }
  } else {
    throw e
  }
})
