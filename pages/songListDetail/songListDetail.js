import request from '../../utils/request'
import PubSub from 'pubsub-js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    songList: [], // 该歌单的音乐列表
    index: 0, // 正在播放的音乐索引
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSongList(options.id)

    // 订阅来自 songDetail 页面的事件
    PubSub.subscribe('switchType', (msg, data) => {
      let {
        songList,
        index
      } = this.data
      if (data === 'pre') {
        // 上一首
        if (index === 0) {
          index = songList.tracks.length - 1
        } else {
          index -= 1
        }
      } else {
        // 下一首
        if (index === songList.tracks.length - 1) {
          index = 0
        } else {
          index += 1
        }
      }

      this.setData({
        index
      })

      let musicId = songList.tracks[index].id
      console.log(musicId);
      // console.log(index);
      PubSub.publish('musicId', musicId)
    })
  },

  // 获取该歌单的音乐列表
  async getSongList(id) {
    let songListData = await request('/playlist/detail', {
      id
    })
    this.setData({
      songList: songListData.playlist
    })
  },

  // 跳转到音乐播放页
  toSongDetail(event) {
    let songDetail = event.currentTarget.dataset
    let {
      song,
      index
    } = songDetail
    console.log(song);
    console.log(index);
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