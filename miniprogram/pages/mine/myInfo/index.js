Page({
  data: {
    userInfo: {
      avatarUrl: '',
      name: '',
      phone: '',
      email: '',
      gender: '',
      organization: '',
      lookingForJob: false,
      hiring: false,
      intro: '',
      avatarId: '' // 该字段表示是否有头像ID
    }
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
  onInput: function(e) {
    // 输入框事件处理函数
    let field = e.currentTarget.dataset.field;
    let value = e.detail.value;
    this.setData({
      [`userInfo.${field}`]: value
    });
  },
  onSwitchChange: function(e) {
    // 开关切换事件处理函数
    let field = e.currentTarget.dataset.field;
    this.setData({
      [`userInfo.${field}`]: !this.data.userInfo[field]
    });
  },
  onSave: function() {
    // 保存按钮点击事件处理函数
    // 编写保存逻辑，可能需要调用API保存数据到服务器
    console.log('保存用户信息', this.data.userInfo);
    // 在这里完成数据保存后，可以给出提示或进行页面跳转
  },
  onShow: function() {
    // 每次页面显示时，都从本地存储中获取最新的用户信息
    const localUserInfo = wx.getStorageSync('userInfo');
    // 如果本地存储中有用户信息，则更新页面数据
    if (localUserInfo) {
      this.setData({
        'userInfo.avatarUrl': localUserInfo.avatarUrl || this.data.userInfo.avatarUrl,
        'userInfo.name': localUserInfo.name || this.data.userInfo.name,
        'userInfo.phone': localUserInfo.phone || this.data.userInfo.phone,
        'userInfo.email': localUserInfo.email || this.data.userInfo.email,
        'userInfo.gender': localUserInfo.gender || this.data.userInfo.gender,
        'userInfo.organization': localUserInfo.organization || this.data.userInfo.organization,
        'userInfo.lookingForJob': localUserInfo.lookingForJob || this.data.userInfo.lookingForJob,
        'userInfo.hiring': localUserInfo.hiring || this.data.userInfo.hiring,
        'userInfo.intro': localUserInfo.intro || this.data.userInfo.intro,
        'userInfo.avatarId': localUserInfo.avatarId || this.data.userInfo.avatarId
      });
    }
  }
});
