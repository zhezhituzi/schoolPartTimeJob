// 引入云开发能力
const cloud = require('wx-server-sdk');

// 初始化云能力
cloud.init({
  // 可以指定云环境
  env: cloud.DYNAMIC_CURRENT_ENV
});

// 获取数据库引用
const db = cloud.database();

exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext();
    const openid = wxContext.OPENID;
    const tempFilePaths = event.tempFilePaths

    // 检查参数
    if (!tempFilePaths || tempFilePaths.length === 0) {
      return { code: 400, message: '缺少图片路径参数' };
    }

    // 只处理第一张图片
    const filePath = tempFilePaths[0];
    const _cloudPath = `userAvatar/${openid}_${Date.now()}.png`;

    // 调用云存储上传
    const uploadRes = await cloud.uploadFile({
      cloudPath: _cloudPath,
      fileContent: Buffer.from(filePath, 'utf-8') // 假设 filePath 是图片的二进制内容
    });

    // 检查上传结果
    if (!uploadRes.fileID) {
      return { code: 500, message: '图片上传失败' };
    }

    // 更新用户信息中的 avatarId 字段
    const updateRes = await db.collection('usr_info').where({
      _openid: openid // 使用_openid作为查询条件
    }).update({
      data: {
        avatarId: uploadRes.fileID
      }
    });

    // 检查更新结果
    if (updateRes.stats.updated === 0) {
      return { code: 404, message: '未找到用户记录' };
    }

    // 返回成功信息和文件 ID
    return { code: 200, message: '上传成功', fileID: uploadRes.fileID };
  } catch (err) {
    console.error('upLoadAvatar error', err);
    return { code: 500, message: '服务器错误', error: err };
  }
};
