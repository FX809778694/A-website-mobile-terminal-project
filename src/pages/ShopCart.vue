<!--
 Created by Thomas on 2018/8/8.
 购物车组件
 -->
<template>
  <div>
    <div class="shop-car" v-if="inlineDescList.length<=0">
      <div >
        <h1>购物车</h1>
        <!-- 购物车为空的时候 -->
        <div class="shop-null">
          <div class="shop-icon">
            <img src="../assets/shop-car.png" />
          </div>
          <h3>空空如也</h3>
          <div class="shop-btn">
            <a @click="enterHome()">去逛逛</a>
          </div>
        </div>
      </div>

    </div>
    <!-- 不为空 -->
    <div v-else>
      <div class="shop-car">
        <div class="shop-head">
          <p>购物车</p>
          <a class="shop-edit" @click="editActive()">{{editSign?'完成':'编辑'}}</a>
        </div>
        <div class="shop-content">
          <checker
                  v-model="selectValue"
                  type="checkbox"
                  default-item-class="item"
                  selected-item-class="item-selected"
                  v-for="(item, index) in inlineDescList"
                  :key="index"
          >
            <div class="shop-title">{{item.BZ}}</div>
            <checker-item :value="val" v-for="(val, num) in item.ContentList" :key="num">
              <div class="shop-item">
                <div class="shop-item-check"></div>
                <div class="shop-item-content">
                  <div class="content-img" @click.stop="$router.push({ name: 'BookInfo', params: { id: `${val.goods.GoodsId}`}})">
                    <img :src="val.goods.MainImage">
                  </div>
                  <div class="content-r">
                    <h3
                      @click.stop="$router.push({ name: 'BookInfo', params: { id: `${val.goods.GoodsId}`}})"
                    >{{`${val.goods.ProductName}${val.goods.GoodsName}${val.goods.Format}`}}</h3>
                    <div class="content-r-item">
                      <span>颜色：{{val.goods.ColorValue}}</span>
                      <span style="margin-left: 10px">数量：{{val.goodsShop.Count}}</span>
                    </div>
                    <div class="content-r-item">
                      <span>账号：{{val.user.LoginName}}</span>
                    </div>
                  </div>
                  <div class="content-r-price">¥{{val.goods.ShowPrice}}</div>
                </div>
                <div class="shop-num-content">
                  <div class="shop-num-icon" @click.stop="reduceNum(index, num, val.goodsShop.Id, val.goodsShop.Count)">
                    <img src="../assets/jian.png" />
                  </div>
                  <input class="shop-num" type="number" disabled="disabled" v-model="val.goodsShop.Count" />
                  <div class="shop-num-icon" @click.stop="addNum(index, num, val.goodsShop.Id, val.goodsShop.Count)">
                    <img src="../assets/jia.png" />
                  </div>
                </div>
              </div>
            </checker-item>
          </checker>
        </div>
      </div>
      <div class="opera-block" style="bottom: 8vh;" v-if="editSign">
        <div class="opera-block-l" @click="selectAll()">
          <div class="img">
            <img src="../assets/check-box-y.png" v-if="computedSign" />
            <img src="../assets/check-box-n.png" v-else />
          </div>
          <span>全选</span>
        </div>
        <div class="opera-block-r" @click="deleteData()">
          删除
        </div>
      </div>
      <div class="opera-block" style="bottom: 8vh;" v-else>
        <div class="opera-block-l" @click="selectAll()">
          <div class="img">
            <img src="../assets/check-box-y.png" v-if="computedSign" />
            <img src="../assets/check-box-n.png" v-else />
          </div>
          <span>全选</span>
        </div>
        <div class="shop-car-price">
          <span>合计：¥{{totalPrice}}</span>
        </div>
        <div class="shop-car-r" @click="Settlement()">
          去结算
        </div>
      </div>
    </div>

    <footer-bar></footer-bar>
  </div>
</template>

