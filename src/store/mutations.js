export default {
  setLoading(state, val) {
    state.loading = val
  },
  setErrorMsg(state, val) {
    state.errorMsg = val
  },
  setRequestErr(state, val) {
    state.isRequestErr = val
  },
  setLogin(state, val) {
    state.isLogin = val
  },
  setDetail(state, val) {
    state.isDetail = val
  },
  setTitle(state, val) {
    state.demoTitle = val;
  },
  updateDirection(state, val) {
    state.direction = val
  },
  setTabbarIndex(state, val) {
    state.tabbarIndex = val
  }
}
