
Component({
  properties: {
    title: {
      type: String,
      value: ''
    },
    isShowDialog: {
      type: Boolean,
      value: false
    },
    info: {
      type: String,
      value: ''
    }
  },

  data: {

  },

  methods: {
    closeDialog() {
      this.setData({
        isShowDialog: false,
      });
    },
  }
})