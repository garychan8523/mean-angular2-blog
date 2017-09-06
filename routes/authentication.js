const User = require('../models/users');

module.exports = (router) => {

	router.post('/register', (req, res) => {
		// req.body.email
		// req.body.username
		// req.body.password
		if (!req.body.email) {
			res.json({ success: false, message: 'must provide an e-mail' });
		} else if (!req.body.username) {
			res.json({ success: false, message: 'must provide an username' });
		} else if (!req.body.password) {
			res.json({ success: false, message: 'must provide a password' });
		} else {
			let user = new User({
				email: req.body.email.toLowerCase(),
				username: req.body.username.toLowerCase(),
				password: req.body.password
			});
			user.save((err) => {
				if (err) {
					if (err.code === 11000) {
						res.json({ success: false, message: 'username or email already exists' });
					} else if (err.errors) {
						if (err.errors.email) {
							res.json({ success: false, message: err.errors.email.message });
						} else if (err.errors.username) {
							res.json({ success: false, message: err.errors.username.message });
						} else if (err.errors.password) {
							res.json({ success: false, message: err.errors.password.message });
						}
					} else {
						res.json({ success: false, message: 'could not save user. error: ', err });
					}
				} else {
					res.json({ success: true, message: 'account registered!' });
				}
			});
		}
	});

	router.get('/checkEmail/:email', (req, res) => {
		if (!req.params.email) {
			res.json({ success: false, message: 'email not provided' });
		} else {
			User.findOne({ email: req.params.email }, (err, user) => {
				if (err) {
					res.json({ success: false, message: err });
				} else {
					if (user) {
						res.json({ success: false, message: 'email has been registered' });
					} else {
						res.json({ success: true, message: 'email is available' });
					}
				}
			});
		}
	});

	router.get('/checkUsername/:username', (req, res) => {
		if (!req.params.username) {
			res.json({ success: false, message: 'username not provided' });
		} else {
			User.findOne({ username: req.params.username }, (err, user) => {
				if (err) {
					res.json({ success: false, message: err });
				} else {
					if (user) {
						res.json({ success: false, message: 'username taken' });
					} else {
						res.json({ success: true, message: 'username is available' });
					}
				}
			});
		}
	});

	return router;
}