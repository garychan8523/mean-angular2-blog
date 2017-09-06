const User = require('../models/users');
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/database'); // Import database configuration

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
        User.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
          // Check if error was found
          if (err) {
            res.json({ success: false, message: err }); // Return error
          } else {
            // Check if username was found
            if (!user) {
              res.json({ success: false, message: 'user not found' }); // Return error
            } else {
              const validPassword = user.comparePassword(req.body.password); // Compare password provided to password in database
              // Check if password is a match
              if (!validPassword) {
                res.json({ success: false, message: 'user not found' }); // Return error
              } else {
                const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h' }); // Create a token for client
                res.json({ success: true, message: 'success', token: token, user: { username: user.username } }); // Return success and token to frontend
              }
            }
          }
        });
      }
    }
  });

	// token auth middlemare: start
	router.use((req, res, next) => {
    const token = req.headers['authorization']; // Create token found in headers
    // Check if token was found in headers
    if (!token) {
      res.json({ success: false, message: 'no token provided' }); // Return error
    } else {
      // Verify the token is valid
      jwt.verify(token, config.secret, (err, decoded) => {
        // Check if error is expired or invalid
        if (err) {
          res.json({ success: false, message: 'token invalid, error: ' + err }); // Return error for token validation
        } else {
          req.decoded = decoded; // Create global variable to use in any request beyond
          next(); // Exit middleware
        }
      });
    }
  });
	// token auth middlemare: end - anything below require logined account

	router.get('/profile', (req, res) => {
    // Search for user in database
    User.findOne({ _id: req.decoded.userId }).select('username email').exec((err, user) => {
      // Check if error connecting
      if (err) {
        res.json({ success: false, message: err }); // Return error
      } else {
        // Check if user was found in database
        if (!user) {
          res.json({ success: false, message: 'user not found' }); // Return error, user was not found in db
        } else {
          res.json({ success: true, user: user }); // Return success, send user object to frontend for profile
        }
      }
    });
  });

	return router;
}