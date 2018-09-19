<!--
 Created by Thomas on 2018/8/10.
 我的中心
 -->
<template>
  <div class="my-center">
    <div class="center-item-h">
      <div class="mine-order">
        <div class="order-top">
          <h3>我的订单</h3>
          <div class="order-top-r"  @click="$router.push({ name: 'OrderList', params: { num: '0'} })">
            <p>全部</p>
            <div class="order-top-img">
              <img src="../assets/jump.png" />
            </div>
          </div>
        </div>
        <div class="order-bottom">
          <div class="order-bottom-item"  @click="$router.push({ name: 'OrderList', params: { num: '1'} })">
            <div class="order-bottom-img">
              <img src="../assets/rectangle-1.png" />
            </div>
            <p>待审核</p>
          </div>
          <div class="order-bottom-item"  @click="$router.push({ name: 'OrderList', params: { num: '2'} })">
            <div class="order-bottom-img">
              <img src="../assets/rectangle-2.png" />
            </div>
            <p>已审核</p>
          </div>
          <div class="order-bottom-item"  @click="$router.push({ name: 'OrderList', params: { num: '3'} })">
            <div class="order-bottom-img">
              <img src="../assets/rectangle-3.png" />
            </div>
            <p>未通过</p>
          </div>
          <div class="order-bottom-item"  @click="$router.push({ name: 'OrderList', params: { num: '4'} })">
            <div class="order-bottom-img">
              <img src="../assets/rectangle-5.png" />
            </div>
            <p>退货</p>
          </div>
        </div>
      </div>
    </div>
    <div class="center-item" @click="$router.push({ name: 'OrderListNoTitle' })">
      <h3>收货订单</h3>
      <div class="center-item-arrow" >
        <img src="../assets/jump.png" />
      </div>
    </div>
    <div class="center-item" @click="$router.push({name : 'MyAddress', params:{ type: 'myCenter'}})">
      <h3>收货地址</h3>
      <div class="center-item-arrow">
        <img src="../assets/jump.png" />
      </div>
    </div>
    <div class="center-item" @click="$router.push({ name: 'MyCollect' })">
      <h3>我的收藏</h3>
      <div class="center-item-arrow">
        <img src="../assets/jump.png" />
      </div>
    </div>
    <div class="center-item" @click="$router.push({ name: 'MyFoot' })">
      <h3>我的足迹</h3>
      <div class="center-item-arrow">
        <img src="../assets/jump.png" />
      </div>
    </div>
    <div class="center-item" @click="showModal()">
      <h3>联系客服</h3>
      <div class="center-item-arrow">
        <img src="../assets/jump.png" />
      </div>
    </div>

    <!-- 联系客服弹框 -->
    <div v-transfer-dom>
      <x-dialog v-model="showToast" class="dialog-demo" hide-on-blur>
        <div class="cs-content">
          <div class="cs-head">
            <h3>联系客服</h3>
            <div class="cs-head-img" @click="showToast = false">
              <img src="../assets/close.png" />
            </div>
          </div>
          <div class="qq">
            <div class="qq-item">
              <div class="qq-item-img">
                <img src="../assets/customer-service.png" />
              </div>
              <a href="http://wpa.qq.com/msgrd?v=3&uin=2247594515&site=qq&menu=yes">客服一</a>
            </div>
            <div class="qq-item">
              <div class="qq-item-img">
                <img src="../assets/customer-service.png" />
              </div>
              <a href="http://wpa.qq.com/msgrd?v=3&uin=1142998184&site=qq&menu=yes">客服二</a>
            </div>
            <div class="qq-item">
              <div class="qq-item-img">
                <img src="../assets/customer-service.png" />
              </div>
              <a href="http://wpa.qq.com/msgrd?v=3&uin=1908286638&site=qq&menu=yes">客服三</a>
            </div>
          </div>
          <div class="phone">
            <div class="phone-l">
              <div class="phone-l-img">
                <img src="../assets/phone.png" />
              </div>
              <div class="phone-l-p">
                <p>0731-85695780</p>
                <p>0731-85695820</p>
              </div>
            </div>
            <div class="phone-r">
              <img src="../assets/tp.png" />
            </div>
          </div>
        </div>
        <div @click="showToast = false">
          <span class="vux-close"></span>
        </div>
      </x-dialog>
    </div>

    <footer-bar></footer-bar>
  </div>
</template>

<script>
  import FooterBar from "../components/Footer.vue";
  import { XSwitch, TransferDomDirective as TransferDom } from 'vux'
  import { globelFnHanle } from "@/common/js/mixin.js";

  export default {
    name: "MyCenter",
    components: {
      FooterBar
    },
    mixin: [globelFnHanle],
    data() {
      return {
        showToast: false,
      }
    },
    methods: {
      showModal() {
        this.showToast = true
      },
    }
  }
</script>

<style scoped lang="scss">

  .my-center{
    margin:  4vh 20px 0 20px;
    padding-bottom: 4vh;

    .center-item{
      &-h{
        border-radius: 5px;
        background-color: #ffffff;
        box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);

        .mine-order{
          padding: 10px;
        }
        .order-top{
          display: flex;
          justify-content: space-between;
          width: 100%;
          border-bottom: 2px solid #f7f7f7;
          height: 40px;
          & h3{
            line-height: 40px;
            font-size: 14px;
            font-weight: bold;
            color: #212128;
          }
          &-r{
            display: flex;
            justify-content: space-between;
            align-items: center;
            & p{
              font-size: 14px;
              color: #aaa;
              margin-right: 8px;
            }
          }
          &-img{
            width: 8px;
            height: 14px;
            & img{
              display: block;
              width: 100%;
              height: 100%;
            }
          }
        }
        .order-bottom{
          display: flex;
          justify-content: space-around;
          padding-top: 10px;

          &-item{
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            & p{
              font-size: 12px;
              color: #212128;
            }
          }

          &-img{
            width: 42px;
            height: 42px;
            & img{
              display: block;
              width: 100%;
              height: 100%;
            }
          }
        }
      }

      border-radius: 5px;
      background-color: #ffffff;
      box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 44px;
      padding: 0 10px;
      margin-top: 4vh;
      & h3{
        font-size: 14px;
        color: #212128;
      }
      &-arrow{
        width: 8px;
        height: 14px;
        & img{
          display: block;
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  /* 客服 */
  .cs-content{
    padding: 20px;
    .cs-head{
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      & h3{
        font-size: 16px;
        color: #212128;
      }
      &-img{
        width: 15px;
        height: 15px;
        & img{
          display: block;
          width: 100%;
          height: 100%;
        }
      }
    }
    .qq{
      margin-top: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &-item{
        display: flex;
        justify-content: space-between;
        align-items: center;
        &-img{
          width: 18px;
          height: 18px;
          margin-right: 10px;
          & img{
            display: block;
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .phone{
      display: flex;
      justify-content: space-around;
      margin-top: 40px;
      &-l{
        display: flex;
        justify-content: flex-start;
        &-img{
          width: 18px;
          height: 18px;
          margin-right: 10px;
          & img{
            width: 100%;
            height: 100%;
            display: block;
          }
        }
        &-p{
          & p{
            font-size: 14px;
            color: #212128;
          }
          & p:last-child{
            margin-top: 20px;
          }
        }
      }
      &-r{
        width: 95px;
        height: 143px;
        & img{
          display: block;
          width: 100%;
          height: 100%;
        }
      }
    }
  }

</style>