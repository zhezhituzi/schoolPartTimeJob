// pages/login/login.js
Page({
  onGetUserProfile(e) {
    wx.getUserProfile({
      desc: '用于完善个人资料',
      success: (res) => {
        console.log('获取用户信息成功', res.userInfo);
        // 保存用户信息到本地存储或全局状态管理中
        wx.setStorageSync('userInfo', res.userInfo);
        // 可以跳转回原页面或者其他操作
        wx.navigateBack();
      },
      fail: (err) => {
        console.error('获取用户信息失败', err);
      }
    });
  },
  
  onGetPhoneNumber(e) {
    if (e.detail.errMsg === "getPhoneNumber:ok") {
      console.log('获取手机号成功', e.detail);
      // 这里的 e.detail 包含加密信息，需要发送到服务器解密
      // 解密后的手机号可以保存到本地存储或全局状态管理中
    } else {
      console.error('获取手机号失败');
    }
  }
});
