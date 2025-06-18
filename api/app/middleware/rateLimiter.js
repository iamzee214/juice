/**
 * Twitter API Rate Limiter Middleware
 *
 * This middleware implements a more robust rate limiting strategy for Twitter API calls:
 * 1. Uses a token bucket algorithm to manage requests
 * 2. Reads and respects 'x-rate-limit-*' headers from Twitter API responses
 * 3. Implements per-endpoint rate limiting with separate buckets
 */

// In-memory store for rate limit state
const rateLimitState = {
  // Endpoint to bucket mapping
  buckets: {},
  // Reset times for each endpoint
  resetTimes: {},
};

// Twitter API endpoints regex patterns and their default limits
const ENDPOINT_LIMITS = {
  "users\\/[0-9]+\\/timelines": { limit: 15, window: 15 * 60 * 1000 }, // 15 requests per 15 minutes
  "insights\\/historical": { limit: 10, window: 15 * 60 * 1000 }, // 10 requests per 15 minutes
  "account\\/verify_credentials": { limit: 75, window: 15 * 60 * 1000 }, // 75 requests per 15 minutes
  // Default fallback for any unspecified endpoints
  default: { limit: 5, window: 15 * 60 * 1000 },
};

/**
 * Get rate limit bucket for an endpoint
 * @param {string} endpoint - API endpoint
 * @returns {Object} Bucket configuration
 */
function getBucketForEndpoint(endpoint) {
  for (const pattern in ENDPOINT_LIMITS) {
    if (endpoint.match(new RegExp(pattern))) {
      return ENDPOINT_LIMITS[pattern];
    }
  }
  return ENDPOINT_LIMITS.default;
}

/**
 * Update rate limit state from Twitter API response headers
 * @param {Object} headers - Response headers
 * @param {string} endpoint - API endpoint
 */
function updateRateLimitFromHeaders(headers, endpoint) {
  // Extract rate limit info from headers
  const remaining = parseInt(headers["x-rate-limit-remaining"], 10);
  const limit = parseInt(headers["x-rate-limit-limit"], 10);
  const reset = parseInt(headers["x-rate-limit-reset"], 10) * 1000; // Convert to ms

  if (!isNaN(remaining) && !isNaN(limit) && !isNaN(reset)) {
    // Create bucket if it doesn't exist
    if (!rateLimitState.buckets[endpoint]) {
      rateLimitState.buckets[endpoint] = getBucketForEndpoint(endpoint);
    }

    // Update bucket with actual values from Twitter
    rateLimitState.buckets[endpoint].limit = limit;
    rateLimitState.buckets[endpoint].remaining = remaining;
    rateLimitState.resetTimes[endpoint] = reset;

    console.log(
      `Rate limit for ${endpoint}: ${remaining}/${limit}, resets at ${new Date(
        reset
      ).toISOString()}`
    );
  }
}

/**
 * Check if a request can be made to a specific endpoint
 * @param {string} endpoint - API endpoint
 * @returns {Object} Status object with canProceed and retryAfter properties
 */
function canMakeRequest(endpoint) {
  // Determine which bucket to use
  let bucket;
  for (const pattern in ENDPOINT_LIMITS) {
    if (endpoint.match(new RegExp(pattern))) {
      const bucketKey = Object.keys(rateLimitState.buckets).find((key) =>
        key.match(new RegExp(pattern))
      );

      if (bucketKey) {
        bucket = rateLimitState.buckets[bucketKey];
        break;
      }
    }
  }

  // If no matching bucket found, create one with default config
  if (!bucket) {
    const defaultConfig = getBucketForEndpoint(endpoint);
    rateLimitState.buckets[endpoint] = {
      ...defaultConfig,
      remaining: defaultConfig.limit,
    };
    bucket = rateLimitState.buckets[endpoint];
  }

  // Check if we need to reset the bucket
  const resetTime = rateLimitState.resetTimes[endpoint];
  if (resetTime && Date.now() >= resetTime) {
    // Reset the bucket
    bucket.remaining = bucket.limit;
    delete rateLimitState.resetTimes[endpoint];
  }

  // Check if we can make the request
  if (bucket.remaining > 0) {
    // Decrement token count
    bucket.remaining--;
    return { canProceed: true };
  } else {
    // Calculate time until reset
    const now = Date.now();
    const retryAfter = resetTime ? Math.max(0, resetTime - now) : bucket.window;

    return {
      canProceed: false,
      retryAfter: retryAfter,
    };
  }
}

/**
 * Process rate limit for a specific Twitter API request
 * @param {string} endpoint - Twitter API endpoint
 * @returns {Promise} Promise that resolves when request can proceed
 */
async function processRateLimit(endpoint) {
  const status = canMakeRequest(endpoint);

  if (status.canProceed) {
    return; // Can proceed immediately
  }

  // Need to wait due to rate limiting
  console.log(
    `Rate limited for endpoint ${endpoint}. Waiting ${status.retryAfter}ms`
  );

  // Return a promise that resolves after the retry time
  return new Promise((resolve) => {
    setTimeout(resolve, status.retryAfter);
  });
}

/**
 * Clears all rate limits for a specific user
 * @param {number} userId - The user ID to clear rate limits for
 */
processRateLimit.clearUserRateLimits = async function (userId) {
  // Since we're using an in-memory store without user segregation,
  // we'll clear all rate limits for now.
  // In a more sophisticated implementation, we would only clear rate limits for the specific user.
  console.log(`Clearing rate limits for user ${userId}`);

  // Reset all buckets by clearing the in-memory state
  Object.keys(rateLimitState.buckets).forEach((endpoint) => {
    const bucket = rateLimitState.buckets[endpoint];
    bucket.remaining = bucket.limit;
  });

  // Clear all reset times
  rateLimitState.resetTimes = {};

  console.log("Rate limits cleared");
};

export { processRateLimit, updateRateLimitFromHeaders };
