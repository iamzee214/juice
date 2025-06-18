import * as twitterFunctions from "../functions/twitterFunctions.js";
import * as authFunctions from "../functions/authFunctions.js";
import * as aiPromptFunctions from "../functions/aiPromptFunctions.js";
import User from "../../models/user.js";

// Cache expiration time (1 day in milliseconds)
const CACHE_TTL = 24 * 60 * 60 * 1000;

// Daily refresh limit
const DAILY_REFRESH_LIMIT = 5;

// Check if cache is valid (less than 1 day old)
function isCacheValid(cachedAt) {
  if (!cachedAt) return false;
  const now = new Date();
  const cacheDate = new Date(cachedAt);
  return now - cacheDate < CACHE_TTL;
}

// Format response with cache info
function formatResponseWithCacheInfo(data, cachedAt, rateLimitReset) {
  const isCached = !!cachedAt;
  const canRefreshAt = rateLimitReset
    ? new Date(rateLimitReset).toISOString()
    : null;

  return {
    data: data,
    cacheInfo: {
      fromCache: isCached,
      cachedAt: cachedAt ? new Date(cachedAt).toISOString() : null,
      canRefreshAt,
      cacheExpiresAt: cachedAt
        ? new Date(new Date(cachedAt).getTime() + CACHE_TTL).toISOString()
        : null,
    },
  };
}

// Check if refresh count should be reset (new day)
function shouldResetRefreshCount(lastRefreshDate) {
  if (!lastRefreshDate) return true;

  const now = new Date();
  const last = new Date(lastRefreshDate);

  return (
    now.getDate() !== last.getDate() ||
    now.getMonth() !== last.getMonth() ||
    now.getFullYear() !== last.getFullYear()
  );
}

// Check if user has exceeded daily refresh limit
async function checkRefreshLimit(userId) {
  const user = await User.findOne({ id: userId });

  // Initialize refresh tracking if not present
  if (!user.refreshCount || shouldResetRefreshCount(user.lastRefreshDate)) {
    await User.findOneAndUpdate(
      { id: userId },
      {
        refreshCount: 0,
        lastRefreshDate: new Date(),
      }
    );
    return {
      canRefresh: true,
      remaining: DAILY_REFRESH_LIMIT,
    };
  }

  // Check if user has refreshes remaining
  if (user.refreshCount >= DAILY_REFRESH_LIMIT) {
    return {
      canRefresh: false,
      remaining: 0,
      error: "Daily refresh limit reached",
    };
  }

  return {
    canRefresh: true,
    remaining: DAILY_REFRESH_LIMIT - user.refreshCount,
  };
}

// Increment user's refresh count
async function incrementRefreshCount(userId) {
  const user = await User.findOne({ id: userId });

  // Reset count if it's a new day
  if (shouldResetRefreshCount(user.lastRefreshDate)) {
    await User.findOneAndUpdate(
      { id: userId },
      {
        refreshCount: 1,
        lastRefreshDate: new Date(),
      }
    );
    return DAILY_REFRESH_LIMIT - 1;
  }

  // Increment count
  const newCount = (user.refreshCount || 0) + 1;
  await User.findOneAndUpdate(
    { id: userId },
    {
      refreshCount: newCount,
      lastRefreshDate: new Date(),
    }
  );

  return DAILY_REFRESH_LIMIT - newCount;
}

