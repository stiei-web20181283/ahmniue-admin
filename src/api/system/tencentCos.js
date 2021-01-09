import request from '@/utils/request'

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/cos/upload',
    method: 'post',
    data: data
  })
}
