Page({
  data: {
    phone: '',
    password: '',
    passwordConfirm: '',
  },
  
  onPhoneInput: function(event) {
    this.setData({ phone: event.detail.value });
  },
  
  onPasswordInput: function(event) {
    this.setData({ password: event.detail.value });
  },
  
  onPasswordConfirmInput: function(event) {
    this.setData({ passwordConfirm: event.detail.value });
  },
  
  onRegisterTap: function() {
    if (this.data.phone.length !== 11) {
      wx.showToast({
        title: '请输入正确的手机号！',
        icon: 'none'
      });
      return;
    }
    
    if (this.data.password.length < 6 || this.data.password.length > 20) {
      wx.showToast({
        title: '密码长度必须在6到20位之间',
        icon: 'none'
      });
      return;
    }
    
    if (this.data.password !== this.data.passwordConfirm) {
      wx.showToast({
        title: '两次输入的密码不一致',
        icon: 'none'
      });
      return;
    }
    
    const db = wx.cloud.database();
    const usr_info = db.collection('usr_info');
  
    // Try to add a new user record to the database
    usr_info.add({
      data: {
        phone_number: this.data.phone,
        password: this.data.password
      }
    })
    
    .catch(err => {
      // Handle the error here if the phone number is already registered
      console.error('注册失败', err);
      wx.showModal({
        title: '注册失败',
        content: '该手机号已注册',
        showCancel: false, // There's no cancel button, only confirm
        confirmText: '确认',
        success (res) {
          if (res.confirm) {
            // The user hit the confirm button. You might want to redirect them or reset the form
          }
        }
      });
    })

    .then(res => {
      wx.showModal({
        title: '提示',
        content: '注册成功！',
        showCancel: false, // 不显示取消按钮
        confirmText: '点击返回',
        success: function (res) {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1 // 返回的页面数，如果是1就会返回上一级页面
            });
          }
        }
      });
      
    })
    .catch(err => {
      // ...处理注册失败的情况
    });
    
  },
  
});
