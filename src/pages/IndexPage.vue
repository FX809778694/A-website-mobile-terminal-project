<template>
  <div class="index-container clearfix">
    <header>
      <h3 class="title-message">
        <div class="logo1">
        </div>
        <div class="change-account" @click="changeAccount">
          <b></b>
          <div class="zt">
            {{accountName[0]==="" ? "切换账套" :accountName[0]}}
          </div>
          <div class="zt-item" v-if="selectContent">
            <p v-for="(item, index) in accountNameList" :key="index" @click="changeAccountId(item.ZTID, item.ZTName)">{{item.ZTName}}</p>
          </div>
        </div>
      </h3>
    </header>
    <search-wrap></search-wrap>
    <div class="swiper-txt-container clearfix">
      <ul>
        <li
          v-for="(item, index) in headerNav"
          :key="index"
          @click="$router.push({ name: 'OneCategoryShopList', params: { id: `${item.FXFLID}`}})"
        >
          {{item.FXFLMC}}
        </li>
      </ul>
    </div>
    <div class="swiper-container">
      <swiper :loop="true" :auto="true" :show-desc-mask="false" class="vux_swiper_img" dots-class="custom-bottom" dots-position="center" height="130px">
        <swiper-item @click.native="bannerLink(item)" v-for="(item, index) in bannerLists" :key="index">
          <img class="banner" :src="item.ImgPath">
        </swiper-item>
      </swiper>
    </div>
    <div class="goods-classifiy" v-for="(item, index) in modalData" :key="index">
      <div class="header-title clearfix">
        <span class="fl">{{item.name}}</span>
        <a @click="$router.push({ name: 'TwoLevelModule', params: { id: `${item.twoId}`,num: index}})" class="fr">更多>></a>
      </div>
      <ul class="goods-container clearfix">
        <li class="goods-item fl" v-for="(item, a) in dataArrayShop[index].data" :key="a" @click="$router.push({ name: 'BookInfo', params: { id: `${item.GoodsId}`}})">
          <div class="img-container">
            <img :src="item.MainImage" alt="" class="goods-pic">
            <p class="pink-area">建议零售价：¥{{item.Price}}</p>
          </div>
          <p class="goods-price">¥{{item.ShowPrice}}</p>
          <p class="goods-tip">商城特供价</p>
          <p class="goods-describe">{{`${item.Product}${item.GoodsName}${item.Format}`}}</p>
        </li>
      </ul>
    </div>
    <footer-bar></footer-bar>
  </div>
</template>

<script>
import FooterBar from "../components/Footer.vue";
import SearchWrap from "../components/SearchWrap.vue";
import {
  fetchCategoryApi,
  fetchIndexAutoImg,
  fetchIndexShopModal,
  fetchTwoCategoryShop,
  GetZtList,
  ChangeZt,
  getDefaultZt
} from "../api";
import { getItem } from "../common/js/util";
import { globelFnHanle } from "@/common/js/mixin.js";
import { Swiper, SwiperItem, PopupPicker } from 'vux';

