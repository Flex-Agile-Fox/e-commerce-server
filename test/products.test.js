const request = require("supertest");
const app = require("../app");
const bcrypt = require("bcrypt");
const { sequelize, User, Product } = require("../models");
const { queryInterface } = sequelize;
const jwt = require("jsonwebtoken");

// default user setup
const salt = bcrypt.genSaltSync(10);
const default_password = "123456";
const hash = bcrypt.hashSync(default_password, salt);
let access_token_admin, access_token_not_admin;
const default_user = {
	name: "admin",
	email: "admin@test.com",
	password: hash,
	role: "admin",
	createdAt: new Date(),
	updatedAt: new Date(),
};

const default_user_notadmin = {
	name: "not admin",
	email: "notadmin@test.com",
	password: hash,
	role: "customer",
	createdAt: new Date(),
	updatedAt: new Date(),
};
// default products setup
const products = [
	{
		name: "test 1",
		image_url: "image_test.url",
		price: 1000,
		stock: 5,
		category: "Hobby",
		description: "Limited Edition",
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		name: "test 2",
		image_url: "image_test.url",
		price: 500,
		stock: 2,
		category: "Hobby",
		description: "Limited Edition",
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];

const product_default = {
	name: "test to update",
	image_url: "image_test.url",
	price: 1000,
	stock: 5,
	category: "Hobby",
	description: "Limited Edition",
};

// jest test case
beforeAll((done) => {
	queryInterface
		.bulkDelete("Users", null, {})
		.then(() => {
			return queryInterface.bulkDelete("Products", null, {});
		})
		.then(() => {
			const users = [default_user, default_user_notadmin];
			return queryInterface.bulkInsert("Users", users);
		})
		.then(() => {
			return User.findOne({
				where: { email: default_user.email },
			});
		})
		.then((admin) => {
			access_token_admin = jwt.sign(
				{ id: admin.id, role: admin.role },
				process.env.JWT_SECRET
			);
			return User.findOne({
				where: { email: default_user_notadmin.email },
			});
		})
		.then((not_admin) => {
			access_token_not_admin = jwt.sign(
				{ id: not_admin.id, role: not_admin.role },
				process.env.JWT_SECRET
			);
		})
		.then(() => {
			done();
		})
		.catch((err) => {
			throw err;
		});
});

afterAll((done) => {
	queryInterface
		.bulkDelete("Users", null, {})
		.then(() => {
			return queryInterface.bulkDelete("Products", null, {});
		})
		.then(() => done())
		.catch((err) => {
			throw err;
		});
});

describe("POST /products", () => {
	it("Success add product, return {sucess: true, data: {name, image_url, price, stock, description}}", (done) => {
		request(app)
			.post("/products")
			.set("Content-Type", "application/json")
			.set("access_token", access_token_admin)
			.send({
				name: "test",
				image_url: "image_test.url",
				price: 1000,
				stock: 5,
				category: "Hobby",
				description: "Limited Edition",
			})
			.then(({ body, status }) => {
				expect(status).toBe(201);
				expect(body).toHaveProperty("success", true);
				expect(body).toHaveProperty("data", expect.any(Object));
				expect(body["data"]).toHaveProperty("name", expect.any(String));
				expect(body["data"]).toHaveProperty("image_url", expect.any(String));
				expect(body["data"]).toHaveProperty("price", expect.any(Number));
				expect(body["data"]).toHaveProperty("stock", expect.any(Number));
				expect(body["data"]).toHaveProperty("description", expect.any(String));
				done();
			});
	});

	it("Fail add product missing access_token, return {sucess: false, errors=['Missing Token']}", (done) => {
		request(app)
			.post("/products")
			.set("Content-Type", "application/json")
			.send({
				name: "test",
				image_url: "image_test.url",
				price: 1000,
				stock: 5,
				category: "Hobby",
				description: "Limited Edition",
			})
			.then(({ body, status }) => {
				expect(status).toBe(400);
				expect(body).toHaveProperty("success", false);
				expect(body["errors"]).toContain("Missing Token");
				done();
			});
	});

	it("Fail add product, access_token that does not belong to admin {sucess: false, errors: ['Not authorized']}", (done) => {
		request(app)
			.post("/products")
			.set("Content-Type", "application/json")
			.set("access_token", access_token_not_admin)
			.send({
				name: "test",
				image_url: "image_test.url",
				price: 1000,
				stock: 5,
				category: "Hobby",
				description: "Limited Edition",
			})
			.then(({ body, status }) => {
				expect(status).toBe(401);
				expect(body).toHaveProperty("success", false);
				expect(body["errors"]).toContain("Not Authorized");
				done();
			});
	});

	it("Fail add product, missing required field {sucess: false, errors: ['Not authorized']}", (done) => {
		request(app)
			.post("/products")
			.set("Content-Type", "application/json")
			.set("access_token", access_token_admin)
			.send({
				name: "",
				image_url: "",
				price: null,
				stock: null,
				category: "",
				description: "",
			})
			.then(({ body, status }) => {
				expect(status).toBe(400);
				expect(body).toHaveProperty("success", false);
				expect(body["errors"]).toContain("Price cannot be null");
				expect(body["errors"]).toContain("Stock cannot be null");
				expect(body["errors"]).toContain("Name cannot be empty");
				expect(body["errors"]).toContain("Image cannot be empty");
				expect(body["errors"]).toContain("Category cannot be empty");
				expect(body["errors"]).toContain("Description cannot be empty");
				done();
			});
	});

	it("Fail add product, negative stock {sucess: false, errors: ['Stock must be at least 1']}", (done) => {
		request(app)
			.post("/products")
			.set("Content-Type", "application/json")
			.set("access_token", access_token_admin)
			.send({
				name: "test",
				image_url: "image_test.url",
				price: 1000,
				stock: -1,
				category: "Hobby",
				description: "Limited Edition",
			})
			.then(({ body, status }) => {
				expect(status).toBe(400);
				expect(body).toHaveProperty("success", false);
				expect(body["errors"]).toContain("Stock must be at least 1");
				done();
			});
	});

	it("Fail add product, negative price {sucess: false, errors: ['Price must be at least 1']}", (done) => {
		request(app)
			.post("/products")
			.set("Content-Type", "application/json")
			.set("access_token", access_token_admin)
			.send({
				name: "test",
				image_url: "image_test.url",
				price: -1,
				stock: -1,
				category: "Hobby",
				description: "Limited Edition",
			})
			.then(({ body, status }) => {
				expect(status).toBe(400);
				expect(body).toHaveProperty("success", false);
				expect(body["errors"]).toContain("Price must be at least 1");
				done();
			});
	});

	it("Fail add product, price with string as a value {sucess: false, errors: ['Price must be a number', 'Stock must be a number']}", (done) => {
		request(app)
			.post("/products")
			.set("Content-Type", "application/json")
			.set("access_token", access_token_admin)
			.send({
				name: "test",
				image_url: "image_test.url",
				price: "price",
				stock: "stock",
				category: "Hobby",
				description: "Limited Edition",
			})
			.then(({ body, status }) => {
				expect(status).toBe(400);
				expect(body).toHaveProperty("success", false);
				expect(body["errors"]).toContain("Price must be a number");
				expect(body["errors"]).toContain("Stock must be a number");
				done();
			});
	});
});

describe("GET /products/:id", () => {
	it("Success read product, return {sucess: true, product: {name, image_url, price, stock, description}}", (done) => {
		queryInterface
			.bulkDelete("Products", null, {})
			.then(() => {
				return queryInterface.bulkInsert("Products", products);
			})
			.then(() => {
				return Product.findOne({ where: { name: products[1].name } });
			})
			.then((product) => {
				return request(app)
					.get(`/products/${product.id}`)
					.set("Content-Type", "application/json")
					.set("access_token", access_token_admin);
			})
			.then(({ body, status }) => {
				expect(status).toBe(200);
				expect(body).toHaveProperty("success", true);
				expect(body).toHaveProperty("product", expect.any(Object));
				expect(body["product"]["name"]).toEqual(products[1].name);
				done();
			});
	});

	it("Fail read product missing access_token, return {sucess: false, errors=['Missing Token']}", (done) => {
		queryInterface
			.bulkDelete("Products", null, {})
			.then(() => {
				return queryInterface.bulkInsert("Products", products);
			})
			.then(() => {
				return Product.findOne({ where: { name: products[1].name } });
			})
			.then((product) => {
				return request(app)
					.get(`/products/${product.id}`)
					.set("Content-Type", "application/json");
			})
			.then(({ body, status }) => {
				expect(status).toBe(400);
				expect(body).toHaveProperty("success", false);
				expect(body["errors"]).toContain("Missing Token");
				done();
			});
	});
});

describe("GET /products", () => {
	it("Success read all products, return {sucess: true, products: [product, product]}", (done) => {
		queryInterface
			.bulkDelete("Products", null, {})
			.then(() => {
				return queryInterface.bulkInsert("Products", products);
			})
			.then(() => {
				return request(app)
					.get("/products")
					.set("Content-Type", "application/json")
					.set("access_token", access_token_admin);
			})
			.then(({ body, status }) => {
				expect(status).toBe(200);
				expect(body).toHaveProperty("success", true);
				expect(body).toHaveProperty("products", expect.any(Array));
				expect(body["products"][0]).toEqual(expect.any(Object));
				expect(body["products"].length).toEqual(2);
				done();
			});
	});

	it("Fail read products missing access_token, return {sucess: false, errors=['Missing Token']}", (done) => {
		queryInterface
			.bulkDelete("Products", null, {})
			.then(() => {
				return queryInterface.bulkInsert("Products", products);
			})
			.then(() => {
				return request(app)
					.get("/products")
					.set("Content-Type", "application/json");
			})
			.then(({ body, status }) => {
				expect(status).toBe(400);
				expect(body).toHaveProperty("success", false);
				expect(body["errors"]).toContain("Missing Token");
				done();
			});
	});
});

describe("PUT /products/:id", () => {
	it("Success edit product, return {sucess: true, message: 'Product Successfully Editted'}", (done) => {
		Product.create(product_default)
			.then((product) => {
				return request(app)
					.put(`/products/${product.id}`)
					.set("Content-Type", "application/json")
					.set("access_token", access_token_admin)
					.send({
						name: "test updated",
						image_url: "image_test_updated.url",
						price: 2,
						stock: 6,
						category: "Hobby",
						description: "Limited Edition",
					});
			})
			.then(({ body, status }) => {
				expect(status).toBe(201);
				expect(body).toHaveProperty("success", true);
				expect(body).toHaveProperty("message", "Product Successfully Editted");
				done();
			});
	});

	it("Fail edit product missing access_token, return {sucess: false, errors=['Missing Token']}", (done) => {
		Product.create(product_default)
			.then((product) => {
				return request(app)
					.put(`/products/${product.id}`)
					.set("Content-Type", "application/json")
					.send({
						name: "test updated",
						image_url: "image_test_updated.url",
						price: 2,
						stock: 6,
						category: "Hobby",
						description: "Limited Edition",
					});
			})
			.then(({ body, status }) => {
				expect(status).toBe(400);
				expect(body).toHaveProperty("success", false);
				expect(body["errors"]).toContain("Missing Token");
				done();
			});
	});

	it("Fail edit product, access_token that does not belong to admin {sucess: false, errors: ['Not authorized']}", (done) => {
		Product.create(product_default)
			.then((product) => {
				return request(app)
					.put(`/products/${product.id}`)
					.set("Content-Type", "application/json")
					.set("access_token", access_token_not_admin)
					.send({
						name: "test updated",
						image_url: "image_test_updated.url",
						price: 2,
						stock: 6,
						category: "Hobby",
						description: "Limited Edition",
					});
			})
			.then(({ body, status }) => {
				expect(status).toBe(401);
				expect(body).toHaveProperty("success", false);
				expect(body["errors"]).toContain("Not Authorized");
				done();
			});
	});

	it("Fail edit product, negative stock {sucess: false, errors: ['Stock must be at least 1']}", (done) => {
		Product.create(product_default)
			.then((product) => {
				return request(app)
					.put(`/products/${product.id}`)
					.set("Content-Type", "application/json")
					.set("access_token", access_token_admin)
					.send({
						name: "test updated",
						image_url: "image_test_updated.url",
						price: 2,
						stock: -1,
						category: "Hobby",
						description: "Limited Edition",
					});
			})
			.then(({ body, status }) => {
				expect(status).toBe(400);
				expect(body).toHaveProperty("success", false);
				expect(body["errors"]).toContain("Stock must be at least 1");
				done();
			});
	});

	it("Fail edit product, negative price {sucess: false, errors: ['Price must be at least 1']}", (done) => {
		Product.create(product_default)
			.then((product) => {
				return request(app)
					.put(`/products/${product.id}`)
					.set("Content-Type", "application/json")
					.set("access_token", access_token_admin)
					.send({
						name: "test updated",
						image_url: "image_test_updated.url",
						price: -1,
						stock: 5,
						category: "Hobby",
						description: "Limited Edition",
					});
			})
			.then(({ body, status }) => {
				expect(status).toBe(400);
				expect(body).toHaveProperty("success", false);
				expect(body["errors"]).toContain("Price must be at least 1");
				done();
			});
	});

	it("Fail add product, price with string as a value {sucess: false, errors: ['Price must be a number', 'Stock must be a number']}", (done) => {
		Product.create(product_default)
			.then((product) => {
				return request(app)
					.put(`/products/${product.id}`)
					.set("Content-Type", "application/json")
					.set("access_token", access_token_admin)
					.send({
						name: "test updated",
						image_url: "image_test_updated.url",
						price: "price",
						stock: "stock",
						category: "Hobby",
						description: "Limited Edition",
					});
			})
			.then(({ body, status }) => {
				expect(status).toBe(400);
				expect(body).toHaveProperty("success", false);
				expect(body["errors"]).toContain("Price must be a number");
				expect(body["errors"]).toContain("Stock must be a number");
				done();
			});
	});
});

describe("DELETE /products/:id", () => {
	it("Success delete product, return {sucess: true, message: Product Successfully Deleted}", (done) => {
		Product.create(product_default)
			.then((product) => {
				return request(app)
					.delete(`/products/${product.id}`)
					.set("Content-Type", "application/json")
					.set("access_token", access_token_admin)
					.send({
						name: "test updated",
						image_url: "image_test_updated.url",
						price: 2,
						stock: 6,
						category: "Hobby",
						description: "Limited Edition",
					});
			})
			.then(({ body, status }) => {
				expect(status).toBe(201);
				expect(body).toHaveProperty("success", true);
				expect(body).toHaveProperty("message", "Product Successfully Deleted");
				done();
			});
	});

	it("Fail delete product missing access_token, return {sucess: false, errors=['Missing Token']}", (done) => {
		Product.create(product_default)
			.then((product) => {
				return request(app)
					.delete(`/products/${product.id}`)
					.set("Content-Type", "application/json")
					.send({
						name: "test updated",
						image_url: "image_test_updated.url",
						price: 2,
						stock: 6,
						category: "Hobby",
						description: "Limited Edition",
					});
			})
			.then(({ body, status }) => {
				expect(status).toBe(400);
				expect(body).toHaveProperty("success", false);
				expect(body["errors"]).toContain("Missing Token");
				done();
			});
	});

	it("Fail delete product, access_token that does not belong to admin {sucess: false, errors: ['Not authorized']", (done) => {
		Product.create(product_default)
			.then((product) => {
				return request(app)
					.delete(`/products/${product.id}`)
					.set("Content-Type", "application/json")
					.set("access_token", access_token_not_admin)
					.send({
						name: "test updated",
						image_url: "image_test_updated.url",
						price: 2,
						stock: 6,
						category: "Hobby",
						description: "Limited Edition",
					});
			})
			.then(({ body, status }) => {
				expect(status).toBe(401);
				expect(body).toHaveProperty("success", false);
				expect(body["errors"]).toContain("Not Authorized");
				done();
			});
	});
});
