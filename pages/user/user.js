const app = getApp()
const re = require('../../utils/request.js')
Page({
  data: {
    isLogin: false,
    userInfo: {
      name: "",
      userId: 0,
      photo: "https://drive.joia.cn/catdog/pic/pb.jpg"
    },
    temUserInfo: {
      name: "",
      userId: 0,
      photo: ''
    },
    temName: '',
    isShowDialog: false,
    isShowChangeUser: false,
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
    } else {
      that.changeUserActive()
      return
    }
  },
  changeUserActive() {
    this.setData({
      temUserInfo: this.data.userInfo,
      isShowChangeUser: !this.data.isShowChangeUser,
      temName: this.data.userInfo.name
    })
  },
  async changePhoto() {
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: async (res) => {
        let tempFilePaths = res.tempFilePaths[0];
        await that.fetchUploadPic(tempFilePaths)
        that.setData({
          ['temUserInfo.photo']: tempFilePaths
        })
      }
    })
  },
  fetchUploadPic(picFile) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: app.globalData.apiHost + "/Pictures",
        filePath: picFile,
        name: "file",
        header: {
          "Content-Type": "multipart/form-data",
          "token": wx.getStorageSync('token')
        },
        formData: {
          "file": picFile,
        },
        success: function (res) {
          if (res.statusCode === 401) {
            that.openDialog({
              isShowDialog: true,
              title: '登录失效'
            })
            navigator.replace({
              url: '/pages/user/user',
            })
            return
          }
          if (res.statusCode !== 200) {
            that.openDialog({
              title: '加载失败',
              info: '请检查网络'
            })
            reject(false)
          } else {
            let url = JSON.parse(res.data).data;
            resolve(url)
          }

        }
      })
    })
  },
  fetchChangeUser() {
    let that = this;
    re({
      url: '/updateuser',
      method: 'POST',
      data: {
        "name": that.data.temName,
        "photo": that.data.temUserInfo.photo
      }
    }).then(res => {
      if (res.code == 200) {
        that.setData({
          "userInfo": that.data.temUserInfo,
          ['userInfo.name']: that.data.temName,
          "isShowChangeUser": false
        })
      }
    }).catch(err => {
      that.openDialog({
        title: '修改失败',
        info: err
      })
    })

  },
  changeByWx() {
    let that = this
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        that.setData({
          "temName": res.userInfo.nickName,
          "temUserInfo.photo": res.userInfo.avatarUrl
        })
      }
    })
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
    that.getUserInfo()
  },
  openDialog(e) {
    let that = this
    app.openDialog(e, that)
  },
  getUserInfo() {
    let that = this;
    if (!wx.getStorageSync('token')) {
      return
    }
    re({
      url: '/userInfo',
      method: 'GET'
    }).then(res => {
      if (res.code == 200) {
        that.setData({
          "isLogin": true,
          "userInfo": res.data
        })
        wx.setStorageSync('userInfo', res.data)
      } else {
        that.setData({
          "isLogin": false
        })
      }
    }).catch(err => {
      that.setData({
        "isLogin": false,
        "userInfo": {
          name: "",
          userId: 0
        }
      })
      that.openDialog({
        title: "发生了错误",
        info: err.errMsg
      })
    })
  }
})