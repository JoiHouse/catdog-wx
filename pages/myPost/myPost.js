Page({
  bindPickerChange(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      picked: e.detail.value
    })
  },

  data: {
    pickerList: [['全部', '猫猫', '狗狗'], ['全部', "审核中", "审核通过", "审核失败", "处理中"]],
    picked: [0, 0]
  },


  onLoad(options) {

  },


})