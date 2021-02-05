import request from '../../utils/request'
import PubSub from 'pubsub-js'
import moment from 'moment'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '', // 天
    month: '', // 月
    recommendList: [], // 每日推荐音乐 
    index: 0, // 点击音乐的下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (!wx.getStorageSync("cookies")) {
      wx.redirectTo({
        url: '/pages/login/login',
      })
      wx.showToast({
        title: '请先登录',
        icon: 'loading',
        duration: 1500
      })
      return;
    }

    let day = moment().format('DD')
    let month = moment().format('MM')
    // if (day < 10) {
    //   day = "0" + day
    // }
    // if (month < 10) {
    //   month = "0" + month
    // }
    // 更新日期
    this.setData({
      day,
      month
    })

    this.getRecommendList()

    // 订阅来自 songDetail 页面的事件
    PubSub.subscribe('switchType', (msg, data) => {
      let {
        recommendList,
        index
      } = this.data
      if (data === 'pre') {
        // 上一首
        if (index === 0) {
          index = recommendList.length - 1
        } else {
          index -= 1
        }
      } else {
        // 下一首
        if (index === recommendList.length - 1) {
          index = 0
        } else {
          index += 1
        }
      }

      this.setData({
        index
      })

      let musicId = recommendList[index].id
      console.log(musicId);
      PubSub.publish('musicId', musicId)
    })
  },

  // 获取用户每日推荐音乐
  async getRecommendList() {
    let recommendListData = await request('/recommend/songs')
    this.setData({
      recommendList: recommendListData.recommend
    })
  },

  // 跳转到音乐播放详细页
  toSongDetail(event) {
    let {
      song,
      index
    } = event.currentTarget.dataset
    this.setData({
      index
    })
    wx.navigateTo({
      // 不能直接传递 song 对象，长度过长会被截取掉。
      url: '/pages/songDetail/songDetail?musicId=' + song.id,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    /**
     * 取消全部订阅
     */
    PubSub.clearAllSubscriptions()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})