// joblist.js
Page({
  data: {
    jobs: [
      { id: 1, title: '服务员', salary: '20元/小时', location: '上海' },
      { id: 2, title: '图书管理员', salary: '25元/小时', location: '北京' },
      // ...其他岗位数据
    ]
  },
  onSearch: function(e) {
    // 搜索逻辑
  },
  onFilterTap: function(e) {
    // 筛选逻辑，例如按位置、行业、时段筛选
  },
  onJobTap: function(e) {
    // 跳转到岗位详情页的逻辑
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/jobDetail/jobDetail?id=' + id,
    });
  }
});

