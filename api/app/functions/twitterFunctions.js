import axios from "axios";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config({ path: `${process.env.NODE_ENV}.env` });
import { Client, auth } from "twitter-api-sdk";
import TwitterStat from "../../models/twitterStat.js";
import * as authFunctions from "./authFunctions.js";
import crypto from "crypto";
import {
  processRateLimit,
  updateRateLimitFromHeaders,
} from "../middleware/rateLimiter.js";
import User from "../../models/user.js";

// OAuth 2.0 configuration
const CLIENT_ID = process.env.TWITTER_CLIENT_ID;
const CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET;
const CALLBACK_URL = process.env.O_AUTH_CALLBACK;

// Scopes for OAuth 2.0
const TWITTER_SCOPES = [
  "tweet.read",
  "users.read",
  "follows.read",
  "follows.write",
  "tweet.write", // Permission to create tweets
  "offline.access", // Important for refresh tokens
];

// Store active OAuth sessions
const oauthSessions = new Map();

// Cache for storing Twitter clients
const clientCache = new Map();

// Expiration time for cached clients (milliseconds)
const CLIENT_CACHE_TTL = 30 * 60 * 1000; // 30 minutes

// Maximum size of the client cache
const MAX_CACHE_SIZE = 1000;

/**
 * Clean up expired clients from the cache
 */
function cleanupExpiredClients() {
  console.log("Running client cache cleanup");
  const now = new Date();
  let expiredCount = 0;

  // Check each client and remove expired ones
  for (const [userId, cachedClient] of clientCache.entries()) {
    if (now.getTime() > cachedClient.expiresAt.getTime()) {
      clientCache.delete(userId);
      expiredCount++;
    }
  }

  // If cache is still too large after removing expired entries,
  // remove the oldest entries until we're under the limit
  if (clientCache.size > MAX_CACHE_SIZE) {
    console.log(
      `Cache size (${clientCache.size}) exceeds limit (${MAX_CACHE_SIZE}), removing oldest entries`
    );

    // Convert to array to sort by expiration time
    const entries = Array.from(clientCache.entries());
    entries.sort((a, b) => a[1].expiresAt.getTime() - b[1].expiresAt.getTime());

    // Remove oldest entries until we're under the limit
    const toRemove = entries.slice(0, clientCache.size - MAX_CACHE_SIZE);
    for (const [userId] of toRemove) {
      clientCache.delete(userId);
    }

    console.log(`Removed ${toRemove.length} oldest entries from client cache`);
  }

  console.log(
    `Cleaned up ${expiredCount} expired clients, current cache size: ${clientCache.size}`
  );
}

// Run cleanup every 15 minutes
setInterval(cleanupExpiredClients, 15 * 60 * 1000);

// Also clean up on startup
cleanupExpiredClients();

/**
 * Generate PKCE code verifier and challenge
 * @returns {object} Object containing codeVerifier and codeChallenge
 */
function generatePKCE() {
  // Generate a random code verifier (43-128 characters)
  const codeVerifier = crypto.randomBytes(32).toString("base64url");

  // For Twitter OAuth 2.0, use 'plain' method instead of 'S256'
  // This solves the "Missing valid authorization header" issue
  const codeChallenge = codeVerifier;

  return { codeVerifier, codeChallenge };
}

/**
 * Generates an auth URL for Twitter OAuth 2.0
 * @returns {string} The authorization URL
 */
