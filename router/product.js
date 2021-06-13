const ProductController = require("../controllers/ProductController");
const {
	authorizationRole,
	authorizationProduct,
} = require("../middlewares/auth");
const router = require("express").Router();

router.get("/", ProductController.read);
router.get("/:id", ProductController.readById);
router.post("/", authorizationRole, ProductController.add);
router.put(
	"/:id",
	authorizationRole,
	authorizationProduct,
	ProductController.edit
);
router.delete(
	"/:id",
	authorizationRole,
	authorizationProduct,
	ProductController.delete
);

module.exports = router;
