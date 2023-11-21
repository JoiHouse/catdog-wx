// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    loading: false,
    currentPage: 0,
    pageSize: 6,
    previewItemWidth: 0,
    isShowInfo: false,
    isShowDialog: false,
    isShowMoreEnd: false,
    dialogInfo: {
      title: '出现问题了',
      info: ''
    },
    userInfo: {
      name: "猫猫狗狗大学"
    },
    animalInfo: {
      total: 0,
      rows: []
    },

    tem: {},
    searchKey: '',
  },
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
  onReachBottom: function () {
    if (this.data.isShowMoreEnd) {
      return
    }
    setTimeout(() => {
      this.setData({
        currentPage: this.data.currentPage + 1
      })
      this.loadMore()
    }, 500)
  },
  loadMore() {
    let that = this
    that.fetchHome().then((data) => {
      if (data.rows.length == 0) {
        that.setData({
          isShowMoreEnd: true
        })
      } else {
        let arr = that.data.animalInfo.rows
        arr.push(...data.rows)
        that.setData({
          ['animalInfo.rows']: arr
        })
      }
    })
  },
  openDialog(e) {
    let that = this
    app.openDialog(e, that)
  },
  openUser() {
    this.openPage('/pages/user/user')
  },
  infoDialogActive() {
    let status = this.data.isShowInfo ? false : true;
    this.setData({
      isShowInfo: status
    })
  },
  randomAnimal() {
    let length = this.data.animalInfo.total
    let ranId = Math.floor(Math.random() * length) + 1
    this.openPage('/pages/detail/detail?id=' + ranId)
  },
  openPage(page) {
    let url = page
    if (typeof page == 'object') {
      url = page.currentTarget.dataset.url;
    }
    wx.navigateTo({
      url: url
    })
  },
  fetchHome() {
    let that = this
    let tem = {}
    that.loading()
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'http://10.150.4.120:7788/home?name=' + that.data.searchKey + '&pageNum=' + that.data.currentPage + '&pageSize=' + that.data.pageSize,
        success: (res) => {
          that.loaded()
          if (res.statusCode !== 200) {
            let log = res.data.msg || res.data.errMsg || res.data.error
            this.openDialog({
              title: '加载失败',
              info: '请检查网络:' + log
            })
            reject(res)
          } else {
            resolve(res.data.data)
          }

        },
        fail: (res) => {
          that.loaded()
          this.openDialog({
            title: '加载失败',
            info: '请检查网络'
          })
          reject(res)
        }
      })
    })
  },
  onLoad() {
    let pageWidth = wx.getSystemInfoSync().windowWidth;
    this.setData({
      previewItemWidth: pageWidth / 2 - 27
    })
    this.fetchHome().then(data => {
      this.setData({
        animalInfo: data
      })
    })

  },


})