function getTwitterOAuth2AuthorizeUrl() {
  // Generate a random state value for security
  const state = crypto.randomBytes(16).toString("hex");

  console.log("Before generateAuthURL - OAuth setup:", {
    client_id: CLIENT_ID ? "exists" : "missing",
    callback: CALLBACK_URL,
    scopes: TWITTER_SCOPES.length,
  });

  // Generate PKCE parameters
  const { codeVerifier, codeChallenge } = generatePKCE();

  // Create a new OAuth2User client for this session
  const sessionAuthClient = new auth.OAuth2User({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    callback: CALLBACK_URL,
    scopes: TWITTER_SCOPES,
  });

  // Generate the auth URL with our own PKCE parameters using 'plain' method
  const authUrl = sessionAuthClient.generateAuthURL({
    state,
    code_challenge_method: "plain", // Use 'plain' instead of 'S256' for Twitter
    code_challenge: codeChallenge,
  });

  // Replace twitter.com with x.com in the URL
  const updatedAuthUrl = authUrl.replace("twitter.com", "x.com");

  console.log("getTwitterOAuth2AuthorizeUrl debug:", {
    state,
    authUrlGenerated: authUrl ? "yes" : "no",
    codeVerifier: codeVerifier ? "exists" : "missing",
    codeVerifierLength: codeVerifier ? codeVerifier.length : 0,
    codeChallenge: codeChallenge ? "exists" : "missing",
    codeChallengeLength: codeChallenge ? codeChallenge.length : 0,
    challengeMethod: "plain",
  });

  // Store the OAuth client AND codeVerifier separately for this session
  oauthSessions.set(state, {
    client: sessionAuthClient,
    codeVerifier: codeVerifier,
    createdAt: new Date(),
  });

  // Clean up old sessions (older than 10 minutes)
  setTimeout(() => {
    oauthSessions.delete(state);
  }, 10 * 60 * 1000);

  return { authUrl: updatedAuthUrl, state, codeVerifier };
}

/**
 * Store OAuth session data temporarily
 * @param {string} state - The OAuth state parameter
 * @param {string} codeVerifier - The PKCE code verifier
 */
async function storeOAuthSession(state, codeVerifier) {
  oauthSessions.set(state, {
    codeVerifier,
    createdAt: new Date(),
  });

  // Clean up old sessions (older than 10 minutes)
  setTimeout(() => {
    oauthSessions.delete(state);
  }, 10 * 60 * 1000);
}

/**
 * Get OAuth session data
 * @param {string} state - The OAuth state parameter
 * @returns {object|null} The OAuth session data or null if not found
 */
async function getOAuthSession(state) {
  return oauthSessions.get(state) || null;
}

/**
 * Clean up OAuth session data
 * @param {string} state - The OAuth state parameter
 */
async function cleanupOAuthSession(state) {
  oauthSessions.delete(state);
}

/**
 * Requests access token using authorization code
 * @param {string} code - The authorization code
 * @param {string} state - The state parameter to identify the OAuth session
 * @param {string} codeVerifier - The PKCE code verifier
 * @returns {object} The access and refresh tokens
 */
