const Blog = require('../models/blog');

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