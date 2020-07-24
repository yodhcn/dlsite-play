const fileFormatList = {
  // テキスト (文本)
  text: ['txt'],
  // オーディオ (音频)
  audio: ['mp3', 'm4a', 'aac', 'wma', 'wav', 'flac'],
  // 動画
  video: ['mov', 'wmv', 'avi', 'mpg', 'mpeg', 'flv', 'mp4', 'divx'],
  // HTML
  html: ['html', 'htm'],
  // PDF
  pdf: ['pdf'],
  // 画像
  image: ['jpg', 'png', 'bmp', 'gif', 'pic', 'pi', 'mag', 'maki']
}

export default class FileFormat {
  /**
   * ファイルタイプを返す (返回文件类型)
   * @returns {string|null}
   */
  static getFiletype(extension) {
    for (let fileType in fileFormatList) {
      if (
        Object.prototype.hasOwnProperty.call(fileFormatList, fileType) &&
        fileFormatList[fileType].includes(extension)
      ) {
        return fileType
      }
    }

    return null
  }
}