async function getTwitterOAuth2Tokens(code, state, codeVerifier) {
  try {
    console.log("getTwitterOAuth2Tokens debug:", {
      codeLength: code ? code.length : 0,
      state: state,
      CLIENT_ID: CLIENT_ID ? "exists" : "missing",
      CLIENT_SECRET: CLIENT_SECRET ? "exists" : "missing",
      codeVerifier: codeVerifier ? "exists" : "missing",
    });

    if (!codeVerifier) {
      throw new Error("Missing codeVerifier for token exchange");
    }

    console.log("About to request access token using direct API call...");

    // Use direct API call for token exchange
    const tokenData = {
      grant_type: "authorization_code",
      code: code,
      redirect_uri: CALLBACK_URL,
      code_verifier: codeVerifier,
    };

    const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
      "base64"
    );

    console.log("Making direct token exchange API call:", {
      url: "https://api.twitter.com/2/oauth2/token",
      hasCodeVerifier: !!codeVerifier,
      hasCredentials: !!credentials,
      tokenData: Object.keys(tokenData),
    });

    const response = await axios.post(
      "https://api.twitter.com/2/oauth2/token",
      new URLSearchParams(tokenData).toString(),
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("Direct API token exchange successful");
    return {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_at: response.data.expires_in
        ? new Date(Date.now() + response.data.expires_in * 1000)
        : new Date(Date.now() + 7200 * 1000), // Default 2 hours
    };
  } catch (error) {
    console.error("Error in getTwitterOAuth2Tokens:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    throw error;
  }
}

/**
 * Refreshes an access token using a refresh token
 * @param {string} refreshToken - The refresh token
 * @returns {object} The new access and refresh tokens
 */
async function refreshTwitterToken(refreshToken) {
  try {
    console.log("Attempting to refresh Twitter token");

    // Create a temporary client for token refresh
    const refreshClient = new auth.OAuth2User({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      callback: CALLBACK_URL,
      scopes: TWITTER_SCOPES,
      token: {
        refresh_token: refreshToken,
      },
    });

    // Refresh the token
    console.log("Calling refreshAccessToken");
    const tokens = await refreshClient.refreshAccessToken();

    console.log("Token refreshed successfully", {
      access_token_length: tokens.token.access_token
        ? tokens.token.access_token.length
        : 0,
      refresh_token_length: tokens.token.refresh_token
        ? tokens.token.refresh_token.length
        : 0,
      expires_in: tokens.token.expires_in,
    });

    return {
      access_token: tokens.token.access_token,
      refresh_token: tokens.token.refresh_token,
      expires_at: new Date(Date.now() + tokens.token.expires_in * 1000),
    };
  } catch (error) {
    console.error("Error refreshing Twitter token:", error);
    console.error(
      "Error details:",
      JSON.stringify({
        message: error.message,
        statusCode: error.statusCode,
        errorType: error.constructor.name,
      })
    );
    throw error;
  }
}

/**
 * Creates a new Twitter API client with the provided access token
 * @param {string} accessToken - The access token
 * @param {string} refreshToken - Optional refresh token (only include if token refresh is needed)
 * @returns {Client} Twitter API client instance
 */
function createTwitterClient(accessToken, refreshToken = null) {
  // Use OAuth2User for User Context authentication instead of OAuth2Bearer
  const clientOptions = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    callback: CALLBACK_URL,
    scopes: TWITTER_SCOPES,
    token: {
      access_token: accessToken,
      refresh_token: refreshToken,
    },
    // Disable auto refresh to prevent the SDK from trying to refresh tokens automatically
    auto_refresh: refreshToken !== null, // Only enable auto-refresh if we actually have a refresh token
  };

  // Only add refresh token if provided
  if (refreshToken) {
    clientOptions.token.refresh_token = refreshToken;
  }

  const userAuthClient = new auth.OAuth2User(clientOptions);
  return new Client(userAuthClient);
}

/**
 * Checks if an access token is expired and refreshes it if needed
 * @param {string} accessToken - The current access token
 * @param {string} refreshToken - The refresh token
 * @param {Date} expiresAt - The expiration date of the access token
 * @param {number} userId - The user ID
 * @returns {object} Object containing the current valid tokens
 */
async function checkAndRefreshToken(
  accessToken,
  refreshToken,
  expiresAt,
  userId
) {
  // If there's no expiration time or refresh token, just return the current tokens
  if (!refreshToken) {
    console.log("No refresh token available, can't refresh");
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt,
    };
  }

  const now = new Date();
  // Add a 5-minute buffer to refresh tokens before they actually expire
  const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
  const expiry = expiresAt ? new Date(expiresAt) : new Date(now - 1); // If no expiry date, treat as expired

  // If token is expired or will expire soon, refresh it
  if (!expiresAt || now.getTime() > expiry.getTime() - bufferTime) {
    try {
      console.log("Access token expired or expiring soon, refreshing...");
      const newTokens = await refreshTwitterToken(refreshToken);
      console.log("Successfully refreshed token");

      // Update user's tokens in database
      await authFunctions.updateUser(userId, {
        twitter_access_token: newTokens.access_token,
        twitter_refresh_token: newTokens.refresh_token,
        twitter_token_expires_at: newTokens.expires_at,
      });

      return {
        access_token: newTokens.access_token,
        refresh_token: newTokens.refresh_token,
        expires_at: newTokens.expires_at,
      };
    } catch (error) {
      console.error("Error refreshing token proactively:", error);
      // If refresh fails, continue with the current token and let the
      // makeTwitterApiRequest function handle a potential 401 error
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: expiresAt,
      };
    }
  }

  // Token is still valid
  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_at: expiresAt,
  };
}

