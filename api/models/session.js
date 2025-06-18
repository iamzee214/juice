import mongoose from "mongoose";
import MongooseSequence from "mongoose-sequence";
const mongooseSequence = MongooseSequence(mongoose);
const schema = new mongoose.Schema(
  {
    id: {
      type: Number,
      default: 0,
      required: true,
    },
    valid: {
      type: Boolean,
      default: true,
    },
    user_id: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
// add unique id
schema.plugin(mongooseSequence, {
  id: "session_id",
  inc_field: "id",
  collection_name: "ids",
});
export default mongoose.model("session", schema);
