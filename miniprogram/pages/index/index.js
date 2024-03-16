Page({
  navigateToPage: function(e) {
    const url = e.currentTarget.dataset.url;
    // 判断是否是 tabBar 页面
    if (url === "/pages/categories/index" || url === "/pages/publishJob/index" || url === "/pages/mine/index") {
      wx.switchTab({
        url: url,
      });
    } else {
      wx.navigateTo({
        url: url,
      });
    }
  },
});
