import request from '../../utils/request'
import PubSub from 'pubsub-js'
import moment from 'moment'

const appInstance = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    song: {},
    musicId: '',
    musicLink: '', // 当前播放的音乐链接
    currentTime: '00:00', // 实时时间
    durationTime: '00:00', // 总时长
    currentWidth: 0, // 实时进度条的宽度
    durationWidth: 0, // 进度条的总宽度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 获取播放进度条总宽度
    const query = wx.createSelectorQuery()
    query.select('.barControl').boundingClientRect()
    query.exec((res) => {
      this.setData({
        durationWidth: res[0].width
      })
    })


    this.setData({
      musicId: options.musicId
    })
    // 获取音乐详细
    this.getMusicInfo(options.musicId)

    // 创建音乐控件
    this.audioManager = wx.getBackgroundAudioManager()

    console.log(typeof appInstance.globalData.musicId);
    console.log(typeof this.data.musicId);
    // 判断当前音乐是否在播放 
    // 若不是当前音乐在播放，停止上一首音乐
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId + '' == this.data.musicId) {
      console.log("appInstance.globalData.musicId" + appInstance.globalData.musicId);
      console.log("options.musicId" + this.data.musicId);
      // 修改当前页面音乐是否在播放
      this.setData({
        isPlay: true
      })
    } else {
      this.audioManager.stop()
    }

    // 监听音乐控件的播放/暂停/停止，让其与 isPlay 属性同步
    this.audioManager.onPlay(() => {
      this.changePlayState(true)
      appInstance.globalData.musicId = this.data.musicId
      console.log("appInstance.globalData.musicId" + appInstance.globalData.musicId);
      console.log("options.musicId" + this.data.musicId);
    })
    this.audioManager.onPause(() => {
      this.changePlayState(false)
    })
    this.audioManager.onStop(() => {
      this.changePlayState(false)
    })
    // 监听音乐自然结束
    this.audioManager.onEnded(() => {
      let {
        isPlay,
        musicId,
        musicLink
      } = this.data
      this.musicController(isPlay, musicId, musicLink)
    })
    // 监听音乐实时播放的进度
    this.audioManager.onTimeUpdate(() => {
      // 计算实时播放的时间
      let currentTime = moment(this.audioManager.currentTime * 1000).format('mm:ss')
      // 计算实时播放的长度
      // currentTime/durationTime = currentWidth/总宽度
      let currentWidth = this.audioManager.currentTime / this.audioManager.duration * this.data.durationWidth

      this.setData({
        currentTime,
        currentWidth
      })
    })
  },

  // 修改播放状态
  changePlayState(isPlay) {
    this.setData({
      isPlay: isPlay
    })
    // 修改全局变量的状态
    appInstance.globalData.isMusicPlay = isPlay
  },

  // 获取音乐详情的功能函数
  async getMusicInfo(musicId) {
    let songData = await request('/song/detail', {
      ids: musicId
    })
    let durationTime = moment(songData.songs[0].dt).format('mm:ss')
    this.setData({
      song: songData.songs[0],
      durationTime
    })
    // 动态修改窗口标题
    wx.setNavigationBarTitle({
      title: this.data.song.name,
    })
  },

  // 点击播放/暂停按钮
  handleMusicPlay() {
    let isPlay = !this.data.isPlay
    let {
      musicId,
      musicLink
    } = this.data
    this.musicController(isPlay, musicId, musicLink)
  },

  // 音乐播放/暂停
  async musicController(isPlay, musicId, musicLink) {
    if (isPlay) {
      if (!musicLink) {
        let musicLinkData = await request('/song/url', {
          id: musicId
        })
        musicLink = musicLinkData.data[0].url
        this.setData({
          musicLink
        })
      }
      // 音乐播放
      this.audioManager.title = this.data.song.name
      this.audioManager.src = musicLink
      this.audioManager.coverImgUrl = this.data.song.al.picUrl
    } else {
      // 暂停音乐
      this.audioManager.pause()
    }
  },

  // 切换歌曲
  switchMusic(event) {
    // 切歌类型 上一首下一首
    let type = event.currentTarget.id
    // 关闭当前的播放音乐
    this.audioManager.stop()
    // 订阅来自 recommendSong 的事件
    PubSub.subscribe('musicId', (msg, musicId) => {
      this.setData({
        musicId: musicId
      })

      // 获取音乐详细
      this.getMusicInfo(musicId)
      // 自动播放当前音乐
      this.musicController(true, musicId)

      // 取消订阅
      PubSub.unsubscribe('musicId')
    })
    // 发布消息给 recommendSong 页面
    PubSub.publish('switchType', type)
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