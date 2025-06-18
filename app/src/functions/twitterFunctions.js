import { useTwitterStore } from "../stores/twitter";
import axios from "../utils/axios.instance";
import { useUserStore } from "../stores/user";

// Add import for useRouter

async function getTimeline(forceRefresh = false) {
  try {
    const endpoint = `/api/twitter/timeline${forceRefresh ? "?refresh=true" : ""}`;

    const response = await axios.get(endpoint, {
      withCredentials: true,
      credentials: "include",
    });

    return response;
  } catch (error) {
    console.error("Error fetching Twitter timeline:", error);
    throw error;
  }
}

async function getFollowerGrowth(forceRefresh = false) {
  try {
    let res = await axios.get("/api/twitter/follower-growth", {
      timeout: 30000,
      withCredentials: true,
      credentials: "include",
      params: { refresh: forceRefresh },
    });
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Error fetching follower growth:", error);
    return {
      success: false,
      data: { data: [], totalGrowth: 0, dayCount: 0 },
      error: error.response?.data || "Failed to fetch follower growth data",
    };
  }
}

async function getPostMetrics(forceRefresh = false) {
  try {
    const endpoint = `/api/twitter/post-metrics${forceRefresh ? "?refresh=true" : ""}`;

    const response = await axios.get(endpoint, {
      withCredentials: true,
      credentials: "include",
    });

    return response;
  } catch (error) {
    console.error("Error fetching post metrics:", error);
    throw error;
  }
}

async function getTwitterProfile() {
  try {
    let res = await axios.get("/api/twitter/profile", {
      timeout: 600000,
      withCredentials: true,
      credentials: "include",
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching Twitter profile:", error);
    return null;
  }
}

// Twitter OAuth 2.0 connection
async function connectTwitter() {
  try {
    // Request OAuth 2.0 authorization URL
    const response = await axios.get("/auth/twitter/oauth-url", {
      timeout: 600000,
      withCredentials: true,
      credentials: "include",
    });

    const { authUrl } = response.data;
    console.log(authUrl);

    // Redirect to Twitter authorization page
    window.location.href = authUrl;

    return true;
  } catch (error) {
    console.error("Error connecting Twitter with OAuth 2.0:", error);
    return false;
  }
}

// OAuth 2.0 validation
async function validateTwitterAuth(code, state) {
  try {
    const twitterStore = useTwitterStore();

    // Exchange the code for access token
    const response = await axios.post(
      "/auth/twitter/callback",
      { code, state },
      {
        timeout: 600000,
        withCredentials: true,
        credentials: "include",
      }
    );

    const { userData } = response.data;
    console.log(userData);

    // Update the store with user data
    twitterStore.setTwitterConnected(userData.twitterConnected);
    twitterStore.setTwitterUsername(userData.twitterUsername);
    twitterStore.setTwitterName(userData.twitterName);
    twitterStore.setTwitterPhoto(userData.twitterPhoto);
    twitterStore.setIsVerified(userData.isVerified);
    twitterStore.setTwitterBanner(userData.twitterBanner);
    twitterStore.setTwitterPostsCount(userData.twitterPostsCount);
    twitterStore.setTwitterFollowersCount(userData.twitterFollowersCount);
    twitterStore.setTwitterFollowingCount(userData.twitterFollowingCount);

    // Update user style if needed
    const userStore = useUserStore();
    userStore.setStyle(userData.style);

    return true;
  } catch (error) {
    console.error("Error validating Twitter OAuth 2.0:", error);
    return false;
  }
}

// Function to sign out (replaces disconnect)
async function signOut() {
  try {
    const userStore = useUserStore();
    const twitterStore = useTwitterStore();

    // Call backend sign out
    await axios.post(
      "/auth/sign-out",
      {},
      {
        timeout: 600000,
        withCredentials: true,
        credentials: "include",
      }
    );

    // Clear all stores
    userStore.$reset();
    twitterStore.$reset();

    // Clear any local cache
    localStorage.removeItem("twitter_timeline_cache");
    localStorage.removeItem("twitter_metrics_cache");
    localStorage.removeItem("twitter_refresh_limit");
    localStorage.removeItem("twitter_refresh_time");

    console.log("Successfully signed out");

    return true;
  } catch (error) {
    console.error("Error signing out:", error);
    return false;
  }
}

/**
 * Get combined timeline and metrics data in a single API call
 * @param {boolean} forceRefresh - Whether to force a refresh of the data
 * @returns {Promise<Object>} The combined data (timeline and metrics)
 */
async function getCombinedData(forceRefresh = false) {
  try {
    const endpoint = `/api/twitter/combined${forceRefresh ? "?refresh=true" : ""}`;

    const response = await axios.get(endpoint, {
      withCredentials: true,
      credentials: "include",
    });

    return response;
  } catch (error) {
    console.error("Error fetching combined Twitter data:", error);
    throw error;
  }
}

async function postReply(tweetId, replyText) {
  try {
    const endpoint = "/api/twitter/reply";

    const response = await axios.post(
      endpoint,
      {
        tweetId,
        replyText,
      },
      {
        withCredentials: true,
        credentials: "include",
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error posting reply to tweet:", error);
    throw error;
  }
}

export {
  getTimeline,
  getFollowerGrowth,
  getPostMetrics,
  getTwitterProfile,
  connectTwitter,
  validateTwitterAuth,
  signOut,
  getCombinedData,
  postReply,
};
