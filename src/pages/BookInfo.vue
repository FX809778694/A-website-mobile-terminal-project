<!--
 Created by Thomas on 2018/8/6.
 详情组件
 -->
<template>
  <div class="book-detail">
    <!-- 详情图 -->
    <div class="detail-img">
      <swiper :options="swiperOption" ref="mySwiper" v-if="bannerImg.length>1">
        <!-- slides -->
        <swiper-slide v-for="(item, index) in bannerImg" :key="index">
          <div class="detail-img-item">
            <img :src="item"/>
          </div>
        </swiper-slide>
        <!-- Optional controls -->
        <div class="swiper-pagination"  slot="pagination"></div>
      </swiper>
      <div class="detail-back" @click="back()">
        <img src="../assets/return.png" />
      </div>
    </div>
    <!-- 价格信息 -->
    <div class="detail-price">
      <div class="detail-price-l">
        <div class="price">
          <span>¥</span>
          <span class="price-integer">{{intPrice}}</span>
          <span>{{floatPrice}}</span>
        </div>
        <div class="title">商城特供价</div>
      </div>
      <div class="info-love" @click="addCollection()">
        <img src="../assets/heart-n.png" v-if="!IsCollection" />
        <img src="../assets/heart-y.png" v-if="IsCollection" />
      </div>
    </div>
    <!-- 商品信息 -->
    <div class="detail-shop">
      <div class="title">{{detail.GoodsName}}</div>
      <div class="shop-item">建议零售价&nbsp;¥{{detail.Price}}</div>
      <div class="shop-item shop-add">
        <div class="color-content">
          <h3>颜色&nbsp;</h3>
          <span
            v-for="(item, index) in colorListData"
            :key="index"
            :class="{ active: signId==item.id }"
            @click="colorOpera(item.id)"
          >{{item.color}}</span>
        </div>
        <div class="shop-num detail-num">
          <div class="detail-num-icon" @click.stop="reduceNum()">
            <img src="../assets/less.png" />
          </div>
          <input class="detail-num-input" disabled="disabled" type="number" v-model="detailNum" />
          <div class="detail-num-icon" @click.stop="addNum()">
            <img src="../assets/add.png" />
          </div>
        </div>
      </div>
      <div class="shop-item shop-add">
        <span>规格&nbsp;{{detail.Format}}</span>
        <span>注：&nbsp;{{remarkInfo}}</span>
      </div>
    </div>

    <div class="detail-shop-t">
      <div class="shop-t-item">商品详情</div>
      <div class="shop-t-item">
        <span>商品名称：</span>
        <span class="shop-t-item-r">{{detail.GoodsName}}</span>
      </div>
      <div class="shop-t-item">
        <span>条形码：</span>
        <span class="shop-t-item-r">{{detail.Barcode}}</span>
      </div>
      <div class="shop-t-item">
        <span>颜色：</span>
        <span class="shop-t-item-r">黑色</span>
      </div>
      <div class="shop-t-item">
        <span>商品品牌：</span>
        <span class="shop-t-item-r">{{detail.Product}}</span>
      </div>
      <div class="shop-t-item">
        <span>售卖单位：</span>
        <span class="shop-t-item-r">{{detail.SaleUitName}}</span>
      </div>
    </div>
    <!-- 图详情 -->
    <div class="shop-content-img">
      <div class="title">产品介绍</div>
      <div v-html="htmlDetail">
      </div>
    </div>

    <!-- 进入购物车 -->
    <div class="enter-shop-cart" @click="enterShopCar()">
      <img src="../assets/3rs@3x.png" />
    </div>
    <!-- 加入购物车 -->
    <div class="detail-add-shop" @click="addShopCart()">
      <a>加入购物车</a>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import SplitTitle from "@/components/SplitTitle";