export default {
  name: "IndexPage",
  components: {
    FooterBar,
    SearchWrap,
    PopupPicker,
    Swiper,
    SwiperItem
  },
  data() {
    return {
      value: "",
      searchContent: "",
      bannerLists: [],
      goodsItem: [],
      twoShopList: [], //模块下的商品
      twoShop: [],
      modalData: [], //模块的一级信息
      headerNav: [],
      accountName: [],
      selectContent: false,
      accountNameList: [],
    };
  },
  mixin: [globelFnHanle],
  created() {
    this.getCategory();
    this.getAutoImg();
    this.getShopModal();
  //  获取账套列表
    const params = {
      ReqData: {
        UserId: getItem("User").UserId
      }
    };
    GetZtList(params)
      .then(this.globelReqHandle)
      .then(res => {
        this.accountNameList = res.Results
        getDefaultZt(params)
          .then(this.globelReqHandle)
          .then(res => {
            let defaultZt = this.accountNameList.filter(item => item.ZTID === res.Result)
            this.accountName[0] = defaultZt[0].ZTName
          })
          .catch(this.globelErrHandle)
      })
      .catch(this.globelErrHandle);

  },
  mounted() {

  },
  computed: {
      dataArrayShop: function() {
        let array = this.twoShopList
        var compare = function (obj1, obj2) {
          var val1 = obj1.num;
          var val2 = obj2.num;
          if (val1 < val2) {
            return -1;
          } else if (val1 > val2) {
            return 1;
          } else {
            return 0;
          }
        }
        array.sort(compare)
        return array.sort(compare)
      }
  },
  methods: {
    changeAccount() {
      if(this.selectContent) {
        this.selectContent = false
      } else {
        this.selectContent = true
      }
    },
    changeAccountId(id, name) {
      this.accountName[0] = name
      const params = {
        ReqData: {
          UserId: getItem("User").UserId,
          ZtID: id
        }
      };
      ChangeZt(params)
        .then(this.globelReqHandle)
        .then(res => {
          if(res.Success) {
            this.selectContent = false
          }
        })
        .catch(this.globelErrHandle);
    },
    getCategory() {
      fetchCategoryApi()
        .then(this.globelReqHandle)
        .then(res => {
          this.headerNav = res.Results;
        })
        .catch(this.globelErrHandle);
    },
    getAutoImg() {
      let params = {
        ReqData: {
          UserID: getItem("User").UserId
        }
      };
      fetchIndexAutoImg(params)
        .then(this.globelReqHandle)
        .then(res => {
          this.bannerLists = res.Results
        })
        .catch(this.globelErrHandle);
    },
    bannerLink(item){

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
          let firstData = [];
          data.map((item) => {
            if (item.ChildrenList[0]) {
              firstData.push({
                name: item.ModuleName,
                twoId: item.ChildrenList[0].ID,
                oneId: item.ID
              });
            }
          });
          this.modalData = firstData;
          this.modalData.map((item, index) => {
            let params = {
              ReqData: {
                UserID: getItem("User").UserId,
                ModuleId: item.twoId
              }
            };

            fetchTwoCategoryShop(params)
              .then(this.globelReqHandle)
              .then(res => {
                this.twoShop = res.Results.slice(0, 4);
                this.twoShopList.push({data: this.twoShop, num: index})
              })
              .catch(this.globelErrHandle);
          });
        })
        .catch(this.globelErrHandle);
    },
    getTwoShopList(params) {

    }
  }
};
</script>


<style  lang="scss">
@import "../common/css/mixin/_multi_overflow";

.index-container {
  padding: 0 20px 100px 20px;
}
header {
  padding-top: 17px;
  height: 50px;
  box-sizing: border-box;
  position: relative;
  z-index: 9999;
}
.title-message {
  text-align: center;
  font-size: 16px;
  height: 100%;
  position: relative;
}
.logo1 {
  width: 92px;
  height: 17px;
  background: url(../assets/logo@3x.png);
  position: absolute;
  left: 50%;
  top: 50%;
  background-size: cover;
  transform: translate(-50%, -50%);
}
.change-account {
  width: 60px;
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translate(0, -50%);
  color: #aaaaaa;
  font-size: 14px;
}
.change-account {
  b {
    position: absolute;
    width: 16px;
    height: 13px;
    background: url(../assets/switch.png);
    left: -23px;
    top: 4px;
    background-size: 100% 100%;
  }
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
    color: #aaa;
  }
  .active {
    font-size: 16px;
    color: #212128;
  }
}
.swiper-container {
  width: 100%;
  background-size: 100% 100%;
  text-align: center;
  .vux-slider > .vux-swiper > .vux-swiper-item > a > .vux-img {
    background-size: 100% 100%;
  }
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
    margin-top: 20px;
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
}
::-webkit-scrollbar {
  width: 0;
}
/* 首页轮播图 */
.banner {
  width: 100%;
  height: 100%;
  & img {
    display: block;
    width: 100%;
    height: 100%;
  }
}

.change-account{
}
  .zt-item{
    padding: 4px;
    border: 1px solid #ccc;
    background-color: #ffffff;
    position: absolute;
    width: 160%;
    right: -3%;
    margin-top: 6px;
    border-radius: 2px;
    & p{
      border-bottom: 1px solid #ccc;
      font-size: 12px;
    }
  }
</style>