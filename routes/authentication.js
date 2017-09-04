const User = require('../models/users');

module.exports = (router) => {

	router.post('/register', (req, res) => {
		// req.body.email
		// req.body.username
		// req.body.password
		if (!req.body.email) {
			res.json({ success: false, message: 'You must provide an e-mail' });
		} else if (!req.body.username) {
			res.json({ success: false, message: 'You must provide an username' });
		} else if (!req.body.password) {
			res.json({ success: false, message: 'You must provide a password' });
		} else {
			let user = new User({
				email: req.body.email.toLowerCase(),
				username: req.body.username.toLowerCase(),
				password: req.body.password
			});
			user.save((err) => {
				if (err) {
					if (err.code === 11000) {
						res.json({ success: false, message: 'Username or email already exists' });
					} else if (err.errors) {
						if (err.errors.email) {
							res.json({ success: false, message: err.errors.email.message });
						} else if (err.errors.username) {
							res.json({ success: false, message: err.errors.username.message });
						} else if (err.errors.password) {
							res.json({ success: false, message: err.errors.password.message });
						}
					} else {
						res.json({ success: false, message: 'Could not save user. Error: ', err });
					}
				} else {
					res.json({ success: true, message: 'Account registered!' });
				}
			});
		}
	});

	return router;
}