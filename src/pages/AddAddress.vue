<!--
 Created by Thomas on 2018/8/10.
 新增地址
 -->
<template>
  <div class="add-address">
    <div class="address-head">
      <div class="address-head-return" @click="back()">
        <img src="../assets/address-return.png" />
      </div>
      <h3>新增地址</h3>
    </div>
    <div class="address-content">
      <div class="address-item">
        <x-input title="姓名：" v-model="name" name="username" placeholder="请输入姓名" is-type="china-name"></x-input>
      </div>
      <div class="address-item">
        <x-input title="手机号：" mask="999 9999 9999" v-model="maskValue" :max="13" is-type="china-mobile"></x-input>
      </div>
      <div class="address-item">
        <x-address
          @on-hide="logHide"
          @on-show="logShow"
          :title="title"
          v-model="value"
          :list="addressData"
          @on-shadow-change="onShadowChange"
          placeholder="请选择地址"
          inline-desc=""
          :show.sync="showAddress"
        >
        </x-address>
      </div>
      <div class="address-item">
        <x-input title="详细地址：" v-model="fullAddress" placeholder="请输入小区楼号" ></x-input>
      </div>
    </div>
    <!-- 确定按钮 两种情况 -->
    <div class="address-btn">
      <x-button
        @click.native="addAddress"
        class="btn-address"
        style="border-radius: 5px;"
      >确定</x-button>
    </div>
  </div>
</template>

<script>
import { ChinaAddressV4Data } from 'vux'
import { globelFnHanle } from "@/common/js/mixin.js";
import { getItem } from "../common/js/util";
import { addAddressApi } from "../api/index"

  export default {
    name: "AddAddress",
    mixin: [globelFnHanle],
    data() {
      return {
        maskValue: '',
        addressData: ChinaAddressV4Data,
        value: [],
        showAddress: false,
        title: "所在区域",
        name: '',
        address: '',
        fullAddress: ''
      }
    },
    methods: {
      back() {
        this.$router.back()
      },
      doShowAddress () {
        this.showAddress = true
        setTimeout(() => {
          this.showAddress = false
        }, 2000)
      },
      onShadowChange (ids, names) {
        this.address = names.join("")
      },
      logHide (str) {

      },
      logShow (str) {

      },
      addAddress() {
        let params = {
          ReqData: {
            UserID: getItem("User").UserId,
            Contacts: this.name,
            Model: this.maskValue,
            Address: `${this.address}${this.fullAddress}`
          }
        }
        addAddressApi(params)
          .then(this.globelReqHandle)
          .then(res => {
            if(res.Code===200) {
              this.$vux.toast.show({
                text: '操作成功',
              })
            }
          })
          .catch(this.globelErrHandle)
      }
    }
  }
</script>

<style scoped lang="scss">

  .weui-btn_default:not(.weui-btn_disabled):active{
    background-color: #d4dbe3!important;
  }

  .address{
    &-head{
      display: flex;
      justify-content: flex-start;
      margin: 2vh 20px 0 20px;
      &-return{
        width: 12px;
        height: 20px;
        & img{
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      & h3{
        font-size: 16px;
        color: #212128;
        font-weight: bold;
        margin-left: 34vw;
      }
    }

    &-content{
      margin: 2vh 20px 0 20px;
      border-radius: 5px;
      background-color: #ffffff;
      box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
      padding-bottom: 6vh;
    }

    &-btn{
      width: 90%;
      height: 52px;
      margin: 4vh 20px 0 20px;
      text-align: center;
      line-height: 52px;
      .btn-address{
        width: 100%;
        height: 6.897vh;
        font-family: PingFangSC;
        font-size: 18px;
        font-weight: normal !important;
        text-align: center;
        line-height: 2;
        letter-spacing: 0.5px;
        margin-top: 14vh;
        color: #fff;
        border-radius: 15px;
        background-color: #d7161e;
        box-shadow: 0 5px 15px 0 rgba(215, 22, 30, 0.3);
      }
    }
  }

</style>