const app = getApp()
Component({


  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    loading: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    loading() {
      this.setData({
        loading: true
      })
    },
    loaded() {
      this.setData({
        loading: false
      })
    },
    closeDialog: function (even) {
      this.triggerEvent('active', {})
    },
    openMailLogin: function () {
      wx.navigateTo({
        url: '/pages/login/login',
      });
      this.closeDialog()
    },
    updateUserInfo() {
      wx.getUserInfo({
        success(res) {
          console.log(res)
          wx.setStorageSync('userInfo', res.userInfo)
        }
      })

    },
    fetchUserInfo() {
      let that = this
      wx.getStorage({
        key: 'userInfo',
        success(res) {
          console.log(res)
          if (res.data) {
            that.triggerEvent('active', {
              userInfo: res.data
            })
          }
        }
      })
    },
    loginWithWx() {
      let that = this
      that.loading()
      wx.login({
        success(res) {
          if (res.code) {
            that.fetchLogin(res.code)
          } else {
            that.loaded()
            openDialog({
              title: '登录失败',
              info: '请检查网络'
            })
            return
          }
        }
      })

    },
    fetchLogin(code) {
      let that = this
      wx.request({
        url: app.globalData.apiHost + '/wxLogin',
        method: 'POST',
        data: {
          code: code
        },
        success(res) {
          console.log(res.data)
          if (res.data.code == 200) {
            wx.setStorageSync('token', res.data.data.token)
            that.triggerEvent('getuserinfo', {})
            that.closeDialog()
          }
        },
        fail(res) {
          that.openDialog({
            title: '登录失败',
            info: res.errMsg
          })
        },
        complete() {
          that.loaded()
        }
      })
    },
    openDialog(e) {
      let value = e.detail;
      if (e.type || e.type == "openDialog") {
        value = e.detail
      } else {
        value = e
      }
      this.setData({
        isShowDialog: true,
        dialogInfo: {
          title: value.title ? value.title : '出现了错误',
          info: value.info ? value.info : ''
        }
      });

    },

  }
})