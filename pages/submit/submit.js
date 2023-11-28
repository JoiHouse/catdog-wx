const re = require('../../utils/request.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemWidth: (wx.getSystemInfoSync().windowWidth - 140) / 3,
    tagItemWidth: 0,
    addValue: "",
    isShowAdd: false,
    isShowDialog: false,
    dialogInfo: {
      title: '出现问题了',
      info: ''
    },
    name: '',
    sex: -1,
    age: '',
    type: -1,
    status: -1,
    foundPlace: '',

    tagList: [
      {
        value: '疫苗',
        status: false
      },
      {
        value: '绝育',
        status: false
      },
      {
        value: '驱虫',
        status: false
      },
      {
        value: '有小宝宝',
        status: false
      },
    ],
    tagDiyList: [],
    picList: []
  },

  chooseTag(even) {
    let status = this.data.tagList[even.currentTarget.dataset.tag].status ? false : true;
    this.setData({
      ['tagList[' + even.currentTarget.dataset.tag + '].status']: status
    })
  },
  addTag(e) {
    this.dialogActive()
    let value = e.detail;
    let length = this.data.tagList.length;

    this.setData({
      ['tagList[' + length + '].status']: true,
      ['tagList[' + length + '].value']: value
    })
  },
  chooseType(e) {
    let type = e.currentTarget.dataset.type;
    let value = e.currentTarget.dataset.value;
    this.setData({
      [type]: parseInt(value)
    })
  },
  dialogActive() {
    let stastus = this.data.isShowAdd ? false : true;
    this.setData({
      isShowAdd: stastus
    })
  },
  openDialog(e) {
    let value = e.detail;
    console.log(value);
    if (e.type || e.type == "openDialog") {
      value = e.detail
    } else {
      value = e
    }
    console.log(value);
    this.setData({
      isShowDialog: true,
      dialogInfo: {
        title: value.title ? value.title : '出现了错误',
        info: value.info ? value.info : ''
      }
    });

  },
  uploadInfo() {
    if (this.checkInfo()) {
      this.fetchSubmit()
    }
  },
  checkInfo() {
    if (this.data.foundPlace == '' || this.data.sex == -1 || this.data.age == '' || this.data.type == -1) {
      this.openDialog({
        title: '信息得都填哦'
      })
      return false
    }
    if (this.data.picList.length == 0) {
      this.openDialog({
        title: '至少上传一张图片哦'
      })
      return false
    }


    let isHas = false
    for (let i = 0; i < this.data.tagList.length; i++) {
      if (this.data.tagList[i].status) {
        isHas = true
      }
    }
    if (this.data.tagDiyList.length > 0) {
      isHas = true
    }
    if (!isHas) {
      this.openDialog({
        title: '至少选择一个标签哦'
      })
      return false
    }

    return true
  },
  addPic() {
    let that = this;
    let temImg = that.data.picList;
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
          picList: temImg
        });

      }
    });
  },
  delTemPic(e) {
    let that = this;
    let temImg = that.data.picList;
    let index = e.currentTarget.dataset.index;
    temImg.splice(index, 1);
    that.setData({
      picList: temImg
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
  async fetchSubmit() {
    let that = this;
    let temPic = []
    for (let i = 0; i < that.data.picList.length; i++) {
      await that.fetchUploadPic(that.data.picList[i]).then(res => {
        temPic.push(res)
      })
    }
    re({
      url: '/modify',
      method: 'POST',
      data: {
        name: that.data.name,
        sex: that.data.sex,
        age: that.data.age,
        type: that.data.type,
        status: that.data.status,
        foundPlace: that.data.foundPlace,
        tags: that.data.tagList,
        photo: temPic
      }
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
        title: '出现了错误',
        info: err
      })
    })
  },


  onLoad(options) {
    console.log(options);
    let pageWidth = wx.getSystemInfoSync().windowWidth;
    this.setData({
      tagItemWidth: pageWidth / 2 - 55,
      foundPlace: options.foundPlace || '',
      name: options.name || '',
      status: parseInt(options.status) || -1,
      type: parseInt(options.type) || -1,
    })
  },
})