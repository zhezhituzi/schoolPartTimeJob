// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      });
    }

    try {
      const userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        // 如果获取到了用户信息，可以做一些初始化操作
        console.log('获取到用户信息', userInfo);
        // 例如将用户信息设置到全局状态中
        this.globalData.userInfo = userInfo;
        // 或者跳转到应用的主页
      } else {
        // 如果没有用户信息，可能需要显示登录界面或做其他操作
        console.log('未获取到用户信息，可能未登录或未授权');
        // 例如跳转到登录页面让用户登录
        wx.redirectTo({
          url: '/pages/login/login'
        });
      }
    } catch (e) {
      // 处理获取失败的情况
      console.error('获取用户信息失败', e);
    }
  },
  globalData: {
    userInfo: null
  }
});
