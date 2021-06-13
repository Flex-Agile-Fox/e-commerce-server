const CartController = require("../controllers/CartController");
const { authorizationCart } = require("../middlewares/auth");
const router = require("express").Router();

router.get("/", CartController.read);
router.post("/", CartController.add);
router.put("/:id", authorizationCart, CartController.edit);
router.delete("/:id", authorizationCart, CartController.delete);

module.exports = router;
