const { User } = require("../models");

class UserController {
	static register(req, res, next) {
		const { name, email, password } = req.body;
		const role = "user";
		User.create({
			name,
			email,
			password,
			role,
		})
			.then((_) => {
				res
					.status(201)
					.json({ success: true, message: "user successfully created" });
			})
			.catch((err) => {
				next(err);
			});
	}
	static login(req, res, next) {
		res.status(201).json({});
	}
}

module.exports = UserController;
