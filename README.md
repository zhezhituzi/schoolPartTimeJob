# 曹光旭毕业设计
该项目仅适用于曹光旭毕业设计使用。

# 一些细节
## 为什么下边栏既有找工作的按钮也有发布工作的按钮？
因为考虑到一些同学一边创业一边做别的兼职。

## 几种跳转方式的区别
wx.navigateTo 和 wx.navigateBack 可以用来实现页面间的前进和后退，页面会被添加到页面栈中。
wx.redirectTo 和 wx.reLaunch 适用于不需要返回的场景，因为它们不保留当前页面。
wx.switchTab 用于跳转到 tabBar 页面，它也不会保留当前页面。