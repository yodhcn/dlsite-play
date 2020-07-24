const env = (() => {
  if (location.port === '8080') {
    return 'test'
  } else if (location.hostname === 'play.stg.dlsite.com') {
    return 'staging'
  } else if (/^play\.([a-z]+)\.dlsite\.com$/.test(location.hostname)) {
    return 'development'
  } else {
    return 'production'
  }
})()

export default env
