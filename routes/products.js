const router = require("express").Router();
const getUserFromToken = require("../helpers/getUserFromToken");
const verifyToken = require("../middleware/verifyToken");
const Product = require("../models/Product");
const Order = require("../models/Order");

router.get("/get_products", async (req, res) => {
  // const products = [1, 1, 2, 3, 5, 8, 13, 21, 34];
  // res.json(products);

  const products = await Product.find(
    {},
    {
      _id: 0,
      product_id: 1,
      model_id: 1,
      flavor: 1,
      number_of_puffs: 1,
    }
  );

  res.json(products);
});

router.post("/buy_product", verifyToken, async (req, res) => {
  const order = req.body;

  if (
    !Object.prototype.toString.call(order).includes("Array") ||
    !order.length ||
    order.some(
      (product) =>
        !product.product_id ||
        !Number.isInteger(product.product_id) ||
        !product.amount ||
        !Number.isInteger(product.amount)
    )
  ) {
    return res.status(403).json({
      ok: false,
      error: "Неправильные детали заказа",
    });
  }

  // const order = new Order({
  //   issuer: getUserFromToken()
  // })

  const issuer = await getUserFromToken(req.token);

  // res.json(issuer);

  await Order.create({
    issuer,
    items: order,
  });

  res.status(201).json({
    ok: true,
    status: `Вы успешно заказали в количестве: ${order
      .map((product) => product.amount)
      .reduce((a, b) => a + b)}`,
  });
});

router.post("/check_verification_code", async (req, res) => {
  const { verification_code } = req.body;

  if (typeof verification_code !== 'string' || !verification_code.trim()) {
    return res.status(403).json({
      ok: false,
      error: "Вы не предоставили код верификации",
    });
  }

  const product = await Product.findOne({
    verification_code,
  });

  if (!product || product.verificated) {
    return res.status(400).json({
      ok: false,
      error: "Ошибка! Неверный код",
    });
  }

  // console.log(product);

  product.verificated = true;
  await product.save();
  return res.status(200).json({
    ok: true,
    status: "Ваш код прошёл проверку!",
  });
});

module.exports = router;
