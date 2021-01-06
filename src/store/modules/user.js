import { login, logout, getInfo, refreshtoken } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import storage from '@/utils/storage'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  permissions: [],
  permisaction: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMISSIONS: (state, permisaction) => {
    state.permisaction = permisaction
  }
}

const actions = {
  // user login 登录
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        const data = response.data
        const tokenStr = data.token
        setToken(tokenStr)
        commit('SET_TOKEN', tokenStr)
        resolve() 
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info 获取用户信息
  GetInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // debugger
      getInfo().then(response => {
        const data = response.data
        // roles must be a non-empty array
        if (!data.roles || data.roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        // commit('SET_PERMISSIONS', permissions)
        commit('SET_ROLES', data.roles)
        commit('SET_NAME', data.username)
        commit('SET_AVATAR', data.avatar)
        // commit('SET_INTRODUCTION', introduction)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 退出系统
  LogOut({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_PERMISSIONS', [])
        removeToken()
        storage.clear()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 刷新token
  refreshToken({ commit, state }) {
    return new Promise((resolve, reject) => {
      refreshtoken({ token: state.token }).then(response => {
        const { token } = response
        commit('SET_TOKEN', token)
        setToken(token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
