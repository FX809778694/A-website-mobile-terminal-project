// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import App from './App'
import router from './router'
import store from './store'
import VueLazyload from 'vue-lazyload'
import {
  getItem
} from './common/js/util'
import 'babel-polyfill'

import wcSwiper from 'wc-swiper'
import 'wc-swiper/style.css'
Vue.use(wcSwiper);

import {
  Loading,
  Flexbox,
  FlexboxItem,
  Swiper,
  SwiperItem,
  XHeader,
  Tabbar,
  TabbarItem,
  Search,
  XButton,
  XTextarea,
  Checker,
  CheckerItem,
  Tab,
  TabItem,
  Sticky,
  CheckIcon,
  Toast,
  Group,
  Cell,
  Badge,
  ConfirmPlugin,
  XInput,
  Drawer,
  Selector,
  DatetimePlugin,
  InlineXNumber,
  Scroller,
  XAddress,
  XDialog,
  ToastPlugin,
} from 'vux'

FastClick.attach(document.body)

Vue.component('loading', Loading)
Vue.component('flexbox', Flexbox)
Vue.component('flexbox-item', FlexboxItem)
Vue.component('swiper', Swiper)
Vue.component('swiper-item', SwiperItem)
Vue.component('x-header', XHeader)
Vue.component('tabbar', Tabbar)
Vue.component('tabbar-item', TabbarItem)
Vue.component('search', Search)
Vue.component('x-button', XButton)
Vue.component('x-textarea', XTextarea)
Vue.component('tab', Tab)
Vue.component('tab-item', TabItem)
Vue.component('sticky', Sticky)
Vue.component('check-icon', CheckIcon)
Vue.component('toast', Toast)
Vue.component('group', Group)
Vue.component('cell', Cell)
Vue.component('badge', Badge)
Vue.component('x-input', XInput)
Vue.component('drawer', Drawer)
Vue.component('selector', Selector)
Vue.component('scroller', Scroller)
Vue.component('inline-x-number', InlineXNumber)
Vue.component('checker', Checker)
Vue.component('checker-item', CheckerItem)
Vue.component('x-address', XAddress)
Vue.component('x-dialog', XDialog)

import 'swiper/dist/css/swiper.css'
//（如果使用的是2.6.0以上的版本需要自己手动去加载css）
import VueAwesomeSwiper from 'vue-awesome-swiper'
Vue.use(VueAwesomeSwiper)

Vue.use(DatetimePlugin)
Vue.use(ConfirmPlugin)
Vue.use(ToastPlugin)

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: './../static/no-book.png',
  loading: './../static/loading.gif',
  attempt: 1
})

Vue.config.productionTip = false


// simple history management
const history = window.sessionStorage
history.clear()
let historyCount = history.getItem('count') * 1 || 0
history.setItem('/', 0)
let isPush = false
let endTime = Date.now()
let methods = ['push', 'go', 'replace', 'forward', 'back']

document.addEventListener('touchend', () => {
  endTime = Date.now()
})
methods.forEach(key => {
  let method = router[key].bind(router)
  router[key] = function (...args) {
    isPush = true
    method.apply(null, args)
  }
})

router.beforeEach(function (to, from, next) {
  store.commit('setLoading', true)

  const isLogin = to.meta && to.meta.isLogin;
  const isDetail = to.meta && to.meta.isDetail;
  const title = to.meta && to.meta.title;
  store.commit('setLogin', !!isLogin)
  store.commit('setDetail', !!isDetail)
  store.commit('setTitle', title ? title : '')

  // const User = getItem('User')

  // if (to.fullPath === '/protocol') next()

  /* if (!User && to.fullPath !== '/') {
    next('/')
  } */

  const toIndex = history.getItem(to.path)
  const fromIndex = history.getItem(from.path)

  if (toIndex) {
    if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
      store.commit('updateDirection', 'forward')
    } else {
      // 判断是否是ios左滑返回
      if (!isPush && (Date.now() - endTime) < 377) {
        store.commit('updateDirection', '')
      } else {
        store.commit('updateDirection', 'reverse')
      }
    }
  } else {
    ++historyCount
    history.setItem('count', historyCount)
    to.path !== '/' && history.setItem(to.path, historyCount)
    store.commit('updateDirection', 'forward')
  }

  if (/\/http/.test(to.path)) {
    let url = to.path.split('http')[1]
    window.location.href = `http${url}`
  } else if (/\/www/.test(to.path)) {
    let url = to.path.split('www')[1]
    window.location.href = `http://www${url}`
  } else {
    next()
  }
})

router.afterEach(function (to) {
  setTimeout(() => {
    store.commit('setLoading', false)
  }, 500);

  isPush = false
})

/* eslint-disable no-new */
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app-box')
