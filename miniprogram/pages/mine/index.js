Page({
  data: {
    userInfo: null // 这里存储用户信息，初始为null表示未登录
  },
  onAvatarTap() {
    const that = this;
    wx.showActionSheet({
      itemList: ['从相册上传', '使用微信头像'],
      success(res) {
        if (res.tapIndex === 0) {
          // 从相册上传
          that.chooseImage();
        } else if (res.tapIndex === 1) {
          // 使用微信头像
          that.getUserProfile();
        }
        that.getAvatarUrlFromCloud();
      },
      fail(res) {
        console.log(res.errMsg);
      }
    });
  },
  chooseImage() {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePath = res.tempFilePaths[0];
        console.log(tempFilePath);
        // 调用云函数上传图片
        wx.cloud.callFunction({
          name: 'upLoadAvatar',
          data: {
            tempFilePaths: [tempFilePath]
          },
          success: uploadRes => {
            console.log('上传成功', uploadRes);
          },
          fail: err => {
            console.error('上传失败', err);
          }
        });
      }
    });
  },
  getUserProfile() {
    const that = this;
    wx.getUserProfile({
      desc: '用于完善个人资料',
      success: (res) => {
        console.log('获取用户信息成功', res.userInfo);
        that.setData({
          userInfo: res.userInfo
        });
        // 保存用户信息到本地存储或全局状态管理中
        wx.setStorageSync('userInfo', res.userInfo);
      },
      fail: (err) => {
        console.error('获取用户信息失败', err);
      }
    });
  },
  onLoad: function() {
    // 页面加载时尝试获取本地存储的用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({ userInfo });
    }
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
  },
  onShow: function() {
    // 页面显示
    this.getUserInfoFromStorage();
    //this.getAvatarUrlFromCloud();
  },
  getUserInfoFromStorage: function() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      // 如果本地存储中有用户信息，更新到data中
      this.setData({ userInfo });
    }
  },
  getAvatarUrlFromCloud: function() {
    const that = this; // 保存当前页面的上下文
    wx.cloud.callFunction({
      name: 'getAvatarUrl',
      success: function(res) {
        if (res.result.hasAvatar) {
          if (res.result.avatarUrl !== that.data.userInfo.avatarUrl || !that.data.userInfo.avatarUrl) {
            // 先更新页面 data 中的 userInfo 对象
            that.setData({
              'userInfo.avatarUrl': res.result.avatarUrl // 使用 setData 更新页面数据和视图
            });
            // 再更新本地存储中的 userInfo 对象
            let updatedUserInfo = Object.assign({}, that.data.userInfo);
            wx.setStorageSync('userInfo', updatedUserInfo);
          }
        }
      },
      fail: console.error
    });
  }
  
  
});

