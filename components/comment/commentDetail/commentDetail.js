const app = getApp()

Component({
  properties: {
    parentId: {
      type: Number,
      value: 0
    },
    postId: {
      type: Number,
      value: 0
    },
  },

  data: {
    ifFullScreen: true,
    rspData: {},
    isShowDialog: false,
    content: '',
    objId: 0,
    dialogInfo: {
      title: '出现问题了',
      info: ''
    },
  },

  lifetimes: {
    attached() {
      this.fetchComment()
      this.setData({
        objId: this.properties.postId
      })
    }
  },
  methods: {
    openDialog(e) {
      let that = this
      app.openDialog(e, that)
    },
    closeDialog() {
      this.triggerEvent('closeDialog', {})
    },
    loadData() {

    },
    fetchAdd() {
      let that = this;
      return new Promise((resolve, reject) => {
        wx.request({
          url: app.globalData.apiHost + "/addComment",
          method: 'POST',
          header: {
            'content-type': 'application/json',
            "token": wx.getStorageSync('token')
          },
          data: {
            "content": that.data.content,
            "detail": that.properties.postId,
            "parentId": that.properties.parentId,
            "photo": [],
          },
          success: (res) => {
            if (res.data.code === 401) {
              that.openDialog({
                isShowDialog: true,
                title: '登录失效'
              })
              setTimeout(() => {
                wx.navigateTo({
                  url: '/pages/user/user',
                });
              }, 2000)

              return
            }
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
              title: '评论失败',
              info: '请检查网络:' + res
            })
          }
        })
      })
    },
    async addComment() {
      let that = this
      if (that.data.content.length == 0) {
        that.setData({
          isShowDialog: true,
          dialogInfo: {
            title: '评论不能为空哦'
          }
        })
        return
      }
      if (that.data.content.length > 100) {
        that.setData({
          isShowDialog: true,
          dialogInfo: {
            title: '评论不能超过100个字哦'
          }
        })
        return
      } else {
        await that.fetchAdd()
          .then((res) => {
            that.setData({
              isShowDialog: true,
              dialogInfo: {
                title: '评论成功'
              }
            })
            setTimeout(function () {
              that.triggerEvent('closeDialog', {})
            }, 1000)
            that.triggerEvent('addComment', {
              commentId: res.commentId
            })
          })
          .catch((res) => {
            console.log(res)
          })
      }
    },
    fetchComment() {
      let that = this
      wx.request({
        url: app.globalData.apiHost + '/top/' + this.properties.parentId,
        method: 'GET',
        success: (res) => {
          if (res.data.code !== 200) {
            that.setData({
              isShowDialog: true,
              dialogInfo: {
                title: '出现问题了'
              }
            })
            return
          }
          let rsp = this.fixDataTime(res.data.data[0])
          this.setData({
            rspData: rsp
          })

        }
      })

    },
    fixDataTime(obj) {
      obj.createdAt = app.getTimeDifferent(obj.createdAt)
      for (let i = 0; i < obj.replies.length; i++) {
        obj.replies[i].createdAt = app.getTimeDifferent(obj.replies[i].createdAt)
        for (let j = 0; j < obj.replies[i].replies.length; j++) {
          obj.replies[i].replies[j].createdAt = app.getTimeDifferent(obj.replies[i].replies[j].createdAt)
        }
      }
      return obj
    }
  }
})