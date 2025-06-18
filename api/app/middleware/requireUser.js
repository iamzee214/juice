export default async (req, res, next) => {
  console.log("USER ID");
  console.log(req.user_id);
  if (!req.user_id) {
    return res.status(403).send("Invalid Session");
  }

  return next();
};
