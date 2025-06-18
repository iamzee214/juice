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
    averageImpressions: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);
// add unique id
schema.plugin(mongooseSequence, {
  id: "average_impressions_id",
  inc_field: "id",
  collection_name: "ids",
});
export default mongoose.model("average_impressions", schema);
