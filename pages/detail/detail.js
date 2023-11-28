const app = getApp()
const re = require('../../utils/request.js')

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
  },
  getComentList() {
    let that = this;
    that.fetchComent()
      .then(res => {
        let tem = res.rows
        for (let i = 0; i < tem.length; i++) {
          tem[i].createdAt = app.getTimeDifferent(tem[i].createdAt)
        }
        that.setData({
          commentData: tem
        })
      })
  },
  fetchData(id) {
    let that = this;
    this.loading()
    re({
      url: "/petde/tails?id=" + id,
      method: 'GET',
    }).then(res => {
      if (res.code === 200) {
        that.setData({
          rspData: res.data
        })
        wx.setNavigationBarTitle({
          title: res.data.name + '-猫猫狗狗',
        })
        that.getComentList()
      }
    }).catch(e => {
      that.openDialog({
        title: '加载失败',
        info: e.errMsg || e.msg || e
      })
    }).finally(() => {
      that.loaded()
    })

  },
  fetchComent() {
    this.loading()
    let that = this;
    return new Promise((resolve, reject) => {
      re({
        url: "/pageComment?pageNum=" + that.data.commentPage + "&pageSize=6&articleId=" + that.data.pageId,
        method: 'GET',
      }).then(res => {
        if (res.code === 200) {
          resolve(res.data)
        }
      }).catch(e => {
        that.openDialog({
          title: '加载评论失败',
          info: e
        })
        reject()
      }).finally(() => {
        that.loaded()
      })
    })

  },
  openDialog(e) {
    let that = this
    app.openDialog(e, that)
  },
  likeItem(e) {
    let that = this
    if (e.currentTarget.dataset.post) {
      re({
        url: "/petLike?id=" + e.currentTarget.dataset.post,
        method: 'POST',
      }).then(res => {
        if (res.code === 200) {
          let plus = res.data.status ? 1 : -1
          that.setData({
            ['rspData.isLike']: res.data.status,
            ['rspData.likeCount']: that.data.rspData.likeCount + plus
          })
        }
      }).catch(e => {
        this.openDialog({
          title: '操作失败',
          info: e
        })
      })
    } else if (e.currentTarget.dataset.comment) {
      re({
        url: "/commentLike?id=" + e.currentTarget.dataset.comment,
        method: 'POST',
      }).then(res => {
        if (res.code === 200) {
          for (let i = 0; i < that.data.commentData.length; i++) {
            if (that.data.commentData[i].id === e.currentTarget.dataset.comment) {
              let plus = res.data.status ? 1 : -1
              that.setData({
                ['commentData[' + i + '].isLike']: res.data.status,
                ['commentData[' + i + '].likeCount']: that.data.commentData[i].likeCount + plus
              })
              break
            }
          }
        }
      }).catch(e => {
        this.openDialog({
          title: '操作失败',
          info: e
        })
      })

    }
  },
  addComment(e) {
    let that = this
    let detail = e.detail
    let user = wx.getStorageSync('userInfo');

    let newItem = {
      "content": detail.content,
      "createdAt": "刚刚",
      "id": detail.newId,
      "photos": detail.photos,
      "user": {
        "name": user.name,
        "photo": user.photo,
        "userId": user.userId
      }
    }
    let tem = [newItem, ...that.data.commentData]
    that.setData({
      commentData: tem
    })
  },
  data: {
    loading: false,
    isShowAddDialog: false,
    isShowDetailDialog: false,
    commentPage: 1,
    isShowMoreEnd: false,
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
      "likeCount": 0,
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
  loadMore() {
    let that = this
    if (this.data.isShowMoreEnd) {
      return
    }
    that.setData({
      commentPage: this.data.commentPage + 1
    })
    this.fetchComent()
      .then(res => {
        let tem = res.rows
        for (let i = 0; i < tem.length; i++) {
          tem[i].createdAt = app.getTimeDifferent(tem[i].createdAt)
        }
        that.setData({
          commentData: [...that.data.commentData, ...tem]
        })
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

})