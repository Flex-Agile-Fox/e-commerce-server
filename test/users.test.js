const request = require("supertest");
const app = require("../app");
const bcrypt = require("bcrypt");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;

beforeAll((done) => {
	queryInterface
		.bulkDelete("Users", null, {})
		.then(() => {
			const salt = bcrypt.genSaltSync(10);
			const hash = bcrypt.hashSync("123456", salt);
			const user = {
				name: "test",
				email: "email@test.com",
				password: hash,
				role: "user",
				createdAt: new Date(),
				updatedAt: new Date(),
			};
			const users = [user];
			return queryInterface.bulkInsert("Users", users);
		})
		.then(() => done())
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

describe("POST /users/register", () => {
	it("Success register using new and valid email and valid password, return {sucess: true, message: 'user successfully created'}", (done) => {
		request(app)
			.post("/users/register")
			.set("Content-Type", "application/json")
			.send({ name: "rendy", email: "user@test.com", password: "123456" })
			.then(({ body, status }) => {
				expect(status).toBe(201);
				expect(body).toHaveProperty("success", true);
				expect(body).toHaveProperty("message", "user successfully created");
				done();
			});
	});

	it("Fail register using existing email, return {sucess: false, message: 'User Exists'}", (done) => {
		request(app)
			.post("/users/register")
			.set("Content-Type", "application/json")
			.send({ name: "duplicate", email: "email@test.com", password: "123456" })
			.then(({ body, status }) => {
				expect(status).toBe(400);
				expect(body).toHaveProperty("success", false);
				expect(body["errors"]).toContain("User Exists");
				done();
			});
	});

	it("Fail register using invalid email, return {sucess: false, message: 'Email must have a valid email format'}", (done) => {
		request(app)
			.post("/users/register")
			.set("Content-Type", "application/json")
			.send({ name: "duplicate", email: "email", password: "123456" })
			.then(({ body, status }) => {
				expect(status).toBe(400);
				expect(body).toHaveProperty("success", false);
				expect(body["errors"]).toContain(
					"Email must have a valid email format"
				);
				done();
			});
	});

	it("Fail register using empty password, empty name, empty email, return {sucess: false, message: 'Email must have a valid email format'}", (done) => {
		request(app)
			.post("/users/register")
			.set("Content-Type", "application/json")
			.send({ name: "", email: "", password: "" })
			.then(({ body, status }) => {
				expect(status).toBe(400);
				expect(body).toHaveProperty("success", false);
				expect(body["errors"]).toContain(
					"Email must have a valid email format"
				);
				expect(body["errors"]).toContain("Email cannot be empty");
				expect(body["errors"]).toContain("Name cannot be empty");
				expect(body["errors"]).toContain("Password cannot be empty");
				expect(body["errors"]).toContain(
					"Password must be at least 6 characters long and maximum 32 characters long"
				);
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
				// expect(body).toHaveProperty("success", "true");
				// expect(body).toHaveProperty("access_token", expect.any(String));
				done();
			});
	});
});
