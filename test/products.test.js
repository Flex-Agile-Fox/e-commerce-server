const request = require("supertest");
const app = require("../app");
const bcrypt = require("bcrypt");
const { sequelize, User } = require("../models");
const { queryInterface } = sequelize;
const jwt = require("jsonwebtoken");

// default user setup
const salt = bcrypt.genSaltSync(10);
const default_password = "123456";
const hash = bcrypt.hashSync(default_password, salt);
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
	role: "user",
	createdAt: new Date(),
	updatedAt: new Date(),
};

// jest test case
beforeAll((done) => {
	queryInterface
		.bulkDelete("Users", null, {})
		.then(() => {
			const users = [default_user, default_user_notadmin];
			return queryInterface.bulkInsert("Users", users);
		})
		.then((user) => {
			done();
		})
		.catch((err) => {
			throw err;
		});
});

afterAll((done) => {
	queryInterface
		.bulkDelete("Users", null, {})
		.then(() => done())
		.catch((err) => {
			throw err;
		});
});

describe("POST /products", () => {
	it("Success add product, return {sucess: true, data: {name, image_url, price, stock, description}}", (done) => {
		User.findOne({
			where: { email: default_user.email },
		}).then((admin) => {
			const access_token = jwt.sign(
				{ id: admin.id, email: admin.email, role: admin.role },
				process.env.JWT_SECRET
			);
			request(app)
				.post("/products")
				.set("Content-Type", "application/json")
				.set("access_token", access_token)
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
					expect(body["data"]).toHaveProperty(
						"description",
						expect.any(String)
					);
					done();
				});
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
		User.findOne({
			where: { email: default_user_notadmin.email },
		}).then((not_admin) => {
			const access_token = jwt.sign(
				{ id: not_admin.id, email: not_admin.email, role: not_admin.role },
				process.env.JWT_SECRET
			);
			request(app)
				.post("/products")
				.set("Content-Type", "application/json")
				.set("access_token", access_token)
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
	});

	it("Fail add product, missing required field {sucess: false, errors: ['Not authorized']}", (done) => {
		User.findOne({
			where: { email: default_user.email },
		}).then((admin) => {
			const access_token = jwt.sign(
				{ id: admin.id, email: admin.email, role: admin.role },
				process.env.JWT_SECRET
			);
			request(app)
				.post("/products")
				.set("Content-Type", "application/json")
				.set("access_token", access_token)
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
	});
});

// describe("GET /products/:id", () => {
// 	it("Success read product, return {sucess: true, product: {name, image_url, price, stock, description}}", (done) => {
// 		request(app)
// 			.get("/products/:id")
// 			.set("Content-Type", "application/json")
// 			.send({})
// 			.then(({ body, status }) => {
// 				expect(status).toBe(200);
// 				// expect(body).toHaveProperty('access_token', expect.any(String));
// 				done();
// 			});
// 	});
// });

// describe("GET /products", () => {
// 	it("Success read all products, return {sucess: true, products: [product, product]}", (done) => {
// 		request(app)
// 			.get("/products")
// 			.set("Content-Type", "application/json")
// 			.send({})
// 			.then(({ body, status }) => {
// 				expect(status).toBe(200);
// 				// expect(body).toHaveProperty('access_token', expect.any(String));
// 				done();
// 			});
// 	});
// });

// describe("PUT /products/:id", () => {
// 	it("Success edit product, return {sucess: true, product: {name, image_url, price, stock, description}}", (done) => {
// 		request(app)
// 			.put("/products/:id")
// 			.set("Content-Type", "application/json")
// 			.send({})
// 			.then(({ body, status }) => {
// 				expect(status).toBe(201);
// 				// expect(body).toHaveProperty('access_token', expect.any(String));
// 				done();
// 			});
// 	});
// });

// describe("DELETE /products/:id", () => {
// 	it("Success delete product, return {sucess: true}", (done) => {
// 		request(app)
// 			.delete("/products/:id")
// 			.set("Content-Type", "application/json")
// 			.send({})
// 			.then(({ body, status }) => {
// 				expect(status).toBe(201);
// 				// expect(body).toHaveProperty('access_token', expect.any(String));
// 				done();
// 			});
// 	});
// });
