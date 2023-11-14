// pages/submitBySteps/submitBySteps.js
Page({
  nextStep() {
    let step = parseInt(this.data.currentStep);
    let temStepLock = parseInt(this.data.stepLock)
    let stepLock = temStepLock == 3 ? temStepLock : temStepLock + 1;
    if (step != 0 && step != 3 && step <= stepLock) {
      //jiaoyangshuju
      console.log("jiaoyang");
    }
    this.setData({
      currentStep: step + 1,
      stepLock: parseInt(stepLock)
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
      ['formData.type']: Math.round(even.currentTarget.dataset.type)
    })
  },
  chooseStatus(even) {
    this.setData({
      ['formData.status']: Math.round(even.currentTarget.dataset.status)
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    currentStep: 0,
    isShowStep0: false,
    stepLock: 0,
    formData: {
      name: '',
      type: -1,
      status: -1,
    }
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