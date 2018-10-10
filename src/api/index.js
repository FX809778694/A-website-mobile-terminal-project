import axios from 'axios';
import qs from 'qs';
import Api from '../config';
import store from '../store';
import router from '../router'
import { cryptoOpt, formatDate } from "../common/js/util";
import {
  getItem,
  spliceToken
} from '../common/js/util'


const instance = axios.create({
  baseURL: Api.baseUrl,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
});


instance.interceptors.request.use(config => {
  const isLogin = /Login/.test(config.url)
  if (!isLogin) {
    const token = getItem("Token");
    config.headers.Authorization = `Bearer ${token}`
  }

  if (config.method === 'post') {
    // const User = getItem('User')

    // 登陆页、注册页不做拦截
    // if (config.url === 'User/Login' || config.url === 'User/Region') return config

    // User 信息不完善时重定向到登录页
    /*if (!config.data.Token) {
      router.push({
        name: 'Login'
      })

      return false
    }*/

    return config;
  }
  return config;
}, err => {
  return Promise.reject(err);
});

instance.interceptors.response.use(res => {
  const User = getItem('User');

  if (res.data.ErrorCode === 100 && (User && !User.client)) {
    router.push({
      name: 'Login'
    })
  } else if (res.data.ErrorCode === 100 && User && User.client) {
    router.push({
      name: 'NotFound'
    })
  }

  if (res.status != 200) {
    return Promise.reject(res);
  }
  return res;
}, err => {
  console.warn(err);
  return Promise.reject(err);
});

const postWrap = (url, params) => {
  return new Promise((resolve, reject) => {
    instance.post(url, params).then(({
      data
    }) => resolve(data)).catch(err => reject(err));
  })
}

const getUserInfo = () => {
  const User = getItem('User')

  if (User) {
    let {
      UserName,
      UserType
    } = User

    return {
      UserId: UserName,
      UserType
    }
  } else {
    return {
      login: false
    }
  }
}

/**
 * login
 * User/Login（POST）
 * @param {*}
 */
export const login = params => {
  const url = 'Home/Login';

  const timeStamps = formatDate(+new Date())
  const Defaults = {
    AppKey: 'zqzyApi',
    V: '1.0',
    Flag: true,
    ReqTime: timeStamps,
    ReqData: {
      LoginName: '',
      LoginPwd: ''
    }
  }
  Defaults.ReqData = Object.assign({}, Defaults.ReqData, params.ReqData);

  const DefaultsJson = JSON.stringify(Defaults)
  const encryptParams = cryptoOpt.Encrypt(DefaultsJson)

  return postWrap(url, encryptParams)
}

/**
 * 获取以及分类列表数据
 * Home/GetFirstClassify（POST）
 * @param null
 */
export const fetchCategoryApi = () => {
  const url = "Home/GetFirstClassify"

  return postWrap(url)
}


/**
 * 获取二级分类数据
 * Home/GetNextClassify（POST）
 * @param 参数对象
 */
export const fetchTwoCategoryApi = id => {
  const url = "Home/GetNextClassify"

  const timeStamps = formatDate(+new Date())
  const Defaults = {
    AppKey: 'zqzyApi',
    V: '1.0',
    Flag: true,
    ReqTime: timeStamps,
    ReqData: {
      firstClassifyID: id
    }
  }
  // console.log(Defaults)
  const DefaultsJson = JSON.stringify(Defaults)
  const encryptParams = cryptoOpt.Encrypt(DefaultsJson)

  return postWrap(url, encryptParams)
}

/**
 * ChangeZt  改变账套
 * User/Login（POST）
 * @param {*}
 */
export const ChangeZt = params => {
  const url = 'Home/ChangeZt';
  const timeStamps = formatDate(+new Date())
  const Defaults = {
    AppKey: 'zqzyApi',
    V: '1.0',
    Flag: true,
    ReqTime: timeStamps,
    ReqData: {
      UserID: '',
      ZtID: ''
    }
  }
  Defaults.ReqData = Object.assign({}, Defaults.ReqData, params.ReqData);

  const DefaultsJson = JSON.stringify(Defaults)
  const encryptParams = cryptoOpt.Encrypt(DefaultsJson)

  return postWrap(url, encryptParams)
}

