import * as authFunctions from "../functions/authFunctions.js";

async function createNewPayment(req, res) {
  try {
    let user = await authFunctions.getUser(req.user_id);
  } catch {
    res.status(500).send();
  }
}

export { createNewPayment };
