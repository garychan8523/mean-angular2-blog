const express = require('express');
const router = express.Router();

const User = require('../models/user');
const LoginState = require('../models/loginState');
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/database'); // Import database configuration
const checkAuth = require('../middleware/auth');
var requestIp = require('request-ip');


module.exports = (app) => {

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
			user.save()
				.then(() => {
					res.json({ success: true, message: 'account registered' });
				})
				.catch((err) => {
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
				})
		}
	});

	router.get('/checkEmail/:email', (req, res) => {
		if (!req.params.email) {
			res.json({ success: false, message: 'email not provided' });
		} else {
			User.findOne({ email: req.params.email })
				.then((user) => {
					if (user) {
						res.json({ success: false, message: 'email has been registered' });
					} else {
						res.json({ success: true, message: 'email is available' });
					}
				})
				.catch((err) => {
					res.json({ success: false, message: err });
				})
		}
	});

	router.get('/checkUsername/:username', (req, res) => {
		if (!req.params.username) {
			res.json({ success: false, message: 'username not provided' });
		} else {
			User.findOne({ username: req.params.username })
				.then((user) => {
					if (user) {
						res.json({ success: false, message: 'username taken' });
					} else {
						res.json({ success: true, message: 'username is available' });
					}
				})
				.catch((err) => {
					res.json({ success: false, message: err });
				})
		}
	});

	router.get('/logout', checkAuth, (req, res) => {
		User.findOne({ _id: req.decoded.userId })
			.then((user) => {
				if (!user) {
					res.json({ success: false, message: 'user not found' });
				} else {
					const username = user.username;
					const token = req.headers['authorization'];
					LoginState.collection.updateOne(
						{ username: username, 'record.token': token },
						{ $set: { 'record.$.loggedout': true } },
						{ upsert: false });
					res.json({ success: true, message: 'logged out.' });
				}
			})
			.catch((err) => {
				res.json({ success: false, message: err });
			})
	});

	router.post('/login', (req, res) => {
		// Check if username was provided
		if (!req.body.username) {
			res.json({ success: false, message: 'No username was provided' }); // Return error
		} else {
			// Check if password was provided
			if (!req.body.password) {
				res.json({ success: false, message: 'No password was provided.' }); // Return error
			} else {
				// Check if username exists in database
				User.findOne({ username: req.body.username.toLowerCase() })
					.then((user) => {
						// Check if username was found
						if (!user) {
							res.json({ success: false, message: 'user not found' }); // Return error
						} else {
							const validPassword = user.comparePassword(req.body.password); // Compare password provided to password in database
							// Check if password is a match
							if (!validPassword) {
								res.json({ success: false, message: 'user not found' }); // Return error
							} else {
								const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '30d' }); // Create a token for client
								let now = Date.now() + new Date().getTimezoneOffset();
								let expire = now + 30 * 86400 * 1000;
								let clientIp = requestIp.getClientIp(req);
								let agent = req.headers['user-agent'];
								var device = "unknown";
								if (/mobile/i.test(agent)) {
									device = 'mobile';
								}
								if (/like Mac OS X/.test(agent)) {
									if (/CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/.exec(agent)[2].replace(/_/g, '.')) {
										device = 'ios';
									}
									if (/iPhone/.test(agent)) {
										device = 'iphone';
									}
									if (/iPad/.test(agent)) {
										device = 'ipad';
									}
								}
								if (/Android/.test(agent)) {
									device = 'android';
								}
								if (/webOS\//.test(agent)) {
									device = 'webos';
								}
								if (/(Intel|PPC) Mac OS X/.test(agent)) {
									device = 'mac';
								}
								if (/Windows NT/.test(agent)) {
									device = 'windows';
								}

								LoginState.findOneAndUpdate({ username: req.body.username }, {
									$push: {
										'record': {
											token: token,
											ipaddress: clientIp,
											device: device,
											location: "unknown",
											loginAt: now,
											expireAt: expire
										}
									}
								}, { upsert: true, new: true })
									.then(() => {
										res.json({ success: true, message: 'success', token: token, user: { username: user.username } });
									})
									.catch((err) => {
										res.json({ success: false, message: err });
									});
							}
						}
					})
					.catch((err) => {
						res.json({ success: false, message: JSON.stringify(err) })
					});
			}
		}
	});

	return router;
}