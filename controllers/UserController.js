const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UserController {
	static register(req, res, next) {
		const { name, email, password } = req.body;
		const role = "customer";
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
		const { email, password } = req.body;
		if ((!email, !password)) {
			throw {
				name: "InvalidEmailAndPassword",
				message: "Invalid email and password",
			};
		}
		User.findOne({
			where: {
				email,
			},
		})
			.then((user) => {
				if (!user) {
					throw {
						name: "InvalidEmailAndPassword",
						message: "Invalid email and password",
					};
				}
				const validate = bcrypt.compareSync(password, user.password);
				if (!validate) {
					throw {
						name: "InvalidEmailAndPassword",
						message: "Invalid email and password",
					};
				}
				const access_token = jwt.sign(
					{
						id: user.id,
						role: user.role,
					},
					process.env.JWT_SECRET
				);

				res.status(200).json({ success: true, access_token });
			})
			.catch((err) => {
				next(err);
			});
	}
}

module.exports = UserController;
