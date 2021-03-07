import request from '../../utils/request'
let timeOut = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '', // placeholder的内容
    hotList: [], // 热搜榜数据
    searchContent: '', // 搜索内容
    searchList: [], // 关键字模糊匹配的数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInitData()
  },

  // 获取初始化数据
  async getInitData() {
    let placeholderData = await request('/search/default')
    let hostListData = await request('/search/hot/detail')
    this.setData({
      placeholderContent: placeholderData.data.showKeyword,
      hotList: hostListData.data
    })
  },

  // 表单项内容发生改变的回调
  handleInputChange(event) {
    this.setData({
      searchContent: event.detail.value.trim()
    })
    // 当表单项内容为空时，将结果直接清空并return出这个函数，避免后续节流出现一系列问题
    if (!this.data.searchContent) {
      this.setData({
        searchList: []
      })
      return;
    }
    if (timeOut) {
      console.log('触发节流，不执行回调');
      return;
    }
    timeOut = true;
    this.getSearchList();
    // 函数节流
    setTimeout(() => {
      timeOut = false
    }, 300)
  },

  async getSearchList() {
    let searchListData = await request('/search', {
      keywords: this.data.searchContent,
      limit: 10,
    })
    this.setData({
      searchList: searchListData.result.songs
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