<template>
  <div class="not-found">
    <p class="txt">没有权限调用接口，尝试重新登陆解决</p>
    <x-button class="toLogin" @click.native="$router.push({path: 'www.baidu.com'})" mini>去登陆</x-button>
  </div>
</template>

<script>
export default {
  name: "NotFound",
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.not-found {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  width: 100%;
  height: 100%;
  .txt {
    height: 60px;
    line-height: 60px;
  }
  .toLogin {
    width: 100px;
  }
}
</style>