/**
 * Checks if a cached client exists and is valid
 * @param {string} userId - The user ID
 * @returns {boolean} Whether the cached client is valid
 */
function isValidCachedClient(userId) {
  if (!clientCache.has(userId)) {
    return false;
  }

  const cachedClient = clientCache.get(userId);
  const now = new Date();

  // Check if client has expired
  if (now.getTime() > cachedClient.expiresAt.getTime()) {
    console.log(`Cached client for user ${userId} has expired`);
    return false;
  }

  return true;
}

/**
 * Get a reusable Twitter client that can be shared across multiple API requests
 * @param {string} accessToken - The OAuth 2.0 access token
 * @param {string} refreshToken - The OAuth 2.0 refresh token
 * @param {number} userId - The internal user ID
 * @returns {object} An object containing the Twitter client and tokens
 */
async function getTwitterClient(accessToken, refreshToken, userId) {
  try {
    // Check if we have a valid cached client
    if (isValidCachedClient(userId)) {
      console.log(`Using cached Twitter client for user ${userId}`);
      return clientCache.get(userId);
    }

    console.log(`Creating new Twitter client for user ${userId}`);

    // Get the user to check token expiration time
    const user = await authFunctions.getUser(userId);
    console.log(`Twitter ID: ${user.twitterId}`);

    // Check if token is expired or will expire soon, and refresh if needed
    const tokens = await checkAndRefreshToken(
      accessToken,
      refreshToken,
      user.twitter_token_expires_at,
      userId
    );

    // Create the client with potentially refreshed token
    console.log("Creating Twitter client with access token");
    const client = createTwitterClient(
      tokens.access_token,
      tokens.refresh_token
    );

    // Calculate expiration time for the cached client
    // Use token expiration time if available, otherwise default cache TTL
    const tokenExpiresAt = tokens.expires_at
      ? new Date(tokens.expires_at)
      : null;
    const cacheExpiresAt =
      tokenExpiresAt || new Date(Date.now() + CLIENT_CACHE_TTL);

    // Store client in cache
    const clientData = {
      client,
      tokens,
      expiresAt: cacheExpiresAt,
    };

    clientCache.set(userId, clientData);
    console.log(
      `Cached Twitter client for user ${userId}, expires at ${cacheExpiresAt.toISOString()}`
    );

    return clientData;
  } catch (error) {
    console.error("Error creating Twitter client:", error);
    throw error;
  }
}

/**
 * Invalidates the cached client for a user
 * @param {string} userId - The user ID
 */
function invalidateClientCache(userId) {
  if (clientCache.has(userId)) {
    console.log(`Invalidating cached Twitter client for user ${userId}`);
    clientCache.delete(userId);
  }
}

/**
 * Clears the entire client cache
 */
function clearClientCache() {
  console.log("Clearing entire Twitter client cache");
  clientCache.clear();
}

/**
 * Clears all cached Twitter data for a user
 * @param {Number} userId - The internal user ID
 */
async function clearTwitterCache(userId) {
  try {
    console.log(`Clearing Twitter cache for user ${userId}`);

    // Clear the client cache for this user
    invalidateClientCache(userId);

    // Delete Twitter stats for this user
    await TwitterStat.deleteMany({ userId });

    // Clear rate limit data for this user
    await processRateLimit.clearUserRateLimits(userId);

    // Clear cached user data
    await User.findOneAndUpdate(
      { id: userId },
      {
        cachedTimeline: null,
        cachedAt: null,
        cachedPostMetrics: null,
      }
    );

    console.log(`Successfully cleared Twitter cache for user ${userId}`);
    return true;
  } catch (error) {
    console.error(`Error clearing Twitter cache for user ${userId}:`, error);
    return false;
  }
}

/**
 * Makes a Twitter API request using OAuth 2.0
 * @param {Function} apiCall - The API call function to execute
 * @param {string} accessToken - The access token
 * @param {string} refreshToken - The refresh token
 * @param {number} userId - The user ID
 * @param {object} existingClient - Optional existing Twitter client to use
 * @returns {object} The API response
 */
