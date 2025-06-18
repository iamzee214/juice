import jwt from "jsonwebtoken";
import secret from "../../config/auth.config.js";

//sign jwt
function signJWT(payload, expiresIn) {
  return jwt.sign(payload, secret, {
    expiresIn: expiresIn,
  });
}
//verify jwt

function verifyJWT(token) {
  try {
    let decoded = jwt.verify(token, secret);
    return { payload: decoded, expired: false };
  } catch (error) {
    return { payload: null, expired: "JWT Expired" };
  }
}
export { signJWT, verifyJWT };