import { setItem, getItem, addFloat } from "../common/js/util";
import { fetchBookDetail, addCollectionResourse, addShopCartApi } from "../api/index"
import BScroll from "better-scroll";
import { globelFnHanle } from "@/common/js/mixin.js";
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  name: "BookInfo",
  mixin: [globelFnHanle],
  data() {
    return {
      bannerImg: [],
      detailImg: [],
      detail: {},
      html: "",
      colorList: [],
      signId: '',
      IsCollection: false,
      detailNum: 1,//数量
      swiperOption: {
        notNextTick: true,
        observer:true,//修改swiper自己或子元素时，自动初始化swiper
        observeParents:true,//修改swiper的父元素时，自动初始化swiper
        //循环
        loop: true,
        //设定初始化时slide的索引
        initialSlide:0,
        //自动播放
        autoplay: false,
        // autoplay: {
        //     delay: 3000,
        //     stopOnLastSlide: false,
        //     disableOnInteraction: false,
        // },
        // 设置轮播
        effect : 'flip',
        //滑动速度
        speed:800,
        //滑动方向
        direction : 'horizontal',
        //小手掌抓取滑动
        // grabCursor : true,
        //滑动之后回调函数
        on: {
          slideChangeTransitionEnd: function(){
            // console.log(this.activeIndex);//切换结束时，告诉我现在是第几个slide
          },
        },
        //左右点击
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        //分页器设置
        pagination: {
          el: '.swiper-pagination',
          clickable :true
        }
      },
    }
  },
  components: {
    SplitTitle,
    BScroll,
    swiper,
    swiperSlide
  },
  watch: {

  },
  computed: {
    ...mapState(["loading", "errorMsg", "isRequestErr", "isLogin", "headerOpt"]),
    intPrice: function() {
      if(this.detail.ShowPrice) {
        return addFloat(this.detail.ShowPrice.toString()).slice(0, -3)
      }
    },
    floatPrice: function() {
      if(this.detail.ShowPrice) {
        return  addFloat(this.detail.ShowPrice.toString()).slice(-3)
      }
    },
    remarkInfo: function() {
      if(this.detail.SaleUitName) {
        return `一${this.detail.SaleUitName}=${this.detail.UnitCnt}${this.detail.UnitName}`
      }
    },
    htmlDetail: function() {
      if(this.detail.Introduction) {
        return this.detail.Introduction
      }
    },
    colorListData: function() {
      if(this.colorList.length > 0) {
        let data = []
        this.colorList.map(item => {
          data.push({
            id: item.GoodsId,
            color: item.ColorValue
          })
        })
        return data
      }
    }
  },
  created() {

    const id = this.$route.params.id
    this.signId = id

    let params = {
      ReqData: {
        UserID: getItem("User").UserId,
        GoodsId: id
      }
    }
    this.getBookDetail(params)
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  methods: {
    ...mapMutations([
      "setLoading",
      "setErrorMsg",
      "setRequestErr",
      "setLogin",
      "setBookId"
    ]),
    back() {
      this.$router.back()
    },
    enterShopCar() {
      setItem("NowNav", "购物车");
      this.$router.push({ name: 'ShopCart' })
    },
    colorOpera(id) {

      this.signId = id
      this.$router.push({
        name: 'BookInfo',
        params: { id: id }
      })
      let params = {
        ReqData: {
          UserID: getItem("User").UserId,
          GoodsId: id
        }
      }
      this.getBookDetail(params)
    },
    getBookDetail(params) {
      fetchBookDetail(params)
        .then(this.globelReqHandle)
        .then(res => {
          this.detail = res.Result
          this.bannerImg = res.Obj.Results
          this.colorList = res.Results
          this.IsCollection = res.Result.IsCollection
        })
        .catch(this.globelErrHandle)
    },
    // 加入收藏
    addCollection() {
      if(this.IsCollection) {
        this.$vux.toast.show({
          text: '已经收藏过该商品',
        })
        return
      }
      const id = this.$route.params.id
      let params = {
        ReqData: {
          UserID: getItem("User").UserId,
          GoodsId: id
        }
      }
      addCollectionResourse(params)
        .then(this.globelReqHandle)
        .then(res =>{
          if(res.Code===200) {
            this.$vux.toast.show({
              text: '收藏成功',
            })
            this.IsCollection = true
          }
        })
        .catch(this.globelErrHandle)
    },
    //减
    reduceNum() {
      if(this.detailNum > 1){
        this.detailNum -= 1
      }

    },
    //加
    addNum() {
      this.detailNum += 1
    },
    addShopCart() {
      //加入购物车获取数量
      let num = this.detailNum
      console.log(num)

      let shopNum = this.detail.UnitCnt * num //提交数量

      const id = this.$route.params.id //提交ID

      //判断提示
      if (this.detail.SupplyNum < shopNum) {
        this.$vux.toast.show({
          text: '供货数量不足',
          type: "warn"
        })
        return
      } else if (this.detail.IsBid === 0) {

      } else if (this.detail.IsSuply === 0){
        this.$vux.toast.show({
          text: '该商品不可供',
          type: "warn"
        })
        return
      } else if(this.detail.Isdelete === 1) {
        this.$vux.toast.show({
          text: '改商品不能下单',
          type: "warn"
        })
        return
      }

      let params = {
        ReqData: {
          UserId: getItem("User").UserId,
          GoodsId: id,
          GoodsCount: shopNum,
          MerchatNo: this.detail.MerchantNo
        }
      }

      addShopCartApi(params)
        .then(this.globelReqHandle)
        .then(res =>{
          if (res.Code === 200) {
            this.$vux.toast.show({
              text: '加入成功',
              type: "success"
            })
          }
        })
        .catch(this.globelErrHandle)
    }
  }
};
</script>

