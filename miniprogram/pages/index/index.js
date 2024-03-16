Page({
  data: {
    jobArray: [
      { id: 1, title: "校园宣传员01", pay: "20元/小时" },
      { id: 2, title: "图书馆管理员", pay: "18元/小时" }
      // 其他兼职信息...
    ]
  },
  goToPartTimeJobs: function() {
    // 导航到兼职列表页面
    wx.navigateTo({
      url: '/pages/parttimejobs/parttimejobs'
    });
  },
  goToRecruitment: function() {
    // 导航到招聘信息发布页面
    wx.navigateTo({
      url: '/pages/recruitment/recruitment'
    });
  }
});
