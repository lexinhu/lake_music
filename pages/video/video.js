import request from '../../utils/request'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [], // 导航标签数据
    navId: '', // 导航标识
    videoList: '', // 视频列表
    videoId: '', // 视频标识
    isTriggered: false // 标识下拉刷新是否被触发
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
    this.getVideoGroupListData();
  },

  // 获取导航数据
  async getVideoGroupListData() {
    let videdoGroupListData = await request('/video/group/list');
    this.setData({
      videoGroupList: videdoGroupListData.data.slice(11, 20),
      navId: videdoGroupListData.data[11].id
    })

    // 获取视频列表
    this.getVideoListData(this.data.navId)
  },

  // 获取视频列表数据
  async getVideoListData(navId) {
    if (!navId) {
      return;
    }
    let videoListData = await request('/video/group', {
      id: navId,
      timestamp: Date.parse(new Date())
    });
    wx.hideLoading()
    let index = 0;
    let videoList = videoListData.datas.map(item => {
      item.id = index++;
      return item;
    })
    this.setData({
      videoList,
      isTriggered: false
    })
  },

  // 点击切换导航的回调
  changeNav(event) {
    let navId = event.currentTarget.id;
    this.setData({
      navId: navId * 1,
      videoList: []
    })

    // 显示正在加载
    wx.showLoading({
      title: '正在加载',
    })

    // 动态获取当前导航对应的视频推荐
    this.getVideoListData(this.data.navId);
  },

  // 点击播放/暂停的回调
  handlePlay(event) {
    let vid = event.currentTarget.id;
    this.setData({
      videoId: vid
    })
  },

  // 自定义下拉刷新的回调
  handleRefresher() {
    this.getVideoListData(this.data.navId)
  },

  // 跳转搜索页
  toSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },

  // 自定义上拉触底的回调
  handleToLower() {

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