/**
 * GetZT  获取账套
 * Home/GetZT（POST）
 * @param {*}
 */
export const GetZtList = params => {
  const url = 'Home/GetZT';
  const timeStamps = formatDate(+new Date())
  const Defaults = {
    AppKey: 'zqzyApi',
    V: '1.0',
    Flag: true,
    ReqTime: timeStamps,
    ReqData: {
      UserID: '',
    }
  }
  Defaults.ReqData = Object.assign({}, Defaults.ReqData, params.ReqData);

  const DefaultsJson = JSON.stringify(Defaults)
  const encryptParams = cryptoOpt.Encrypt(DefaultsJson)

  return postWrap(url, encryptParams)
}
/**
 * GetZT  获取默认选中的账套
 * Home/GetDefaultZt（POST）
 * @param {*}
 */
export const getDefaultZt = params => {
  const url = "Home/GetDefaultZt"
  const timeStamps = formatDate(+new Date())
  const Defaults = {
    AppKey: 'zqzyApi',
    V: '1.0',
    Flag: true,
    ReqTime: timeStamps,
    ReqData: {
      UserID: '',
    }
  }
  Defaults.ReqData = Object.assign({}, Defaults.ReqData, params.ReqData);

  const DefaultsJson = JSON.stringify(Defaults)
  const encryptParams = cryptoOpt.Encrypt(DefaultsJson)

  return postWrap(url, encryptParams)
}
/**
 * 获取首页的轮播图
 * Home/GetGoodsActivity（POST）
 * @param 参数对象
 */
export const fetchIndexAutoImg = params => {
  const url = "Home/GetGoodsActivity"
  const timeStamps = formatDate(+new Date())

  const Defaults = {
    AppKey: 'zqzyApi',
    V: '1.0',
    Flag: true,
    ReqTime: timeStamps,
    ReqData: {
      UserID: '',
    }
  }

  Defaults.ReqData = Object.assign({}, Defaults.ReqData, params.ReqData);

  const DefaultsJson = JSON.stringify(Defaults)
  const encryptParams = cryptoOpt.Encrypt(DefaultsJson)

  return postWrap(url, encryptParams)
}
/**
 * 获取首页的商品一级模块
 * Home/GetHomeModule（POST）
 * @param 参数对象
 */
export const fetchIndexShopModal = params => {
  const url = "Home/GetHomeModule"
  const timeStamps = formatDate(+new Date())

  const Defaults = {
    AppKey: 'zqzyApi',
    V: '1.0',
    Flag: true,
    ReqTime: timeStamps,
    ReqData: {
      UserID: '',
    }
  }

  Defaults.ReqData = Object.assign({}, Defaults.ReqData, params.ReqData);

  const DefaultsJson = JSON.stringify(Defaults)
  const encryptParams = cryptoOpt.Encrypt(DefaultsJson)

  return postWrap(url, encryptParams)
}
/**
 * 获取首页的商品一级模块下默认第一个二级模块的商品
 * 使用一级下的二级第一个ID
 * 模块和分类不一样
 * Goods/GetIndexGoods（POST）
 * @param 参数对象
 */
export const fetchTwoCategoryShop = params => {
  const url = "Goods/GetIndexGoods"
  const timeStamps = formatDate(+new Date())

  const Defaults = {
    AppKey: 'zqzyApi',
    V: '1.0',
    Flag: true,
    ReqTime: timeStamps,
    ReqData: {
      UserID: ''
    }
  }

  Defaults.ReqData = Object.assign({}, Defaults.ReqData, params.ReqData);

  const DefaultsJson = JSON.stringify(Defaults)
  const encryptParams = cryptoOpt.Encrypt(DefaultsJson)

  return postWrap(url, encryptParams)
}
/**
 * 获取详情的接口
 * Goods/GetGoodsDetail（POST）
 * @param 参数对象
 */
