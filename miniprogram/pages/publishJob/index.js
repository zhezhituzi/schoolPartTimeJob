Page({
  data: {
    // 页面的初始数据
  },
  // 表单提交事件处理函数
  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    // 在这里处理表单数据的提交
    // 例如，调用微信的请求API进行异步提交
    wx.request({
      url: 'YOUR_API_ENDPOINT', // 您的后端API地址
      method: 'POST',
      data: e.detail.value,
      success(res) {
        // 提交成功后的反馈
        wx.showToast({
          title: '提交成功',
          icon: 'success'
        });
        // 也可以选择跳转到其他页面
        // wx.navigateTo({
        //   url: '/pages/somepage/somepage'
        // });
      },
      fail(err) {
        // 提交失败的反馈
        wx.showToast({
          title: '提交失败',
          icon: 'none'
        });
      }
    });
  },
  // 底部导航点击事件处理函数
  onTabItemTap(item) {
    // 根据点击的 tabBar 项进行跳转
    const pathMap = ['/pages/index/index', '/pages/categories/categories', '/pages/notifications/index', '/pages/mine/index'];
    const path = pathMap[item.index];
    if (path) {
      wx.switchTab({
        url: path
      });
    }
  }
});

