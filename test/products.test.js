const request = require("supertest");
const app = require("../app");
const bcrypt = require("bcrypt");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;

// describe("POST /products/add", () => {
// 	it("Success add product, return {sucess: true, product: {name, image_url, price, stock, description}}", (done) => {
// 		request(app)
// 			.post("/products/add")
// 			.set("Content-Type", "application/json")
// 			.send({})
// 			.then(({ body, status }) => {
// 				expect(status).toBe(201);
// 				// expect(body).toHaveProperty('access_token', expect.any(String));
// 				done();
// 			});
// 	});
// });

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

describe("GET /products", () => {
	it("Success read all products, return {sucess: true, product: {name, image_url, price, stock, description}}", (done) => {
		request(app)
			.get("/products")
			.set("Content-Type", "application/json")
			.send({})
			.then(({ body, status }) => {
				expect(status).toBe(200);
				// expect(body).toHaveProperty('access_token', expect.any(String));
				done();
			});
	});
});

describe("PUT /products/:id", () => {
	it("Success edit product, return {sucess: true, product: {name, image_url, price, stock, description}}", (done) => {
		request(app)
			.put("/products/1")
			.set("Content-Type", "application/json")
			.send({})
			.then(({ body, status }) => {
				expect(status).toBe(201);
				// expect(body).toHaveProperty('access_token', expect.any(String));
				done();
			});
	});
});

// describe("DELETE /products/:id", () => {
// 	it("Success add product, return {sucess: true, product: {name, image_url, price, stock, description}}", (done) => {
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
