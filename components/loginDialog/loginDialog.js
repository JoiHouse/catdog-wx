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
        success: res => {
          if (res.code) {
            let URL = 'https://api.weixin.qq.com/sns/jscode2session?appid=##################&secret=*************** ***************& js_code='+res.code+' & grant_type=authorization_code'
            wx.request({
              url: URL,
              success: function (res) {
                console.log(res.data)//res.data中有openid
              }
            })
          }
        }
      })



    }
  }
})