import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config({ path: `${process.env.NODE_ENV}.env` });
import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import setUpAuthRoutes from "../app/routes/auth.routes.js";
import setUpTwitterRoutes from "../app/routes/twitter.routes.js";
import setUpWalletRoutes from "../app/routes/wallet.routes.js";
import bodyParser from "body-parser";
const app = express();
import fileUpload from "express-fileupload";
import { botAccounts } from "../app/functions/algorithm.js";
import mongoConfig from "./mongo.config.js";
import cors from "cors";

const databaseUri = mongoConfig.database.uri;
const databaseOptions = mongoConfig.database.options;

var corsOptions = {
  credentials: true,
  origin: process.env.WEBSITE_URL,
};
mongoose.connect(databaseUri, databaseOptions, async (error) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log("MongoDB connected");
  console.log("Listening on port " + process.env.PORT_NUMBER);
  // await botAccounts();
});
app.use(express.static("public"));
app.use(cookieParser());
console.log("Started server");

app.use(express.json());
app.use("/api/auth", [cors(corsOptions)], setUpAuthRoutes);
app.use("/api/twitter", [cors(corsOptions)], setUpTwitterRoutes);
app.use("/api/wallet", [cors(corsOptions)], setUpWalletRoutes);
app.use(express.urlencoded({ extended: true }));

let server = app.listen(process.env.PORT_NUMBER);
server.timeout = 10000000;
