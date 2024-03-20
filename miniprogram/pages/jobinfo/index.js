// pages/jobDetail/jobDetail.js
Page({
  data: {
    jobDetail: {
      id:1,
      storeName: '精品咖啡店',
      storeAddress: '市中心广场102号',
      position: '咖啡师助理',
      workingHours: '周一至周五，9:00 - 18:00',
      salary: '时薪50元',
      requirements: '无需经验，提供培训'
    }
  },
  onLoad: function(options) {
    const jobId = options.id; // 从页面加载参数中获取id
    this.getJobDetail(jobId); // 使用id获取岗位详情
  },
  getJobDetail: function(jobId) {
    // TODO: 实现获取岗位详情的逻辑
    // 例如从服务器获取或者查询本地数据
    // 假设有一个函数 fetchJobDetailById 可以根据ID获取详情
    const detail = fetchJobDetailById(jobId);
    this.setData({
      jobDetail: detail
    });
  },
  fetchJobDetailById: function(jobId) {
    // 模拟根据id获取详情数据的过程
    // 实际情况中这里应该是一个异步请求数据的过程
    // 目前只是直接返回了一个静态对象
    return {
      id: jobId,
      storeName: '精品咖啡店',
      storeAddress: '市中心广场102号',
      position: '咖啡师助理',
      workingHours: '周一至周五，9:00 - 18:00',
      salary: '时薪50元',
      requirements: '无需经验，提供培训'
    };
  }
});
