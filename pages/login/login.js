import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 表单项内容发生改变的回调
  handleInput(event) {
    let type = event.currentTarget.id;
    this.setData({
      [type]: event.detail.value
    })
  },

  // 登录回调
  async login() {
    // 收集表单项数据
    let {
      phone,
      password
    } = this.data;
    // 前端验证
    if (!phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return;
    }
    let phoneReg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
    if (!phoneReg.test(phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      })
      return;
    }
    if (!password) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return;
    }

    // 调用后端登录接口
    let result = await request('/login/cellphone', {
      phone,
      password,
      isLogin: true
    });
    if (result.code === 200) {
      wx.showToast({
        title: '登录成功',
      })
      // 将用户的信息存储到本地
      wx.setStorageSync('userInfo', JSON.stringify(result.profile));
      // 跳转到个人中心页
      wx.reLaunch({
        url: '/pages/personal/personal',
      })
    } else if (result.code === 400 || result.code === 502) {
      wx.showToast({
        title: '手机号或密码发生错误',
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: '登录失败，请与管理员联系。',
        icon: 'none'
      })
    }
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