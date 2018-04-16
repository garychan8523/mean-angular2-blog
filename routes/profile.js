const User = require('../models/user');
const checkAuth = require('../middleware/auth');

module.exports = (router) => {
	router.get('/profile', checkAuth, (req, res) => {
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