// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animalInfo: {
      id: 1,
      name: '阿花',
      sex: null,
      photo_url: 'https://source.unsplash.com/900x600/?nature,water,4',
      tag: [{ "预苗": true, "绝育": true, "品种": "中华田园犬" },{ "驱虫": true,}]

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: this.data.animalInfo.name+'-猫猫狗狗',    
  
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