<!--
 Created by Thomas on 2018/8/10.
 我的收藏
 -->
<template>
  <div>
    <div class="my-foot-shop">
        <div class="shop-car">
          <div class="shop-head">
            <div class="foot-img" @click="back()">
              <img src="../assets/returnb.png" />
            </div>
            <p>我的收藏</p>
          </div>
          <div class="shop-content">
            <checker v-model="selectArray" type="checkbox" default-item-class="item" selected-item-class="item-selected">
              <checker-item :value="item" v-for="(item, index) in inlineDescList" :key="index">
                <div class="shop-item">
                  <div class="shop-item-check"></div>
                  <div class="shop-item-content" @click.stop="$router.push({ name: 'BookInfo', params: { id: `${item[1].GoodsId}`}})">
                    <div class="content-img" style="width: 72px;height: 72px">
                      <img style="display: block;width: 100%;height: 100%" :src="item[0].MainImage">
                    </div>
                    <div class="content-r">
                      <h3>{{`${item[0].Product}${item[0].GoodsName}${item[0].Format}`}}</h3>
                      <div class="content-r-item">
                        <span>颜色：{{item[0].ColorValue}}</span>
                      </div>
                    </div>
                    <div class="content-r-price">¥{{item[0].ShowPrice}}</div>
                  </div>
                </div>
              </checker-item>
            </checker>
            <div v-if="moreShow" class="get-more" @click="getMoreShop()">点击加载更多</div>
            <div v-else class="get-more">没有更多啦！</div>
          </div>
        </div>
      </div>

    <div class="opera-block" v-if="operaShow">
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
  </div>

</template>

<script>
  import { fetchCollectShop, deleteCollectShopId } from "../api/index"
  import { getItem } from "../common/js/util"
  import { globelFnHanle } from "@/common/js/mixin.js"

  export default {
    name: "MyCollect",
    data() {
      return {
        inlineDescList:[],
        selectArray: [],
        PageIndex: 1,
        operaShow: false,
        moreShow: false
      }
    },
    mixin: [globelFnHanle],
    created() {
      let params = {
        ReqData: {
          UserID: getItem("User").UserId,
          state: 0,
          PageIndex: this.PageIndex,
          PageSize: 20
        }
      }
      this.getCollectShop(params)
    },
    computed: {
      computedSign: function () {
        if (this.inlineDescList.length===this.selectArray.length) {
          return true
        } else {
          return false
        }
      }
    },
    methods: {
      back() {
        this.$router.back()
      },
      getMoreShop() {
        let params = {
          ReqData: {
            UserID: getItem("User").UserId,
            state: 0,
            PageIndex: this.PageIndex,
            PageSize: 20
          }
        }
        this.getCollectShop(params)
      },
      getCollectShop(params) {
        fetchCollectShop(params)
          .then(this.globelReqHandle)
          .then(res =>{
            res.Results.map(item => {
              this.inlineDescList.push(item)
            })
            if(res.Results.length >0) {
              this.operaShow = true
              this.moreShow = true
              this.PageIndex += 1
            } else {
              this.moreShow = false
            }
          })
          .catch(this.globelErrHandle)
      },
      selectAll() {
        if(this.sign) {
          this.sign = false
          this.selectArray = []
        } else {
          this.sign = true
          this.selectArray = this.inlineDescList
        }
      },
      deleteData() {
        let dataArray = []
        this.selectArray.map(item => {
          dataArray.push(item[1].Id)
        })
        let params = {
          ReqData: {
            UserId: getItem("User").UserId,
            CollectionId: dataArray.join(',')
          }
        }
        deleteCollectShopId(params)
          .then(this.globelReqHandle)
          .then(res => {

            if(res.Code===200) {
              this.$vux.toast.show({
                text: '操作成功',
              })
            }
            this.$router.go(0)
          })
          .catch(this.globelErrHandle)
      }
    }
  }
</script>

<style scoped lang="scss">

</style>