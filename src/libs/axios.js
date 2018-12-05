import axios from 'axios'
import store from '@/store'
import {getToken} from './util'
// import { Spin } from 'iview'
const addErrorLog = errorInfo => {
  const {data,statusText, status, request: {responseURL}} = errorInfo
  let info = {
    type: 'ajax',
    code: data.code,
    mes: data.description,
    url: responseURL
  }
  if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }

  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
      }
    }
    return config
  }

  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }

  interceptors (instance, url) {
    console.log(url)
    // 请求拦截
    instance.interceptors.request.use(config => {
      const token = getToken()
      if (token) {
        config.headers.authorization = token
      }
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      const {data, status, headers} = res
      return {data, status, headers}
    }, error => {
      this.destroy(url)
      addErrorLog(error.response)
      return Promise.reject(error)
    })
  }

  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}

export default HttpRequest
