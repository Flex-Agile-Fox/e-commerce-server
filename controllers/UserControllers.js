const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

class UserController {
	static register(req, res, next) {
		const { name, email, password, role } = req.body;

		User.create({ name, email, password, role })
			.then((user) => {
				const access_token = jwt.sign(
					{ id: user.id, role: user.role },
					JWT_SECRET
				);
				res.status(201).json({ access_token, user });
			})
			.catch((err) => {
				next(err);
			});
	}

	static login(req, res, next) {
		const { email, password } = req.body;

		User.findOne({ where: { email } })
			.then((user) => {
				if (user && bcrypt.compareSync(password, user.password)) {
					const access_token = jwt.sign(
						{ id: user.id, role: user.role },
						JWT_SECRET
					);
					return res.status(200).json({ access_token, user });
				}
				throw { name: 'LOGIN_FAIL' };
			})
			.catch((err) => {
				next(err);
			});
	}
}

module.exports = UserController;
