// joblist.js
Page({
  data: {
    jobs: [],
    lastId: null,
    industryList: ['厨师', '快递', '外卖', '清洁', '安保'],
    selectedIndustryText: '行业',
    placeList:['图书馆','宿舍','东食堂','西食堂','快递站','教学楼'],
    selectedPlaceText: '位置',
    timeList: ['上午', '中午', '下午', '晚上'], // 新增变量，用于在视图中显示时段列表
    selectedTimeText: '时段'
  },
  showPlacePicker: function() {
    const that = this;
    wx.showActionSheet({
      itemList: this.data.placeList,
      success: function(res) {
        // res.tapIndex 是用户点击的项的索引
        const selectedPlace = that.data.placeList[res.tapIndex];
        that.setData({
          selectedPlaceText: selectedPlace // 更新视图中显示的文本为用户所选的地点
        });
        that.setData({
          jobs: [] ,// 先清空当前的岗位列表
          lastId: null
        });
        that.fetchJobs();
      },
      fail: function(res) {
        console.log(res.errMsg);
      }
    });
  },
  showIndustryPicker: function() {
    const that = this;
    wx.showActionSheet({
      itemList: this.data.industryList,
      success: function(res) {
        // res.tapIndex 是用户点击的项的索引
        const selectedIndustry = that.data.industryList[res.tapIndex];
        that.setData({
          selectedIndustryText: selectedIndustry // 更新视图中显示的文本为用户所选的行业
        });
        that.setData({
          jobs: [] ,// 先清空当前的岗位列表
          lastId: null
        });
        that.fetchJobs();
      },
      fail: function(res) {
        console.log(res.errMsg);
      }
    });
  },
  showTimePicker: function() {
    const that = this;
    wx.showActionSheet({
      itemList: this.data.timeList,
      success: function(res) {
        // res.tapIndex 是用户点击的项的索引
        const selectedTime = that.data.timeList[res.tapIndex];
        that.setData({
          selectedTimeText: selectedTime, // 更新视图中显示的文本为用户所选的时段
          jobs: [] ,// 先清空当前的岗位列表
          lastId: null
        });
        that.fetchJobs();
      },
      fail: function(res) {
        console.log(res.errMsg);
      }
    });
  },
  fetchJobs: function(lastId = '') {
    const that = this;
    let dataObj = {
      lastId: that.data.lastId, 
    };
    if (that.data.selectedPlaceText !== '位置') {
      dataObj.selectedPlace = that.data.selectedPlaceText;
    }
    if (that.data.selectedIndustryText !== '行业') {
      dataObj.selectedIndustry = that.data.selectedIndustryText;
    }
    if (that.data.selectedTimeText !== '时段') {
      dataObj.selectedTime = that.data.selectedTimeText;
    }
    dataObj.isHR = 'true';
    wx.cloud.callFunction({
      name: 'getJob', // 调用的云函数名称
      data: dataObj,
      success: function(res) {
        const newJobs = res.result.data; // 假设云函数返回的数据在 res.result.data 中
        const newLastId = res.result.lastId; // 获取返回的最新的lastId
        console.log('从云端获取到的岗位数据:', newJobs);
        if(res.result.data.length >0 ){
          that.setData({
            jobs: that.data.jobs.concat(newJobs), // 将新获取到的岗位数据追加到现有数据后面
            lastId: newLastId // 更新lastId，用于下次分页加载
          });
        }
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
    const that = this
    that.setData({
      jobs: [],
      lastId: null,
      industryList: ['厨师', '快递', '外卖', '清洁', '安保'],
      selectedIndustryText: '行业',
      placeList:['图书馆','宿舍','东食堂','西食堂','快递站','教学楼'],
      selectedPlaceText: '位置',
      timeList: ['上午', '中午', '下午', '晚上'], // 新增变量，用于在视图中显示时段列表
      selectedTimeText: '时段'
    });
    this.fetchJobs();
  },
  onReachBottom: function() {
    this.fetchJobs(); // 加载更多数据
  }

});