async function getUserTimeline(req, res) {
  try {
    let userId = req.user_id;
    let user = await authFunctions.getUser(userId);
    const { twitter_access_token, twitter_refresh_token, twitterId } = user;

    // Force refresh parameter
    const forceRefresh = req.query.refresh === "true";

    // Check if we have cached data that's still valid
    if (!forceRefresh && user.cachedTimeline && isCacheValid(user.cachedAt)) {
      console.log("Returning cached timeline data");
      console.log("Cached timeline type:", typeof user.cachedTimeline);

      // Ensure the cached timeline is an object before returning
      let cachedData = user.cachedTimeline;
      if (typeof cachedData === "string") {
        try {
          cachedData = JSON.parse(cachedData);
        } catch (e) {
          console.error("Error parsing cached timeline data:", e);
        }
      }

      return res.status(200).send({
        data: cachedData,
        cacheInfo: {
          fromCache: true,
          cachedAt: user.cachedAt
            ? new Date(user.cachedAt).toISOString()
            : null,
          canRefreshAt: user.rateLimitReset
            ? new Date(user.rateLimitReset).toISOString()
            : null,
          cacheExpiresAt: user.cachedAt
            ? new Date(
                new Date(user.cachedAt).getTime() + CACHE_TTL
              ).toISOString()
            : null,
        },
        refreshInfo: {
          remaining: user.refreshCount
            ? DAILY_REFRESH_LIMIT - user.refreshCount
            : DAILY_REFRESH_LIMIT,
          limit: DAILY_REFRESH_LIMIT,
        },
      });
    }

    // If force refresh, check daily refresh limit
    if (forceRefresh) {
      const refreshLimit = await checkRefreshLimit(userId);
      if (!refreshLimit.canRefresh) {
        // Return cached data with refresh limit error
        if (user.cachedTimeline) {
          let cachedData = user.cachedTimeline;
          if (typeof cachedData === "string") {
            try {
              cachedData = JSON.parse(cachedData);
            } catch (e) {
              console.error("Error parsing cached timeline data:", e);
            }
          }

          return res.status(200).send({
            data: cachedData,
            cacheInfo: {
              fromCache: true,
              cachedAt: user.cachedAt
                ? new Date(user.cachedAt).toISOString()
                : null,
              cacheExpiresAt: user.cachedAt
                ? new Date(
                    new Date(user.cachedAt).getTime() + CACHE_TTL
                  ).toISOString()
                : null,
            },
            refreshInfo: {
              remaining: 0,
              limit: DAILY_REFRESH_LIMIT,
              error: "Daily refresh limit reached",
            },
          });
        }

        return res.status(429).send({
          error: "Daily refresh limit reached (5 refreshes per day)",
          refreshInfo: {
            remaining: 0,
            limit: DAILY_REFRESH_LIMIT,
          },
        });
      }

      // Increment refresh count
      await incrementRefreshCount(userId);
    }

    // Check if we're rate limited
    const now = new Date();
    if (
      user.rateLimitReset &&
      new Date(user.rateLimitReset) > now &&
      user.rateLimitRemaining === 0
    ) {
      // If rate limited but we have cached data, return it
      if (user.cachedTimeline) {
        console.log("Rate limited, returning cached timeline data");
        console.log("Cached timeline type:", typeof user.cachedTimeline);

        // Ensure the cached timeline is an object before returning
        let cachedData = user.cachedTimeline;
        if (typeof cachedData === "string") {
          try {
            cachedData = JSON.parse(cachedData);
          } catch (e) {
            console.error("Error parsing cached timeline data:", e);
          }
        }

        return res.status(200).send({
          data: cachedData,
          cacheInfo: {
            fromCache: true,
            cachedAt: user.cachedAt
              ? new Date(user.cachedAt).toISOString()
              : null,
            canRefreshAt: user.rateLimitReset
              ? new Date(user.rateLimitReset).toISOString()
              : null,
            cacheExpiresAt: user.cachedAt
              ? new Date(
                  new Date(user.cachedAt).getTime() + CACHE_TTL
                ).toISOString()
              : null,
          },
          refreshInfo: {
            remaining: user.refreshCount
              ? DAILY_REFRESH_LIMIT - user.refreshCount
              : DAILY_REFRESH_LIMIT,
            limit: DAILY_REFRESH_LIMIT,
          },
        });
      } else {
        return res.status(429).send({
          error: "Twitter API rate limit reached",
          canRefreshAt: user.rateLimitReset
            ? new Date(user.rateLimitReset).toISOString()
            : null,
          refreshInfo: {
            remaining: user.refreshCount
              ? DAILY_REFRESH_LIMIT - user.refreshCount
              : DAILY_REFRESH_LIMIT,
            limit: DAILY_REFRESH_LIMIT,
          },
        });
      }
    }

    // Get fresh data from Twitter
    console.log("Getting Twitter client for timeline");
    console.log({
      twitter_access_token,
      twitter_refresh_token,
      twitterId,
      userId,
    });
    try {
      // Get a client from the cache or create a new one that will be cached
      const { client, tokens } = await twitterFunctions.getTwitterClient(
        twitter_access_token,
        twitter_refresh_token,
        userId
      );

      console.log("Calling getUserTimeline function with the client");
      // Use the client to get timeline data
      let timelineResponse = await twitterFunctions.getUserTimeline(
        tokens.access_token,
        tokens.refresh_token,
        twitterId,
        userId,
        client
      );

      // Process timeline data to include full user info and media
      let processedTimeline = timelineResponse;

      // Filter out retweets and quote tweets
      if (processedTimeline.data && Array.isArray(processedTimeline.data)) {
        processedTimeline.data = processedTimeline.data.filter((tweet) => {
          // Check if it's a retweet or quote tweet
          if (!tweet.referenced_tweets) return true;

          // Filter out retweets and quotes
          return !tweet.referenced_tweets.some(
            (ref) => ref.type === "retweeted" || ref.type === "quoted"
          );
        });

        // Enhance tweets with user and media info
        if (processedTimeline.includes) {
          const users = processedTimeline.includes.users || [];
          const media = processedTimeline.includes.media || [];

          processedTimeline.data = processedTimeline.data.map((tweet) => {
            // Add author information
            const author = users.find((user) => user.id === tweet.author_id);
            if (author) {
              tweet.author_name = author.name;
              tweet.author_username = author.username;
              tweet.author_profile_image = author.profile_image_url;
              tweet.author_verified = author.verified;

              // Add author metrics
              tweet.author_metrics = {
                followers_count: author.public_metrics?.followers_count,
                following_count:
                  author.public_metrics?.following_count ||
                  author.public_metrics?.friends_count,
                statuses_count:
                  author.public_metrics?.tweet_count ||
                  author.public_metrics?.statuses_count,
              };
            }

            // Add media information
            if (tweet.attachments && tweet.attachments.media_keys) {
              tweet.media = tweet.attachments.media_keys
                .map((mediaKey) => {
                  const mediaItem = media.find((m) => m.media_key === mediaKey);
                  if (mediaItem) {
                    return {
                      type: mediaItem.type,
                      url: mediaItem.url || mediaItem.preview_image_url,
                    };
                  }
                  return null;
                })
                .filter((item) => item !== null);
            }

            return tweet;
          });
        }

        // Generate the AI prompt template fresh each time
        const aiPromptTemplate =
          aiPromptFunctions.generateAIPromptTemplate(user);

        // Prepare tweets data for batch processing
        const tweetsForBatch = processedTimeline.data.map((tweet) => ({
          tweetId: tweet.id,
          tweetContent: tweet.text,
          imageUrl:
            tweet.media && tweet.media.length > 0 ? tweet.media[0].url : null,
        }));

        // Generate AI responses for all tweets in parallel with fresh prompt
        const batchResponses =
          await aiPromptFunctions.generateBatchTweetResponses(tweetsForBatch, {
            ...user,
            aiPromptTemplate,
          });

        // Create a map of tweet ID to AI response for easier lookup
        const responseMap = {};
        batchResponses.forEach((response) => {
          responseMap[response.tweetId] = response.response;
        });

        // Add AI responses to tweets
        processedTimeline.data = processedTimeline.data.map((tweet) => ({
          ...tweet,
          ai_response:
            responseMap[tweet.id] ||
            "Interesting perspective! Would love to discuss more.",
        }));
      }

      console.log("Timeline fetched successfully");
      console.log("Timeline data type:", typeof processedTimeline);

      // Extract rate limit info from headers if available
      const rateLimitReset = req.headers["x-rate-limit-reset"]
        ? new Date(parseInt(req.headers["x-rate-limit-reset"]) * 1000)
        : null;
      const rateLimitRemaining = req.headers["x-rate-limit-remaining"]
        ? parseInt(req.headers["x-rate-limit-remaining"])
        : null;

      // Update cache in database
      await User.findOneAndUpdate(
        { id: user.id },
        {
          cachedTimeline: processedTimeline,
          cachedAt: new Date(),
          rateLimitReset,
          rateLimitRemaining,
        }
      );

      // Get current refresh count
      user = await User.findOne({ id: userId });
      const remainingRefreshes = user.refreshCount
        ? DAILY_REFRESH_LIMIT - user.refreshCount
        : DAILY_REFRESH_LIMIT;

      res.status(200).send({
        data: processedTimeline,
        cacheInfo: {
          fromCache: false,
          cachedAt: new Date().toISOString(),
          canRefreshAt: rateLimitReset ? rateLimitReset.toISOString() : null,
          cacheExpiresAt: new Date(
            new Date().getTime() + CACHE_TTL
          ).toISOString(),
        },
        refreshInfo: {
          remaining: remainingRefreshes,
          limit: DAILY_REFRESH_LIMIT,
        },
      });
    } catch (twitterError) {
      console.log("Twitter API error:", twitterError);

      // Invalidate client cache on errors
      twitterFunctions.invalidateClientCache(userId);

      // If rate limited, update the rate limit info
      if (twitterError.statusCode === 429 && twitterError.headers) {
        const resetTime = twitterError.headers["x-rate-limit-reset"]
          ? new Date(
              parseInt(twitterError.headers["x-rate-limit-reset"]) * 1000
            )
          : new Date(now.getTime() + 15 * 60 * 1000); // Default: 15 mins

        await User.findOneAndUpdate(
          { id: user.id },
          {
            rateLimitReset: resetTime,
            rateLimitRemaining: 0,
          }
        );

        // Return cached data if available
        if (user.cachedTimeline) {
          return res.status(200).send({
            data: user.cachedTimeline,
            cacheInfo: {
              fromCache: true,
              cachedAt: user.cachedAt
                ? new Date(user.cachedAt).toISOString()
                : null,
              canRefreshAt: resetTime.toISOString(),
              cacheExpiresAt: user.cachedAt
                ? new Date(
                    new Date(user.cachedAt).getTime() + CACHE_TTL
                  ).toISOString()
                : null,
            },
            refreshInfo: {
              remaining: user.refreshCount
                ? DAILY_REFRESH_LIMIT - user.refreshCount
                : DAILY_REFRESH_LIMIT,
              limit: DAILY_REFRESH_LIMIT,
            },
          });
        }

        // If no cached data is available, return error with the reset time
        return res.status(429).send({
          error: "Twitter API rate limit reached",
          canRefreshAt: resetTime.toISOString(),
          refreshInfo: {
            remaining: user.refreshCount
              ? DAILY_REFRESH_LIMIT - user.refreshCount
              : DAILY_REFRESH_LIMIT,
            limit: DAILY_REFRESH_LIMIT,
          },
        });
      }

      return res.status(twitterError.statusCode || 500).send({
        error:
          twitterError.statusCode === 429
            ? "Twitter API rate limit reached"
            : "Failed to fetch timeline",
        canRefreshAt: user.rateLimitReset
          ? user.rateLimitReset.toISOString()
          : null,
        refreshInfo: {
          remaining: user.refreshCount
            ? DAILY_REFRESH_LIMIT - user.refreshCount
            : DAILY_REFRESH_LIMIT,
          limit: DAILY_REFRESH_LIMIT,
        },
      });
    }
  } catch (e) {
    console.log("Error in getUserTimeline:", e);
    return res.status(500).send({
      error: "Internal server error",
    });
  }
}

