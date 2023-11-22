// app.js
App({

  getTimeDifferent(oldTime) {
    let newTime = new Date();
    oldTime = new Date(oldTime.replace(/-/g, "/"));
    let differentTime = (newTime - oldTime) / 1000;
    let days = parseInt(differentTime / 86400);
    let hours = parseInt(differentTime / 3600) - 24 * days;
    let minutes = parseInt(differentTime % 3600 / 60);
    let seconds = parseInt(differentTime % 60);
    let tem
    if (days > 365) {
      tem = oldTime.getFullYear() + "-" + (oldTime.getMonth() + 1) + "-" + oldTime.getDate();
    } else if (days > 7) {
      tem = (oldTime.getMonth() + 1) + "-" + oldTime.getDate()
    } else if (days == 1) {
      tem = "昨天";
    } else if (days == 2) {
      tem = "前天";
    } else if (days > 2) {
      tem = days + "天前";
    } else if (hours > 0) {
      tem = hours + "小时前";
    } else if (minutes > 0) {
      tem = minutes + "分钟前";
    } else if (seconds > 0) {
      tem = "刚刚";
    }
    return tem;
  },
  openDialog(e, that) {
    let value = e.detail;
    if (e.type || e.type == "openDialog") {
      value = e.detail
    } else {
      value = e
    }
    that.setData({
      isShowDialog: true,
      dialogInfo: {
        title: value.title ? value.title : '出现了错误',
        info: value.info ? value.info : ''
      }
    });

  },

  onLaunch() {

  },
  globalData: {
    token: null,
    userName: null,
    userAvatar: null,
    apiHost: 'http://10.150.4.120:7788',
  }
})
