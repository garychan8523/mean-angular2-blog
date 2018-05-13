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
				title: req.body.title.replace(/<\/?.*?>/g, ''),
				body: req.body.body.replace(/\n/g, "<br>").replace(/<\/?(?!(?:p|b|i|u|font|strong|br|s|ol|li)\b)[a-zA-Z0-9._\-%$*?].*?>/g, ''),
                createdBy: req.body.createdBy,
                createdAt: Date.now() + new Date().getTimezoneOffset()
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
    									blog.title = req.body.title.replace(/<\/?.*?>/g, '');
    									blog.body = req.body.body.replace(/<\/?(?!(?:p|b|i|u|font|strong|br|s|ol|li)\b)[a-zA-Z0-9._\-%$*?].*?>/g, '');
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

    router.delete('/deleteBlog/:id', checkAuth, (req, res) => {
        if (!req.params.id) {
            res.json({ success: false, message: 'No blog id provided.' });
        } else {
            Blog.findOne({ _id: req.params.id }, (err, blog) => {
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
                                        blog.remove((err) => {
                                            if (err) {
                                                res.json({ success: false, message: err });
                                            } else {
                                                res.json({ success: true, message: 'blog removed.' });
                                            }
                                        })
                                    }
                                }
                            }
                        });
                    }
                }
            })
        }
    });

    router.put('/likeBlog', checkAuth, (req, res) => {
        if(!req.body.id) {
            res.json({ success: false, message: 'No blog id provided.' });
        } else {
            Blog.findOne({ _id: req.body.id }, (err, blog) => {
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
                                    if (user.username === blog.createdBy) {
                                        res.json({ success: false, message: 'Cannot like your own post.' });
                                    } else {
                                        if (blog.likedBy.includes(user.username)) {
                                            res.json({ success: false, message: 'You already liked this post.' });
                                        } else {
                                            if (blog.dislikedBy.includes(user.username)) {
                                                blog.dislikes--;
                                                const arrayIndex = blog.dislikedBy.indexOf(user.username);
                                                blog.dislikedBy.splice(arrayIndex, 1);
                                                blog.likes++;
                                                blog.likedBy.push(user.username);
                                                blog.save((err) => {
                                                    if (err) {
                                                        res.json({ success: false, message: err });
                                                    } else {
                                                        res.json({ success: true, message: 'Blog liked.' });
                                                    }
                                                });
                                            } else {
                                                blog.likes++;
                                                blog.likedBy.push(user.username);
                                                blog.save((err) => {
                                                    if (err) {
                                                        res.json({ success: false, message: err });
                                                    } else {
                                                        res.json({ success: true, message: 'Blog liked.' });
                                                    }
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    }
                }
            })
        }
    });

    router.put('/dislikeBlog', checkAuth, (req, res) => {
        if(!req.body.id) {
            res.json({ success: false, message: 'No blog id provided.' });
        } else {
            Blog.findOne({ _id: req.body.id }, (err, blog) => {
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
                                    if (user.username === blog.createdBy) {
                                        res.json({ success: false, message: 'Cannot dislike your own post.' });
                                    } else {
                                        if (blog.dislikedBy.includes(user.username)) {
                                            res.json({ success: false, message: 'You already disliked this post.' });
                                        } else {
                                            if (blog.likedBy.includes(user.username)) {
                                                blog.likes--;
                                                const arrayIndex = blog.likedBy.indexOf(user.username);
                                                blog.likedBy.splice(arrayIndex, 1);
                                                blog.dislikes++;
                                                blog.dislikedBy.push(user.username);
                                                blog.save((err) => {
                                                    if (err) {
                                                        res.json({ success: false, message: err });
                                                    } else {
                                                        res.json({ success: true, message: 'Blog disliked.' });
                                                    }
                                                });
                                            } else {
                                                blog.dislikes++;
                                                blog.dislikedBy.push(user.username);
                                                blog.save((err) => {
                                                    if (err) {
                                                        res.json({ success: false, message: err });
                                                    } else {
                                                        res.json({ success: true, message: 'Blog disliked.' });
                                                    }
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    }
                }
            })
        }
    });

	return router;
};