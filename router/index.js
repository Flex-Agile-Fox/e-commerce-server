const router = require("express").Router();
const userRoutes = require("./user");
const productRoutes = require("./product");
const cartRoutes = require("./cart");
const { authentication } = require("../middlewares/auth");

router.use(`/users`, userRoutes);
router.use(`/products`, authentication, productRoutes);
router.use(`/carts`, authentication, cartRoutes);

module.exports = router;
