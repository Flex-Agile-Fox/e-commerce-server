const request = require("supertest");
const app = require("../app");
const bcrypt = require("bcrypt");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;

describe("POST /users/register", () => {
	it("Success register using new and valid email and valid password, return {sucess: true, message: 'user successfully created'}", (done) => {
		request(app)
			.post("/users/register")
			.set("Content-Type", "application/json")
			.send({})
			.then(({ body, status }) => {
				expect(status).toBe(201);
				// expect(body).toHaveProperty('access_token', expect.any(String));
				done();
			});
	});
});

describe("LOGIN /users/login", () => {
	it("Success login using valid email and valid password, return {sucess: true, access_token: 'string'}", (done) => {
		request(app)
			.post("/users/login")
			.set("Content-Type", "application/json")
			.send({})
			.then(({ body, status }) => {
				expect(status).toBe(201);
				// expect(body).toHaveProperty('access_token', expect.any(String));
				done();
			});
	});
});
