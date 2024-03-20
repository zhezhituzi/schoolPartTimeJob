// app.js
App({
  globalData: {
    userInfo: null
  },
  
  // 检查登录状态，并根据状态执行相应操作的方法
  checkLoginAndNavigate: function() {
    try {
      const userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        console.log('用户信息存在', userInfo);
        this.globalData.userInfo = userInfo;
        if (!userInfo.phoneNumber) {
          // 如果用户信息中没有phoneNumber，引导用户去设置手机号码
          wx.navigateTo({
            url: '/pages/logIn/index'
          });
        } else {
          // 执行已登录且已设置手机号的用户的初始化操作
        }
      } else {
        // 用户信息不存在，显示登录提示框
        wx.showModal({
          title: '登录提示',
          content: '您需要先登录',
          confirmText: '点击登录',
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
              // 用户点击了“点击登录”按钮
              this.getUserProfile();
            }
          }
        });
      }
    } catch (e) {
      console.error('获取用户信息失败', e);
    }
  },

  // 获取用户头像和昵称的方法
  getUserProfile: function() {
    wx.getUserProfile({
      desc: '用于完善个人资料',
      success: (res) => {
        console.log('获取用户信息成功', res.userInfo);
        this.globalData.userInfo = res.userInfo;
        wx.setStorageSync('userInfo', res.userInfo);
        wx.navigateTo({
          url: '/pages/logIn/index'
        });
      },
      fail: (err) => {
        console.error('获取用户信息失败', err);
      }
    });
  },

  // 小程序启动时执行的生命周期函数
  onLaunch: function() {
    // 其他初始化代码...
    wx.cloud.init({
      env: 'cloud1-5g5n870q24e225bc'
    })
    // 检查登录状态
    this.checkLoginAndNavigate();
  },
});
