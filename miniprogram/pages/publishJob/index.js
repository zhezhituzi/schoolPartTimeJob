Page({
  data: {
    userInfo: {},
    startTime: '00:00',
    endTime: '00:00',
    industryList: ['厨师', '快递', '外卖', '清洁', '安保'],
    selectedIndustry: '',
    placeList:['图书馆','宿舍','东食堂','西食堂','快递站','教学楼'],
    selectedPlace: ''
    // 页面的初始数据
  },
  // 表单提交事件处理函数
  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);

    const db = wx.cloud.database();
    const jobCollection = db.collection('job');
    const that = this

    const _data = e.detail.value;
    _data.selectedIndustry = that.data.selectedIndustry
    _data.selectedPlace = that.data.selectedPlace
    _data.startTime = that.data.startTime
    _data.endTime = that.data.endTime

    // 将表单数据添加到集合中
    jobCollection.add({
        data: e.detail.value,
        success: function(res) {
            // 数据添加成功后的回调函数
            console.log('数据添加成功，记录的 _id：', res._id);
            wx.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 2000
            });
        },
        fail: function(err) {
            // 数据添加失败后的回调函数
            console.error('数据添加失败：', err);
            console.error('12122121', err);
            wx.showToast({
                title: '提交失败，请重试',
                icon: 'none',
                duration: 2000
            });
        }
    });
  },

  onPickerChange: function(e) {
    const selectedIndustry = this.data.industryList[e.detail.value];
    this.setData({
      selectedIndustry: selectedIndustry
    });
  },
  onPlacePickerChange: function(e) {
    const selectedPlace = this.data.placeList[e.detail.value];
    this.setData({
      selectedPlace: selectedPlace
    });
  },
  onMultiPickerChange: function(e) {
    const selectedIndexes = e.detail.value;
    const selectedWorkHours = selectedIndexes.map(index => this.data.workHoursList[0][index]);
    this.setData({
      selectedWorkHours: selectedWorkHours
    });
  },
  onStartTimeChange: function(e) {
    this.setData({
      startTime: e.detail.value
    });
  },
  onEndTimeChange: function(e) {
    this.setData({
      endTime: e.detail.value
    });
  },
  onLoad: function() {
    // 从本地存储获取用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({ userInfo });
    }
  }
});

