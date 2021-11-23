const { promisify } = require("util");
let jwt = require("jsonwebtoken");

jwt = {
  verify: promisify(jwt.verify.bind(jwt)),
};

async function verifyToken(req, res, next) {
  const bearerToken = req.headers.authorization;

  if (!bearerToken) {
    return res.sendStatus(403);
  }

  // console.log(bearerToken);

  const token = bearerToken.split(" ")[1];

  req.token = token;

  try {
    await jwt.verify(token, process.env.SECRET_KEY);
  } catch (err) {
    return res.status(403).json({ ok: false, error: err.message });
  }

  next();
}

module.exports = verifyToken;