async function getUserProfile(req, res) {
  try {
    let userId = req.user_id;
    let user = await authFunctions.getUser(userId);
    const { twitter_access_token, twitter_refresh_token, twitterId } = user;

    // Get a client from the cache or create a new one that will be cached
    const { client, tokens } = await twitterFunctions.getTwitterClient(
      twitter_access_token,
      twitter_refresh_token,
      userId
    );

    // Update follower stats whenever profile is loaded
    try {
      console.log("Calling updateFollowerStats function from getUserProfile");
      await twitterFunctions.updateFollowerStats(
        userId,
        user.twitterId,
        user.twitterUsername,
        user.twitterFollowersCount
      );
    } catch (statsError) {
      console.error("Error updating follower stats:", statsError);
      // Don't fail the entire request if stats update fails
    }

    // Return the Twitter profile data saved in our database
    const profileData = {
      twitterUsername: user.twitterUsername,
      twitterName: user.twitterName,
      twitterId: user.twitterId,
      twitterPhoto: user.twitterPhoto,
      twitterBanner: user.twitterBanner,
      isVerified: user.isVerified,
      twitterPostsCount: user.twitterPostsCount,
      twitterFollowersCount: user.twitterFollowersCount,
      twitterFollowingCount: user.twitterFollowingCount,
      twitterConnected: user.twitterConnected,
      // Add cache information
      cacheInfo: {
        lastUpdated: user.cachedAt
          ? new Date(user.cachedAt).toISOString()
          : null,
        canRefreshAt: user.rateLimitReset
          ? new Date(user.rateLimitReset).toISOString()
          : null,
      },
    };

    res.status(200).send(profileData);
  } catch (e) {
    console.log("Error in getUserProfile:", e);

    // Invalidate client cache on errors
    if (req.user_id) {
      twitterFunctions.invalidateClientCache(req.user_id);
    }

    return res.status(500).send({ error: "Failed to fetch profile" });
  }
}

