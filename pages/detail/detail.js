Page({
  loading() {
    this.setData({
      loading: true
    })
  },
  loaded() {
    this.setData({
      loading: false
    })
  },
  addDialogAcitve() {
    this.setData({
      isShowAddDialog: this.data.isShowAddDialog ? false : true
    })
  },
  detailDialogAcitve(e) {
    let id = e.currentTarget.dataset.id

    this.setData({
      isShowDetailDialog: this.data.isShowDetailDialog ? false : true,
      commentId: id
    })
  },
  getDetail(id) {
    this.loading()
    this.fetchData(id)
    this.loaded()
  },
  fetchData(id) {
    wx.request({
      url: "http://10.150.4.120:7788/petde/tails?id=" + id,

      success: (res) => {
        console.log(res.data);
        this.setData({
          rspData: res.data.data
        })
      },
      fail: (res) => {
        console.log(res);
      }
    })
  },
  data: {
    loading: false,
    isShowAddDialog: false,
    isShowDetailDialog: false,
    rspData: {
      "pet_id": null,
      "sex": null,
      "name": "加载失败",
      "type": "",
      "status": null,
      "found_time": "2023-11-10 21:39:39",
      "found_place": "",
      "likeNum": 1,
      "tags": [],
      "photos": ['https://source.unsplash.com/900x600/?nature,water,4',
        'https://source.unsplash.com/900x600/?nature,water,3',],
      "comment_total": 1,
      "created_user": {
        "user_id": 1,
        "name": "user",
        "avatar": ""
      }

    }
  },

  onLoad(options) {
    this.getDetail(options.id)
    wx.setNavigationBarTitle({
      title: this.data.rspData.name + '-猫猫狗狗',

    })
  },


})