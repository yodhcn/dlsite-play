const path = require('path')
const HttpsProxyAgent = require('https-proxy-agent')
const zlib = require('zlib')

// http 或 https 代理
const PROXY = 'http://127.0.0.1:10809'

const resolve = dir => path.join(__dirname, dir)

/**
 * 根据 [Content-Encoding] 消息头确定解码方式, 处理完数据之后再编码回去
 * @param oriBuffer 缓冲区数据
 * @param encoding 消息头中的编码格式
 * @param handleJsonResFunc 数据处理函数
 */
const handleBuffer = (oriBuffer, encoding, handleJsonResFunc) => {
  let decodeMethod = ''
  let encodeMethod = ''
  // 编码格式参考：https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Encoding
  switch (encoding) {
    case 'gzip':
      decodeMethod = 'gunzipSync'
      encodeMethod = 'gzipSync'
      break
    case 'deflate':
      decodeMethod = 'inflateSync'
      encodeMethod = 'deflateSync'
      break
    case 'br':
      decodeMethod = 'brotliDecompressSync'
      encodeMethod = 'brotliCompressSync'
      break
    default:
      break
  }

  // 如果缓冲区数据被压缩过, 解压数据
  let decodeBuffer = oriBuffer
  if (decodeMethod && encodeMethod) {
    decodeBuffer = zlib[decodeMethod](oriBuffer)
  }

  // 将缓冲区数据解码为字符串
  const oriString = decodeBuffer.toString()

  // 尝试将数据转换成 JSON 对象
  let oriJSONRes = null
  try {
    oriJSONRes = JSON.parse(oriString)
  } catch (err) {
    // 转换 JSON 出错时提示
    // console.warn('[warn]: JSON parse error! origin string:\n' + decodeBuffer.toString())
    oriJSONRes = oriString
  }

  // 对数据进行处理
  const handledJSONRes = handleJsonResFunc(oriJSONRes)

  // 将处理后的数据转换回缓冲区数据
  const buffer = Buffer.from(handledJSONRes)

  // 按原压缩方式重新压缩
  return decodeMethod && encodeMethod ? zlib[encodeMethod](buffer) : buffer
}

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'https://play.dlsite.com',
        agent: new HttpsProxyAgent(PROXY),
        onProxyRes: (proxyRes, req, res) => {
          const oriWriteHead = res.writeHead
          const oriWrite = res.write
          const oriEnd = res.end

          if (/^\/api\/video\/playlist.m3u8/.test(req.url)) {
            let chunks = []
            let oriSize = 0
            Object.assign(res, {
              writeHead: () => {},
              write: chunk => {
                chunks.push(chunk)
                oriSize = chunk.length
              },
              end: () => {
                const oriBuffer = Buffer.concat(chunks, oriSize)
                const compressBuffer = handleBuffer(oriBuffer, proxyRes.headers['content-encoding'], data =>
                  // 将 playlist.m3u8 文件中的 URL 转换为相对 URL, 使其能够被 devServer 代理
                  data.replace(/http(s)?:\/\/play.dlsite.com/g, '')
                )
                chunks = []
                chunks.push(compressBuffer)
                const buffer = Buffer.concat(chunks, compressBuffer.size)

                const headers = Object.keys(proxyRes.headers).reduce((prev, key) => {
                  const value = key === 'content-length' ? buffer.length : proxyRes.headers[key]
                  return Object.assign({}, prev, { [key]: value })
                }, {})

                oriWriteHead.apply(res, [200, headers])
                oriWrite.call(res, buffer)

                oriEnd.call(res)
              }
            })
          }
        }
      }
    }
  },

  // webpack 配置
  chainWebpack: config => {
    // 配置别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))

    // 配置loader
    // 添加一个新的 Loader
    config.module
      .rule('LICENSE')
      .test(/LICEN(S|C)E(\.md)?$/i)
      .use('html-loader')
      .loader('html-loader')
      .end()

    // 替换一个规则里的 Loader
    const svgRule = config.module.rule('svg')
    // 清除已有的所有 loader
    // 如果你不这样做. 接下来的 loader 会附加在该规则现有的 loader 之后
    svgRule.uses.clear()

    // 添加要替换的 loader
    svgRule
      .rule('svg')
      .use('url-loader')
      .loader('url-loader')
  }
}
