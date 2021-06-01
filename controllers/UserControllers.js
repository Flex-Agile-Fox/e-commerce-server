class UserController {
	static login(req, res, next) {
		res.status(200).json('success login');
	}
	static register(req, res, next) {
		res.status(201).json('registered');
	}
}

module.exports = UserController;
