const User = require('../models/user');
const LoginState = require('../models/loginState');
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

    router.get('/loginstatus', checkAuth, (req, res) => {
        User.findOne({ _id: req.decoded.userId }).select('username').exec((err, user) => {
            if(err){
                res.json({ success: false, message: err });
            }
            if(!user){
                res.json({ success: false, message: 'user not found' }); // Return error, user was not found in db
            }else{
                LoginState.aggregate(
                    { $match: {'username': user.username}},
                    { $unwind: '$record' },
                    { $sort: {'record.loginAt': -1 }},
                    { $group: { _id: '$username',record: { $push: '$record' }}},
                    { $project: {'username': 0, '_id': 0, 'record.token': 0, 'record._id': 0}},
                    (err, records) => {
                        if(err){
                            res.json({ success: false, message: err });
                        }
                        if(!records){
                            res.json({ success: false, message: 'record not found' });
                        }else{
                            res.json({ success: true, records: records });
                        }
                    });
                // LoginState.findOne({ username: user.username },  { _id: 0, username: 0, __v: 0, "record.token": 0}, (err, records) => {
                //     if(err){
                //         res.json({ success: false, message: err });
                //     }
                //     if(!records){
                //         res.json({ success: false, message: 'record not found' });
                //     }else{
                //         res.json({ success: true, records: records });
                //     }
                // }).sort({ "record.loginAt": -1 });
            }
        });
    });

  	return router;
};