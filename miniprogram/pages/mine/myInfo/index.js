Page({
  data: {
    userInfo: {
      nickName: '', // 默认昵称
      phone: '', // 电话号码
      class: '', // 班级
      bio: '' // 简介
    },
    isEditing: false // 是否处于编辑状态
  },

  onLoad: function() {
    // 加载时获取存储的用户信息
    const storedInfo = wx.getStorageSync('userInfo');
    if (storedInfo) {
      this.setData({ userInfo: storedInfo });
    }
  },

  onInput: function(e) {
    // 更新用户信息数据
    const field = e.currentTarget.dataset.field;
    this.data.userInfo[field] = e.detail.value;
  },

  toggleEdit: function() {
    // 切换编辑状态
    this.setData({ isEditing: !this.data.isEditing });
    if (!this.data.isEditing) {
      // 保存编辑后的信息
      wx.setStorageSync('userInfo', this.data.userInfo);
    }
  }
});

