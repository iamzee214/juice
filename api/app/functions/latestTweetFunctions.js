import latestTweet from "../../models/latestTweet.js";

async function findLatestTweet(accountId) {
  return await latestTweet.findOne({ twitterId: accountId });
}

// Function to add a new latest tweet entry
async function addLatestTweet(query) {
  return await latestTweet.create(query);
}

// Function to update an existing latest tweet entry
async function updateLatestTweet(query, update) {
  return await latestTweet.updateOne(query, update);
}
async function getLatestTweets() {
  return await latestTweet.find({});
}
export { addLatestTweet, updateLatestTweet, getLatestTweets, findLatestTweet };
