<template>
  <div class="index-container">
    <h3 class="checkorder-title">
      核对订单
      <b @click="$router.go(-1)"></b>
    </h3>
    <div class="location-message" v-if="!noAddress" @click="$router.push({name : 'MyAddress', params:{ type: 'checkOrder'}})">
      <div class="receiver-message">
        <span class="receiver-name">{{addressList[addressIndex].LXR}}</span>
        <span class="receiver-phone">{{addressList[addressIndex].LXDH}}</span>
        <div class="location-detail">
          {{addressList[addressIndex].SHDZ}}
        </div>
      </div>
      <b></b>
    </div>
    <div class="location-message" v-if="noAddress" @click="$router.push({name : 'MyAddress' })">
      <div class="receiver-message" style="padding-left:40px;">
        <b class="add-pic"></b>
        <h3>新增收货地址</h3>
      </div>
      <b></b>
    </div>
    <div class="title-tip">
      <div>
        华翰公司
      </div>
      <ul class="goods-lists">
        <li v-for="(item, index) in shopList">
          <div class="left-aside">
            <img :src=item.uploadTime alt="">
          </div>
          <div class="right-aside">
            <h4>{{item.goodsName}}</h4>
            <p>
              <span>颜色:{{item.colorValue}}</span>
              <span>数量 {{item.count}}</span>
            </p>
            <p>
              <span>账号 :{{item.KHID}}</span>
            </p>
          </div>
          <span class="price">￥{{item.price}}</span>
        </li>
      </ul>
    </div>
    <div class="operation">
      <group title="">
        <popup-picker :title="title1" :data="list1" v-model="value1"></popup-picker>
      </group>
      <group title="">
        <popup-picker :title="title2" :data="list2" v-model="value2"></popup-picker>
      </group>
      <group title="">
        <datetime title="最迟到货时间" v-model="date"></datetime>
      </group>
      <group title="">
        <x-input title="" v-model="tipContent" type="text" label-width="4em" placeholder="请输入备注" placeholder-align="left" class="search-input">
        </x-input>
      </group>
      <group>
        <x-input title="发送验证码" class="weui-vcode" size="mini" v-if="isLarge" v-model="phoneMsg">
          <x-button slot="right" type="primary" mini v-if="!isSend" @click.native="sendMessage">发送验证码</x-button>
          <x-button slot="right" type="default" mini v-if="isSend" :disabled="disabled">{{ time + "s" }}</x-button>
        </x-input>
      </group>
    </div>
    <footer>
      <span>合计: ¥{{amount}}</span>
      <button @click="confirm">确认提交</button>
    </footer>
  </div>
</template>

