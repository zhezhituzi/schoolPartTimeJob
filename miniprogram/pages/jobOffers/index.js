// joblist.js
Page({
  data: {
    jobs: [],
    lastId: null
  },

  fetchJobs: function(lastId = '') {
    const that = this;
    wx.cloud.callFunction({
      name: 'getJob', // 调用的云函数名称
      data: {
        lastId: this.data.lastId, // 传入上次查询获取到的最后一条数据的ID
        // 其他筛选条件可以在这里添加
      },
      success: function(res) {
        const newJobs = res.result.data; // 假设云函数返回的数据在 res.result.data 中
        const newLastId = res.result.lastId; // 获取返回的最新的lastId
        console.log('获取到的岗位数据:', newJobs);
        that.setData({
          jobs: that.data.jobs.concat(newJobs), // 将新获取到的岗位数据追加到现有数据后面
          lastId: newLastId // 更新lastId，用于下次分页加载
        });
      },
      fail: function(err) {
        console.error('获取岗位数据失败:', err);
      }
    });
    
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
      url: '/pages/jobInfo/index?id=' + id,
    });
  },
  onShow: function(e) {
    this.fetchJobs();
  },
  onReachBottom: function() {
    this.fetchJobs(); // 加载更多数据
  }

});

