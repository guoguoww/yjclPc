import axios from 'axios'
import qs from 'qs'
import router from '@/router/index'
import Vue from 'vue'

  //自定义 axios 实例添加拦截器
  var instance = axios.create({
    baseURL: process.env.API_HOST,
    timeout: 30*1000,
    headers: {
      'Content-Type': 'application/json',
    },
    'withCredentials': true,
  });
  instance.defaults.withCredentials = true;

  // 添加请求拦截器
  instance.interceptors.request.use(

    config => {

      // 在发送请求之前做些什么
      const token = localStorage.getItem('_auth');

      if(token){
        config.headers.auth = token;
         // config.headers.authorization = token;
      }

      //在vue中使用axios Post请求时会遇到后台接收不到参数问题，因请求参数格式还是json的数据格式：
      //需要在请求传参之前将数据序列化后再传递到后台
      if(config.method == 'post' && config.headers['Content-Type'] == 'application/x-www-form-urlencoded'){
        config.data = qs.stringify(config.data);
      }

      return config;
    },
    err => {
      // 对请求错误做些什么
      return Promise.reject(err);
    });

  // 添加响应拦截器
  instance.interceptors.response.use(
    response => {
      // 对响应数据做点什么
      if (response.data.code) {
        Vue.prototype.$Notice.error({
          title: response.data.msg,
        });
      }
      if (response.data.code == 2) {
        Vue.prototype.$Message.error(response.data.msg)
        window.localStorage.removeItem('_auth');
        router.push('login')
      }
      return response;
    },
    err =>  {
      // 对响应错误做点什么

      if(err.response) {
        switch (err.response.status) {
          case 401:
            // 返回 401 清除token信息并跳转到登录页面
            localStorage.removeItem('_auth');
            router.replace({
              path: 'login',
              query: {redirect: router.history.current.fullPath}
            })
        }

      }

      return Promise.reject(err.response);
  });


  export default instance
