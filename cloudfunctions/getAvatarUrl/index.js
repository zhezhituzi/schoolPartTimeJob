// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // env 参数决定接下来小程序发起的云开发调用会默认请求到哪个云环境的资源
  env: cloud.DYNAMIC_CURRENT_ENV // 使用当前环境
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const openid = cloud.getWXContext().OPENID

  try {
    // 根据 openid 从数据库中获取用户信息
    const userRes = await db.collection('usr_info').where({
      _openid: openid
    }).get();

    if (userRes.data.length === 0) {
      // 用户信息不存在
      return { error: 'User not found' };
    }

    // 获取用户的 avatarId
    const avatarId = userRes.data[0].avatarId;
    
    if (!avatarId) {
      // avatarId 不存在
      return { 
        error: 'Avatar ID not found',
        hasAvatar: false 
      };
    }
    
    // 使用 avatarId 作为 fileID 下载头像文件
    const fileRes = await cloud.downloadFile({
      fileID: avatarId,
    });

    // 返回头像的临时文件路径和 hasAvatar 标志
    return {
      avatarUrl: fileRes.fileContent.toString('utf8'),
      hasAvatar: true
    };
  } catch (err) {
    return { error: err }
  }
}
