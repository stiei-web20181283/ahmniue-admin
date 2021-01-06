import request from '@/utils/request'

// 查询角色列表
export function listRole(params) {
  return request({
    url: '/role/list',
    method: 'get',
    params: params
  })
}

// 查询角色详细
export function getRole(roleId) {
  return request({
    url: '/role/' + roleId,
    method: 'get'
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/role/create',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateRole(id,data) {
  return request({
    url: '/role/update/' + id,
    method: 'post',
    data: data
  })
}

// 角色菜单数据
export function listMenuByRole(roleId) {
  return request({
    url: '/role/listMenu/'+roleId,
    method: 'get'
  })
}
// 给角色分配菜单
export function allocMenu(data) {
  return request({
    url: '/role/allocMenu',
    method: 'post',
    data:data
  })
}
// 角色状态修改
export function changeRoleStatus(id, params) {
  return request({
    url: '/role/updateStatus/' + id,
    method: 'post',
    params: params
  })
}

// 删除角色
export function delRole(data) {
  return request({
    url:'/role/delete',
    method:'post',
    data:data
  })
}