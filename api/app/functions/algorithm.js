import axios from "axios";
import { TwitterApi } from "twitter-api-v2";
// Initialize Twitter client using Bearer Token for OAuth 2.0
import * as authFunctions from "./authFunctions.js";
import * as latestTweetFunctions from "./latestTweetFunctions.js";

const services = {
  retweets: 2926,
  likes: 2156,
  impressions: 810,
  comments: 828,
  profileClick: 2581,
  detailExpand: 815,
};
const N1_API_URL = "https://n1panel.com/api/v2";
const N1_API_KEY = "1cbd4ec7025e23e8d435f0dbb2b71fde";

// Add this near the top of the file, with other constants
const MAX_RESULTS = 5;

async function start() {}
async function getAverageImpressions(tweets) {
  let metrics = tweets.map((x) => x.public_metrics);

  // Calculate the average impression count
  const totalImpressions = metrics.reduce(
    (sum, metric) => sum + metric.impression_count,
    0
  );
  const averageImpressions = totalImpressions / metrics.length;

  return Math.round(averageImpressions);
}

//Seperate into 3 groups, bronze, silver, gold
//------------------------For all bronze users----------------------
//Check any tweets they have made in the last hour
//Put all tweets into one list of ids
//Get the average impressions for all of their tweets in last week

async function botAccounts() {
  console.log("Starting botAccounts function");
  const users = await authFunctions.getUsers({
    membershipStatus: { $ne: "none" },
  });
  console.log(`Total users fetched: ${users.length}`);
  const userGroups = {
    bronze: users.filter((user) => user.membershipStatus === "bronze"),
    silver: users.filter((user) => user.membershipStatus === "silver"),
    gold: users.filter((user) => user.membershipStatus === "gold"),
  };
  console.log("User groups:", {
    bronze: userGroups.bronze.length,
    silver: userGroups.silver.length,
    gold: userGroups.gold.length,
  });

  for (const [tier, userList] of Object.entries(userGroups)) {
    console.log(`Processing ${tier} tier users`);
    for (const user of userList) {
      await processUser(user, tier);
    }
  }

  // Add this line to log when all users have been processed
  console.log("Processing completed for all users");
}

async function processUser(user, tier) {
  console.log(`Processing user: ${user.id}, Tier: ${tier}`);
  const tweets = await getUserTweets(user.id);
  console.log(
    `Fetched ${tweets.data ? tweets.data.length : 0} tweets for user ${user.id}`
  );

  if (!tweets.data || tweets.data.length === 0) {
    console.log(
      `No tweets found for user ${user.id}. Skipping further processing.`
    );
    return;
  }

  const tweetsUpdated = tweets.data.filter((tweet) => !isReply(tweet));
  console.log(`${tweetsUpdated.length} tweets after filtering out replies`);

  if (tweetsUpdated.length > 0) {
    console.log(`Latest tweet ID: ${tweetsUpdated[0].id}`);
    await updateLatestTweetId(user.twitterId, tweetsUpdated[0].id);
  }
  console.log(tweetsUpdated);
  const averageViews = await getAverageImpressions(tweetsUpdated);
  console.log(`Average views for user ${user.id}: ${averageViews}`);

  await botUser(tweetsUpdated, averageViews, user.twitterId, tier);
}

async function botUser(tweets, averageViews, accountId, tier) {
  console.log(
    `Botting user: ${accountId}, Tier: ${tier}, Average views: ${averageViews}`
  );
  const engagementRates = {
    bronze: { min: 0.01, max: 0.02 },
    silver: { min: 0.02, max: 0.03 },
    gold: { min: 0.03, max: 0.05 },
  };

  const { min, max } = engagementRates[tier];
  const targetEngagementRate = Math.random() * (max - min) + min;
  const viewMultiplier = tier === "bronze" ? 1 : 1.3;
  const totalEngagements = Math.max(
    Math.round(averageViews * viewMultiplier * targetEngagementRate),
    tier === "bronze" ? 30 : tier === "silver" ? 50 : 75
  );

  const engagementDistribution = {
    likes: Math.max(
      Math.round(totalEngagements * 0.4),
      tier === "bronze" ? 10 : 15
    ),
    comments: Math.max(
      Math.round(totalEngagements * 0.25),
      tier === "bronze" ? 10 : 15
    ),
    retweets: Math.max(
      Math.round(totalEngagements * 0.15),
      tier === "bronze" ? 10 : 15
    ),
  };

  if (tier !== "bronze") {
    engagementDistribution.detailExpandsAndProfileViews = Math.max(
      Math.round(totalEngagements * 0.2),
      15
    );
  }

  console.log(`Total engagements for ${accountId}: ${totalEngagements}`);
  console.log("Engagement distribution:", engagementDistribution);

  for (const tweet of tweets) {
    console.log(`Processing tweet: ${tweet.id}`);
    await performEngagements(tweet, accountId, engagementDistribution, tier);
  }
}

