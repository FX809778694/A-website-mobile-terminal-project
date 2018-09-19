<template>
  <div class="index-container">
    <div class="list-search-area" v-if="showSearch">
      <x-input title=""  v-model="searchContent" type="text" label-width="4em" placeholder="请输入订单号" placeholder-align="left" class="search-input">
      </x-input>
      <a @click="enterSearch()">确定</a>
    </div>
    <h3 class="checkorder-title">
      收货订单
      <b @click="$router.go(-1)" class="back"></b>
      <b class="search" @click="switchSearch()"></b>
    </h3>
    <div class="order-container  clearfix" v-for="(item, index) in dataList" :key="index">
      <p class="order-message clearfix">
        <span class="fl">订单号：{{item.XSDH}}</span>
        <span class="fr">{{item.ZTMC}}</span>
      </p>
      <ul class="goods-lists">
        <li v-for="(val, num) in item.XsdMxArr" :key="num">
          <div class="left-aside">
            <img :src="val.Goods.MainImage" alt="">
          </div>
          <div class="right-aside">
            <h4>{{val.PM}}</h4>
            <p>
              <span>颜色：{{val.Goods.ColorValue}}</span>
              <span>数量 {{`${val.FHSL}${val.KBMC}`}}</span>
            </p>
          </div>
          <span class="price">￥{{val.FHSY}}</span>
        </li>
      </ul>
    </div>
    <div v-if="moreShow" class="get-more" @click="getMoreShop()">点击加载更多</div>
    <div v-else class="get-more">没有更多啦！</div>
  </div>
</template>

<script>
  import { getReceiptListApi } from "../api/index"
  import { getItem } from "../common/js/util"

export default {
  name: "OrderList",
  data() {
    return {
      showSearch: false,
      searchContent: "",
      PageIndex: 1,
      dataList: [],
      moreShow: false
    };
  },
  created() {
    let params = {
      ReqData: {
        UserID: getItem("User").UserId,
        search: "",
        PageIndex: 1,
        PageSize: 20,
      }
    }
    this.getReceiptList(params)
  },
  methods: {
    itemClick(index){
      this.num = index;
    },
    getMoreShop() {
      let params = {
        ReqData: {
          UserID: getItem("User").UserId,
          search: this.searchContent,
          PageIndex: this.PageIndex,
          PageSize: 20
        }
      }
      this.getReceiptList(params)
    },
    switchSearch() {
      if(this.showSearch) {
        this.showSearch = false
      } else {
        this.showSearch = true
      }
    },
    getReceiptList(params) {
      getReceiptListApi(params)
        .then(this.globelReqHandle)
        .then(res => {
          res.Results.map(item => {
            this.dataList.push(item)
          })
          if(res.Results.length > 0) {
            this.moreShow = true
            this.PageIndex += 1
          } else {
            this.moreShow = false
          }
        })
        .catch(this.globelErrHandle)
    },
    enterSearch() {
      this.showSearch = false
      let params = {
        ReqData: {
          UserID: getItem("User").UserId,
          search: this.searchContent,
          PageIndex: 1,
          PageSize: 20,
        }
      }
      this.getReceiptList(params)
    }
  }
};
</script>

<style lang="scss" scoped>
.checkorder-title {
  font-weight: 600;
  font-size: 16px;
  font-family: PingFangSC;
  color: #212128;
  text-align: center;
  position: relative;
  margin-top: 12px;
  .back {
    width: 12px;
    height: 20px;
    background: url(../assets/returnb.png);
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    left: 10px;
    background-size: 100% 100%;
  }
  .search {
    height: 20px;
    width: 20px;
    background: url(../assets/search.png);
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    right: 3px;
    background-size: 100% 100%;
  }
}
.order-container {
  margin-top: 30px;
}
.order-message {
  font-size: 14px;
  font-weight: 600;
}
.goods-lists {
  li {
    display: flex;
    align-items: center;
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
    margin-top: 20px;
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
::-webkit-scrollbar {
  width: 0;
}
  .list-search-area{
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-radius: 5px;
    background-color: #ffffff;
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
  }
</style>







