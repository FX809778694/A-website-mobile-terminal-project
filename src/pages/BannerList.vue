<!--
 Created by Thomas on 2018/8/14.
 三级分类组件区别于二级三级模块
 -->
<template>
  <div>
    <div class="index-container clearfix">
      <h3 class="three-level-title">
        商品列表
        <b @click="back()"></b>
      </h3>
      <div class="goods-classifiy">
        <ul class="goods-container clearfix">
          <li class="goods-item fl"
              v-for="(item, index) in goodsItem"
              :class="{first :index % 2 ==0 }"
              @click="$router.push({ name: 'BookInfo', params: { id: `${item.GoodsId}`}})"
          >
            <div class="img-container">
              <img :src="item.MainImage" alt="" class="goods-pic">
              <p class="pink-area">建议零售价：¥{{item.Price}}</p>
            </div>
            <p class="goods-price">¥{{item.ShowPrice}}</p>
            <p class="goods-tip">商城特供价</p>
            <p class="goods-describe">{{`${item.Product}${item.GoodsName}${item.Format}`}}</p>
          </li>
        </ul>
        <div v-if="moreShow" class="get-more" @click="getMoreShop()">点击加载更多</div>
        <div v-else class="get-more">没有更多啦！</div>
      </div>
    </div>
    <footer-bar></footer-bar>
  </div>
</template>

<script>
  import FooterBar from "../components/Footer.vue";
  import { getBannerListApi } from "../api/index"
  import { getItem } from "../common/js/util";
  import { globelFnHanle } from "@/common/js/mixin.js";

  export default {
    name: "BannerList",
    components: {
      FooterBar
    },
    mixin: [globelFnHanle],
    data() {
      return {
        goodsItem: [],
        loading: false,
        PageIndex: 1,
        moreShow: false
      };
    },
    created() {
      const ActivitiesID = this.$route.params.id
      let params = {
        ReqData: {
          UserId: getItem("User").UserId,
          ActivitiesID: ActivitiesID,
          PageIndex: this.PageIndex,
          PageSize: 20
        }
      }
      this.getShopList(params)
    },
    computed: {

    },
    mounted() {

    },
    methods: {
      back() {
        this.$router.back()
      },
      getMoreShop() {
        const ActivitiesID = this.$route.params.id
        let params = {
          ReqData: {
            UserId: getItem("User").UserId,
            ActivitiesID: ActivitiesID,
            PageIndex: this.PageIndex,
            PageSize: 20
          }
        }
        this.getShopList(params)
      },
      getShopList(params){
        getBannerListApi(params)
          .then(this.globelReqHandle)
          .then(res => {
            res.Results.map(item => {
              this.goodsItem.push(item)
            })
            if(res.Results.length >0) {
              this.PageIndex += 1
              this.moreShow = true
            } else {
              this.moreShow = false
            }
          })
          .catch(this.globelErrHandle)
      }
    }
  };
</script>


<style  lang="scss" scoped>
  @import "../common/css/mixin/_multi_overflow";
  .three-level-title {
    font-weight: 600;
    font-size: 16px;
    width: 100%;
    font-family: PingFangSC;
    color: #212128;
    background-color: #fff;
    text-align: center;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    padding-top: 12px;
    padding-bottom: 12px;
    box-sizing: border-box;
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
  .index-container {
    padding: 0 0 100px 20px;
  }
  .goods-classifiy {
    margin-top: 80px;
    & ul{
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
    }
    .header-title {
      margin-bottom: 10px;
    }
    span,
    a {
      font-size: 14px;
      color: #aaaaaa;
    }
    .goods-item {
      width: 45%;
      box-sizing: border-box;
      padding-bottom: 10px;
      list-style: none;
      margin-top: 10px;
      border-radius: 5px;
      height: 254px;
      text-align: center;
      background-color: #ffffff;
      box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
      .img-container {
        position: relative;
        height: 150px;
        width: 100%;
        text-align: center;
        .goods-pic {
          width: 138px;
          height: 150px;
          background-size: cover;
        }
        .pink-area {
          width: 138px;
          background-color: #d7161e;
          opacity: 0.4;
          height: 30px;
          line-height: 30px;
          padding-left: 5px;
          padding-right: 5px;
          color: #fff;
          position: absolute;
          left: 50%;
          transform: translate(-50%, 0);
          bottom: 0;
          font-size: 12px;
          border-radius: 5px;
          text-align: center;
        }
      }

      .goods {
        &-price {
          text-align: center;
          color: #f43543;
          font-size: 16px;
          font-weight: bold;
        }
        &-tip {
          font-size: 12px;
          color: #aaaaaa;
          text-align: center;
          font-family: PingFangSC;
        }
        &-describe {
          padding-left: 10px;
          padding-right: 10px;
          text-align: center;
          width: 100%;
          @include multi-overflow(2);
        }
      }
    }
    .first {
      margin-right: 20px;
    }
  }
  ::-webkit-scrollbar {
    width: 0;
  }
</style>


