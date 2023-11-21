// pages/submitBySteps/submitBySteps.js
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
    this.setData({
      currentStep: step + 1,
      stepLock: parseInt(stepLock)
    })
  },
  checkForm(step) {
    console.log(step, this.data.formData);
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
  submit() {
    wx.navigateBack({
      delta: 1
    })
    wx.navigateTo({
      url: '/pages/submit/submit',
    });
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
      url: '/pages/submit/submit',
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
  /**
   * 页面的初始数据
   */
  data: {
    currentStep: 0,
    isShowStep0: false,
    stepLock: 0,
    name: '',
    type: -1,
    status: -1,
    foundPlace: '',
    photos: [],
    dialogInfo: {
      title: '出现问题了',
      info: ''
    },

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    setTimeout(() => {
      this.setData({
        isShowStep0: true
      })
    }, 200)
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