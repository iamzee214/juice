import { defineStore } from "pinia";

export const useAlertStore = defineStore({
  id: "alert",
  state: () => ({
    successMessage: null,
    errorMessage: null,
    progressMessage: null,
    progress: 0,
  }),

  actions: {
    setSuccessMessage(successMessage) {
      this.successMessage = successMessage;
      setTimeout(() => {
        this.successMessage = null;
      }, 3000);
    },
    setErrorMessage(errorMessage) {
      this.errorMessage = errorMessage;
      setTimeout(() => {
        this.errorMessage = null;
      }, 3000);
    },
    setProgressMessage(progressMessage) {
      this.progressMessage = progressMessage;
    },
    setProgress(progress) {
      this.progress = progress;
    },
  },
  persist: false,
});
