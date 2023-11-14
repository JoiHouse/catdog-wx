// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    previewItemWidth: 0,
    isShowInfo: false,
    userInfo: {
      name: "猫猫狗狗大学"
    },
    animalInfo: {
      total: 3,
      detail: [{
        id: 1,
        name: '阿花',
        photo_url: 'https://source.unsplash.com/900x600/?nature,water,4',
        tag: ["预苗", "驱虫", "绝育"]
      },
      {
        id: 2,
        name: '阿明',
        photo_url: 'https://source.unsplash.com/300x300/?nature,water,4',
        tag: ["1", "2"]
      },
      {
        id: 3,
        name: '阿斗',
        photo_url: 'https://source.unsplash.com/500x600/?nature,water,4',
        tag: ["1", "2"]
      },
      ]
    }
  },
  openUser() {
    this.openPage('/pages/user/user')
  },
  infoDialogActive() {
    let status = this.data.isShowInfo ? false : true;
    this.setData({
      isShowInfo: status
    })
  },
  randomAnimal() {
    let length = this.data.animalInfo.total
    let ranId = Math.floor(Math.random() * length) + 1
    this.openPage('/pages/detail/detail?id=' + ranId)
  },
  openPage(page) {
    let url = page
    if (typeof page == 'object') {
      url = page.currentTarget.dataset.url;
    }
    wx.navigateTo({
      url: url
    })
  },
  onLoad() {
    this.openPage('/pages/submitBySteps/submitBySteps' )
    let pageWidth = wx.getSystemInfoSync().windowWidth;
    this.setData({
      previewItemWidth: pageWidth / 2 - 27
    })
  },


})