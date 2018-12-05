import axios from '@/libs/api.request'
import config from '@/config'

export const login = ({ userName, password }) => {
  let loginUrl = config.loginServicePath + '?username=' + userName + '&password=' + password
  return axios.request({
    url: loginUrl,
    method: 'post'
  })
}

export const getUserInfo = () => {
  return axios.request({
    url: 'api/user/current-user',
    method: 'get'
  })
}

export const getUsersByRole=(roleId)=>{
  return axios.request({
    url:"api/user/user-by-role-id?roleId="+roleId,
    method:"get"
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}

export const findAllUser=()=>{
  return axios.request({
    url:'api/user/find-all',
    method:"GET"
  })
}
