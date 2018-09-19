import {
  md5
} from 'vux'

const Crypto = require("crypto-js/core");
const AES = require("crypto-js/aes");

/**
 * AES加密、解密
 */
export const cryptoOpt = {
  _KEY: "12345678900000001234567890000000", //32位
  _IV: "1234567890000000", //16位
  /**************************************************************
   *字符串加密
   *   str：需要加密的字符串
   ****************************************************************/
  Encrypt: function(str) {
    var key = Crypto.enc.Utf8.parse(this._KEY);
    var iv = Crypto.enc.Utf8.parse(this._IV);

    var encrypted = "";

    var srcs = Crypto.enc.Utf8.parse(str);
    encrypted = AES.encrypt(srcs, key, {
      iv: iv,
      mode: Crypto.mode.CBC,
      padding: Crypto.pad.Pkcs7
    });

    return encrypted.ciphertext.toString();
  },

  /**************************************************************
   *字符串解密
   *   str：需要解密的字符串
   ****************************************************************/
  Decrypt: function(str) {
    var key = Crypto.enc.Utf8.parse(this._KEY);
    var iv = Crypto.enc.Utf8.parse(this._IV);
    var encryptedHexStr = Crypto.enc.Hex.parse(str);
    var srcs = Crypto.enc.Base64.stringify(encryptedHexStr);
    var decrypt = AES.decrypt(srcs, key, {
      iv: iv,
      mode: Crypto.mode.CBC,
      padding: Crypto.pad.Pkcs7
    });
    var decryptedStr = decrypt.toString(Crypto.enc.Utf8);
    return decryptedStr.toString();
  }
};
/* 时间戳 */
export const formatDate = (time) => {
  let date = new Date(time);
  let year = date.getFullYear(),
      month = date.getMonth() + 1, //月份是从0开始的
      day = date.getDate(),
      hour = date.getHours(),
      min = date.getMinutes(),
      sec = date.getSeconds();
  let newTime = `${year}-${month}-${day} ${hour}:${min}:${sec}`;

  return newTime
}


export const setItem = (name, val) => {
  val = JSON.stringify(val);

  return window.localStorage.setItem(name, val);
}
export const getItem = name => {
  name = window.localStorage.getItem(name);
  name = JSON.parse(name);

  return name
};
export const removeItem = opt => window.localStorage.removeItem(opt);

export const getRect = function(el) {
  if (el instanceof window.SVGElement) {
    let rect = el.getBoundingClientRect()
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    }
  } else {
    return {
      top: el.offsetTop,
      left: el.offsetLeft,
      width: el.offsetWidth,
      height: el.offsetHeight
    }
  }
}

/**
 * 拼接 token
 */
export const spliceToken = function(timeStamps) {
  let User = getItem('User')

  if (User) {
    let {
      UserName,
      UserType,
      Token
    } = User

    UserType = UserType.toLowerCase()

    const result = md5(UserName + UserType + timeStamps + Token);

    return result
  } else {
    return ''
  }
}

/**
 * 运动函数
 */
export const ease = {
  // easeOutQuint
  swipe: {
    style: 'cubic-bezier(0.23, 1, 0.32, 1)',
    fn: function(t) {
      return 1 + (--t * t * t * t * t)
    }
  },
  // easeOutQuard
  swipeBounce: {
    style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    fn: function(t) {
      return t * (2 - t)
    }
  },
  // easeOutQuart
  bounce: {
    style: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
    fn: function(t) {
      return 1 - (--t * t * t * t)
    }
  }
}

//分类页数据整合
export const dataHandle = (data, sign) => {
  let newData = []
  data.map(item =>{
    newData.push({
      name: item.FXFLMC,
      id: item.FXFLID,
      ChildrenList: sign ? item.ChildrenList : ''
    })
  })


  return newData
}
// 整数加.00
export const addFloat = (num) => {
  num += '';
  num = num.replace(/[^0-9|\.]/g, ''); //清除字符串中的非数字非.字符

  if(/^0+/) //清除字符串开头的0
    num = num.replace(/^0+/, '');
  if(!/\./.test(num)) //为整数字符串在末尾添加.00
    num += '.00';
  if(/^\./.test(num)) //字符以.开头时,在开头添加0
    num = '0' + num;
  num += '00';        //在字符串末尾补零
  num = num.match(/\d+\.\d{2}/)[0];
  return num
}

//获取精确的计算
//加
export const add = function(a, b) {
  var c, d, e;
  try {
    c = a.toString().split(".")[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split(".")[1].length;
  } catch (f) {
    d = 0;
  }
  return e = Math.pow(10, Math.max(c, d)), (mul(a, e) + mul(b, e)) / e;
}
//乘
export const mul = function(a, b) {
  var c = 0;
  var e, d;
    d = a.toString();
    e = b.toString();
  try {
    c += d.split(".")[1].length;
  } catch (f) {}
  try {
    c += e.split(".")[1].length;
  } catch (f) {}
  return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}
//减
export const sub = function(a, b) {
  var c, d, e;
  try {
    c = a.toString().split(".")[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split(".")[1].length;
  } catch (f) {
    d = 0;
  }
  return e = Math.pow(10, Math.max(c, d)), (mul(a, e) - mul(b, e)) / e;

}
//除
export const div = function(a, b) {
  var c, d, e = 0,
    f = 0;
  try {
    e = a.toString().split(".")[1].length;
  } catch (g) {}
  try {
    f = b.toString().split(".")[1].length;
  } catch (g) {}
  return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math.pow(10, f - e));
}