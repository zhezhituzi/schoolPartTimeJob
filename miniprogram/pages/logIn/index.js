Page({
  data: {
    phone: '',
    password: '',
  },
  inputPhone(e) {
    this.setData({
      phone: e.detail.value,
    });
  },
  inputPassword(e) {
    this.setData({
      password: e.detail.value,
    });
  },
  login() {
    const { phone, password } = this.data;
    const db = wx.cloud.database();
    const usr_info = db.collection('usr_info');

    usr_info.where({
      phone_number: phone
    }).get().then(res => {
      if (res.data.length === 0) {
        wx.showModal({
          title: '提示',
          content: '该手机号未注册',
          cancelText: '重新输入',
          confirmText: '去注册',
          success (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/signUp/index'
              });
            } else if (res.cancel) {
              this.setData({
                phone: '',
                password: '',
              });
            }
          }
        });
      } else {
        const user = res.data[0];
        if (user.password === password) {
          // 账号密码都正确了
          let userInfo = wx.getStorageSync('userInfo') || {};
          userInfo.phoneNumber = phone;
          userInfo.password = password;
          try {
            wx.setStorageSync('userInfo', userInfo);
            console.log('User information updated successfully');
          } catch (e) {
            console.error('Failed to update user information', e);
          }
          // 登录成功，可以返回了
          wx.navigateBack({
            delta: 1
          });

        } else {
          wx.showModal({
            title: '提示',
            content: '密码错误，如忘记请联系作者：13188888888',
            showCancel: false,
            confirmText: '确定',
          });
        }
      }
    }).catch(err => {
      console.error(err);
      // Handle any other errors
    });
  },
  goToSignUp() {
    wx.navigateTo({
      url: '/pages/signUp/index',
    });
  },
});
