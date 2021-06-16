const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

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
				console.log(err);
			});
	}

	static googleLogin(req, res, next) {
		const { token } = req.body;
		const client = new OAuth2Client(process.env.CLIENT_ID);
		async function verify() {
			const ticket = await client.verifyIdToken({
				idToken: token,
				audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
				// Or, if multiple clients access the backend:
				//[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
			});
			const payload = ticket.getPayload();
			// const userid = payload["sub"];
			// If request specified a G Suite domain:
			// const domain = payload['hd'];
			User.findOne({
				where: {
					email: payload.email,
				},
			})
				.then((user) => {
					const role = "customer";
					if (!user) {
						return User.create({
							name: payload.email,
							email: payload.email,
							password: process.env.DEFAULT_PASSWORD,
							role,
						});
					} else {
						return user;
					}
				})
				.then((user) => {
					console.log(user);
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
					console.log(err);
					next(err);
				});
		}
		verify().catch(console.error);
	}
}

module.exports = UserController;
