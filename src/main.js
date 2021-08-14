import Vue from 'vue'
import App from './App.vue'
import './firebase'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

import axios from 'axios'
// NOTE: as a proxy is used, the baseURL is still 'http://localhost:8080'
var env = 'loacl';
export const base = axios.create({
  // baseURL: 'http://localhost:8080'
  baseURL: env === 'loacl' ? 'http://127.0.0.1:5000' : 'https://defve-app-backend.herokuapp.com'
});
Vue.prototype.$http = base;
Vue.prototype.$axios = axios;

Vue.config.productionTip = false

import my_component from './components/index'
Vue.use(my_component)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')