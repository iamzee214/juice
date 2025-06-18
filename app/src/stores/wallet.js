import { defineStore } from "pinia";

export const useWalletStore = defineStore({
  id: "wallet",
  state: () => ({
    isLoggedIn: false,
    walletAddress: null,
    tokens: [],
    totalValue: 0,
  }),
  actions: {
    setIsLoggedIn(isLoggedIn) {
      this.isLoggedIn = isLoggedIn;
    },
    setWalletAddress(walletAddress) {
      this.walletAddress = walletAddress;
    },
    setTokens(tokens) {
      this.tokens = tokens;
    },
    setTotalValue(totalValue) {
      this.totalValue = totalValue;
    },
  },
  persist: false,
});
