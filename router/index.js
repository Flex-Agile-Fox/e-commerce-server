const router = require("express").Router();
const userRoutes = require("./user");
const productRoutes = require("./product");
const { authentication, authorization } = require("../middlewares/auth");

router.use(`/users`, userRoutes);
router.use(`/products`, authentication, productRoutes);

module.exports = router;
