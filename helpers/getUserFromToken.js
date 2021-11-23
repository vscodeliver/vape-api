const { promisify } = require("util");
let jwt = require("jsonwebtoken");

jwt = {
  verify: promisify(jwt.verify.bind(jwt)),
};

async function getUserFromToken(token) {
  const payload = await jwt.verify(token, process.env.SECRET_KEY);
  return payload;
}

module.exports = getUserFromToken;
