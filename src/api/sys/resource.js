import axios from '@/libs/api.request'
const baseUrl = "api/resource"
const resource = {
  getAllResource:function(){
    return axios.request({
      url:baseUrl+"/find-all",
      method:'GET'
    })
  },
  /**
   * 根据OperationCode获取唯一的Resource
   * @param code
   */
  getResourceByOperationCode:function(code){
    return axios.request({
      url:baseUrl+"/find-one-by-operation-code?code="+code,
      method:'GET'
    })
  },
  /**
   * 保存resource
   * @param resource
   */
  saveResource:function(resource){
    return axios.request({
      url:baseUrl,
      method:"POST",
      data:resource
    })
  },
  removeResource:function(resource){
    return axios.request({
      url:baseUrl,
      method:"DELETE",
      data:resource
    })
  }
}

export default resource
