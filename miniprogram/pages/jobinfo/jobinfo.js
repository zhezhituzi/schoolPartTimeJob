// 获取 app 实例，以便有时访问全局数据或方法
const app = getApp();

Page({
  data: {
    jobs: [
      // 示例数据，您应该从服务器获取真实数据
      { id: 1, title: '软件开发', salary: '￥30/小时' },
      { id: 2, title: '平面设计', salary: '￥50/小时' },
      // ... 其他岗位信息
    ]
  },
  onJobTap: function(event) {
    // 处理点击岗位信息的函数，这里简单跳转到岗位详情页面
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/jobdetail/jobdetail?id=' + id
    });
  },
  onTabTap: function(event) {
    // 处理底部 tab 点击的函数
    const index = event.currentTarget.dataset.index;
    const pagePath = [
      'pages/index/index',
      'pages/jobinfo/jobinfo',
      // 添加其他页面的路径
    ][index];
    if (pagePath) {
      wx.switchTab({
        url: '/' + pagePath
      });
    }
  },
  onLoad: function(options) {
    // 页面加载时执行，这里可以执行获取岗位列表的操作
  },
  // 其他需要的页面逻辑函数
});


