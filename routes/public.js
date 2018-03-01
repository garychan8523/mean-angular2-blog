const User = require('../models/user');
const Blog = require('../models/blog');
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/database'); // Import database configuration

module.exports = (router) => {

	router.get('/allBlogs', (req, res) => {
		Blog.find({}, (err, blogs) => {
			if(err) {
				res.json({ success: false, message: err });
			}else if(!blogs) {
				res.json({ success: false, message: 'no blogs found' });
			}else{
				res.json({ success: true, blogs: blogs });
			}
		}).sort({ '_id': -1 });
	});
	return router;
};