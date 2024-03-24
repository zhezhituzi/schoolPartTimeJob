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
            // 上传成功后获取头像 URL
            that.getAvatarUrlFromCloud();
          },
          fail: err => {
            console.error('上传失败', err);
          }
        });
      }
    });
  },
  getAvatarUrlFromCloud: function() {
    const that = this;
    wx.cloud.callFunction({
      name: 'getAvatarUrl',
      success: function(res) {
        if (res.result.hasAvatar) {
          that.setData({
            'userInfo.avatarUrl': res.result.avatarUrl
          });
          // 更新本地存储中的 userInfo
          wx.setStorageSync('userInfo', that.data.userInfo);
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
        that.setData({
          'userInfo.avatarUrl': res.userInfo.avatarUrl
        });
        // 更新本地存储
        wx.setStorageSync('userInfo', that.data.userInfo);
      },
      fail: (err) => {
        console.error('获取用户信息失败', err);
      }
    });
  },
  onSave: function() {
    const that = this;
    const db = wx.cloud.database();
    const usrInfoCollection = db.collection('usr_info');

    // 首先尝试保存到本地存储
    try {
        wx.setStorageSync('userInfo', this.data.userInfo);
        wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
        });

        // 保存到本地存储成功后，继续保存到云数据库
        // 判断用户是否已经在云数据库中有记录，如果有，则更新；如果没有，则添加新记录
        usrInfoCollection.where({
            _openid: this.data.userInfo._openid // 用小程序用户的 openid 作为查询条件
        }).get({
            success: function(res) {
                if (res.data.length > 0) {
                    // 如果用户信息已存在，更新记录
                    const docId = res.data[0]._id;
                    usrInfoCollection.doc(docId).update({
                        data: that.data.userInfo,
                        success: function() {
                            console.log('用户信息更新成功');
                        },
                        fail: function(err) {
                            console.error('用户信息更新失败：', err);
                        }
                    });
                } else {
                    // 如果用户信息不存在，添加新记录
                    usrInfoCollection.add({
                        data: that.data.userInfo,
                        success: function() {
                            console.log('用户信息添加成功');
                        },
                        fail: function(err) {
                            console.error('用户信息添加失败：', err);
                        }
                    });
                }
            }
        });
    } catch (e) {
        // 保存失败的处理
        console.error('保存失败', e);
        wx.showToast({
            title: '保存失败',
            icon: 'none',
            duration: 2000
        });
    }
  },

  onInput: function(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    this.setData({
      [`userInfo.${field}`]: value
    });
  },
  onShow: function() {
    const localUserInfo = wx.getStorageSync('userInfo');
    if (localUserInfo) {
      this.setData({
        userInfo: {
          ...this.data.userInfo,
          ...localUserInfo,
          avatarUrl: this.data.userInfo.avatarUrl || localUserInfo.avatarUrl // 保证头像信息优先
        }
      });
    }
  }
});
