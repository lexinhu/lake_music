import request from '../../utils/request'
import PubSub from 'pubsub-js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [], // 轮播图数据
    recommendList: [], // 推荐歌单
    topList: [], // 排行榜数据
    listIndex: 0, // 哪个排行榜
    musicIndex: 0, // 哪个音乐
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let bannerListData = await request('/banner', {
      type: 2
    })
    let recommendListData = await request('/personalized', {
      limit: 8
    })
    this.setData({
      bannerList: bannerListData.banners,
      recommendList: recommendListData.result,
    })
    let index = 1
    let resultArr = []
    while (index < 6) {
      let topListData = await request('/top/list', {
        idx: index++
      })
      let topListItem = {
        name: topListData.playlist.name,
        tracks: topListData.playlist.tracks.slice(0, 3)
      }
      resultArr.push(topListItem)
      this.setData({
        topList: resultArr
      })
    }

    // 订阅来自 songDetail 页面的事件
    PubSub.subscribe('switchType', (msg, data) => {
      let {
        topList,
        listIndex,
        musicIndex
      } = this.data
      if (data === 'pre') {
        // 上一首
        if (musicIndex === 0) {
          musicIndex = topList[listIndex].tracks.length - 1
        } else {
          musicIndex -= 1
        }
      } else {
        // 下一首
        if (musicIndex === topList[listIndex].tracks.length - 1) {
          musicIndex = 0
        } else {
          musicIndex += 1
        }
      }

      this.setData({
        musicIndex
      })

      let musicId = topList[listIndex].tracks[musicIndex].id
      console.log(musicId);
      PubSub.publish('musicId', musicId)
    })
  },

  // 跳转至 recommendSong
  toRecommendSong() {
    wx.redirectTo({
      url: '/pages/recommendSong/recommendSong'
    })
  },

  // 跳转至 songListDetail
  toSongListDetail(event) {
    wx.redirectTo({
      url: '/pages/songListDetail/songListDetail?id=' + event.currentTarget.dataset.id
    })
  },

  // 跳转至 SongDetail
  toSongDetail(event) {
    let songDetail = event.currentTarget.dataset
    let {
      song,
      listIndex,
      musicIndex
    } = songDetail
    this.setData({
      listIndex,
      musicIndex
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