export const globelFnHanle = {
  methods: {
    /* 全局 ErrorCode 监听处理 */
    globelReqHandle({
      Success,
      ErrorMsg,
      Data,
      Total,
      ErrorCode
    }) {
      if (ErrorCode === 100) {
        /**
         * TODO:
         * 重定向至登录页
         */
        return false;
      } else if (ErrorCode !== 0) {
        this.$message(ErrorMsg);
        console.log(ErrorMsg);
        return false;
      }

      return Promise.resolve({
        Success,
        ErrorMsg,
        Data,
        Total,
        ErrorCode
      });
    },
    /* 全局 error 监听处理 */
    globelErrHandle(err) {
      console.log(err);
    }
  }
}
