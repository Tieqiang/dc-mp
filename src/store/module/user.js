import {login, logout, getUserInfo} from '@/api/user'
import {setToken, getToken} from '@/libs/util'
import {forEach} from "../../libs/tools";

export default {
  state: {
    userName: '',
    userId: '',
    avatorImgPath: '',
    token: getToken(),
    access: '',
    hasGetInfo: false
  },
  mutations: {
    setAvator(state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId(state, id) {
      state.userId = id
    },
    setUserName(state, name) {
      state.userName = name
    },
    setAccess(state, access) {
      state.access = access
    },
    setToken(state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo(state, status) {
      state.hasGetInfo = status
    }
  },
  actions: {
    // 登录
    handleLogin({commit}, {userName, password}) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        login({
          userName,
          password
        }).then((res) => {
          const authorization = res.headers.authorization
          commit('setToken', authorization)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut({state, commit}) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('setToken', '')
          commit('setAccess', [])
          resolve()
        }).catch(err => {
          reject(err)
        })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo({commit}) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo().then(res => {
            let access = []
            const data = res.data
            data.authorities.forEach(item => {
              if (item.authority && item.authority.length > 0) {
                access= item.authority.split(",");
              }
            })
            commit('setAvator', data.avator)
            commit('setUserName', data.username)
            commit('setUserId', data.id)
            commit('setAccess', access)
            commit('setHasGetInfo', true)
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
