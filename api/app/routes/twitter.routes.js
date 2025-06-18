import express from "express";
import * as controller from "../controllers/twitter.controller.js";
import requireUser from "../middleware/requireUser.js";
import deserializeUser from "../middleware/deserializeUser.js";

const twitterRouter = express.Router();

// Get user's timeline
twitterRouter.get(
  "/timeline",
  [deserializeUser, requireUser],
  controller.getUserTimeline
);

// Get user's Twitter profile
twitterRouter.get(
  "/profile",
  [deserializeUser, requireUser],
  controller.getUserProfile
);

// Get follower growth over the past 7 days
twitterRouter.get(
  "/follower-growth",
  [deserializeUser, requireUser],
  controller.getFollowerGrowth
);

// Get post metrics for the past 7 days
twitterRouter.get(
  "/post-metrics",
  [deserializeUser, requireUser],
  controller.getPostMetrics
);

// Generate AI response for a tweet
twitterRouter.post(
  "/generate-response",
  [deserializeUser, requireUser],
  controller.generateResponse
);

// Get combined timeline and metrics data in a single call
twitterRouter.get(
  "/combined",
  [deserializeUser, requireUser],
  controller.getCombinedData
);

// Post a reply to a tweet
twitterRouter.post(
  "/reply",
  [deserializeUser, requireUser],
  controller.postReply
);

export default twitterRouter;
