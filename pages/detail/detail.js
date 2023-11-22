const app = getApp()
Page({
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
  addDialogAcitve() {
    this.setData({
      isShowAddDialog: this.data.isShowAddDialog ? false : true
    })
  },
  detailDialogAcitve(e) {
    let id = e.currentTarget.dataset.id

    this.setData({
      isShowDetailDialog: this.data.isShowDetailDialog ? false : true,
      commentId: id
    })
  },
  getDetail(id) {
    let that = this;
    that.fetchData(id)
      .then((res) => {
        if (1 == 1) {
          that.getComentList()
        }
        that.loaded()
        if (res) {
          that.setData({
            rspData: res
          })
          wx.setNavigationBarTitle({
            title: res.name + '-猫猫狗狗',
          })
        }
      })
  },
  getComentList() {
    let that = this;
    let tem
    that.fetchComent()
      .then((res) => {
        tem = res.rows
        if (res) {
          for (let i = 0; i < tem.length; i++) {
            tem[i].createdAt = app.getTimeDifferent(tem[i].createdAt)
          }
          that.setData({
            commentData: tem
          })
        }
      })
  },
  fetchData(id) {
    this.loading()
    let that = this;
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.globalData.apiHost + "/petde/tails?id=" + id,
        header: {
          "token": wx.getStorageSync('token') || '',
        },
        success: (res) => {
          if (res.data.code !== 200) {
            let log = res.data.msg || res.data.errMsg || res.data.error
            that.openDialog({
              title: '加载失败',
              info: '请检查网络:' + log
            })
            reject(res)
          } else {
            resolve(res.data.data)
          }
        },
        fail: (res) => {
          that.openDialog({
            title: '获取失败',
            info: '请检查网络:' + res
          })
        },
      })
    })
  },
  fetchComent() {
    this.loading()
    let that = this;
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.globalData.apiHost + "/pageComment?pageNum=" + that.data.commentPage + "&pageSize=6" + "&articleId=" + that.data.pageId,
        header: {
          "token": wx.getStorageSync('token') || '',
        },
        success: (res) => {
          if (res.data.code !== 200) {
            let log = res.data.msg || res.data.errMsg || res.data.error
            that.openDialog({
              title: '加载失败',
              info: '请检查网络:' + log
            })
            reject(res)
          } else {
            resolve(res.data.data)
          }
        },
        fail: (res) => {
          that.openDialog({
            title: '获取失败',
            info: '请检查网络:' + res
          })
        },
        complete: () => {
          that.loaded()
        }
      })
    })
  },
  openDialog(e) {
    let that = this
    app.openDialog(e, that)
  },
  data: {
    loading: false,
    isShowAddDialog: false,
    isShowDetailDialog: false,
    commentPage: 0,
    pageId: 0,
    commentId: 0,

    rspData: {
      "petId": null,
      "sex": null,
      "name": "加载失败",
      "type": "",
      "status": null,
      "found_time": "2023-11-10 21:39:39",
      "found_place": "",
      "likeNum": 1,
      "tags": [],
      "photos": ['https://source.unsplash.com/900x600/?nature,water,4',
        'https://source.unsplash.com/900x600/?nature,water,3'],
      "comment_total": 1,
      "created_user": {
        "user_id": 1,
        "name": "user",
        "avatar": ""
      }

    },
    commentData: []
  },
  onLoad(options) {
    this.setData({
      pageId: options.id
    })
    this.getDetail(options.id)
  },
  onPullDownRefresh() {
    this.getDetail(this.data.pageId)
    wx.stopPullDownRefresh()
  },

})