<style lang="scss">
@import "../common/css/mixin/_multi_overflow";
input{-webkit-appearance: none; -moz-appearance: none; -o-appearance: none; appearance: none;}
input[type=number]:focus, input[type=password]:focus {

}
input:disabled{
  border: 0 solid #DDD;
  background-color: #FFFFFF;
  color: #212128;
}

.book-detail{
  background: #f1f1f1;
  .detail-img{
    width: 100%;
    &-item{
      width: 100%;
      & img{
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }
  .detail-back{
    position: absolute;
    top: 0.3%;
    left: 1.8%;
    width: 36px;
    height: 36px;
    z-index: 999;
    & img{
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .detail-price{
    background: #fff;
    padding: 4% 5% 1.5% 5%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .info-love{
      width: 28px;
      height: 23px;
      & img{
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    &-l{
      width: 90%;
      display: flex;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .price{
      color: #f43543;
      font-size: 16px;
      &-integer{
        font-size: 24px;
      }
    }
    .title{
      color: #aaa;
      font-size: 14px;
      line-height: 38px;
      text-align: center;
      margin-left: 2%;
      padding-top: 1%;
    }
    .info-love{
      & img{
        float: right;
      }
    }
  }
  .detail-shop{
    padding: 0 5% 4% 5%;
    background: #fff;
    margin-bottom: 1%;
    .title{
      width: 100%;
      @include multi-overflow(1);
      font-size: 24px;
      font-weight: 600;
      color: #212128;
      margin-bottom: 3%;
    }
  }
  .shop-item{
    font-size: 14px;
    margin-top: 6px;
    color: #aaa;
  }
  .shop-add{
    display: flex;
    justify-content: space-between;
    position: relative;
    height: 26px;
    &-btn{
      position: absolute;
      right: 0;
      top: -60%;
      width: 36px;
      height: 36px;
      & img{
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }
  .detail-shop-t{
    background: #fff;
    padding: 5%;
    margin-bottom: 1%;
    .shop-t-item{
      display: flex;
      justify-content: space-between;
      color: #aaa;
      font-size: 14px;
      margin-top: 1%;
      &-r{
        color: #000;
      }
    }
  }
  .shop-content-img{
    background: #fff;
    width: 100%;
    .title{
      font-size: 14px;
      padding: 4% 5%;
      color: #aaa;
    }
    .shop-img{
      margin-top: 1%;
      width: 100%;
      & img{
        display: block;
        height: 100%;
        width: 100%;
      }
    }
  }
  .detail-add-shop{
    position: fixed;
    width: 100%;
    height: 44px;
    background: #f43543;
    bottom: 0;
    text-align: center;
    color: #fff;
    line-height: 44px;
  }
  /* 颜色的 */
  .color-content{
    display: flex;
    justify-content: flex-start;
    & h3{
      font-size: 14px;
      font-weight: 500;
    }
    & span{
      margin-left: 4px;
    }
    .active{
      color: #f43543;
    }
  }
}
  .enter-shop-cart{
    width: 40px;
    height: 40px;
    position: fixed;
    right: 10px;
    bottom: 100px;
    & img{
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  /* 数量 */
  .detail-num{
    display: flex;
    justify-content: flex-start;
    &-icon{
      width: 24px;
      height: 24px;
      & img{
        width: 100%;
        height: 100%;
        display: block;
      }
    }
    &-input{
      width: 40px;
      outline: none;
      border-width: 0;
      text-align: center;
      font-size: 18px;
      color: #212128;
    }
  }
</style>

