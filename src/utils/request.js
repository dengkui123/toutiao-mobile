
// 封装 axios 请求模块

import axios from 'axios'
// 在非组件模块中获取 store 必须通过这种方式
// 这里单独加载 store，和在组件中 this.$store 一个东西
import store from '@/store'
import JSONBig from 'json-bigint'
// JSONBig.parse()：把 JSON 格式的字符串转化为JS对象
// JSONBig.stringify()：把JS对象转化为JSON格式的字符串

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/', // 基础路径

  // 自定义后端返回的原始数据
  // data: 后端返回的原始数据，JSON格式的字符串
  transformResponse: [function (data) {
    try {
      return JSONBig.parse(data);
    } catch (err) {
      return data
    }
    // axios 默认会在内部这样处理后端返回的数据:
    // return JSON.parse(data)
  }]
})

// 请求拦截器(request是axios的实例)
request.interceptors.request.use(function(config) {
  // Do something before request is sent
  const { user } = store.state
  // 如果用户已登录，统一给接口设置 token 信息
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // 处理完之后一定要把 config 返回，否则请求就会停在这里
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 响应拦截器
export default request
