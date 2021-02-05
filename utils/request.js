
import config from '../config/config'

export default (url, data = {}, method = 'GET') => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.removeHost + url,
      // url: config.ddnsHost + url,
      data,
      method,
      header: {
        cookie: wx.getStorageSync('cookies') ? wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1) : ''
      },
      success: (res) => {
        // console.log('请求成功', res)
        if (data.isLogin) { // 登录请求
          // 将用户的cookie存入本地
          wx.setStorage({
            key: 'cookies',
            data: res.cookies,
          })
        }
        resolve(res.data)
      },
      fail: (err) => {
        // console.log('请求失败', err)
        reject(err)
      }
    })
  })
}