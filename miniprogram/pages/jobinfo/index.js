// pages/jobDetail/jobDetail.js
Page({
  data: {
    jobDetail: {}
  },
  onLoad: function(options) {
    const jobId = options.id; // 从页面加载参数中获取id
    this.getJobDetail(jobId); // 使用id获取岗位详情
  },
  getJobDetail: function(jobId) {
    const that = this;
    console.log(jobId);
    wx.cloud.callFunction({
      name: 'getJob',
      data: {
        jobId: jobId // 传递岗位ID
      },
      success: function(res) {
        console.log('岗位详情获取成功', res.result.data)
        that.setData({
          jobDetail: res.result.data[0] // 更新页面数据
        })
      },
      fail: function(err) {
        console.error('岗位详情获取失败', err)
      }
    })
  }
});
