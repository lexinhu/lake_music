// pages/recommendSong/recommendSong.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '', // 天
    month: '' // 月
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let day = new Date().getDate(); 
    let month = new Date().getMonth() + 1;
    if(day < 10){
      day = "0" + day
    }
    if(month<10){
      month = "0" + month
    }
    // 更新日期
    this.setData({
      day,
      month
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