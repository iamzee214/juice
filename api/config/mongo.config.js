import * as dotenv from "dotenv";
dotenv.config({ path: `${process.env.NODE_ENV}.env` });

export default {
  database: {
    uri: ``,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
};
