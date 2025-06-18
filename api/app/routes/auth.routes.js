import express from "express";
import * as controller from "../controllers/auth.controller.js";
import requireUser from "../middleware/requireUser.js";
import deserializeUser from "../middleware/deserializeUser.js";

var authRouter = express.Router();

// Twitter OAuth 2.0 routes - these don't require authentication as they ARE the authentication
authRouter.get("/twitter/oauth-url", controller.getTwitterOAuth2Url);
authRouter.post("/twitter/callback", controller.handleTwitterOAuth2Callback);

// Protected routes that require authentication
authRouter.post(
  "/update-style",
  [deserializeUser, requireUser],
  controller.updateUserStyle
);

authRouter.post(
  "/update-configuration",
  [deserializeUser, requireUser],
  controller.updateUserConfiguration
);

authRouter.get(
  "/user-data",
  [deserializeUser, requireUser],
  controller.getUserData
);

authRouter.post(
  "/sign-out",
  [deserializeUser, requireUser],
  controller.signOut
);

export default authRouter;
