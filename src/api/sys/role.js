import axios from '@/libs/api.request'
const baseUrl = "api/role"

const Role={
  findAllRole:function(){
    return axios.request({
      method:'GET',
      url:baseUrl+"/find-all"
    })
  },
  saveRole(role){
    return axios.request({
      url:baseUrl,
      method:"POST",
      data:role
    })
  },
  removeRole(role){
    console.log(role)
    return axios.request({
      url:baseUrl,
      method:"DELETE",
      data:role
    })
  }
}

export default Role