async function getFollowerGrowth(req, res) {
  try {
    let userId = req.user_id;

    console.log("Calling getFollowerGrowth function");
    // Get follower growth data for the past 7 days
    const growthData = await twitterFunctions.getFollowerGrowth(userId);

    res.status(200).send(growthData);
  } catch (e) {
    console.error("Error in getFollowerGrowth:", e);
    return res
      .status(500)
      .send({ error: "Failed to fetch follower growth data" });
  }
}

async function getPostMetrics(req, res) {
  try {
    let userId = req.user_id;
    let user = await authFunctions.getUser(userId);

    // Force refresh parameter
    const forceRefresh = req.query.refresh === "true";

    // Check if we have cached data that's still valid
    if (
      !forceRefresh &&
      user.cachedPostMetrics &&
      isCacheValid(user.cachedAt)
    ) {
      console.log("Returning cached post metrics data");
      const response = formatResponseWithCacheInfo(
        user.cachedPostMetrics,
        user.cachedAt,
        user.rateLimitReset
      );

      // Add refresh info
      response.refreshInfo = {
        remaining: user.refreshCount
          ? DAILY_REFRESH_LIMIT - user.refreshCount
          : DAILY_REFRESH_LIMIT,
        limit: DAILY_REFRESH_LIMIT,
      };

      return res.status(200).send(response);
    }

    // If force refresh, check daily refresh limit
    if (forceRefresh) {
      const refreshLimit = await checkRefreshLimit(userId);
      if (!refreshLimit.canRefresh) {
        // Return cached data with refresh limit error
        if (user.cachedPostMetrics) {
          const response = formatResponseWithCacheInfo(
            user.cachedPostMetrics,
            user.cachedAt,
            user.rateLimitReset
          );

          response.refreshInfo = {
            remaining: 0,
            limit: DAILY_REFRESH_LIMIT,
            error: "Daily refresh limit reached",
          };

          return res.status(200).send(response);
        }

        return res.status(429).send({
          error: "Daily refresh limit reached (5 refreshes per day)",
          refreshInfo: {
            remaining: 0,
            limit: DAILY_REFRESH_LIMIT,
          },
        });
      }

      // Increment refresh count if we're actually doing a refresh
      await incrementRefreshCount(userId);
    }

    // Check if we're rate limited
    const now = new Date();
    if (
      user.rateLimitReset &&
      new Date(user.rateLimitReset) > now &&
      user.rateLimitRemaining === 0
    ) {
      // If rate limited but we have cached data, return it
      if (user.cachedPostMetrics) {
        console.log("Rate limited, returning cached post metrics data");
        const response = formatResponseWithCacheInfo(
          user.cachedPostMetrics,
          user.cachedAt,
          user.rateLimitReset
        );

        // Add refresh info
        response.refreshInfo = {
          remaining: user.refreshCount
            ? DAILY_REFRESH_LIMIT - user.refreshCount
            : DAILY_REFRESH_LIMIT,
          limit: DAILY_REFRESH_LIMIT,
        };

        return res.status(200).send(response);
      } else {
        return res.status(429).send({
          error: "Twitter API rate limit reached",
          canRefreshAt: user.rateLimitReset,
          refreshInfo: {
            remaining: user.refreshCount
              ? DAILY_REFRESH_LIMIT - user.refreshCount
              : DAILY_REFRESH_LIMIT,
            limit: DAILY_REFRESH_LIMIT,
          },
        });
      }
    }

    try {
      // Get user's tweets with metrics
      const { twitter_access_token, twitter_refresh_token, twitterId } = user;
      console.log("Getting Twitter client for metrics for user", userId);

      // Get a client from the cache or create a new one that will be cached
      const { client, tokens } = await twitterFunctions.getTwitterClient(
        twitter_access_token,
        twitter_refresh_token,
        userId
      );

      // Use the shared client to get post metrics
      const metricsData = await twitterFunctions.getPostMetrics(userId, client);

      // Extract rate limit info from headers if available
      const rateLimitReset =
        client.rateLimitHeaders && client.rateLimitHeaders["x-rate-limit-reset"]
          ? new Date(
              parseInt(client.rateLimitHeaders["x-rate-limit-reset"]) * 1000
            )
          : null;
      const rateLimitRemaining =
        client.rateLimitHeaders &&
        client.rateLimitHeaders["x-rate-limit-remaining"]
          ? parseInt(client.rateLimitHeaders["x-rate-limit-remaining"])
          : null;

      // Update cache in database - store as object directly
      await User.findOneAndUpdate(
        { id: user.id },
        {
          cachedPostMetrics: metricsData,
          cachedAt: new Date(),
          rateLimitReset,
          rateLimitRemaining,
        }
      );

      console.log("User tweets with metrics fetched successfully");

      // Get the updated user with latest refresh count
      user = await User.findOne({ id: userId });
      const remainingRefreshes = user.refreshCount
        ? DAILY_REFRESH_LIMIT - user.refreshCount
        : DAILY_REFRESH_LIMIT;

      // Create response with the updated refreshInfo
      const response = formatResponseWithCacheInfo(
        metricsData,
        new Date(),
        rateLimitReset
      );
      response.refreshInfo = {
        remaining: remainingRefreshes,
        limit: DAILY_REFRESH_LIMIT,
      };

      res.status(200).send(response);
    } catch (metricsError) {
      console.error("Error in getPostMetrics:", metricsError);

      // Invalidate client cache on errors
      twitterFunctions.invalidateClientCache(userId);

      // If rate limited, update the rate limit info
      if (metricsError.statusCode === 429 && metricsError.headers) {
        const resetTime = metricsError.headers["x-rate-limit-reset"]
          ? new Date(
              parseInt(metricsError.headers["x-rate-limit-reset"]) * 1000
            )
          : new Date(now.getTime() + 15 * 60 * 1000); // Default: 15 mins

        await User.findOneAndUpdate(
          { id: user.id },
          {
            rateLimitReset: resetTime,
            rateLimitRemaining: 0,
          }
        );
      }

      // If rate limited and we have cached data, return it
      if (metricsError.statusCode === 429 && user.cachedPostMetrics) {
        console.log("Rate limited, returning cached data");
        return res
          .status(200)
          .send(
            formatResponseWithCacheInfo(
              user.cachedPostMetrics,
              user.cachedAt,
              user.rateLimitReset
            )
          );
      }

      // If no cached data or not a rate limit error, return an empty structure
      return res.status(metricsError.statusCode || 500).send({
        posts: [],
        averages: {},
        error:
          metricsError.statusCode === 429
            ? "Twitter API rate limit reached. Please try again later."
            : "Failed to fetch post metrics data",
        canRefreshAt: user.rateLimitReset,
      });
    }
  } catch (e) {
    console.error("Unexpected error in getPostMetrics:", e);
    return res.status(500).send({
      posts: [],
      averages: {},
      error: "An unexpected error occurred",
    });
  }
}

