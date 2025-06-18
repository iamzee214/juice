import * as userFunctions from "../functions/user.functions.js";
import * as requestFunctions from "../functions/request.functions.js";

async function requestLimit(req, res, next) {
  try {
    const user = await userFunctions.getUser({ id: req.user_id });
    if (user.accountLevel === "Premium") {
      // If the user is premium, don't limit the requests
      return next();
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const userRequests = await requestFunctions.getRequests({
      user_id: user.id,
      timestamp: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    if (userRequests.length >= 3) {
      // If the user has already made 3 requests today, reject the request
      return res.status(403).send({ message: "Daily request limit reached" });
    }

    // Otherwise, allow the request
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
}

export default requestLimit;
