// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      isLogin: false,
      name: "123",
      user_id: 123
    },
    isShowLoginDialog: false,
  },
  userInfoChange() {

    let that = this;
    if (this.data.userInfo.isLogin == false) {//未登录
      this.loginDialogAcitve()
      return
    }
  },
  loginDialogAcitve() {
    let status = this.data.isShowLoginDialog ? false : true
    this.setData({
      "isShowLoginDialog": status
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})