async function makeTwitterApiRequest(
  apiCall,
  accessToken,
  refreshToken,
  userId,
  existingClient = null
) {
  try {
    let client;
    let tokens;

    // Use existing client if provided, otherwise get from cache or create a new one
    if (existingClient) {
      console.log(`Using provided existing client for user ${userId}`);
      client = existingClient;
      // We don't have tokens directly, but that's ok since we're using an existing client
    } else {
      // Try to get or create client
      console.log(
        `No client provided, getting from cache or creating new for user ${userId}`
      );
      const clientData = await getTwitterClient(
        accessToken,
        refreshToken,
        userId
      );
      client = clientData.client;
      tokens = clientData.tokens;
    }

    // Validate client
    if (!client) {
      throw new Error("Twitter client is null or undefined");
    }

    // Make the API call
    console.log("Executing Twitter API call");
    const response = await apiCall(client);
    console.log("Twitter API call successful");
    return response;
  } catch (error) {
    console.error("Twitter API Error:", error.constructor.name);

    // Check if this is a rate limit error
    if (error.statusCode === 429 || (error.status && error.status === 429)) {
      console.log("Twitter API rate limit reached");

      // Extract the reset time from headers if available
      if (error.headers && error.headers["x-rate-limit-reset"]) {
        const resetTime = new Date(
          parseInt(error.headers["x-rate-limit-reset"]) * 1000
        );
        console.log(`Rate limit will reset at: ${resetTime.toISOString()}`);
      }

      // Rethrow rate limit error
      throw error;
    }

    // Check for auth errors
    if (error.statusCode === 401 || (error.status && error.status === 401)) {
      console.log(
        "Twitter API authorization error, attempting to refresh token"
      );

      try {
        // Try to refresh the token
        const newTokens = await refreshTwitterToken(refreshToken);

        // Update user tokens in database
        await authFunctions.updateUser(userId, {
          twitter_access_token: newTokens.access_token,
          twitter_refresh_token: newTokens.refresh_token,
          twitter_token_expires_at: newTokens.expires_at,
        });

        // Create a new client with the refreshed token
        const newClient = createTwitterClient(
          newTokens.access_token,
          newTokens.refresh_token
        );

        // Try the API call again with the new client
        console.log("Retrying Twitter API call with refreshed token");
        const response = await apiCall(newClient);
        console.log("Twitter API retry successful");
        return response;
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        console.error("Token refresh failed, user needs to reconnect Twitter");

        // Clear existing Twitter tokens
        await authFunctions.updateUser(userId, {
          twitter_access_token: null,
          twitter_refresh_token: null,
          twitter_token_expires_at: null,
          twitterConnected: false,
        });

        // Return error with requiresReconnect flag
        const reconnectError = new Error("Twitter authorization expired");
        reconnectError.status = 401;
        reconnectError.requiresReconnect = true;
        throw reconnectError;
      }
    }

    // For other errors, just rethrow
    throw error;
  }
}

/**
 * Get user timeline using OAuth 2.0
 * @param {string} accessToken - The OAuth 2.0 access token
 * @param {string} refreshToken - The OAuth 2.0 refresh token
 * @param {string} twitterId - The Twitter user ID
 * @param {number} userId - The internal user ID
 * @param {object} existingClient - Optional existing Twitter client to use
 * @returns {object} User timeline data
 */
