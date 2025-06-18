export default async (req, res, next) => {
  // Retrieve the "access_code" header
  const accessCode = req.headers["access-code"];
  console.log(req.headers);
  // Check if the "access_code" header is present
  if (accessCode == "Juiceanalysis") {
    return next();
  } else {
    return res.status(401).send("Access code is required");
  }
};
