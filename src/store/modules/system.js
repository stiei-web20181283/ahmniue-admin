import { updateSetting } from '@/api/login'
import logo from '@/assets/logo/ahmniueLight.png'
const state = {
  info: {
    logo: logo,
    name:'ahmniue-admin'
  }
}

const mutations = {
  SET_INFO: (state, data) => {
    state.info = data
  }
}

const actions = {
  settingDetail({ commit }) {
    return new Promise((resolve, reject) => {
        const data  = state.info
        commit('SET_INFO', data)
        resolve(data)
    })
  },
  updateSetting({ commit }, info) {
    return new Promise((resolve, reject) => {
      updateSetting(info).then(response => {
        const { data } = response
        commit('SET_INFO', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
