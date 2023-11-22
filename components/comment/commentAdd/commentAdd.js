const app = getApp()
Component({


  properties: {
    type: {
      type: String,
      value: ''
    },
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
    addCommentInputFocus: true,
    content: '',
    imgs: [],
    isShowDialog: false,
    dialogInfo: {
      title: '出现问题了',
      info: ''
    },
  },


  methods: {
    closeDialog() {
      this.triggerEvent('closeDialog', {})
    },
    addPic() {
      let that = this;
      let temImg = that.data.imgs;
      if (temImg.length == 3) {
        that.setData({
          isShowDialog: true,
          dialogInfo: {
            title: '最多只能上传3张图片'
          }
        });
        return
      }
      wx.chooseImage({
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          let tempFilePaths = res.tempFilePaths;
          console.log("数组：" + tempFilePaths);
          temImg.push(tempFilePaths[0]);
          that.setData({
            imgs: temImg
          });
        }
      });
    },
    delTemPic(e) {
      let that = this;
      let temImg = that.data.imgs;
      let index = e.currentTarget.dataset.index;
      temImg.splice(index - 1, 1);
      that.setData({
        imgs: temImg
      });
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
    fetchAdd(pics) {
      let that = this;
      console.log(pics);
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
            "parentId": that.properties.parentId || '',
            "photo": pics || [],
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
      let upTem = true
      let upArr = []
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
        for (let i = 0; i < that.data.imgs.length; i++) {
          await that.fetchUploadPic(that.data.imgs[i])
            .then((res) => {
              if (res) {
                upArr.push(res)
              }
            })
            .catch((res) => {
              that.setData({
                isShowDialog: true,
                dialogInfo: {
                  title: '上传图片失败'
                }
              })
            })

        }

        console.log(upArr);
        await that.fetchAdd(upArr)
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
    openDialog(e) {
      let that = this
      app.openDialog(e, that)
    },
  }
})