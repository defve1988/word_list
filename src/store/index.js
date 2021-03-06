import Vue from 'vue'
import Vuex from 'vuex'
import app_data from './modules/app_data'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app_data,
  }
})
