// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // env 参数说明：
  //   env 参数决定接下来云函数的请求将发送到哪个云环境的资源
  env: cloud.DYNAMIC_CURRENT_ENV // 当前环境的常量（推荐）
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let query = db.collection('job')

  // 如果是 HR，只筛选该 HR 发布的工作
  if (event.isHR) {
    query = query.where({
      _openid: wxContext.OPENID // 筛选条件为当前用户的 openid
    })
  }

  if (event.jobId){
    query = query.where({
      _id: event.jobId // 筛选条件为当前用户的 openid
    })
  }

  // 如果提供了 selectedIndustry，添加该筛选条件
  if (event.selectedIndustry) {
    query = query.where({
      industry: event.selectedIndustry // 筛选特定行业的工作
    })
  }

  // 分页处理，根据前端传来的 lastId 进行分页
  if (event.lastId) {
    query = query.where({
      _id: db.command.gt(event.lastId) // 查询 ID 大于 lastId 的记录，实现分页
    })
  }

  try {
  
    const res = await query.orderBy('_id', 'asc').limit(10).get()

    // 返回查询结果
    return {
      data: res.data,
      lastId: res.data.length > 0 ? res.data[res.data.length - 1]._id : null, // 返回最后一条数据的 _id 作为下次查询的 lastId
      errMsg: '获取成功'
    }
  } catch (err) {
    return {
      errMsg: '获取失败',
      err
    }
  }
}
