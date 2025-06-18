import mongoose from "mongoose";
import MongooseSequence from "mongoose-sequence";

const mongooseSequence = MongooseSequence(mongoose);
function getBalance(value) {
  if (typeof value !== "undefined") {
    return parseFloat(value.toString());
  }
  return value;
}
const schema = new mongoose.Schema(
  {
    id: {
      type: Number,
      default: 0,
      unique: true,
      required: true,
    },

    solanaWalletAddress: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },
    solanaNonce: {
      type: Number,
      default: () => Math.floor(Math.random() * 100000000), // Initialize with a random nonce
    },
    // DEPRECATED: Legacy OAuth 1.0a tokens - kept for backward compatibility
    // These fields will be removed in a future update
    oauth_token: {
      type: String,
      default: null,
    },
    oauth_token_secret: {
      type: String,
      default: null,
    },
    oauth_access_token: {
      type: String,
      default: null,
    },
    oauth_access_token_secret: {
      type: String,
      default: null,
    },
    // OAuth 2.0 tokens - Current implementation
    twitter_access_token: {
      type: String,
      default: null,
    },
    twitter_refresh_token: {
      type: String,
      default: null,
    },
    twitter_token_expires_at: {
      type: Date,
      default: null,
    },
    twitter_auth_state: {
      type: String,
      default: null,
    },
    twitter_code_verifier: {
      type: String,
      default: null,
    },
    style: {
      type: String,
      default: null,
    },
    // New properties
    twitterUsername: {
      type: String,
      default: null,
    },
    twitterId: {
      type: String,
      default: null,
    },
    twitterName: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    twitterConnected: {
      type: Boolean,
      default: false,
    },
    twitterPhoto: {
      type: String,
      default: null,
    },
    twitterBanner: {
      type: String,
      default: null,
    },
    twitterPostsCount: {
      type: Number,
      default: 0,
    },
    twitterFollowersCount: {
      type: Number,
      default: 0,
    },
    twitterFollowingCount: {
      type: Number,
      default: 0,
    },
    membershipStatus: {
      type: String,
      default: "none",
    },
    // Configuration settings
    configuration: {
      type: Object,
      default: {
        bullishTokens: [],
        bearishTokens: [],
        personalityTraits: [],
        bannedWords: [],
        isComplete: false,
      },
    },
    // AI prompt template
    aiPromptTemplate: {
      type: String,
      default: null,
    },
    // Cache data
    cachedTimeline: {
      type: Object,
      default: null,
    },
    cachedPostMetrics: {
      type: Object,
      default: null,
    },
    cachedAt: {
      type: Date,
      default: null,
    },
    // Rate limit information
    rateLimitReset: {
      type: Date,
      default: null,
    },
    rateLimitRemaining: {
      type: Number,
      default: null,
    },
    // Daily refresh limit tracking
    refreshCount: {
      type: Number,
      default: 0,
    },
    lastRefreshDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);
// add unique id
schema.plugin(mongooseSequence, {
  id: "user_id",
  inc_field: "id",
  collection_name: "ids",
});
export default mongoose.model("user", schema);
