// components/comment/commentDetail/commentDetail.js
const app = getApp()

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    commentId: {
      type: Number,
      value: ''
    }
  },

  data: {
    ifFullScreen: true,
    rspData: {}
  },

  lifetimes: {
    attached() {
      this.fetchComment()
    }
  },
  methods: {
    closeDialog() {
      this.triggerEvent('closeDialog', {})
    },
    loadData() {

    },
    fetchComment() {
      wx.request({
        url: 'http://10.150.4.120:7788/top/' + this.data.commentId,
        method: 'GET',
        success: (res) => {

          let rsp = this.fixDataTime(res.data[0])
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