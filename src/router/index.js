import Vue from 'vue'
import Router from 'vue-router'

const IndexPage = () =>
  import("@/pages/IndexPage").then(m => m.default)
const TwoLevelModule = () =>
  import("@/pages/TwoLevelModule").then(m => m.default)
const ThreeLevelModule = () =>
  import("@/pages/ThreeLevelModule").then(m => m.default)
const OneCategoryShopList = () =>
  import("@/pages/OneCategoryShopList").then(m => m.default)
const BookInfo = () =>
  import("@/pages/BookInfo").then(m => m.default)
const Login = () =>
  import("@/pages/Login").then(m => m.default)
const NotFound = () =>
  import("@/pages/404").then(m => m.default)
const CategoryList = () =>
  import("@/pages/CategoryList").then(m => m.default)
const ShopCart = () =>
  import("@/pages/ShopCart").then(m => m.default)
const CheckOrder = () =>
  import("@/pages/CheckOrder").then(m => m.default)
const OrderList = () =>
  import("@/pages/OrderList").then(m => m.default)
const OrderListNoTitle = () =>
  import("@/pages/OrderListNoTitle").then(m => m.default)
const AddAddress = () =>
  import("@/pages/AddAddress").then(m => m.default)
const MyAddress = () =>
  import("@/pages/MyAddress").then(m => m.default)
const MyCenter = () =>
  import("@/pages/MyCenter").then(m => m.default)
const MyCollect = () =>
  import("@/pages/MyCollect").then(m => m.default)
const MyFoot = () =>
  import("@/pages/MyFoot").then(m => m.default)
const SearchContent = () =>
  import("@/pages/SearchContent").then(m => m.default)

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [{
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/IndexPage',
    name: 'IndexPage',
    component: IndexPage,
  },
  {
    path: '/category',
    name: 'CategoryList',
    component: CategoryList,
  },
  {
    path: '/shopcart',
    name: 'ShopCart',
    component: ShopCart,
  },
  {
    path: '/bookInfo/:id',
    name: 'BookInfo',
    component: BookInfo
  },
  {
    path: '/mycollect',
    name: 'MyCollect',
    component: MyCollect
  },
  {
    path: '/myfoot',
    name: 'MyFoot',
    component: MyFoot
  },
  {
    path: '/addaddress',
    name: 'AddAddress',
    component: AddAddress
  },
  {
    path: '/myaddress/:type',
    name: 'MyAddress',
    component: MyAddress
  },
  {
    path: '/mycenter',
    name: 'MyCenter',
    component: MyCenter
  },
  {
    path: '/404',
    name: 'NotFound',
    component: NotFound,
  },
  {
    path: '/twolevelmodule/:id/:num',
    name: 'TwoLevelModule',
    component: TwoLevelModule
  },
  {
    path: '/threelevelmodule/:id',
    name: 'ThreeLevelModule',
    component: ThreeLevelModule
  },
    {
      path: '/OneCategoryShopList/:id',
      name: 'OneCategoryShopList',
      component: OneCategoryShopList
    },
  {
    path: '/checkorder/:index',
    name: "CheckOrder",
    component: CheckOrder
  },
  {
    path: '/orderlist/:num',
    name: "OrderList",
    component: OrderList
  },
  {
    path: '/orderlistnotitle',
    name: "OrderListNoTitle",
    component: OrderListNoTitle
  },
    {
      path: '/searchContent/:q',
      name: "SearchContent",
      component: SearchContent
    }
  ]
})
