
// 封装 axios 请求模块

import axios from 'axios'
// 在非组件模块中获取 store 必须通过这种方式
// 这里单独加载 store，和在组件中 this.$store 一个东西
import store from '@/store'
import JSONBig from 'json-bigint'
// JSONBig.parse()：把 JSON 格式的字符串转化为JS对象
// JSONBig.stringify()：把JS对象转化为JSON格式的字符串
import { Toast } from 'vant'
import router from '@/router/'

const refreshTokenReq = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn',
})
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
  }],
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
request.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, async function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  const status = error.response.status;
  if (status === 400) {
    // 客户端错误
    Toast.fail('客户端请求参数异常');
  } else if (status === 401) {
    // token 无效
    // user或者user.token不存在，跳转到登录页
    const { user } = store.state;
    if (!user || !user.token) {
      return redirectLogin();
    }
    // 使用refresh_token请求获取新的token
    try {
      const { data } = await refreshTokenReq({
        method: 'PUT',
        url: '/app/v1_0/authorizations',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      console.log(data);
      user.token = data.data.token;
      store.commit('setUser', user);
      // 使用 request 发送请求，从拦截器里访问token数据重新加载
      return request(error.config);
    } catch (err) {
      // 刷新token失败，跳转登陆页
      redirectLogin();
    }
  } else if (status === 403) {
    // 没有权限操作
    Toast.fail('没有权限操作');
  } else if (status >= 500) {
    // 服务器异常
    Toast.fail('服务器异常，请稍后重试');
  }
  // 抛出异常
  return Promise.reject(error);
});

function redirectLogin() {
  router.replace({
    name: 'Login',
    query: {
      // router.currentRoute等价于组件中的 this.$route
      redirect: router.currentRoute.fullPath
    }
  });
}
// 响应拦截器
export default request
