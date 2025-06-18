import { defineStore } from "pinia";
import axios_instance from "../utils/axios.instance";

export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    userId: null,
    isLoggedIn: false,
    style: null,
    authSolanaWalletAddress: null,
    sessionId: null,
    user: {
      configuration: {
        bullishTokens: [],
        bearishTokens: [],
        personalityTraits: [],
        bannedWords: [],
        interests: [],
        rules: [],
        isComplete: false,
      },
    },
  }),

  actions: {
    setAuthSolanaWalletAddress(authSolanaWalletAddress) {
      this.authSolanaWalletAddress = authSolanaWalletAddress;
    },
    setStyle(style) {
      this.style = style;
    },
    setUserId(userId) {
      this.userId = userId;
    },

    setIsLoggedIn(isLoggedIn) {
      this.isLoggedIn = isLoggedIn;
    },

    setSessionId(sessionId) {
      this.sessionId = sessionId;
    },

    updateConfiguration(configuration) {
      this.user.configuration = configuration;
    },

    async refreshUserData() {
      try {
        const response = await axios_instance.get("/api/auth/user-data", {
          withCredentials: true,
          credentials: "include",
        });
        if (response.data && response.data.user) {
          this.setUser(response.data.user);
        }
        return response.data.user;
      } catch (error) {
        console.error("Error refreshing user data:", error);
        throw error;
      }
    },

    setUser(userData) {
      this.user = userData || { configuration: null };
      if (!this.user.configuration) {
        this.user.configuration = {
          bullishTokens: [],
          bearishTokens: [],
          personalityTraits: [],
          bannedWords: [],
          interests: [],
          rules: [],
          isComplete: false,
        };
      }
    },

    // Add a reset method for logout
    resetStore() {
      this.$reset();
    },
  },
  persist: true,
});
