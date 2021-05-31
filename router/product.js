const ProductController = require("../controllers/ProductController");
const router = require("express").Router();

router.get("/", ProductController.read);
router.post("/edit/:id", ProductController.edit);

module.exports = router;
