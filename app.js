if (process.env.NODE_ENV !== "production") require("dotenv").config();
const cors = require("cors");
const express = require("express");
const errorHandler = require("./middlewares/errorHandler");
const app = express();
const port = process.env.PORT || 3000;
const router = require("./router");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);
app.use(errorHandler);

if (process.env.NODE_ENV === "test") module.exports = app;
else
	app.listen(port, () => {
		console.log(`Applikasi jalan di port ${port}`);
	});
