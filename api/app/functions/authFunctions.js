import jwt from "jsonwebtoken";
import validator from "email-validator";
import bcrypt from "bcrypt";
import User from "../../models/user.js";
import Session from "../../models/session.js";
import * as twitterFunctions from "./twitterFunctions.js";

async function getUser(user_id) {
  return User.findOne({ id: user_id });
}

async function getUserByTwitterId(twitterId) {
  return User.findOne({
    twitterId: twitterId,
  });
}

async function createTwitterUser(userData) {
  return User.create({
    twitterId: userData.twitterId,
    twitterUsername: userData.twitterUsername,
    twitterName: userData.twitterName,
    twitter_access_token: userData.twitter_access_token,
    twitter_refresh_token: userData.twitter_refresh_token,
    twitter_token_expires_at: userData.twitter_token_expires_at,
    twitterConnected: userData.twitterConnected,
    twitterPhoto: userData.twitterPhoto,
    twitterBanner: userData.twitterBanner,
    isVerified: userData.isVerified,
    twitterPostsCount: userData.twitterPostsCount,
    twitterFollowersCount: userData.twitterFollowersCount,
    twitterFollowingCount: userData.twitterFollowingCount,
    hasVerified: true,
    style: "casual", // Default style
    configuration: {
      bullishTokens: [],
      bearishTokens: [],
      personalityTraits: [],
      bannedWords: [],
      interests: [],
      rules: [],
      isComplete: false,
    },
  });
}

async function updateUser(userId, userObject) {
  try {
    // Track if follower count changed
    let followerCountChanged = false;
    let oldFollowerCount = 0;

    // Check if we're updating follower count
    if (userObject.twitterFollowersCount !== undefined) {
      const currentUser = await User.findOne({ id: userId });
      if (
        currentUser &&
        currentUser.twitterFollowersCount !== userObject.twitterFollowersCount
      ) {
        followerCountChanged = true;
        oldFollowerCount = currentUser.twitterFollowersCount || 0;
      }
    }

    // Update the user
    let res = await User.updateOne({ id: userId }, userObject);

    // If follower count changed, update statistics
    if (followerCountChanged) {
      try {
        const updatedUser = await getUser(userId);
        await twitterFunctions.updateFollowerStats(
          userId,
          updatedUser.twitterId,
          updatedUser.twitterUsername,
          updatedUser.twitterFollowersCount
        );
        console.log(
          `Updated follower stats for user ${userId}: ${oldFollowerCount} → ${updatedUser.twitterFollowersCount}`
        );
      } catch (statsError) {
        console.error(
          "Error updating follower stats on user update:",
          statsError
        );
      }
    }

    return res;
  } catch (e) {
    throw e;
  }
}

async function getSession(sessionId) {
  let session = await Session.findOne({ id: sessionId });
  return session && session.valid ? session : null;
}

async function deleteSession(sessionId) {
  const session = await Session.findOne({ id: sessionId });
  if (session) {
    await Session.deleteOne({ id: sessionId });
  }
  return session;
}

async function invalidateSession(sessionId) {
  const session = await Session.findOne({ id: sessionId });
  if (session) {
    session.valid = false;
    await session.save();
  }
  return session;
}

async function createSession(user_id) {
  let session = await Session.create({
    user_id: user_id,
    valid: true,
  });
  return session;
}

async function getUsers(query) {
  return await User.find(query);
}

export {
  getUserByTwitterId,
  createTwitterUser,
  getSession,
  deleteSession,
  invalidateSession,
  createSession,
  updateUser,
  getUser,
  getUsers,
};