async function getUserTimeline(
  accessToken,
  refreshToken,
  twitterId,
  userId,
  existingClient = null
) {
  return makeTwitterApiRequest(
    async (client) => {
      const response = await client.tweets.usersIdTimeline(twitterId, {
        max_results: 50,
        expansions: ["author_id", "attachments.media_keys"],
        "tweet.fields": [
          "id",
          "text",
          "created_at",
          "public_metrics",
          "attachments",
          "entities",
          "referenced_tweets",
          "in_reply_to_user_id",
        ],
        "user.fields": [
          "id",
          "name",
          "username",
          "profile_image_url",
          "verified",
          "public_metrics",
        ],
        "media.fields": ["type", "url", "preview_image_url"],
        exclude: ["replies", "retweets"],
      });

      // Fix for Twitter API bug: manually filter out replies that weren't excluded
      if (response.data && Array.isArray(response.data)) {
        response.data = response.data.filter((tweet) => {
          // Filter out tweets that are replies (have referenced_tweets of type "replied_to")
          if (
            tweet.referenced_tweets &&
            Array.isArray(tweet.referenced_tweets)
          ) {
            return !tweet.referenced_tweets.some(
              (ref) => ref.type === "replied_to"
            );
          }
          return true;
        });
      }

      return response;
    },
    accessToken,
    refreshToken,
    userId,
    existingClient
  );
}

/**
 * Get user tweets with metrics using OAuth 2.0
 * @param {string} accessToken - The OAuth 2.0 access token
 * @param {string} refreshToken - The OAuth 2.0 refresh token
 * @param {string} twitterId - The Twitter user ID
 * @param {number} maxResults - The maximum number of results to return
 * @param {number} userId - The internal user ID
 * @param {object} existingClient - Optional existing Twitter client to use
 * @returns {object} User tweets with metrics
 */
async function getUserTweetsWithMetrics(
  accessToken,
  refreshToken,
  twitterId,
  maxResults = 20,
  userId,
  existingClient = null
) {
  return makeTwitterApiRequest(
    async (client) => {
      const response = await client.tweets.usersIdTweets(twitterId, {
        max_results: maxResults,
        expansions: ["attachments.media_keys"],
        "tweet.fields": [
          "id",
          "text",
          "created_at",
          "public_metrics",
          "attachments",
          "entities",
          "referenced_tweets",
          "in_reply_to_user_id",
        ],
        "user.fields": [
          "id",
          "name",
          "username",
          "profile_image_url",
          "verified",
        ],
        "media.fields": ["type", "url", "preview_image_url"],
        exclude: ["replies", "retweets"],
      });

      // Fix for Twitter API bug: manually filter out replies that weren't excluded
      if (response.data && Array.isArray(response.data)) {
        response.data = response.data.filter((tweet) => {
          // Filter out tweets that are replies (have referenced_tweets of type "replied_to")
          if (
            tweet.referenced_tweets &&
            Array.isArray(tweet.referenced_tweets)
          ) {
            return !tweet.referenced_tweets.some(
              (ref) => ref.type === "replied_to"
            );
          }
          return true;
        });
      }

      return response;
    },
    accessToken,
    refreshToken,
    userId,
    existingClient
  );
}

/**
 * Get user by ID using OAuth 2.0
 * @param {string} accessToken - The OAuth 2.0 access token
 * @param {string} refreshToken - The OAuth 2.0 refresh token
 * @param {string} twitterId - The Twitter user ID or 'me' for the authenticated user
 * @param {number} userId - The internal user ID
 * @param {object} existingClient - Optional existing Twitter client to use
 * @returns {object} User data
 */
async function getUserById(
  accessToken,
  refreshToken,
  twitterId,
  userId,
  existingClient = null
) {
  // Special handling for the initial auth flow
  if (twitterId === "me") {
    console.log(
      "Getting authenticated user info during OAuth flow using direct API call"
    );
    try {
      // Make a direct API call to Twitter v2 API instead of using the SDK
      // This completely avoids the SDK's auto-refresh mechanism
      const response = await axios.get("https://api.twitter.com/2/users/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        params: {
          "user.fields":
            "id,name,username,created_at,description,profile_image_url,public_metrics,verified,profile_banner_url",
          expansions: "pinned_tweet_id",
          "tweet.fields":
            "id,text,created_at,public_metrics,attachments,entities",
        },
      });

      console.log("Successfully fetched user data via direct API call");
      return response.data;
    } catch (error) {
      console.error(
        "Error getting authenticated user info via direct API call:",
        error
      );
      throw error;
    }
  }

  // For regular user info requests, use the makeTwitterApiRequest helper
  return makeTwitterApiRequest(
    async (client) => {
      return client.users.findUserById(twitterId, {
        expansions: ["pinned_tweet_id", "most_recent_tweet_id"],
        "user.fields": [
          "id",
          "name",
          "username",
          "created_at",
          "description",
          "profile_image_url",
          "public_metrics",
          "verified",
          "profile_banner_url",
        ],
        "tweet.fields": [
          "id",
          "text",
          "created_at",
          "public_metrics",
          "attachments",
          "entities",
        ],
      });
    },
    accessToken,
    refreshToken,
    userId,
    existingClient
  );
}

