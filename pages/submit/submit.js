// pages/submit/submit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tagItemWidth: 0,
    addValue: "",
    isShowAdd: false,
    isShowDialog: false,
    dialogInfo: {
      title: '出现问题了',
      info: ''
    },
    formData: {
      name: '',
      sex: -1,
      age: '',
      type: -1
    },
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
  chooseSex(even) {
    this.setData({
      ['formData.sex']: parseInt(even.currentTarget.dataset.sex)
    })
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
  chooseType(even) {
    this.setData({
      ['formData.type']: parseInt(even.currentTarget.dataset.type)
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
      // let tagList = this.data.tagList;
      // let tagDiyList = this.data.tagDiyList;
      // let picList = this.data.picList;
      // let formData = this.data.formData;
      // let tag = [];
      // for (i = 0; i < tagList.length; i++) {
      //   if (tagList[i].status) {
      //     tag.push(tagList[i].value)
      //   }
      // }
      // formData.tag = tag;
      // formData.tagDiy = tagDiyList;
      // formData.pic = picList;
      // wx.request({
      //   url: 'https://www.xinqianqian.top/api/addPet',
      //   data: formData,
      //   method: 'POST',
      //   success: function (res) {
      //     console.log(res)
      //   }
      // })
    }
  },
  checkInfo() {
    if (this.data.formData.name == '' || this.data.formData.sex == -1 || this.data.formData.age == '' || this.data.formData.type == -1 || this.data.picList.length == 0) {
      this.openDialog({
        title: '信息得都填哦'
      })
      return false
    } else {
      let isHas = false
      for (i = 0; i < this.data.tagList.length; i++) {
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
    }
    return true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let pageWidth = wx.getSystemInfoSync().windowWidth;
    this.setData({
      tagItemWidth: pageWidth / 2 - 55
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})