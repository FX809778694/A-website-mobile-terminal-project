<template>
  <div class="split_title">
    <mark></mark>
    <h2 class="split_content">
      <slot></slot>
    </h2>
  </div>
</template>

<script>
export default {
  name: "SplitTitle",
  data() {
    return {};
  }
};
</script>

<style scope lang="scss">
.split_title {
  display: flex;
  align-items: cneter;
  height: 16px;
  padding: 3px 0;
  margin: 10px 0;
  mark,
  .split_content {
    display: inline-block;
    height: 16px;
    line-height: 16px;
    vertical-align: middle;
  }
  mark {
    width: 2px;
    margin-right: 4px;
    background-color: #6dbfee;
  }
  .split_content {
    font-size: 16px;
    font-weight: 500;
    color: #414141;
  }
}
</style>

