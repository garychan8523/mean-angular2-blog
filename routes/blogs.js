const Blog = require('../models/blog');
const User = require('../models/user');
const checkAuth = require('../middleware/auth');

module.exports = (router) => {

	router.post('/newBlog', checkAuth, (req, res) => {
		if(!req.body.title) {
			res.json({ success: false, message: 'blog title is required.' });
		}else if(!req.body.body) {
			res.json({ success: false, message: 'blog body is required.' });
		}else if(!req.body.createdBy) {
			res.json({ success: false, message: 'blog creator is required.' });
		}else {
			const blog = new Blog({
				title: req.body.title,
				body: req.body.body.replace(/\n/g, "<br>").replace(/<(?!br\s*\/?)[^>]+>/g, ''),
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

	router.get('/singleBlog/:id', checkAuth, (req, res) => {
        if(!req.params.id) {
            res.json({ success: false, message: 'No blog id provided.' });
        } else {
            Blog.findOne({ _id: req.params.id }, (err, blog) => {
                if (err) {
                    res.json({ success: false, message: 'Not a valid blog id.' });
                } else {
                    if (!blog) {
                        res.json({ success: false, message: 'Blog not found.' });
                    } else {
                    	User.findOne({ _id: req.decoded.userId }, (err, user) => {
                    		if (err) {
                    			res.json({ success: false, message: err });
                    		} else {
                    			if (!user) {
                    				res.json({ success: false, message: 'Unable to authenticate user.' });
                    			} else {
                    				if (user.username !== blog.createdBy) {
                    					res.json({ success: false, message: 'Not authorized.' });
                    				} else {
                    					res.json({ success: true, blog: blog });
                    				}
                    			}
                    		}
                    	});
                    }
                }
            });
        }
    });

    router.put('/updateBlog', checkAuth, (req, res) => {
    	if(!req.body._id) {
    		res.json({ success: false, message: 'No blog id provided.' });
    	} else {
    		Blog.findOne({ _id: req.body._id }, (err, blog) => {
    			if (err) {
    				res.json({ success: false, message: 'Invalid blog id.' });
    			} else {
    				if (!blog) {
    					res.json({ success: false, message: 'Blog id not found.' });
    				} else {
    					User.findOne({ _id: req.decoded.userId }, (err, user) => {
    						if (err) {
    							res.json({ success: false, message: err });
    						} else {
    							if (!user) {
    								res.json({ success: false, message: 'Unable to authenticate user.' });
    							} else {
    								if (user.username !== blog.createdBy) {
    									res.json({ success: false, message: 'Not authorized.' });
    								} else {
    									blog.title = req.body.title;
    									blog.body = req.body.body;
    									blog.save((err) => {
    										if (err) {
    											res.json({ success: false, message: err });
    										} else {
    											res.json({ success: true, message: 'blog updated.' });
    										}
    									});
    								}
    							}
    						}
    					});
    				}
    			}
    		});
    	}
    });

	return router;
};