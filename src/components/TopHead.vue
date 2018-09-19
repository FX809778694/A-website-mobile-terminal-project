 <template>
  <div class="top_head">
    <nav></nav>
  </div>
</template>

<script>
export default {
  name: "TopHead",
  data() {
    return {};
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    list: {
      type: Array,
      default: () => []
    }
  }
};
</script>

<style scoped lang="scss">
.top_head {
}
</style>

