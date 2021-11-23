if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const { DB_CONNECTION } = process.env;

module.exports = async function () {
  await mongoose.connect(DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("Успешное подключение к MongoDB");

  return mongoose;
};
