Page({
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
  openPage(page) {
    let url = page
    console.log(page);
    if (typeof page == 'object') {
      url = page.currentTarget.dataset.url;
    }
    wx.navigateTo({
      url: url
    })
  },

})