import express from "express";
import * as controller from "../controllers/wallet.controller.js";
import requireUser from "../middleware/requireUser.js";
import deserializeUser from "../middleware/deserializeUser.js";

var walletRouter = express.Router();

walletRouter.get(
  "/balance",
  [deserializeUser, requireUser],
  controller.getWalletBalance
);

export default walletRouter;
