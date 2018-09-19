<template>
  <div class="search-area">
    <x-input title="" :show-clear="false" v-model="searchContent" type="text" label-width="4em" placeholder="请输入商品名称" placeholder-align="left" class="search-input">
    </x-input>
    <b @click="search()"></b>
  </div>
</template>

<script>
export default {
  name: "searchwrap",
  data() {
    return {
      searchContent: ""
    };
  },
  methods: {
    search() {
      console.log(1111)
      this.$router.push({
        name: 'SearchContent',
        params: {
          q: this.searchContent
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.search-area {
  padding: 10px 0 0 0;
  width: 100%;
  position: relative;
  b {
    height: 40px;
    width: 40px;
    background: url(../assets/search.png);
    position: absolute;
    top: 11px;
    right: 5px;
    transform: scale(0.5, 0.5);
    background-size: 100% 100%;
  }
  .search-input {
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
    height: 40px;
  }
  .search-input::-webkit-input-placeholder {
    color: #c0c0c0;
    font-size: 12px;
  }
}
</style>