<script>
import {
  getAddressListApi,
  GettlementShopApi,
  GetMoneyLimit,
  SmsSend,
  VerifyingSMS,
  SubOrder,
  GetSettlementStatus
} from "../api/index";
import { getItem, addFloat, add, mul } from "@/common/js/util";
import { Datetime, PopupPicker } from "vux";
import { globelFnHanle } from "@/common/js/mixin.js";
import { setInterval } from "timers";
import moment from "moment";
export default {
  name: "",
  mixin: [globelFnHanle],
  data() {
    return {
      getType: "发货方式",
      noAddress: null,
      showModal: false,
      isLarge: false,
      goodsTypeContent: "发货要补",
      payTypeContent: "现金",
      date: moment().add('days',7).format('YYYY-MM-DD'),
      form: {},
      title1: "发货方式",
      value1: ["发货要补"],
      list1: [["发货要补", "发货不补", "发一次", "满足发货", "满足不补"]],
      title2: "结算方式",
      value2: ["现金"],
      data:[],
      data2:[],
      list2: [],
      title3: "手机机型",
      value3: ["小米"],
      list3: [["小米", "iPhone", "华为", "情怀", "三星", "其他", "不告诉你"]],
      tipContent: "",
      time: 5,
      isSend: false,
      disabled: true,
      limitMoney: null,
      amount: null,
      phoneMsg: null,
      addressList: [],
      addressIndex: 0,
      shopList: []
    };
  },
  components: {
    Datetime,
    PopupPicker
  },
  created() {
    this.addressIndex = this.$route.params.index
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      let params = {
        ReqData: {
          UserID: getItem("User").UserId
        }
      };
      GetSettlementStatus()
        .then(this.globelReqHandle)
        .then(res => {
          res.Results.map(x=>{
            this.data.push(x.JSFSMC)
            this.data2.push(x);
          })
          this.list2.push(this.data);
        })
        .catch(this.globelErrHandle);
      getAddressListApi(params)
        .then(this.globelReqHandle)
        .then(res => {
          let dataArray = []
          res.Results.map(item => {
            dataArray.push(Object.assign(item[0], item[1]))
          })
          this.addressList = dataArray
        })
        .catch(this.globelErrHandle);
      GettlementShopApi(params)
        .then(this.globelReqHandle)
        .then(res => {
          this.shopList = res.Results;
          GetMoneyLimit()
            .then(this.globelReqHandle)
            .then(res => {
              this.limitMoney = res.Result.VALUE;
              let amount = 0;
              this.shopList.map(x => {
                amount += mul(Number(x.count), Number(x.price));
              });
              this.amount = addFloat(amount);
              if (Number(this.amount) > Number(this.limitMoney)) {
                this.isLarge = true;
              }
            })
            .catch(this.globelErrHandle);
        })
        .catch(this.globelErrHandle);
    },
    confirm() {
      var SettlementMode
      this.data2.map(x=>{
        if(x.JSFSMC==this.value2[0]){
          SettlementMode=x.JSFSID;
         }
      })
      if (this.isLarge) {
        let params = {
          ReqData: {
            UserID: getItem("User").UserId,
            Number: this.phoneMsg
          }
        };
        VerifyingSMS(params)
          .then(this.globelReqHandle)
          .then(res => {
            if (res.Message === "成功") {
              const params1 = {
                ReqData: {
                  UserID: getItem("User").UserId,
                  AddressID: this.addressList[this.addressIndex].SHDZID,
                  Remark: this.tipContent,
                  SettlementMode,
                  SendMode: this.value1[0],
                  EndTime: this.date
                }
              };
              SubOrder(params1)
                .then(this.globelReqHandle)
                .then(res => {
                  if(res.Message === "成功") {
                    this.$router.push({ name: 'OrderList', params: { num: '0'} })
                  }
                })
                .catch(this.globelErrHandle);
            } else {
              this.$vux.toast.show({
                text: "验证码不正确",
                type: "warn"
              });
            }
          })
          .catch(this.globelErrHandle);
      } else {
        const params1 = {
          ReqData: {
            UserID: getItem("User").UserId,
            AddressID: this.addressList[this.addressIndex].SHDZID,
            Remark: this.tipContent,
            SettlementMode,
            SendMode: this.value1[0],
            EndTime: this.date
          }
        };
        SubOrder(params1)
          .then(this.globelReqHandle)
          .then(res => {
            if(res.Message === "成功") {
              this.$router.push({ name: 'OrderList', params: { num: '0'} })
            }
          })
          .catch(this.globelErrHandle);
      }
    },
    sendMessage() {
      this.isSend = true;
      let interval = window.setInterval(() => {
        if (this.time-- <= 0) {
          this.time = 5;
          this.isSend = false;
          window.clearInterval(interval);
        }
      }, 1000);
      const params = {
        ReqData: {
          UserID: getItem("User").UserId
        }
      };
      SmsSend(params)
        .then(this.globelReqHandle)
        .then(res => {

        })
        .catch(this.globelErrHandle);
    }
  },
  computed: {}
};
</script>


<style lang="scss" scoped>
li {
  list-style: none;
}
.checkorder-title {
  font-weight: 600;
  font-size: 16px;
  font-family: PingFangSC;
  color: #212128;
  text-align: center;
  position: relative;
  margin-top: 12px;
  b {
    width: 12px;
    height: 20px;
    background: url(../assets/returnb.png);
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    left: 10px;
    background-size: 100% 100%;
  }
}
.location-message {
  height: 74px;
  width: 100%;
  border-radius: 5px;
  margin-top: 30px;
  display: flex;
  align-items: center;
  background-color: #ffffff;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  .receiver-message {
    padding-left: 5%;
    font-size: 14px;
    font-weight: 500;
    position: relative;
    .add-pic {
      position: absolute;
      width: 14px;
      height: 14px;
      background: url(../assets/shape.png);
      background-size: 100% 100%;
      top: 50%;
      left: 10%;
      transform: translate(0, -50%);
    }
    .location-detail {
      font-size: 12px;
    }
  }
  b {
    position: absolute;
    width: 100%;
    height: 5px;
    bottom: 0;
    left: 0;
    background: url(../assets/address.png);
    background-size: 100% 100%;
  }
}
.title-tip {
  width: 100%;
  margin-top: 30px;
  font-size: 14px;
  font-weight: 600;
  ul {
    margin-top: 20px;
    li {
      display: flex;
      align-items: center;
      box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
      margin-top: 30px;
      border-radius: 5px;
      position: relative;
      .price {
        position: absolute;
        bottom: 4px;
        right: 10px;
        color: #f43543;
      }
    }
    .left-aside,
    .right-aside {
      float: left;
    }
    .left-aside {
      margin-right: 5%;
      height: 72px;
      width: 72px;
      img {
        width: 72px;
        height: 72px;
      }
    }
    .right-aside {
      h4 {
        font-size: 14px;
        letter-spacing: 0.2px;
        color: #000;
        font-family: SFProDisplay;
      }
      span {
        font-size: 10px;
        color: #aaaaaa;
        font-family: PingFangSC;
      }
    }
  }
}
footer {
  height: 48px;
  background: #fff;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  padding-left: 20px;
  line-height: 48px;
  button {
    height: 48px;
    float: right;
    border: none;
    width: 29%;
    background-color: #f43543;
    color: #fff;
    font-size: 14px;
  }
}
.weui-cells {
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1) !important;
  font-size: 12px !important;
}
</style>

