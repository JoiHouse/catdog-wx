const re = require('../../utils/request.js')
const app = getApp()
Page({
  nextStep() {
    let step = parseInt(this.data.currentStep);
    let temStepLock = parseInt(this.data.stepLock)
    let stepLock = temStepLock == 3 ? temStepLock : temStepLock + 1;
    if (step != 0 && step != 3 && step <= stepLock) {
      if (this.checkForm(step) == false) {
        return
      }
    }
    if (step == 3) {
      this.submit();
      return;
    }
    this.setData({
      currentStep: step + 1,
      stepLock: parseInt(stepLock)
    })
  },
  checkForm(step) {
    if (step == 1) {
      if (this.data.name == '' || this.data.type == -1) {
        this.openDialog({
          title: '请填写完整哦',
          info: ''
        })
        return false;
      }
    } else {
      if (this.data.foundPlace == '' || this.data.photos.length == 0) {
        this.openDialog({
          title: '请填写完整哦',
          info: ''
        })
        return false;
      }
    }

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

  async submit() {
    let that = this;
    let temImgs = [];
    for (let i = 0; i < this.data.photos.length; i++) {
      await this.fetchUploadPic(this.data.photos[i]).then(res => {
        if (res) {
          temImgs.push(res)
        }
      })
    }
    re({
      url: '/modify',
      method: 'POST',
      data: {
        name: that.data.name,
        type: that.data.type,
        status: that.data.status,
        foundPlace: that.data.foundPlace,
        photo: temImgs,
        tags: []
      },

    }).then(res => {
      if (res.code == 200) {
        that.openDialog({
          title: '提交成功',
          info: '感谢您的参与，我们会尽快审核您的信息，请耐心等待哦'
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 2000)
      }
    }).catch(err => {
      that.openDialog({
        title: '提交失败',
        info: err
      })
    })
  },
  changeStep(e) {
    let step = Math.round(e.currentTarget.dataset.step)
    if (step > this.data.stepLock || step == this.data.currentStep) {
      return;
    }
    this.setData({
      currentStep: parseInt(step)
    })
  },
  chooseType(even) {
    this.setData({
      type: Math.round(even.currentTarget.dataset.type)
    })
  },
  chooseStatus(even) {
    this.setData({
      status: Math.round(even.currentTarget.dataset.status)
    })
  },
  openSubmitMore() {
    //关闭当前页面前往下一个页面
    wx.navigateBack({
      delta: 1
    })
    wx.navigateTo({
      url: '/pages/submit/submit?name=' + this.data.name + '&type=' + this.data.type + '&status=' + this.data.status + '&foundPlace=' + this.data.foundPlace + '&photos=' + this.data.photos,
    });
  },
  openDialog(e) {
    let value = e.detail;
    if (e.type || e.type == "openDialog") {
      value = e.detail
    } else {
      value = e
    }
    this.setData({
      isShowDialog: true,
      dialogInfo: {
        title: value.title ? value.title : '出现了错误',
        info: value.info ? value.info : ''
      }
    });

  },
  addPic() {
    let that = this;
    let temImg = that.data.photos;
    if (temImg.length == 3) {
      that.openDialog({
        title: '最多只能上传3张图片哦'
      })
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
          photos: temImg
        });
      }
    });
  },
  delTemPic(e) {
    let that = this;
    let temImg = that.data.photos;
    let index = e.currentTarget.dataset.index;
    temImg.splice(index, 1);
    that.setData({
      photos: temImg
    });
  },
  data: {
    currentStep: 0,
    isShowStep0: false,
    stepLock: 0,
    name: '',
    type: -1,
    status: -1,
    foundPlace: '',
    photos: [],
    itemWidth: (wx.getSystemInfoSync().windowWidth - 140) / 3,
    dialogInfo: {
      title: '出现问题了',
      info: ''
    },

  },
  onLoad(options) {
    setTimeout(() => {
      this.setData({
        isShowStep0: true
      })
    }, 200)
  },

})