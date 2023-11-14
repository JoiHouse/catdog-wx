// components/loginDialog/loginDialog.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    aaa: {
      type: String,
      value: 'default value',
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
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
       wx.login({
        success (res) {
          if (res.code) {
            //发起网络请求
            console.log(res);
            wx.request({
              url: 'https://example.com/onLogin',
              method:'POST',
              data: {
                code: res.code
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })

    }
  }
})