// Helper function to calculate average metrics
function calculateAverages(tweets) {
  if (!tweets || tweets.length === 0) return {};

  const metrics = {};
  const metricCounts = {};

  tweets.forEach((tweet) => {
    if (tweet.public_metrics) {
      Object.entries(tweet.public_metrics).forEach(([key, value]) => {
        metrics[key] = (metrics[key] || 0) + value;
        metricCounts[key] = (metricCounts[key] || 0) + 1;
      });
    }
  });

  const averages = {};
  Object.entries(metrics).forEach(([key, total]) => {
    averages[key] = Math.round(total / metricCounts[key]);
  });

  return averages;
}

async function generateResponse(req, res) {
  try {
    const userId = req.user_id;
    const { tweetId, tweetText, imageUrl } = req.body;

    if (!tweetText) {
      return res.status(400).send({ error: "Tweet text is required" });
    }

    // Get the user to access their AI prompt template
    const user = await authFunctions.getUser(userId);

    // Generate the AI prompt template fresh
    const aiPromptTemplate = aiPromptFunctions.generateAIPromptTemplate(user);

    // Prepare tweet for batch processing (even though it's just one tweet)
    // This allows us to reuse the same optimized code path
    const tweetsForBatch = [
      {
        tweetId,
        tweetContent: tweetText,
        imageUrl,
      },
    ];

    // Use the batch processing function even for a single tweet
    const batchResponses = await aiPromptFunctions.generateBatchTweetResponses(
      tweetsForBatch,
      { ...user, aiPromptTemplate }
    );

    // Get the response for this tweet
    const aiResponse = batchResponses[0].response;

    // Find the tweet in the cached timeline and update its response
    if (user.cachedTimeline && typeof user.cachedTimeline !== "string") {
      const timeline = user.cachedTimeline;
      if (timeline.data && Array.isArray(timeline.data)) {
        const tweetIndex = timeline.data.findIndex((t) => t.id === tweetId);
        if (tweetIndex !== -1) {
          timeline.data[tweetIndex].ai_response = aiResponse;

          // Update cache in database
          await User.findOneAndUpdate(
            { id: user.id },
            { cachedTimeline: timeline }
          );
        }
      }
    }

    res.status(200).send({ response: aiResponse });
  } catch (error) {
    console.error("Error generating AI response:", error);
    res.status(500).send({ error: "Failed to generate AI response" });
  }
}