export const fetchBookDetail = params => {
  const url = "Goods/GetGoodsDetail"
  const timeStamps = formatDate(+new Date())

  const Defaults = {
    AppKey: 'zqzyApi',
    V: '1.0',
    Flag: true,
    ReqTime: timeStamps,
    ReqData: {
      UserID: '',
      GoodsId: ''
    }
  }

  Defaults.ReqData = Object.assign({}, Defaults.ReqData, params.ReqData);

  const DefaultsJson = JSON.stringify(Defaults)
  const encryptParams = cryptoOpt.Encrypt(DefaultsJson)

  return postWrap(url, encryptParams)
}
/**
 * 加入收藏
 * Goods/AddCollection（POST）
 * @param 参数对象
 */
export const addCollectionResourse = params => {
  const url = "Goods/AddCollection"
  const timeStamps = formatDate(+new Date())

  const Defaults = {
    AppKey: 'zqzyApi',
    V: '1.0',
    Flag: true,
    ReqTime: timeStamps,
    ReqData: {
      UserID: '',
      GoodsId: ''
    }
  }

  Defaults.ReqData = Object.assign({}, Defaults.ReqData, params.ReqData);

  const DefaultsJson = JSON.stringify(Defaults)
  const encryptParams = cryptoOpt.Encrypt(DefaultsJson)

  return postWrap(url, encryptParams)
}
/**
 * 获取收藏列表
 * Goods/GetCollectionList（POST）
 * @param 参数对象
 */
export const fetchCollectShop = params => {
  const url = "Goods/GetCollectionList"
  const timeStamps = formatDate(+new Date())

  const Defaults = {
    AppKey: 'zqzyApi',
    V: '1.0',
    Flag: true,
    ReqTime: timeStamps,
    ReqData: {
      UserID: '',
      Search: '',
      state: 0
    }
  }

  Defaults.ReqData = Object.assign({}, Defaults.ReqData, params.ReqData);

  const DefaultsJson = JSON.stringify(Defaults)
  const encryptParams = cryptoOpt.Encrypt(DefaultsJson)

  return postWrap(url, encryptParams)
}
/**
 * 获取足迹列表
 * Goods/GetMyFoot（POST）
 * @param 参数对象
 */
export const fetchFootShop = params => {
  const url = "Goods/GetMyFoot"
  const timeStamps = formatDate(+new Date())

  const Defaults = {
    AppKey: 'zqzyApi',
    V: '1.0',
    Flag: true,
    ReqTime: timeStamps,
    ReqData: {
      UserId: '',
      Search: '',
    }

  }

  Defaults.ReqData = Object.assign({}, Defaults.ReqData, params.ReqData)
  const DefaultsJson = JSON.stringify(Defaults)
  const encryptParams = cryptoOpt.Encrypt(DefaultsJson)
  return postWrap(url, encryptParams)

}
/**
 * 加入购物车
 * Goods/AddShop（POST）
 * @param 参数对象
 */
export const addShopCartApi = params => {
  const url = "Goods/AddShop"
  const timeStamps = formatDate(+new Date())

  const Defaults = {
    AppKey: 'zqzyApi',
    V: '1.0',
    Flag: true,
    ReqTime: timeStamps,
    ReqData: {
      UserId: '',
      GoodsId: '',
      GoodsCount: '',
      MerchatNo: ''
    }

  }

  Defaults.ReqData = Object.assign({}, Defaults.ReqData, params.ReqData)
  const DefaultsJson = JSON.stringify(Defaults)
  const encryptParams = cryptoOpt.Encrypt(DefaultsJson)
  return postWrap(url, encryptParams)
}
/**
 * 搜索接口
 * Goods/SearchGoods（POST）
 * @param 参数对象
 */
export const searchResource = params => {
  const url = "Goods/SearchGoods"
  const timeStamps = formatDate(+new Date())

  const Defaults = {
    AppKey: 'zqzyApi',
    V: '1.0',
    Flag: true,
    ReqTime: timeStamps,
    ReqData: {
      UserId: '',
      ZtId: 'All',
      Search: '',
      ClassifyId_I: '',
      ClassifyId_Next: ''
    }
  }

  Defaults.ReqData = Object.assign({}, Defaults.ReqData, params.ReqData)
  const DefaultsJson = JSON.stringify(Defaults)
  const encryptParams = cryptoOpt.Encrypt(DefaultsJson)
  return postWrap(url, encryptParams)
}
/**
 * 删除足迹
 * Goods/DelMyFoot（POST）
 * @param 参数对象
 */
