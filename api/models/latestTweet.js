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
    twitterId: {
      type: String,
      unique: true,
    },
    postId: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);
// add unique id
schema.plugin(mongooseSequence, {
  id: "lastest_tweet_id",
  inc_field: "id",
  collection_name: "ids",
});
export default mongoose.model("lastest_tweet", schema);
