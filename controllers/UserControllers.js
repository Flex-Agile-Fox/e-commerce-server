const { User } = require('../models');

class UserController {
	static login(req, res, next) {
		const { name, email, password, role } = req.body;
		res.status(200).json('success login');
	}
	static register(req, res, next) {
		res.status(201).json('registered');
	}
}

module.exports = UserController;