export const deleteFootShopId = params => {
  const url = "Goods/DelMyFoot"

  const timeStamps = formatDate(+new Date())

  const Defaults = {
    AppKey: 'zqzyApi',
    V: '1.0',
    Flag: true,
    ReqTime: timeStamps,
    ReqData: {
      UserId: '',
      FootId: ''
    }
  }

  Defaults.ReqData = Object.assign({}, Defaults.ReqData, params.ReqData)
  const DefaultsJson = JSON.stringify(Defaults)
  const encryptParams = cryptoOpt.Encrypt(DefaultsJson)
  console.log(Defaults)
  return postWrap(url, encryptParams)
}
/**
 * 删除收藏
 * Goods/DelMyFoot（POST）
 * @param 参数对象
 */
export const deleteCollectShopId = params => {
  const url = "Goods/DelCollection"

  const timeStamps = formatDate(+new Date())

  const Defaults = {
    AppKey: 'zqzyApi',
    V: '1.0',
    Flag: true,
    ReqTime: timeStamps,
    ReqData: {
      UserId: '',
      CollectionId: ''
    }
  }

  Defaults.ReqData = Object.assign({}, Defaults.ReqData, params.ReqData)
  const DefaultsJson = JSON.stringify(Defaults)
  const encryptParams = cryptoOpt.Encrypt(DefaultsJson)
  console.log(Defaults)
  return postWrap(url, encryptParams)
}
/**
 * 获取购物车列表
 * Goods/GetShopList（POST）
 * @param 参数对象
 */
export const fetchCarShop = params => {
  const url = "Goods/GetShopList"
  const timeStamps = formatDate(+new Date())

  const Defaults = {
    AppKey: 'zqzyApi',
    V: '1.0',
    Flag: true,
    ReqTime: timeStamps,
    ReqData: {
      UserId: '',
      Search: '',
    }

  }

  Defaults.ReqData = Object.assign({}, Defaults.ReqData, params.ReqData)
  const DefaultsJson = JSON.stringify(Defaults)
  const encryptParams = cryptoOpt.Encrypt(DefaultsJson)
  return postWrap(url, encryptParams)

}
/**
 * 删除购物车的商品
 * Goods/DelShopGoods（POST）
 * @param 参数对象
 */
export const deleteShopCarId = params => {
  const url = "Goods/DelShopGoods"
  const timeStamps = formatDate(+new Date())

  const Defaults = {
    AppKey: 'zqzyApi',
    V: '1.0',
    Flag: true,
    ReqTime: timeStamps,
    ReqData: {
      UserId: '',
      ShopId: ''
    }
  }

  Defaults.ReqData = Object.assign({}, Defaults.ReqData, params.ReqData)
  const DefaultsJson = JSON.stringify(Defaults)
  const encryptParams = cryptoOpt.Encrypt(DefaultsJson)
  console.log(Defaults)
  return postWrap(url, encryptParams)
}
/**
 * 购物车商品 去结算接口
 * Goods/SetShopGoodsList（POST）
 * @param 参数对象
 */
export const SettlementShopApi = params => {
  const url = "Goods/SetShopGoodsList"
  const timeStamps = formatDate(+new Date())
  const Defaults = {
    AppKey: 'zqzyApi',
    V: '1.0',
    Flag: true,
    ReqTime: timeStamps,
    ReqData: params.ReqData
  }

  const DefaultsJson = JSON.stringify(Defaults)

  const encryptParams = cryptoOpt.Encrypt(DefaultsJson)
  console.log(DefaultsJson)
  return postWrap(url, encryptParams)
}
/**
 * 购物车商品 去结算接口
 * Goods/GetShopGoodsList（POST）
 * @param 参数对象
 */
