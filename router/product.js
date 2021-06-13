const ProductController = require("../controllers/ProductController");
const {
	authorizationRole,
	authorizationProduct,
} = require("../middlewares/auth");
const router = require("express").Router();

router.get("/", ProductController.read);
router.get("/:id", ProductController.readById);
router.post("/", ProductController.add);
router.put("/:id", authorizationProduct, ProductController.edit);
router.delete("/:id", authorizationProduct, ProductController.delete);

module.exports = router;
