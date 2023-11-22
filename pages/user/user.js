const app = getApp()

Page({
  data: {
    isLogin: false,
    userInfo: {
      name: "",
      userId: 0
    },
    isShowDialog: false,
    dialogInfo: {
      title: '出现问题了',
      info: ''
    },
    isShowLoginDialog: false,
  },
  userInfoChange() {
    let that = this;
    if (this.data.isLogin == false) {//未登录
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
  onLoad() {
    let that = this;
    console.log(1);
    that.getUserInfo()
  },
  openDialog(e) {
    let that = this
    app.openDialog(e, that)
  },
  getUserInfo() {
    let that = this;
    wx.request({
      url: app.globalData.apiHost + '/userInfo',
      header: {
        'token': wx.getStorageSync('token')
      },
      success(res) {
        if (res.data.code == 401) {
          that.openDialog({
            title: '登录失效'
          })
          that.setData({
            isLogin: false
          })
          that.loginDialogAcitve()
        }
        if (res.data.code == 200) {
          that.setData({
            userInfo: res.data.data,
            isLogin: true
          })
          console.log(res.data.data, that.data.userInfo);
          wx.setStorageSync('userInfo', res.data.data)

          that.closeDialog()
        }
      },
      fail(res) {
        that.openDialog({
          title: '登录失败',
          info: res.errMsg
        })
      },
    })

  }

})