/**
 * Updates follower count in the database for a user
 * @param {Number} userId - The internal user ID
 * @param {String} twitterId - Twitter ID
 * @param {String} twitterUsername - Twitter username
 * @param {Number} followerCount - Current follower count
 */
async function updateFollowerStats(
  userId,
  twitterId,
  twitterUsername,
  followerCount
) {
  try {
    // Create a date object for today with time set to midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // First, try to find an existing record for today
    let stat = await TwitterStat.findOne({
      userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (stat) {
      // Update existing record
      stat.followerCount = followerCount;
      await stat.save();
    } else {
      // Create new record
      stat = new TwitterStat({
        userId,
        twitterId,
        twitterUsername,
        followerCount,
        date: today,
      });
      await stat.save();
    }

    return stat;
  } catch (error) {
    console.error("Error updating follower stats:", error);
    throw error;
  }
}

/**
 * Gets follower growth data for a user over the past 7 days
 * @param {Number} userId - The internal user ID
 */
async function getFollowerGrowth(userId) {
  try {
    // Get the date 7 days ago with time set to midnight
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Get all follower count records for the past 7 days
    const stats = await TwitterStat.find({
      userId,
      date: { $gte: sevenDaysAgo },
    }).sort({ date: 1 });

    // If we have no data, return empty result
    if (stats.length === 0) {
      // Try to get the user's current follower count
      const user = await authFunctions.getUser(userId);
      if (user && user.twitterFollowersCount) {
        // Create a fake data point for today with the current count
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return {
          data: [
            {
              date: today,
              followerCount: user.twitterFollowersCount,
            },
          ],
          totalGrowth: 0, // No historical data to compare
          dayCount: 1,
        };
      }

      return {
        data: [],
        totalGrowth: 0,
        dayCount: 0,
      };
    }

    // If we only have one data point, we can't calculate growth
    if (stats.length === 1) {
      return {
        data: stats.map((stat) => ({
          date: stat.date,
          followerCount: stat.followerCount,
        })),
        totalGrowth: 0,
        dayCount: 1,
      };
    }

    // Get the earliest count within our range
    const earliestCount = stats[0].followerCount;

    // Get the latest count
    const latestCount = stats[stats.length - 1].followerCount;

    // Calculate total growth
    const totalGrowth = latestCount - earliestCount;

    // Prepare daily data
    const dailyData = stats.map((stat) => ({
      date: stat.date,
      followerCount: stat.followerCount,
    }));

    // Fill in missing days with interpolated values to have a smoother graph
    const filledData = fillMissingDays(dailyData);

    return {
      data: filledData,
      totalGrowth,
      dayCount: stats.length,
    };
  } catch (error) {
    console.error("Error getting follower growth:", error);
    throw error;
  }
}

/**
 * Fill in missing days in the data array with interpolated values
 * @param {Array} data - Array of {date, followerCount} objects
 * @returns {Array} - Filled array with no missing days
 */
function fillMissingDays(data) {
  if (data.length <= 1) return data;

  const filledData = [...data];
  const sortedData = filledData.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const result = [sortedData[0]];

  for (let i = 1; i < sortedData.length; i++) {
    const currentDate = new Date(sortedData[i].date);
    const prevDate = new Date(sortedData[i - 1].date);

    // Calculate days between
    const daysDiff = Math.floor(
      (currentDate - prevDate) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff > 1) {
      // We have missing days
      const countDiff =
        sortedData[i].followerCount - sortedData[i - 1].followerCount;
      const dailyChange = countDiff / daysDiff;

      // Add interpolated points
      for (let j = 1; j < daysDiff; j++) {
        const interpolatedDate = new Date(prevDate);
        interpolatedDate.setDate(prevDate.getDate() + j);

        const interpolatedCount = Math.round(
          sortedData[i - 1].followerCount + dailyChange * j
        );

        result.push({
          date: interpolatedDate,
          followerCount: interpolatedCount,
          interpolated: true, // Mark as interpolated
        });
      }
    }

    result.push(sortedData[i]);
  }

  return result;
}

async function getPostMetrics(userId, existingClient = null) {
  // Get user's Twitter credentials and posts
  const user = await authFunctions.getUser(userId);

  try {
    const { twitter_access_token, twitter_refresh_token, twitterId } = user;

    // Get the user's tweets with metrics
    const timeline = await getUserTweetsWithMetrics(
      twitter_access_token,
      twitter_refresh_token,
      twitterId,
      30,
      userId,
      existingClient
    );

    // Get post IDs from the last 7 days
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentPosts = timeline.data || [];

    if (!recentPosts || recentPosts.length === 0) {
      return { posts: [], averages: {} };
    }

    const filteredPosts = recentPosts.filter((post) => {
      const postDate = new Date(post.created_at);
      return postDate >= sevenDaysAgo;
    });

    // Process and format the metrics
    const processedData = {
      posts: filteredPosts.map((post) => ({
        id: post.id,
        text: post.text,
        created_at: post.created_at,
        metrics: post.public_metrics,
      })),
      averages: {},
    };

    // Calculate averages
    if (filteredPosts.length > 0) {
      const metrics = {};
      const metricCounts = {};

      filteredPosts.forEach((post) => {
        if (post.public_metrics) {
          Object.entries(post.public_metrics).forEach(([key, value]) => {
            metrics[key] = (metrics[key] || 0) + value;
            metricCounts[key] = (metricCounts[key] || 0) + 1;
          });
        }
      });

      Object.entries(metrics).forEach(([key, total]) => {
        processedData.averages[key] = Math.round(total / metricCounts[key]);
      });
    }

    return processedData;
  } catch (error) {
    console.error("Error fetching post metrics with OAuth 2.0:", error);
    return { posts: [], averages: {} };
  }
}

/**
 * Posts a reply to a tweet using OAuth 2.0
 * @param {string} accessToken - The OAuth 2.0 access token
 * @param {string} refreshToken - The OAuth 2.0 refresh token
 * @param {string} tweetText - The text of the tweet reply
 * @param {string} replyToTweetId - The ID of the tweet to reply to
 * @param {number} userId - The internal user ID
 * @param {object} existingClient - Optional existing Twitter client to use
 * @returns {object} The created tweet data
 */
async function postTweetReply(
  accessToken,
  refreshToken,
  tweetText,
  replyToTweetId,
  userId,
  existingClient = null
) {
  return makeTwitterApiRequest(
    async (client) => {
      // Create the reply with reference to the tweet we're replying to
      const response = await client.tweets.createTweet({
        text: tweetText,
        reply: {
          in_reply_to_tweet_id: replyToTweetId,
        },
      });

      console.log("Successfully posted reply tweet");
      return response;
    },
    accessToken,
    refreshToken,
    userId,
    existingClient
  );
}

export {
  // OAuth 2.0 functions
  getTwitterOAuth2AuthorizeUrl,
  getTwitterOAuth2Tokens,
  storeOAuthSession,
  getOAuthSession,
  cleanupOAuthSession,
  refreshTwitterToken,
  checkAndRefreshToken,
  getTwitterClient,
  invalidateClientCache,
  clearClientCache,
  getUserTimeline,
  getUserTweetsWithMetrics,
  getUserById,
  postTweetReply,

  // Shared functions
  updateFollowerStats,
  getFollowerGrowth,
  getPostMetrics,
  clearTwitterCache,
};