export const GettlementShopApi = params => {
  const url = "Goods/GetShopGoodsList"
  const timeStamps = formatDate(+new Date())
  const Defaults = {
    AppKey: 'zqzyApi',
    V: '1.0',
    Flag: true,
    ReqTime: timeStamps,
    ReqData: params.ReqData
  }

  const DefaultsJson = JSON.stringify(Defaults)

  const encryptParams = cryptoOpt.Encrypt(DefaultsJson)
  console.log(DefaultsJson)
  return postWrap(url, encryptParams)
}
/**
 * 购物车商品 去结算接口
 * Goods/UploadGoodsCount（POST）
 * @param 参数对象
 */
export const editShopCarNum = params => {
  const url = "Goods/UploadGoodsCount"

  const timeStamps = formatDate(+new Date())
  const Defaults = {
    AppKey: 'zqzyApi',
    V: '1.0',
    Flag: true,
    ReqTime: timeStamps,
    ReqData: params.ReqData
  }

  const DefaultsJson = JSON.stringify(Defaults)

  const encryptParams = cryptoOpt.Encrypt(DefaultsJson)
  console.log(DefaultsJson)
  return postWrap(url, encryptParams)
}
/**
 * 获取地址列表
 * Goods/AddressList（POST）
 * @param 参数对象
 */
export const getAddressListApi = params => {
  const url = "Goods/AddressList"

  const timeStamps = formatDate(+new Date())
  const Defaults = {
    AppKey: 'zqzyApi',
    V: '1.0',
    Flag: true,
    ReqTime: timeStamps,
    ReqData: params.ReqData
  }

  const DefaultsJson = JSON.stringify(Defaults)

  const encryptParams = cryptoOpt.Encrypt(DefaultsJson)
  return postWrap(url, encryptParams)
}
/**
 * 单条删除收货地址
 * Goods/DelAddress（POST）
 * @param 参数对象
 */
export const deleteAddressListApi = params => {
  const url = "Goods/DelAddress"

  const timeStamps = formatDate(+new Date())
  const Defaults = {
    AppKey: 'zqzyApi',
    V: '1.0',
    Flag: true,
    ReqTime: timeStamps,
    ReqData: params.ReqData
  }

  const DefaultsJson = JSON.stringify(Defaults)

  const encryptParams = cryptoOpt.Encrypt(DefaultsJson)
  return postWrap(url, encryptParams)
}
/**
 * 新增收货地址
 * Goods/AddAddress（POST）
 * @param 参数对象
 */
export const addAddressApi = params => {
  const url = "Goods/AddAddress"
  const timeStamps = formatDate(+new Date())
  const Defaults = {
    AppKey: 'zqzyApi',
    V: '1.0',
    Flag: true,
    ReqTime: timeStamps,
    ReqData: params.ReqData
  }

  const DefaultsJson = JSON.stringify(Defaults)

  const encryptParams = cryptoOpt.Encrypt(DefaultsJson)
  return postWrap(url, encryptParams)
}


/**
 * 获取订单列表
 * GOrder/GetOrderList（POST）
 * @param 参数对象
 */
export const GetOrderList = params => {
  const url = "Order/GetOrderList"
  const timeStamps = formatDate(+new Date())
  const Defaults = {
    AppKey: 'zqzyApi',
    V: '1.0',
    Flag: true,
    ReqTime: timeStamps,
    ReqData: params.ReqData
  }

  const DefaultsJson = JSON.stringify(Defaults)

  const encryptParams = cryptoOpt.Encrypt(DefaultsJson)
  return postWrap(url, encryptParams)
}



/**
 *  购物金额验证是否需要发送验证码
 * Order/SmsSend（POST）
 * @param 参数对象
 */
export const GetMoneyLimit = params => {
  const url = "Order/GetMoneyLimit"
  const timeStamps = formatDate(+new Date())
  const Defaults = {
    AppKey: 'zqzyApi',
    V: '1.0',
    Flag: true,
    ReqTime: timeStamps,
    // ReqData: params.ReqData
  }

  const DefaultsJson = JSON.stringify(Defaults)

  const encryptParams = cryptoOpt.Encrypt(DefaultsJson)
  return postWrap(url, encryptParams)
}

/**
 *  发送短信
 * Order/SmsSend（POST）
 * @param 参数对象
 */
