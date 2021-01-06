import request from '@/utils/request'

// 查询菜单列表
export function listMenu(query) {
  return request({
    url: '/api/v1/menulist',
    method: 'get',
    params: query
  })
}

// 查询菜单详细
export function getMenu(id) {
  return request({
    url: '/menu/' + id,
    method: 'get',
  })
}

// 查询菜单下拉树结构
export function treeselect() {
  return request({
    url: '/menu/treeList',
    method: 'get'
  })
}

// 新增菜单
export function addMenu(data) {
  return request({
    url: '/menu/create',
    method: 'post',
    data: data
  })
}

// 修改菜单
export function updateMenu(id, data) {
  return request({
    url: '/menu/update/' + id,
    method: 'post',
    data: data
  })
}

// 删除菜单
export function delMenu(menuId) {
  return request({
    url: '/api/v1/menu/' + menuId,
    method: 'delete'
  })
}
