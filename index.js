const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./helpers/db");
const app = express();

const PORT = process.env.PORT || 5000;

const authRoute = require("./routes/auth");
const productsRoute = require("./routes/products");

app.use(
  bodyParser.json({
    limit: "2mb",
  })
);

app.use("", authRoute);
app.use("", productsRoute);

// app.get("/", (req, res) => res.send("hello world"));

// app.post("/", (req, res) =>
//   res.send({ ok: true, status: 200, message: "Request Accepted" })
// );

const server = app.listen(PORT, () => {
  const { address } = server.address();

  connectDB();

  console.log(
    `Server is listening on port http://${
      address === "::" ? "localhost" : address
    }:${PORT}`
  );
});