export const SmsSend = params => {
  const url = "Order/SmsSend"
  const timeStamps = formatDate(+new Date())
  const Defaults = {
    AppKey: 'zqzyApi',
    V: '1.0',
    Flag: true,
    ReqTime: timeStamps,
    ReqData: params.ReqData
  }

  const DefaultsJson = JSON.stringify(Defaults)

  const encryptParams = cryptoOpt.Encrypt(DefaultsJson)
  return postWrap(url, encryptParams)
}

/**
 *  短信验证
 * Order/VerifyingSMS
 * @param 参数对象
 */
export const VerifyingSMS = params => {
  const url = "Order/VerifyingSMS"
  const timeStamps = formatDate(+new Date())
  const Defaults = {
    AppKey: 'zqzyApi',
    V: '1.0',
    Flag: true,
    ReqTime: timeStamps,
    ReqData: params.ReqData
  }

  const DefaultsJson = JSON.stringify(Defaults)

  const encryptParams = cryptoOpt.Encrypt(DefaultsJson)
  return postWrap(url, encryptParams)
}

/**
 *  短信验证
 * Order/VerifyingSMS
 * @param 参数对象
 */
export const SubOrder = params => {
  const url = "Order/SubOrder"
  const timeStamps = formatDate(+new Date())
  const Defaults = {
    AppKey: 'zqzyApi',
    V: '1.0',
    Flag: true,
    ReqTime: timeStamps,
    ReqData: params.ReqData
  }

  const DefaultsJson = JSON.stringify(Defaults)

  const encryptParams = cryptoOpt.Encrypt(DefaultsJson)
  return postWrap(url, encryptParams)
}

/**
 * 获取退货单
 * Order/GetReturnOrderList（POST）
 * @param 参数对象
 */
export const getReturnListApi = params => {
  const url = "Order/GetReturnOrderList"
  const timeStamps = formatDate(+new Date())
  const Defaults = {
    AppKey: 'zqzyApi',
    V: '1.0',
    Flag: true,
    ReqTime: timeStamps,
    ReqData: params.ReqData
  }

  const DefaultsJson = JSON.stringify(Defaults)

  const encryptParams = cryptoOpt.Encrypt(DefaultsJson)
  return postWrap(url, encryptParams)
}
/**
 * 获取收货单列表
 * Order/GetReceiptOrderList（POST）
 * @param 参数对象
 */
export const getReceiptListApi = params => {
  const url = "Order/GetReceiptOrderList"

  const timeStamps = formatDate(+new Date())
  const Defaults = {
    AppKey: 'zqzyApi',
    V: '1.0',
    Flag: true,
    ReqTime: timeStamps,
    ReqData: params.ReqData
  }

  const DefaultsJson = JSON.stringify(Defaults)

  const encryptParams = cryptoOpt.Encrypt(DefaultsJson)
  return postWrap(url, encryptParams)
}

/**
 * 获取支付方式列表
 * /Order/GetSettlementStatus
 * @param 参数对象
 */
export const GetSettlementStatus = params => {
  const url = "/Order/GetSettlementStatus"
  const timeStamps = formatDate(+new Date())
  const Defaults = {
  }

  const DefaultsJson = JSON.stringify(Defaults)
  const encryptParams = cryptoOpt.Encrypt(DefaultsJson)
  return postWrap(url, encryptParams)
}
/**
 * 获取轮播图列表
 * /Goods/GetActivityGoods
 * @param 参数对象
 */
export const getBannerListApi = params => {
  const url = "/Goods/GetActivityGoods"
  const timeStamps = formatDate(+new Date())

  const Defaults = {
    AppKey: 'zqzyApi',
    V: '1.0',
    Flag: true,
    ReqTime: timeStamps,
    ReqData: {
      UserId: '',
      ActivitiesID: '',
    }

  }

  Defaults.ReqData = Object.assign({}, Defaults.ReqData, params.ReqData)
  const DefaultsJson = JSON.stringify(Defaults)
  const encryptParams = cryptoOpt.Encrypt(DefaultsJson)
  return postWrap(url, encryptParams)
}