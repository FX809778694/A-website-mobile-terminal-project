import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
  loading: false,
  // 全局错误提示
  errorMsg: '',
  // 全局错误提示状态
  isRequestErr: false,
  bookId: '',
  isLogin: false,
  isDetail: false,
  demoTitle: '',
  // 图书类别代码
  code: '',
  // 图书类别名称
  codeName: '',
  direction: '',
  prevDemo: '',
  tabbarIndex: 0
}

export default new Vuex.Store({
  state,
  mutations
})
