const app = getApp()
const re = require('../../utils/request.js')
Page({
  data: {
    loading: false,
    currentPage: 1,
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
      console.log(data);
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
  async fetchHome() {
    let that = this
    let tem = {}
    return new Promise((resolve, reject) => {
      that.loading()
      re({
        url: '/home?name=' + that.data.searchKey + '&pageNum=' + that.data.currentPage + '&pageSize=' + that.data.pageSize,
        method: 'GET'
      }).then(res => {
        if (res.code == 200) {
          resolve(res.data)
        }
      }).catch(err => {
        reject(err)
      }).finally(() => {
        that.loaded()
      })
    })


  },
  onLoad() {
    let that = this
    let pageWidth = wx.getSystemInfoSync().windowWidth;
    that.setData({
      previewItemWidth: pageWidth / 2 - 27
    })
    that.fetchHome()
      .then(data => {
        that.setData({
          animalInfo: data
        })
      })
      .catch(e => {
        that.openDialog({
          title: '出现问题了',
          info: e.errMsg || e.msg || e
        })
      })
  },


})