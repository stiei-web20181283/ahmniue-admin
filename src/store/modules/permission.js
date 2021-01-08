import { asyncRoutes, constantRoutes } from '@/router'
import { getRoutes } from '@/api/system/role'
import Layout from '@/layout'
// import sysuserindex from '@/views/sysuser/index'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Use names to determine if the current user has permission
 * @param names
 * @param route
 */
function hasPathPermission(paths, route) {
  if (route.path) {
    return paths.some(path => route.path === path.path)
  } else {
    return true
  }
}

/**
  * 后台查询的菜单数据拼装成路由格式的数据
  * @param routes
  */
export function generaMenu(routes, data) {
  data.forEach(item => {
    const menu = {
      path: item.parentId === 0 ? '/' + item.name:item.name,
      component: item.parentId === 0 ? Layout : loadView(item.name),
      hidden: false,
      children: [],
      name: item.name,
      meta: {
        title: item.title,
        icon: item.icon,
        noCache: true
      }
    }
    if (item.children) {
      generaMenu(menu.children, item.children)
    }
    if(item.hidden == 0){
      routes.push(menu)
    }
  })
}

export const loadView = (view) => { // 路由懒加载
  return (resolve) => require(['@/views/' + view], resolve)
  // return () => import(`@/views${view}`)
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param components
 */
export function filterAsyncPathRoutes(routes, paths) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPathPermission(paths, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncPathRoutes(tmp.children, paths)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  GenerateRoutes({ commit }, data) {
    return new Promise(resolve => {
      const menus = data
        // console.log(data)
       
          // Object.assign(menus, data)
          generaMenu(asyncRoutes, menus)
          asyncRoutes.push({ path: '*', redirect: '/', hidden: true })
          commit('SET_ROUTES', asyncRoutes)
          resolve(asyncRoutes)

    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