/**
 * Get combined timeline and metrics data in a single API call
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
async function getCombinedData(req, res) {
  try {
    let userId = req.user_id;
    let user = await authFunctions.getUser(userId);
    const { twitter_access_token, twitter_refresh_token, twitterId } = user;

    // Force refresh parameter
    const forceRefresh = req.query.refresh === "true";

    // Check if we have valid cached data for both timeline and metrics
    if (
      !forceRefresh &&
      user.cachedTimeline &&
      user.cachedPostMetrics &&
      isCacheValid(user.cachedAt)
    ) {
      console.log("Returning cached combined data");

      // Ensure the cached timeline is an object before returning
      let cachedTimeline = user.cachedTimeline;
      if (typeof cachedTimeline === "string") {
        try {
          cachedTimeline = JSON.parse(cachedTimeline);
        } catch (e) {
          console.error("Error parsing cached timeline data:", e);
        }
      }

      return res.status(200).send({
        timeline: cachedTimeline,
        metrics: user.cachedPostMetrics,
        cacheInfo: {
          fromCache: true,
          cachedAt: user.cachedAt
            ? new Date(user.cachedAt).toISOString()
            : null,
          canRefreshAt: user.rateLimitReset
            ? new Date(user.rateLimitReset).toISOString()
            : null,
          cacheExpiresAt: user.cachedAt
            ? new Date(
                new Date(user.cachedAt).getTime() + CACHE_TTL
              ).toISOString()
            : null,
        },
        refreshInfo: {
          remaining: user.refreshCount
            ? DAILY_REFRESH_LIMIT - user.refreshCount
            : DAILY_REFRESH_LIMIT,
          limit: DAILY_REFRESH_LIMIT,
        },
      });
    }

    // If force refresh, check daily refresh limit
    if (forceRefresh) {
      const refreshLimit = await checkRefreshLimit(userId);
      if (!refreshLimit.canRefresh) {
        // Return cached data with refresh limit error if available
        if (user.cachedTimeline && user.cachedPostMetrics) {
          let cachedTimeline = user.cachedTimeline;
          if (typeof cachedTimeline === "string") {
            try {
              cachedTimeline = JSON.parse(cachedTimeline);
            } catch (e) {
              console.error("Error parsing cached timeline data:", e);
            }
          }

          return res.status(200).send({
            timeline: cachedTimeline,
            metrics: user.cachedPostMetrics,
            cacheInfo: {
              fromCache: true,
              cachedAt: user.cachedAt
                ? new Date(user.cachedAt).toISOString()
                : null,
              cacheExpiresAt: user.cachedAt
                ? new Date(
                    new Date(user.cachedAt).getTime() + CACHE_TTL
                  ).toISOString()
                : null,
            },
            refreshInfo: {
              remaining: 0,
              limit: DAILY_REFRESH_LIMIT,
              error: "Daily refresh limit reached",
            },
          });
        }

        return res.status(429).send({
          error: "Daily refresh limit reached (5 refreshes per day)",
          refreshInfo: {
            remaining: 0,
            limit: DAILY_REFRESH_LIMIT,
          },
        });
      }

      // Increment refresh count
      await incrementRefreshCount(userId);
    }

    // Check if we're rate limited
    const now = new Date();
    if (
      user.rateLimitReset &&
      new Date(user.rateLimitReset) > now &&
      user.rateLimitRemaining === 0
    ) {
      // If rate limited but we have cached data, return it
      if (user.cachedTimeline && user.cachedPostMetrics) {
        console.log("Rate limited, returning cached combined data");

        let cachedTimeline = user.cachedTimeline;
        if (typeof cachedTimeline === "string") {
          try {
            cachedTimeline = JSON.parse(cachedTimeline);
          } catch (e) {
            console.error("Error parsing cached timeline data:", e);
          }
        }

        return res.status(200).send({
          timeline: cachedTimeline,
          metrics: user.cachedPostMetrics,
          cacheInfo: {
            fromCache: true,
            cachedAt: user.cachedAt
              ? new Date(user.cachedAt).toISOString()
              : null,
            canRefreshAt: user.rateLimitReset
              ? new Date(user.rateLimitReset).toISOString()
              : null,
            cacheExpiresAt: user.cachedAt
              ? new Date(
                  new Date(user.cachedAt).getTime() + CACHE_TTL
                ).toISOString()
              : null,
          },
          refreshInfo: {
            remaining: user.refreshCount
              ? DAILY_REFRESH_LIMIT - user.refreshCount
              : DAILY_REFRESH_LIMIT,
            limit: DAILY_REFRESH_LIMIT,
          },
        });
      } else {
        return res.status(429).send({
          error: "Twitter API rate limit reached",
          canRefreshAt: user.rateLimitReset
            ? new Date(user.rateLimitReset).toISOString()
            : null,
          refreshInfo: {
            remaining: user.refreshCount
              ? DAILY_REFRESH_LIMIT - user.refreshCount
              : DAILY_REFRESH_LIMIT,
            limit: DAILY_REFRESH_LIMIT,
          },
        });
      }
    }

    try {
      console.log("Getting Twitter client for combined data");

      // Get a client from the cache or create a new one that will be cached
      const { client, tokens } = await twitterFunctions.getTwitterClient(
        twitter_access_token,
        twitter_refresh_token,
        userId
      );

      // Fetch both timeline and metrics using the same client
      console.log("Fetching timeline and metrics with shared client");

      // 1. Get timeline data
      const timelineResponse = await twitterFunctions.getUserTimeline(
        tokens.access_token,
        tokens.refresh_token,
        twitterId,
        userId,
        client // Pass the cached client
      );

      // 2. Get metrics data
      const metricsData = await twitterFunctions.getPostMetrics(userId, client);

      // Process timeline data to include full user info and media
      let processedTimeline = timelineResponse;

      // Filter out retweets and quote tweets
      if (processedTimeline.data && Array.isArray(processedTimeline.data)) {
        processedTimeline.data = processedTimeline.data.filter((tweet) => {
          // Check if it's a retweet or quote tweet
          if (!tweet.referenced_tweets) return true;

          // Filter out retweets and quotes
          return !tweet.referenced_tweets.some(
            (ref) => ref.type === "retweeted" || ref.type === "quoted"
          );
        });

        // Enhance tweets with user and media info
        if (processedTimeline.includes) {
          const users = processedTimeline.includes.users || [];
          const media = processedTimeline.includes.media || [];

          processedTimeline.data = processedTimeline.data.map((tweet) => {
            // Add author information
            const author = users.find((user) => user.id === tweet.author_id);
            if (author) {
              tweet.author_name = author.name;
              tweet.author_username = author.username;
              tweet.author_profile_image = author.profile_image_url;
              tweet.author_verified = author.verified;

              // Add author metrics
              tweet.author_metrics = {
                followers_count: author.public_metrics?.followers_count,
                following_count:
                  author.public_metrics?.following_count ||
                  author.public_metrics?.friends_count,
                statuses_count:
                  author.public_metrics?.tweet_count ||
                  author.public_metrics?.statuses_count,
              };
            }

            // Add media information
            if (tweet.attachments && tweet.attachments.media_keys) {
              tweet.media = tweet.attachments.media_keys
                .map((mediaKey) => {
                  const mediaItem = media.find((m) => m.media_key === mediaKey);
                  if (mediaItem) {
                    return {
                      type: mediaItem.type,
                      url: mediaItem.url || mediaItem.preview_image_url,
                    };
                  }
                  return null;
                })
                .filter((item) => item !== null);
            }

            return tweet;
          });
        }

        // Generate the AI prompt template fresh each time
        const aiPromptTemplate =
          aiPromptFunctions.generateAIPromptTemplate(user);

        // Prepare tweets data for batch processing
        const tweetsForBatch = processedTimeline.data.map((tweet) => ({
          tweetId: tweet.id,
          tweetContent: tweet.text,
          imageUrl:
            tweet.media && tweet.media.length > 0 ? tweet.media[0].url : null,
        }));

        // Generate AI responses for all tweets in parallel with fresh prompt
        const batchResponses =
          await aiPromptFunctions.generateBatchTweetResponses(tweetsForBatch, {
            ...user,
            aiPromptTemplate,
          });

        // Create a map of tweet ID to AI response for easier lookup
        const responseMap = {};
        batchResponses.forEach((response) => {
          responseMap[response.tweetId] = response.response;
        });

        // Add AI responses to tweets
        processedTimeline.data = processedTimeline.data.map((tweet) => ({
          ...tweet,
          ai_response:
            responseMap[tweet.id] ||
            "Interesting perspective! Would love to discuss more.",
        }));
      }

      console.log("Combined data fetched successfully");

      // Extract rate limit info from headers if available
      const rateLimitReset = req.headers["x-rate-limit-reset"]
        ? new Date(parseInt(req.headers["x-rate-limit-reset"]) * 1000)
        : null;
      const rateLimitRemaining = req.headers["x-rate-limit-remaining"]
        ? parseInt(req.headers["x-rate-limit-remaining"])
        : null;

      // Update cache in database
      await User.findOneAndUpdate(
        { id: user.id },
        {
          cachedTimeline: processedTimeline,
          cachedPostMetrics: metricsData,
          cachedAt: new Date(),
          rateLimitReset,
          rateLimitRemaining,
        }
      );

      // Get current refresh count
      user = await User.findOne({ id: userId });
      const remainingRefreshes = user.refreshCount
        ? DAILY_REFRESH_LIMIT - user.refreshCount
        : DAILY_REFRESH_LIMIT;

      // Return combined data response
      res.status(200).send({
        timeline: processedTimeline,
        metrics: metricsData,
        cacheInfo: {
          fromCache: false,
          cachedAt: new Date().toISOString(),
          canRefreshAt: rateLimitReset ? rateLimitReset.toISOString() : null,
          cacheExpiresAt: new Date(
            new Date().getTime() + CACHE_TTL
          ).toISOString(),
        },
        refreshInfo: {
          remaining: remainingRefreshes,
          limit: DAILY_REFRESH_LIMIT,
        },
      });
    } catch (twitterError) {
      console.log("Twitter API error:", twitterError);

      // Invalidate client cache on errors
      twitterFunctions.invalidateClientCache(userId);

      // If rate limited, update the rate limit info
      if (twitterError.statusCode === 429 && twitterError.headers) {
        const resetTime = twitterError.headers["x-rate-limit-reset"]
          ? new Date(
              parseInt(twitterError.headers["x-rate-limit-reset"]) * 1000
            )
          : new Date(now.getTime() + 15 * 60 * 1000); // Default: 15 mins

        await User.findOneAndUpdate(
          { id: user.id },
          {
            rateLimitReset: resetTime,
            rateLimitRemaining: 0,
          }
        );

        // Return cached data if available
        if (user.cachedTimeline && user.cachedPostMetrics) {
          return res.status(200).send({
            timeline: user.cachedTimeline,
            metrics: user.cachedPostMetrics,
            cacheInfo: {
              fromCache: true,
              cachedAt: user.cachedAt
                ? new Date(user.cachedAt).toISOString()
                : null,
              canRefreshAt: resetTime.toISOString(),
              cacheExpiresAt: user.cachedAt
                ? new Date(
                    new Date(user.cachedAt).getTime() + CACHE_TTL
                  ).toISOString()
                : null,
            },
            refreshInfo: {
              remaining: user.refreshCount
                ? DAILY_REFRESH_LIMIT - user.refreshCount
                : DAILY_REFRESH_LIMIT,
              limit: DAILY_REFRESH_LIMIT,
            },
          });
        }

        // If no cached data is available, return error with the reset time
        return res.status(429).send({
          error: "Twitter API rate limit reached",
          canRefreshAt: resetTime.toISOString(),
          refreshInfo: {
            remaining: user.refreshCount
              ? DAILY_REFRESH_LIMIT - user.refreshCount
              : DAILY_REFRESH_LIMIT,
            limit: DAILY_REFRESH_LIMIT,
          },
        });
      }

      return res.status(twitterError.statusCode || 500).send({
        error:
          twitterError.statusCode === 429
            ? "Twitter API rate limit reached"
            : "Failed to fetch combined data",
        canRefreshAt: user.rateLimitReset
          ? user.rateLimitReset.toISOString()
          : null,
        refreshInfo: {
          remaining: user.refreshCount
            ? DAILY_REFRESH_LIMIT - user.refreshCount
            : DAILY_REFRESH_LIMIT,
          limit: DAILY_REFRESH_LIMIT,
        },
      });
    }
  } catch (e) {
    console.log("Error in getCombinedData:", e);
    return res.status(500).send({
      error: "Internal server error",
    });
  }
}

/**
 * Posts a reply to a tweet
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
async function postReply(req, res) {
  try {
    const userId = req.user_id;
    const { tweetId, replyText } = req.body;

    if (!tweetId || !replyText) {
      return res.status(400).send({
        error:
          "Missing required parameters. Both tweetId and replyText are required.",
      });
    }

    // Get the user for their Twitter credentials
    const user = await authFunctions.getUser(userId);
    const { twitter_access_token, twitter_refresh_token } = user;

    // Check if the user has connected Twitter
    if (!twitter_access_token || !twitter_refresh_token) {
      return res.status(401).send({
        error: "Twitter account not connected or authorization expired",
      });
    }

    console.log(`Getting cached Twitter client for user ${userId}`);
    // Get a client from the cache or create a new one
    const { client, tokens } = await twitterFunctions.getTwitterClient(
      twitter_access_token,
      twitter_refresh_token,
      userId
    );

    // Ensure we're using the cached client
    console.log(`Using cached client for user ${userId}`);

    // Post the reply
    const replyResponse = await twitterFunctions.postTweetReply(
      tokens.access_token,
      tokens.refresh_token,
      replyText,
      tweetId,
      userId,
      client // Passing the cached client explicitly
    );

    // Return the new tweet data
    res.status(200).send({
      success: true,
      tweet: replyResponse.data,
      message: "Reply posted successfully",
    });
  } catch (error) {
    console.error("Error posting reply to tweet:", error);

    // Invalidate client cache on errors
    if (req.user_id) {
      twitterFunctions.invalidateClientCache(req.user_id);
    }

    // Handle rate limiting specifically
    if (error.status === 429) {
      return res.status(429).send({
        error: "Twitter API rate limit reached. Please try again later.",
      });
    }

    // Handle authorization errors
    if (error.status === 401 || error.status === 403) {
      return res.status(401).send({
        error:
          "Twitter authorization failed or expired. Please reconnect your Twitter account.",
      });
    }

    // Handle other errors
    return res.status(500).send({
      error: "Failed to post reply to tweet",
      details: error.message,
    });
  }
}

export {
  getUserTimeline,
  getUserProfile,
  getFollowerGrowth,
  getPostMetrics,
  generateResponse,
  getCombinedData,
  postReply,
};
