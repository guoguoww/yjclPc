// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index'
import axios from './axios'
import store from './store'


//引入公共头部
import pointBuyVue from '@/components/pointBuy/pointBuyVue';
Vue.use(pointBuyVue);
Vue.component('pointBuyVue', pointBuyVue); //初始化组件

import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.min.css';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import VCharts from 'v-charts'


import "../static/css/reset.css";
import "../static/css/icon/iconmoon.css";

Vue.use(VueAwesomeSwiper);
Vue.use(iView);
Vue.use(VCharts);



Vue.prototype.isWorkTime = function(){

    let time = new Date();
    let hour = time.getHours();
    let minute = time.getMinutes();
    let m = hour * 60 + minute;
    if (time.getDay() > 5) {
      return false;
    } else if ((m >= 9 * 60 + 30 && m <= 11 * 60 + 30) || (m >= 13 * 60 && m <= 15 * 60)) {
      return true;
    }
    return false;
}

Vue.prototype.configData = store.dispatch('fetchMsg')



Vue.config.productionTip = false
Vue.prototype.$axios = axios

Vue.filter('keepTwoNum', val => {//全局的保留两位小数方法

  val = Number(val);
  return val.toFixed(2);

})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
