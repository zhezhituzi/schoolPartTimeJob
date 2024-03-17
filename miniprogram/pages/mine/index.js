Page({
  data: {
    userInfo: null // 这里存储用户信息，初始为null表示未登录
  },
  onGetUserProfile(e) {
    wx.getUserProfile({
      desc: '用于完善个人资料',
      success: (res) => {
        console.log('获取用户信息成功', res.userInfo);
        // 更新页面数据，展示头像和昵称
        this.setData({
          userInfo: res.userInfo
        });
        // 保存用户信息到本地存储或全局状态管理中
        wx.setStorageSync('userInfo', res.userInfo);
      },
      fail: (err) => {
        console.error('获取用户信息失败', err);
        // 可以在这里处理用户拒绝授权的情况
      }
    });
  },
  onLoad: function() {
    // 模拟从本地存储获取用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({ userInfo });
    }
  },
  navigateToLogin: function() {
    wx.navigateTo({
      url: '/pages/logIn/index',
    });
  },
  navigateToPage: function(e) {
    const url = e.currentTarget.dataset.url;
    // 判断是否是 tabBar 页面
    if (url === "/pages/categories/index" || url === "/pages/jobOffers/index" || url === "/pages/mine/index") {
      wx.switchTab({
        url: url,
      });
    } else {
      wx.navigateTo({
        url: url,
      });
    }
  }
});
