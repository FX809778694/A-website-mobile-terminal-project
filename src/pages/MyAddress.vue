<!--
 Created by Thomas on 2018/8/10.
 我的地址
 -->
<template>
  <div class="my-address">
    <div class="my-address-head">
      <div class="address-head-return" @click="back()">
        <img src="../assets/address-return.png" />
      </div>
      <h3>我的地址</h3>
      <div class="address-head-add" @click="$router.push({ name: 'AddAddress' })">
        <img src="../assets/address-add.png" />
      </div>
    </div>
    <div class="my-address-content">
      <div class="address-item" v-for="(item, index) in address" :key="index">
        <div class="item-l" @click="selectAddress(index)">
          <h3>收件人&nbsp;&nbsp; {{item.LXR}}</h3>
          <p>{{item.SHDZ}}</p>
        </div>
        <div class="item-r" @click="deleteAddressId(item.SHDZID)">
          <img src="../assets/delete.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { globelFnHanle } from "@/common/js/mixin.js";
  import { getAddressListApi, deleteAddressListApi } from "../api";
  import { getItem } from "../common/js/util";

  export default {
    name: "MyAddress",
    data() {
      return {
        address: []
      }
    },
    mixin: [globelFnHanle],
    created() {
      this.getAddressList()
    },
    methods: {
      back() {
        this.$router.back()
      },
      getAddressList() {

        let params = {
          ReqData: {
            UserID: getItem("User").UserId
          }
        }
        getAddressListApi(params)
          .then(this.globelReqHandle)
          .then(res => {
            let dataArray = []
            res.Results.map(item => {
              dataArray.push(Object.assign(item[0], item[1]))
            })
            this.address = dataArray
          })
          .catch(this.globelErrHandle)
      },
      deleteAddressId(id) {
        let params = {
          ReqData: {
            UserID: getItem("User").UserId,
            AddressId: id
          }
        }

        deleteAddressListApi(params)
          .then(this.globelReqHandle)
          .then(res => {
            if(res.Code===200) {
              this.$vux.toast.show({
                text: '删除成功',
              })
              this.getAddressList()
            }
          })
          .catch(this.globelErrHandle)
      },
      selectAddress(index) {
        if(this.$route.params.type==="checkOrder"){
          this.$router.push({
            name: 'CheckOrder',
            params: {index: index}
          })
        }
      }
    }
  }
</script>

<style scoped lang="scss">


  .my-address{

    &-head{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 2vh 20px 0 20px;
      & h3{
        font-size: 16px;
        color: #212128;
        font-weight: bold;
      }
    }
    .address-head{

      &-return{
        width: 12px;
        height: 20px;
        & img{
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      &-add{
        width: 16px;
        height: 16px;
        & img{
          display: block;
          width: 100%;
          height: 100%;
        }
      }
    }

    &-content{
      margin: 4vh 20px 0 20px;
      padding-bottom: 40px;
      .address-item{
        background-color: #ffffff;
        box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 20px;
        margin-top: 4vh;
        .item-l{
          color: #212128;
          & h3{
            font-size: 14px;
            font-weight: bold;
          }
          & p{
            font-size: 12px;
          }
        }
        .item-r{
          width: 14px;
          height: 18px;
          & img{
            display: block;
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
</style>