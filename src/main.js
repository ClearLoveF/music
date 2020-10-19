// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vant from 'vant'
import 'vant/lib/index.css'
import http from '@/utils/request.js'
import store from '@/store/index'
import VueLazyLoad from 'vue-lazyload'



Vue.use(VueLazyLoad,{
    preLoad: 1.3,
    error:'./static/error.png',
    loading:'./static/loading.png',
    attempt: 1
})





Vue.config.productionTip = false
Vue.prototype.$http = http

// Vue.use(Vuex)
Vue.use(Vant)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