async function performEngagements(tweet, accountId, distribution, tier) {
  console.log(
    `Performing engagements for tweet: ${tweet.id}, Account: ${accountId}, Tier: ${tier}`
  );
  const tweetLink = `https://twitter.com/${accountId}/status/${tweet.id}`;

  console.log(`Calling bot service for likes: ${distribution.likes}`);
  await callBotService(services.likes, tweetLink, distribution.likes);

  const aiComments = await getAiComments(tweet, distribution.comments);
  console.log(`Generated ${aiComments.length} AI comments`);
  console.log(`Calling bot service for comments: ${distribution.comments}`);
  await callBotService(
    services.comments,
    tweetLink,
    distribution.comments,
    aiComments
  );

  console.log(`Calling bot service for retweets: ${distribution.retweets}`);
  await callBotService(services.retweets, tweetLink, distribution.retweets);

  if (tier !== "bronze") {
    const detailExpands = Math.round(
      distribution.detailExpandsAndProfileViews * Math.random()
    );
    const profileViews =
      distribution.detailExpandsAndProfileViews - detailExpands;

    console.log(`Calling bot service for detail expands: ${detailExpands}`);
    await callBotService(services.detailExpand, tweetLink, detailExpands);
    console.log(`Calling bot service for profile views: ${profileViews}`);
    await callBotService(services.profileClick, tweetLink, profileViews);
  }
}

async function getUserTweets(user_id) {
  try {
    let twitter_id = (await authFunctions.getUser(user_id)).twitterId;
    //Check database to see if entry for last tweet
    let latestTweet = await latestTweetFunctions.findLatestTweet(twitter_id);
    let tweets;
    if (latestTweet) {
      //If entry, get tweets since then.
      // Prepare parameters for the request
      const params = {
        "tweet.fields": "conversation_id,referenced_tweets,public_metrics",
        max_results: MAX_RESULTS, // Use the configurable parameter here
      };

      // Include since_id only if latestTweetId is not null or undefined
      params.since_id = latestTweet.postId;

      console.log("PARAMS");
      console.log(params);
      // Fetch user timeline with tweets, including retweets
      const userTimeline = await twitterClient.v2.userTimeline(
        twitter_id,
        params
      );

      tweets = userTimeline.data;
    } else {
      //If entry, get tweets since then.
      // Prepare parameters for the request
      const params = {
        "tweet.fields": "conversation_id,referenced_tweets,public_metrics", // Include fields needed to determine tweet type
        max_results: MAX_RESULTS, // Use the configurable parameter here
      };

      // Include since_id only if latestTweetId is not null or undefined
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      params.start_time = twentyFourHoursAgo.toISOString();

      console.log("PARAMS");
      console.log(params);
      // Fetch user timeline with tweets, including retweets
      const userTimeline = await twitterClient.v2.userTimeline(
        twitter_id,
        params
      );

      tweets = userTimeline.data;
    }
    //return the tweets
    return tweets;
  } catch (e) {
    console.log(e);
    return [];
  }
}
async function getAiComments(tweet, numberOfComments) {
  // Create an array of "test" strings with length equal to numberOfComments
  return Array(numberOfComments).fill("test");
}

async function callBotService(serviceId, link, quantity, comments) {
  console.log(
    `Calling bot service: ${serviceId}, Link: ${link}, Quantity: ${quantity}`
  );
  try {
    const requestData = {
      key: N1_API_KEY,
      action: "add",
      service: serviceId,
      link: link,
      quantity: quantity,
    };

    // Add comments to the request if provided
    if (comments) {
      requestData.comments = comments.join("\n");
    }

    const response = await axios.post(N1_API_URL, requestData);

    if (response.data) {
      console.log(
        `Successfully called service ${serviceId} for link ${link} with quantity ${quantity}. Response:`,
        response.data
      );
    } else {
      console.error(`Error: No response data for service ${serviceId}`);
    }
  } catch (error) {
    console.error(
      `Error calling service ${serviceId} for link ${link} with quantity ${quantity}:`,
      error.response ? error.response.data : error.message
    );
  }
}
function isReply(tweet) {
  return (
    tweet.referenced_tweets &&
    tweet.referenced_tweets.some((ref) => ref.type === "replied_to")
  );
}

async function updateLatestTweetId(accountId, newTweetId) {
  try {
    // Check if a latest tweet entry exists for the accountId
    const existingTweet = await latestTweetFunctions.findLatestTweet(accountId);

    if (existingTweet) {
      // If it exists, update it with the newTweetId
      await latestTweetFunctions.updateLatestTweet(
        { twitterId: accountId },
        { postId: newTweetId }
      );
      console.log(
        `Updated latestTweetId for account ${accountId} to ${newTweetId}`
      );
    } else {
      // If it doesn't exist, create a new entry
      await latestTweetFunctions.addLatestTweet({
        twitterId: accountId,
        postId: newTweetId,
      });
      console.log(
        `Added new latestTweetId for account ${accountId} with tweet ID ${newTweetId}`
      );
    }
  } catch (error) {
    console.error(
      `Error updating or adding latestTweetId for account ${accountId}:`,
      error
    );
  }
}

export { botAccounts, getUserTweets, start };
