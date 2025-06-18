import { verifyJWT, signJWT } from "../utils/jwt.utils.js";
import * as authFunctions from "../functions/authFunctions.js";

export default async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken && !refreshToken) {
    return next();
  }

  const { payload, expired } = verifyJWT(accessToken);

  if (payload) {
    req.user_id = payload.user_id;
    return next();
  }
  const { payload: refresh } =
    expired && refreshToken ? verifyJWT(refreshToken) : { payload: null };
  if (!refresh) {
    return next();
  }
  let session = await authFunctions.getSession(refresh.sessionId);
  if (!session) {
    return next();
  }
  let newAccessToken = signJWT(
    { user_id: session.user_id, sessionId: session.id },
    "2h"
  );
  res.cookie("accessToken", newAccessToken, {
    maxAge: 300000,
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  let newPayload = verifyJWT(newAccessToken).payload;
  req.user_id = newPayload.user_id;
  req.sessionId = newPayload.sessionId;
  return next();
};
