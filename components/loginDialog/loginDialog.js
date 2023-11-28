const app = getApp()
const re = require('../../utils/request.js')
Component({
  data: {
    loading: false,
  },
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
    updateUserInfo() {
      wx.getUserInfo({
        success(res) {
          wx.setStorageSync('userInfo', res.userInfo)
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
      re({
        url: '/wxLogin',
        method: 'POST',
        data: {
          code: code
        }
      })
      .then(res => {
        if (res.code === 200) {
          wx.setStorageSync('token', res.data.token)
          that.triggerEvent('getuserinfo', {})
          that.closeDialog()
        }
      })
      .catch(err => {
        that.openDialog({
          title: '登录失败'
        })
      })
      .finally(() => {
        that.loaded()
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