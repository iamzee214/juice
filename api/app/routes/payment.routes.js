import express from "express";
import * as controller from "../controllers/payment.controller.js";
import requireUser from "../middleware/requireUser.js";
import deserializeUser from "../middleware/deserializeUser.js";

var paymentRouter = express.Router();

paymentRouter.post(
  "/createNewPayment",
  [deserializeUser, requireUser],
  controller.updateUserStyle
);
export default paymentRouter;
