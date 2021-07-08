// 用户相关请求模块

import request from '@/utils/request'
// 登录
export const login = data => {
  return request({
    method: 'POST',
    url: './app/v1_0/authorizations',
    data
  })
}
// 获取验证码
export const sendSms = mobile => {
  return request({
    method: 'GET',
    url: `/app/v1_0/sms/codes/${mobile}`,
  })
}

// 获取用户信息
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user',
  })
}

// 获取用户频道列表
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}

// 关注用户
export const addFollow = target => {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/followings',
    data: {
      target
    }
  });
}

// 取消关注
export const delFollow = target => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/followings/${target}`,
  });
}

// 获取其他用户信息
export const getUsersInfo = target => {
  return request({
    method: 'GET',
    url: `/app/v1_0/users/${target}`,
  })
}

// 获取用户文章列表
export const getUserArticleById = target => {
  return request({
    method: 'GET',
    url: `/app/v1_0/users/${target}/articles`
  })
}

// 获取当前登录用户的个人资料
export const getUserProfile = target => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/profile',
  })
}

// 修改用户个人资料
export const updateUserProfile = data => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/profile',
    data
  })
}

// 编辑用户照片资料
export const updateUserPhoto = data => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/photo',
    data
  })
}
