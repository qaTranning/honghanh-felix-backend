export const useLoadingStore = defineStore('loading', {
  state: () => ({ loading: false }),

  actions: {
    showLoading() {
      this.loading = true;
    },
    hideLoading() {
      this.loading = false;
    },
    toggleLoading() {
      this.loading = !this.loading;
    },
  },
});
