const router = require("express").Router();
const userRoutes = require("./user");
const productRoutes = require("./product");
const { authentication, authorizationRole } = require("../middlewares/auth");

router.use(`/users`, userRoutes);
router.use(`/products`, authentication, authorizationRole, productRoutes);

module.exports = router;
