import mongoose from "mongoose";
import MongooseSequence from "mongoose-sequence";

const mongooseSequence = MongooseSequence(mongoose);
function getBalance(value) {
  if (typeof value !== "undefined") {
    return parseFloat(value.toString());
  }
  return value;
}
const schema = new mongoose.Schema(
  {
    id: {
      type: Number,
      default: 0,
      unique: true,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    },
    // New properties
    twitterUsername: {
      type: String,
      default: null,
    },
    twitterId: {
      type: String,
      default: null,
    },
    followerCount: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { timestamps: true }
);

// Compound index to ensure unique entries per user per day
schema.index({ userId: 1, date: 1 }, { unique: true });

// add unique id
schema.plugin(mongooseSequence, {
  id: "twitter_stat_id",
  inc_field: "id",
  collection_name: "ids",
});

export default mongoose.model("TwitterStat", schema);
