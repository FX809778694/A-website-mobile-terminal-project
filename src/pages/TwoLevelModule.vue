<template>
  <div class="index-container clearfix">
    <h3 class="two-level-title">
      商品列表
      <b @click="back()"></b>
    </h3>
    <div class="swiper-txt-container clearfix">
      <ul>
        <li v-for="(item, index) in headerNav" :key="index" :class="{active: item.ID == num }" @click="getSwitchTwoShopList(item.ID)">
          {{item.ModuleName}}
        </li>
      </ul>
    </div>
    <div class="goods-classifiy">
      <ul class="goods-container clearfix">
        <li
          style="margin-top: 10px"
          class="goods-item fl"
          v-for="(item,index) in twoCategoryShop"
          :class="{first :index % 2 === 0 }"
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
    <footer-bar></footer-bar>
  </div>
</template>

<script>
import FooterBar from "../components/Footer.vue";
import SearchWrap from "../components/SearchWrap.vue";
import { setItem, getItem } from "../common/js/util";
import { fetchIndexShopModal, fetchTwoCategoryShop } from "../api";
import { globelFnHanle } from "@/common/js/mixin.js";

export default {
  name: "TwoLevelModule",
  components: {
    FooterBar,
    SearchWrap
  },
  mixin: [globelFnHanle],
  data() {
    return {
      value: "",
      searchContent: "",
      twoCategoryShop: [],
      headerNav: [],
      num: 0,
      PageIndex: 1,
      categoryIndex: "",
      moreShow: true,
    };
  },
  created() {
    let id = this.$route.params.id
    this.categoryIndex = this.$route.params.num
    this.num = ~~this.$route.params.id

    this.getTwoShopList(id)
    this.getShopModal()
  },
  methods: {
    back() {
      this.$router.back()
    },
    getShopModal() {
      let params = {
        ReqData: {
          UserID: getItem("User").UserId
        }
      };
      fetchIndexShopModal(params)
        .then(this.globelReqHandle)
        .then(res => {
          const data = res.Results;
          this.headerNav = res.Results[this.categoryIndex].ChildrenList
        })
        .catch(this.globelErrHandle);
    },
    getMoreShop() {
      console.log(111)
      let id = ~~this.num
      this.getTwoShopList(id)
    },
    // 获取二级模块下的商品
    getTwoShopList(id) {
      this.num = id;
      let params = {
        ReqData: {
          UserID: getItem("User").UserId,
          ModuleId: id,
          PageIndex: this.PageIndex,
          PageSize: 20
        }
      }

      fetchTwoCategoryShop(params)
        .then(this.globelReqHandle)
        .then(res => {
          res.Results.map(item => {
            this.twoCategoryShop.push(item)
          })
          if(res.Results.length >0) {
            this.operaShow = true
            this.PageIndex += 1
          } else {
            this.moreShow = false
          }
        })
        .catch(this.globelErrHandle)
    },
    getSwitchTwoShopList(id) {
      this.PageIndex = 1
      this.moreShow = true
      this.num = id;
      let params = {
        ReqData: {
          UserID: getItem("User").UserId,
          ModuleId: id,
          PageIndex: this.PageIndex,
          PageSize: 20
        }
      }

      fetchTwoCategoryShop(params)
        .then(this.globelReqHandle)
        .then(res => {
          this.twoCategoryShop = res.Results
        })
        .catch(this.globelErrHandle)
    }
  }
};
</script>

<style lang="scss">
@import "../common/css/mixin/_multi_overflow";
.two-level-title{
  font-weight: 600;
  font-size: 16px;
  font-family: PingFangSC;
  color: #212128;
  text-align: center;
  position: relative;
  margin-top:12px;
  b{
    width:12px;
    height: 20px;
    background: url(../assets/returnb.png);
    position: absolute;
    top:50%;
    transform: translate(0,-50%);
    left:10px;
    background-size:100% 100%;
  }
}
.index-container {
  padding: 0 20px 100px 20px;
}
.swiper-txt-container {
  width: 100%;
  ul {
    overflow-x: scroll;
    width: 100%;
    height: 40px;
    white-space: nowrap;
    float: left;
    overflow-y: hidden;
    margin-top: 15px;
  }
  li {
    display: inline-block;
    width: 80px;
    height: 30px;
    font-size: 14px;
    color: #e0e0e0;
  }
  .active {
    font-size: 16px;
    color: #212128;
  }
}

::-webkit-scrollbar {
  width: 0;
}
.goods-price {
  @include multi-overflow(1);
}
.goods-classifiy {
  margin-top: 20px;
  .header-title {
    margin-bottom: 10px;
  }
  span,
  a {
    font-size: 14px;
    color: #aaaaaa;
  }
  .goods-item:nth-child(odd) {
    margin-right: 20px;
  }
  .goods-item {
    width: 46%;
    box-sizing: border-box;
    padding-bottom: 10px;
    list-style: none;
    border-radius: 5px;
    height: 254px;
    text-align: center;
    background-color: #ffffff;
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
    margin-top: 6px;
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
  // .first {
  //   margin-right: 20px;
  // }
}
</style>


