const app = getApp()
const re = require('../../../utils/request.js')
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
    isFocusInput: false,
    rspData: {
    },
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
      this.setData({
        objId: this.properties.parentId
      })
      this.fetchComment()
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
      re({
        url: "/addComment", method: "POST",
        data: {
          "content": that.data.content,
          "detail": that.properties.postId,
          "parentId": that.data.objId,
          "photo": []
        }
      })
        .then((res) => {
          if (res.code == 200) {
            that.setData({
              isShowDialog: true,
              dialogInfo: {
                title: '评论成功'
              }
            })
            that.addNewCommentItem(res.data.id, that.properties.parentId)
          }
        }).catch((res) => {
          console.log(res)
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
        that.fetchAdd()
      }
    },
    fetchComment() {
      let that = this
      re({
        url: "/top/" + this.properties.parentId, method: "GET"
      }).then((res) => {
        if (res.code === 200) {
          let rsp = that.fixDataTime(res.data[0])
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
    },
    addNewCommentItem(id, parentId) {
      let that = this
      let user = wx.getStorageSync('userInfo');
      let tem = that.data.rspData.replies
      let index2
      let newItem = {
        "content": that.data.content,
        "createdAt": "刚刚",
        "id": id,
        "photos": [],
        "user": {
          "name": user.name,
          "photo": user.photo,
          "userId": user.userId
        }
      }
      if (parentId === that.properties.parentId) {
        tem.unshift(newItem)
        that.setData({
          ['rspData.replies']: tem
        })
        return
      }
      for (let i = 0; i < tem.length; i++) {
        if (tem[i].id === parentId) {
          let tem2 = tem[i].replies
          tem2.unshift(newItem)
          that.setData({
            ['rspData.replies[' + i + '].replies']: tem2
          })
          return
        }
        for (let j = 0; j < tem[i].replies.length; j++) {
          if (tem[i].replies[j].id === parentId) {
            let tem3 = tem[i].replies[j].replies
            tem3.unshift(newItem)
            that.setData({
              ['rspData.replies[' + i + '].replies[' + j + '].replies']: tem3
            })
            return
          }

        }
      }

    },
    changeObjComment(e) {
      console.log(e.currentTarget.dataset);
      if (e.currentTarget.dataset.id) {
        this.setData({
          objId: Math.round(e.currentTarget.dataset.id),
          isFocusInput: true
        })

      }
    },
    likeItem(e) {
      let that = this
      re({
        url: "/commentLike?id=" + e.currentTarget.dataset.id,
        method: 'POST',
      }).then(res => {
        if (res.code === 200) {
          if (that.data.rspData.id == e.currentTarget.dataset.id) {
            that.setData({
              ['rspData.isLike']: res.data.status,
              ['rspData.likeCount']: that.data.rspData.likeCount + (res.data.status ? 1 : -1)
            })
            return
          }
          for (let i = 0; i < that.data.rspData.replies.length; i++) {
            if (that.data.rspData.replies[i].id === e.currentTarget.dataset.id) {
              that.setData({
                ['rspData.replies[' + i + '].isLike']: res.data.status,
                ['rspData.replies[' + i + '].likeCount']: that.data.rspData.replies[i].likeCount + (res.data.status ? 1 : -1)
              })
            }
            return
          }
        }
      }).catch(e => {
        this.openDialog({
          title: '操作失败',
          info: e
        })
      })


    },
  }
})