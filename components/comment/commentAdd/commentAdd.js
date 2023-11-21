// components/comment/commentAdd/commentAdd.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    addCommentInputFocus: true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeDialog() {
      this.triggerEvent('closeDialog', {})
    },
  }
})