<script>
  import FooterBar from "../components/Footer";
  import { globelFnHanle } from "@/common/js/mixin.js";
  import { fetchCarShop, deleteShopCarId, SettlementShopApi, editShopCarNum } from "../api/index"
  import { setItem, getItem, mul } from "../common/js/util";

  export default {
    name: "ShopCart",
    components: {
      FooterBar
    },
    mixin: [globelFnHanle],
    data() {
      return {
        inlineDescList: [],
        selectValue: [],
        editSign: false
      }
    },
    created() {
      let params = {
        ReqData: {
          UserID: getItem("User").UserId,
        }
      }
      this.getCartShop(params)
    },
    computed: {
      computedSign: function () {
        let dataArray = []
        this.inlineDescList.map(item => {
          item.ContentList.map(val => {
            dataArray.push(val)
          })
        })
        if (dataArray.length===this.selectValue.length) {
          return true
        } else {
          return false
        }
      },
      totalPrice: function () {
        let price = 0
        this.selectValue.map(item => {
          price += mul(item.goodsShop.Count, item.goods.ShowPrice)
        })
        return price
      }
    },
    methods: {
      enterHome() {
        this.$router.push({ name: 'IndexPage' })
        setItem("NowNav", "首页")
      },
      reduceNum(index, num, id, count) {
        if(this.inlineDescList[index].ContentList[num].goodsShop.Count > this.inlineDescList[index].ContentList[num].goods.UnitCnt) {
          this.inlineDescList[index].ContentList[num].goodsShop.Count -= this.inlineDescList[index].ContentList[num].goods.UnitCnt
          let params = {
            ReqData: {
              UserID: getItem("User").UserId,
              ShopId: id,
              GoodsCount: this.inlineDescList[index].ContentList[num].goodsShop.Count
            }
          }
          editShopCarNum(params)
            .then(this.globelReqHandle)
            .then(res => {

            })
            .catch(this.globelErrHandle)
        }

      },
      addNum(index, num, id, count) {
          this.inlineDescList[index].ContentList[num].goodsShop.Count += this.inlineDescList[index].ContentList[num].goods.UnitCnt
          let params = {
            ReqData: {
              UserID: getItem("User").UserId,
              ShopId: id,
              GoodsCount: this.inlineDescList[index].ContentList[num].goodsShop.Count
            }
          }
          editShopCarNum(params)
            .then(this.globelReqHandle)
            .then(res => {

            })
            .catch(this.globelErrHandle)

      },
      getCartShop(params) {
        fetchCarShop(params)
          .then(this.globelReqHandle)
          .then(res => {
            this.inlineDescList = res.Results
          })
          .catch(this.globelErrHandle)
      },
      selectAll() {
        if(this.computedSign) {
          this.computedSign = false
          this.selectValue = []
        } else {
          this.computedSign = true

          let dataArray = []
          this.inlineDescList.map(item => {
            item.ContentList.map(val => {
              dataArray.push(val)
            })
          })

          this.selectValue = dataArray
        }
      },
      deleteData() {
        let dataArray = []
        this.selectValue.map(item => {
          dataArray.push(item.goodsShop.Id)
        })
        let params = {
          ReqData: {
            UserId: getItem("User").UserId,
            ShopId: dataArray.join(',')
          }
        }
        deleteShopCarId(params)
          .then(this.globelReqHandle)
          .then(res => {
            if(res.Code===200) {
              this.$vux.toast.show({
                text: '操作成功',
              })
            }
            let params = {
              ReqData: {
                UserID: getItem("User").UserId
              }
            }
            this.getCartShop(params)
          })
          .catch(this.globelErrHandle)
      },
      editActive() {
        if(this.editSign) {
          this.editSign = false
        } else {
          this.editSign = true
        }
      },
      // 去结算
      Settlement() {
        if(this.selectValue.length <= 0) {
          this.$vux.toast.show({
            text: '至少选择一个商品',
          })
          return
        }
        this.$router.push({name: "CheckOrder", params: { index: 0}})
        let dataArray = []
        this.selectValue.map(item => {
          dataArray.push(
            {
              UserID: getItem("User").UserId,
              ztId: item.goods.ZTID,
              goodsId: item.goodsShop.GoodsId,
              shopId: item.goodsShop.Id,
              merchantNo: item.goods.MerchantNo,
              barcode: item.goods.Barcode,
              colorValue: item.goods.ColorValue,
              price: item.goods.ShowPrice,
              jyPrice: item.goods.PurchasePrice,
              sumCount: item.goodsShop.Count * item.goods.ShowPrice,
              uploadTime: item.goods.MainImage,
              goodsName: item.goods.GoodsName,
              count: item.goodsShop.Count,
              KHID: item.user.KhId
            }
          )
        })
        let params = {
          ReqData: dataArray
        }

        SettlementShopApi(params)
          .then(this.globelReqHandle)
          .then(res => {

          })
          .catch(this.globelErrHandle)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../common/css/mixin/_multi_overflow";
  input{-webkit-appearance: none; -moz-appearance: none; -o-appearance: none; appearance: none;}
  input[type=number]:focus, input[type=password]:focus {
    border: 2px solid #f00;
  }
  input:disabled{
    border: 0 solid #DDD;
    background-color: #FFFFFF;
    color: #212128;
  }
.shop{
  &-car{
    width: 100%;
    height: auto;
    padding: 0 10px;
    & h1{
      width: 100%;
      font-size: 16px;
      text-align: center;
      color: #212128;
      margin-top: 6vh;
    }
   }
  &-null{
    margin-top: 40%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    & h3{
      font-size: 14px;
      color: #aaa;
      margin-top: 1%;
    }
  }
  &-icon{
    width: 162px;
    height: 104px;
    & img{
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  &-btn{
    width: 50%;
    height: 6vh;
    background: #d7161e;
    box-shadow: 0 5px 15px 0 rgba(215, 22, 30, 0.3);
    text-align: center;
    line-height: 6vh;
    border-radius: 10px;
    margin-top: 5vh;
    color: #fff;
    & a{
      display: block;
    }
  }

  &-head{
    display: flex;
    justify-content: space-between;
    margin-top: 4vh;
    color: #212128;
    font-size: 16px;
    & p{
      font-weight: bold;
    }
  }
  &-title{
    color: #212128;
    font-size: 14px;
    font-weight: bold;
    margin: 10px 0;
  }

  &-item-check{
    width: 15px;
    height: 15px;
    background-position: center center;
    background-size: 15px, 15px;
    margin-right: 3%;
  }
  &-content{
    margin-top: 1vh;
    margin-bottom: 16vh;
  }
}
.item-selected .shop-item-check{
  background-image: url("../assets/check-box-y.png")!important;
}
.item .shop-item-check{
  background-image: url("../assets/check-box-n.png");
}
.shop-item{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    &-content{
      width: 94%;
      border-radius: 5px;
      box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-top: 2%;
      padding: 16px;
      position: relative;

      .content-img{
        width: 72px;
        height: 72px;
        margin-right: 10px;
        & img{
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      .content-r{
        width: 70%;
        padding: 1%;
        & h3{
          color: #000000;
          font-size: 15px;
          letter-spacing: 0.2px;
          @include multi-overflow(1);
        }
        &-item{
          font-size: 12px;
          color: #aaa;
        }
        &-price{
          position: absolute;
          bottom: 28px;
          right: 10px;
          color: #f43543;
          letter-spacing: 0.2px;
          font-size: 14px;
        }
      }
    }
  }
  /* 购物车区别其他价格结算 */
  .shop-car-price{
    font-size: 14px;
    color: #000;
  }
  .shop-car-r{
    width: 88px;
    height: 7vh;
    background-color: #f43543;
    text-align: center;
    line-height: 7vh;
    color: #ffffff;
  }
  .shop-num-content{
    position: absolute;
    right: 10px;
    bottom: 6px;
    display: flex;
    justify-content: space-around;
    border: 1px solid #e0e0e0;
    width: 78px;
    height: 20px;
    border-radius: 4px;
    z-index: 999;
  }
  .shop-num{
    border-right: 1px solid #e0e0e0;
    border-top: none;
    border-bottom: none;
    border-left: 1px solid #e0e0e0;
    width: 50%;
    text-align: center;
    color: #aaa;
    font-size: 12px;
  }
  .shop-num-icon{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 25%;
    &:first-of-type{
      border-right: 1px solid #e0e0e0;
    }
    &:last-of-type{
      border-left: 1px solid #e0e0e0;
    }
    & img{
      width: 10px;
      height: 10px;
      display: block;
    }
  }

</style>
