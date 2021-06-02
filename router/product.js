const ProductController = require("../controllers/ProductController");
const { authorization } = require("../middlewares/auth");
const router = require("express").Router();

router.get("/", ProductController.read);
router.get("/:id", ProductController.readById);
router.post("/", authorization, ProductController.add);
router.put("/:id", ProductController.edit);
router.delete("/:id", ProductController.delete);

module.exports = router;
