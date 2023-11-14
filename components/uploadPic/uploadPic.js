// components/uploadPic/uploadPic.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    itemWidth: (wx.getSystemInfoSync().windowWidth - 100) / 3,
    picList: [

    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    addPic: function () {
      wx.chooseImage({
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          let tempFilePaths = res.tempFilePaths;
          console.log("数组：" + tempFilePaths);
          let imgs = that.data.imgs;
          // console.log(tempFilePaths + '----');
          for (i = 0; i < tempFilePaths.length; i++) {
            if (imgs.length >= 9) {
              that.setData({
                imgs: imgs
              });
              return false;
            } else {
              imgs.push(tempFilePaths[i]);
            }
          }
          wx.uploadFile({
            url: '部署API的请求地址',
            filePath: tempFilePaths[0],
            name: "file",
            header: {
              "Content-Type": "multipart/form-data"
            },
            formData: {
              "user": "test",
            },
            success: function (res) {
              console.log(res.data + "结果")
            }
          })
        }
      });
    }
  }
})