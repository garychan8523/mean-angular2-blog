const User = require('../models/user');
const Blog = require('../models/blog');
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/database'); // Import database configuration

module.exports = (router) => {

	router.post('/newBlog', (req, res) => {
		if(!req.body.title) {
			res.json({ success: false, message: 'blog title is required.' });
		}else if(!req.body.body) {
			res.json({ success: false, message: 'blog body is required.' });
		}else if(!req.body.createdBy) {
			res.json({ success: false, message: 'blog creator is required.' });
		}else {
			const blog = new Blog({
				title: req.body.title,
				body: req.body.body,
				createdBy: req.body.createdBy
			});
			blog.save((err) => {
				if(err) {
					if(err.errors) {
						if(err.errors.title) {
							res.json({ success: false, message: err.errors.title.message });
						}else if(err.errors.body) {
							res.json({ success: false, message: err.errors.body.message });
						}else {
							res.json({ success: false, message: err.errmsg });
						}
					}else {
						res.json({ success: false, message: err });
					}
				}else {
					res.json({ success: true, message: 'blog saved.' });
				}
			});
		}
	});

	return router;
};