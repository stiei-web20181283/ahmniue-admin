import request from '@/utils/request'

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/admin/list',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/admin/' + userId,
    method: 'get'
  })
}
//查询当前登录用户
export function getProfile() {
  return request({
    url: '/admin/profile',
    method: 'get'
  })
}
// 查询用户角色列表
export function getUserRole(userId) {
  return request({
    url: '/admin/role/' + userId,
    method: 'get'
  })
}

// 给用户分配角色
export function updateUserRole(data) {
  return request({
    url: '/admin/role/update',
    method: 'post',
    data: data
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/admin/register',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(id,data) {
  return request({
    url: '/admin/update/' + id,
    method: 'post',
    data: data
  })
}

// 删除用户
export function delUser(userId) {
  return request({
    url: '/admin/delete/' + userId,
    method: 'post'
  })
}

// 用户密码重置
export function resetUserPwd(userId, password) {
  const data = {
    userId,
    password
  }
  return request({
    data: data
  })
}

// 用户状态修改
export function changeUserStatus(id, params) {
  return request({
    url: '/admin/updateStatus/' + id,
    method: 'post',
    params: params
  })
}
// 用户头像修改
export function changeUserAvatar(id, data) {
  return request({
    url: '/admin/updateAvatar/' + id,
    method: 'post',
    data: data
  })
}


// 用户密码重置
export function updateUserPwd(data) {
  return request({
    url: '/admin/updatePassword',
    method: 'post',
    data: data
  })
}
