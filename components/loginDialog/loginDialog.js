// components/loginDialog/loginDialog.js
Component({

  /**
   * 组件的属性列表
   */
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
        url: 'http://10.150.4.76:7788/wxLogin',
        method: 'POST',
        data: {
          code: code
        },
        success(res) {
          console.log(res.data)
          if (res.data.code == 200) {
            wx.setStorageSync('token', res.data.data.token)
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