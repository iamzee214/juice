import { defineStore } from "pinia";

export const useTwitterStore = defineStore({
  id: "twitter",
  state: () => ({
    twitterConnected: false,
    twitterUsername: null,
    twitterName: null,
    twitterPhoto: null,
    isVerified: false,
    twitterBanner: null,
    twitterPostsCount: null,
    twitterFollowersCount: null,
    twitterFollowingCount: null,
    apiKeyConnected: false,
  }),

  actions: {
    setIsVerified(isVerified) {
      this.isVerified = isVerified;
    },
    setTwitterConnected(twitterConnected) {
      this.twitterConnected = twitterConnected;
    },
    setTwitterUsername(twitterUsername) {
      this.twitterUsername = twitterUsername;
    },
    setTwitterName(twitterName) {
      this.twitterName = twitterName;
    },
    setTwitterPhoto(twitterPhoto) {
      this.twitterPhoto = twitterPhoto;
    },
    setTwitterBanner(twitterBanner) {
      this.twitterBanner = twitterBanner;
    },
    setTwitterPostsCount(count) {
      this.twitterPostsCount = count;
    },
    setTwitterFollowersCount(count) {
      this.twitterFollowersCount = count;
    },
    setTwitterFollowingCount(count) {
      this.twitterFollowingCount = count;
    },
    setApiKeyConnected(connected) {
      this.apiKeyConnected = connected;
    },
    clearAccountInfo() {
      this.isVerified = false;
      this.twitterConnected = false;
      this.twitterUsername = null;
      this.twitterName = null;
      this.twitterPhoto = null;
      this.twitterBanner = null;
      this.twitterPostsCount = null;
      this.twitterFollowersCount = null;
      this.twitterFollowingCount = null;
      this.apiKeyConnected = false;
    },
  },
  persist: true,
});
