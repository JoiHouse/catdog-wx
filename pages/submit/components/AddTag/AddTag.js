// pages/submit/components/AddTag/AddTag.js
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
    tagValue: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    addTag: function () {
      let value = this.data.tagValue;
      if (value == '') {
        this.triggerEvent('openDialog', {
          title: "请不要为空哦",
          info: ''
        });
        return
      }
      if (value.length > 4) {
        this.triggerEvent('openDialog', {
          title: "字数4个字以内哦",
          info: ''
        });
        return
      }
      this.triggerEvent('addTag', this.data.tagValue);
    }
  }
})