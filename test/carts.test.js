const request = require("supertest");
const app = require("../app");
const bcrypt = require("bcrypt");
const { sequelize, User, Product, Cart } = require("../models");
const { queryInterface } = sequelize;
const jwt = require("jsonwebtoken");

// default user setup
const salt = bcrypt.genSaltSync(10);
const default_password = "123456";
const hash = bcrypt.hashSync(default_password, salt);
let access_token_admin, access_token_not_admin;
let UserId_admin, UserId_not_admin;
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
let products = [
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

let product_default = {
	name: "test to update",
	image_url: "image_test.url",
	price: 1000,
	stock: 5,
	category: "Hobby",
	description: "Limited Edition",
};

// default carts setup
let product_id_one, product_id_two;

let cart_default = {
	quantity: 1,
};

let carts = [
	{
		quantity: 1,
		UserId: 0,
		ProductId: 0,
	},
	{
		quantity: 1,
		UserId: 0,
		ProductId: 0,
	},
];

// jest test case
beforeAll((done) => {
	queryInterface
		.bulkDelete("Users", null, {})
		.then(() => {
			return queryInterface.bulkDelete("Products", null, {});
		})
		.then(() => {
			return queryInterface.bulkDelete("Users", null, {});
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
			UserId_admin = admin.id;
			products = products.map((product) => {
				return {
					...product,
					UserId: admin.id,
					updatedAt: new Date(),
					createdAt: new Date(),
				};
			});
			product_default.UserId = admin.id;
			access_token_admin = jwt.sign(
				{ id: admin.id, role: admin.role },
				process.env.JWT_SECRET
			);
			return User.findOne({
				where: { email: default_user_notadmin.email },
			});
		})
		.then((not_admin) => {
			UserId_not_admin = not_admin.id;
			access_token_not_admin = jwt.sign(
				{ id: not_admin.id, role: not_admin.role },
				process.env.JWT_SECRET
			);
			return queryInterface.bulkInsert("Products", products);
		})
		.then(() => {
			return Product.findOne({
				where: { name: products[0].name },
			});
		})
		.then((pro) => {
			product_id_one = pro.id;
			return Product.findOne({
				where: { name: products[1].name },
			});
		})
		.then((pro) => {
			product_id_two = pro.id;
			cart_default.UserId = UserId_not_admin;
			cart_default.ProductId = product_id_one;
			carts = carts.map((cart, i) => {
				return {
					...cart,
					UserId: UserId_not_admin,
					ProductId: i === 0 ? product_id_one : product_id_two,
					createdAt: new Date(),
					updatedAt: new Date(),
				};
			});
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
		.then(() => {
			return queryInterface.bulkDelete("Carts", null, {});
		})
		.then(() => done())
		.catch((err) => {
			throw err;
		});
});

describe("POST /carts", () => {
	it("Success add cart, return { success: true, message: 'Added Successfully to carts' }", (done) => {
		request(app)
			.post("/carts")
			.set("Content-Type", "application/json")
			.set("access_token", access_token_not_admin)
			.send({
				...cart_default,
				product_id: product_id_one,
			})
			.then(({ body, status }) => {
				expect(status).toBe(201);
				expect(body).toHaveProperty("success", true);
				expect(body).toHaveProperty("message", "Added Successfully to carts");
				done();
			});
	});

	it("Fail add cart missing access_token, return {sucess: false, errors=['Missing Token']}", (done) => {
		request(app)
			.post("/carts")
			.set("Content-Type", "application/json")
			.send({
				...cart_default,
				product_id: product_id_one,
			})
			.then(({ body, status }) => {
				expect(status).toBe(400);
				expect(body).toHaveProperty("success", false);
				expect(body["errors"]).toContain("Missing Token");
				done();
			});
	});

	it("Fail add cart, missing required product {sucess: false, errors: ['validation', 'validation']}", (done) => {
		request(app)
			.post("/carts")
			.set("Content-Type", "application/json")
			.set("access_token", access_token_not_admin)
			.send({})
			.then(({ body, status }) => {
				expect(status).toBe(404);
				expect(body).toHaveProperty("success", false);
				expect(body["errors"]).toContain("Product Not Found");
				done();
			});
	});

	it("Fail add cart, negative stock {sucess: false, errors: ['Stock must be at least 1']}", (done) => {
		request(app)
			.post("/carts")
			.set("Content-Type", "application/json")
			.set("access_token", access_token_not_admin)
			.send({
				quantity: -2,
				product_id: product_id_one,
			})
			.then(({ body, status }) => {
				expect(status).toBe(400);
				expect(body).toHaveProperty("success", false);
				expect(body["errors"]).toContain("Quantity must be at least 1");
				done();
			});
	});

	it("Fail add carts, quantity with string as a value {sucess: false, errors: ['Quantity must be a number']}", (done) => {
		request(app)
			.post("/carts")
			.set("Content-Type", "application/json")
			.set("access_token", access_token_not_admin)
			.send({
				quantity: "asdfaasdf",
				product_id: product_id_one,
			})
			.then(({ body, status }) => {
				expect(status).toBe(400);
				expect(body).toHaveProperty("success", false);
				expect(body["errors"]).toContain("Quantity must be a number");
				done();
			});
	});
});

describe("GET /carts", () => {
	it("Success read all carts, return {sucess: true, carts: [cart, cart]}", (done) => {
		queryInterface
			.bulkDelete("Carts", null, {})
			.then(() => {
				return queryInterface.bulkInsert("Carts", carts);
			})
			.then(() => {
				return request(app)
					.get("/carts")
					.set("Content-Type", "application/json")
					.set("access_token", access_token_not_admin);
			})
			.then(({ body, status }) => {
				expect(status).toBe(200);
				expect(body).toHaveProperty("success", true);
				expect(body).toHaveProperty("carts", expect.any(Array));
				expect(body["carts"][0]).toEqual(expect.any(Object));
				expect(body["carts"].length).toEqual(2);
				done();
			});
	});

	it("Fail read carts missing access_token, return {sucess: false, errors=['Missing Token']}", (done) => {
		queryInterface
			.bulkDelete("Carts", null, {})
			.then(() => {
				return queryInterface.bulkInsert("Carts", carts);
			})
			.then(() => {
				return request(app)
					.get("/carts")
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

describe("PUT /carts/:id", () => {
	it("Success edit cart, return {sucess: true, message: 'Carts Eddited Successfully'}", (done) => {
		Cart.create({
			...cart_default,
			product_id: product_id_one,
		})
			.then((cart) => {
				return request(app)
					.put(`/carts/${cart.id}`)
					.set("Content-Type", "application/json")
					.set("access_token", access_token_not_admin)
					.send({
						quantity: 2,
					});
			})
			.then(({ body, status }) => {
				expect(status).toBe(200);
				expect(body).toHaveProperty("success", true);
				expect(body).toHaveProperty("message", "Carts Eddited Successfully");
				done();
			});
	});

	it("Fail edit cart missing access_token, return {sucess: false, errors=['Missing Token']}", (done) => {
		Cart.create({
			...cart_default,
			product_id: product_id_one,
		})
			.then((cart) => {
				return request(app)
					.put(`/carts/${cart.id}`)
					.set("Content-Type", "application/json")
					.send({ quantity: 2 });
			})
			.then(({ body, status }) => {
				expect(status).toBe(400);
				expect(body).toHaveProperty("success", false);
				expect(body["errors"]).toContain("Missing Token");
				done();
			});
	});

	it("Fail edit cart, negative stock {sucess: false, errors: ['Stock must be at least 1']}", (done) => {
		Cart.create({
			...cart_default,
			product_id: product_id_one,
		})
			.then((cart) => {
				return request(app)
					.put(`/carts/${cart.id}`)
					.set("Content-Type", "application/json")
					.set("access_token", access_token_not_admin)
					.send({
						quantity: -1,
					});
			})
			.then(({ body, status }) => {
				expect(status).toBe(400);
				expect(body).toHaveProperty("success", false);
				expect(body["errors"]).toContain("Quantity must be at least 1");
				done();
			});
	});

	it("Fail add cart, price with string as a value {sucess: false, errors: ['Price must be a number', 'Stock must be a number']}", (done) => {
		Cart.create({
			...cart_default,
			product_id: product_id_one,
		})
			.then((cart) => {
				return request(app)
					.put(`/carts/${cart.id}`)
					.set("Content-Type", "application/json")
					.set("access_token", access_token_not_admin)
					.send({
						quantity: "adfasdfasd",
					});
			})
			.then(({ body, status }) => {
				expect(status).toBe(400);
				expect(body).toHaveProperty("success", false);
				expect(body["errors"]).toContain("Quantity must be a number");
				done();
			});
	});
});

describe("DELETE /carts/:id", () => {
	it("Success delete cart, return {sucess: true, message: Cart Successfully Deleted}", (done) => {
		Cart.create(cart_default)
			.then((cart) => {
				return request(app)
					.delete(`/carts/${cart.id}`)
					.set("Content-Type", "application/json")
					.set("access_token", access_token_not_admin)
					.send();
			})
			.then(({ body, status }) => {
				expect(status).toBe(201);
				expect(body).toHaveProperty("success", true);
				expect(body).toHaveProperty("message", "Cart Successfully Deleted");
				done();
			});
	});

	it("Fail delete cart missing access_token, return {sucess: false, errors=['Missing Token']}", (done) => {
		Cart.create(cart_default)
			.then((cart) => {
				return request(app)
					.delete(`/carts/${cart.id}`)
					.set("Content-Type", "application/json")
					.send();
			})
			.then(({ body, status }) => {
				expect(status).toBe(400);
				expect(body).toHaveProperty("success", false);
				expect(body["errors"]).toContain("Missing Token");
				done();
			});
	});
});
