const Blog = require('../models/blog');
const User = require('../models/user');
const checkAuth = require('../middleware/auth');

module.exports = (router) => {

    router.param('blogId', function (req, res, next, blogId) {
        // console.log('fetching blog')
        try {
            if (!blogId) {
                throw 'missing blog id';
            } else {
                Blog.findOne({ _id: blogId }, (err, blog) => {
                    if (err) {
                        throw err;
                    } else {
                        if (!blog) {
                            throw 'blog not found';
                        } else {
                            req.blog = blog
                            next();
                        }
                    }
                });
            }
        } catch (err) {
            next(new Error(err));
        }
    });

    router.post('/newBlog', checkAuth, (req, res) => {
        if (!req.body.title) {
            res.json({ success: false, message: 'blog title is required' });
        } else if (!req.body.body) {
            res.json({ success: false, message: 'blog body is required' });
        } else if (!req.body.createdBy) {
            res.json({ success: false, message: 'blog creator is required' });
        } else {
            const blog = new Blog({
                title: req.body.title.replace(/<\/?.*?>/g, ''),
                leadin: req.body.leadin.replace(/\n/g, "<br>").replace(/<\/?(?!(?:p|b|i|u|font|strong|br|s|ol|li)\b)[a-zA-Z0-9._\-%$*?].*?>/g, ''),
                body: req.body.body,
                createdBy: req.body.createdBy,
                createdAt: Date.now() + new Date().getTimezoneOffset()
            });
            blog.save((err) => {
                if (err) {
                    if (err.errors) {
                        if (err.errors.title) {
                            res.json({ success: false, message: err.errors.title.message });
                        } else if (err.errors.body) {
                            res.json({ success: false, message: err.errors.body.message });
                        } else {
                            res.json({ success: false, message: err.errmsg });
                        }
                    } else {
                        res.json({ success: false, message: err });
                    }
                } else {
                    res.json({ success: true, message: 'blog saved', blogId: blog._id });
                }
            });
        }
    });

    router.get('/singleBlog/:blogId', (req, res) => {
        res.json({ success: true, blog: req.blog });
    });

    router.get('/listUnpublished', checkAuth, (req, res) => {
        User.findOne({ _id: req.decoded.userId }, (err, user) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!user) {
                    res.json({ success: false, message: 'Unable to authenticate user' });
                } else {
                    Blog.find({ createdBy: user.username, published: undefined }, (err, blogs) => {
                        if (err) {
                            res.json({ success: false, message: err });
                        } else {
                            res.json({ success: true, blogs: blogs });
                        }
                    }).sort({ '_id': -1 });
                }
            }
        });
    });

    router.get('/listPrivate', checkAuth, (req, res) => {
        User.findOne({ _id: req.decoded.userId }, (err, user) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!user) {
                    res.json({ success: false, message: 'Unable to authenticate user' });
                } else {
                    Blog.find({ createdBy: user.username, published: false }, (err, blogs) => {
                        if (err) {
                            res.json({ success: false, message: err });
                        } else {
                            res.json({ success: true, blogs: blogs });
                        }
                    }).sort({ '_id': -1 });
                }
            }
        });
    });

    router.put('/updateBlog/:blogId', checkAuth, (req, res) => {
        let blog = req.blog;
        User.findOne({ _id: req.decoded.userId }, (err, user) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!user) {
                    res.json({ success: false, message: 'Unable to authenticate user' });
                } else {
                    if (user.username !== blog.createdBy) {
                        res.json({ success: false, message: 'Not authorized' });
                    } else {
                        blog.title = req.body.title.replace(/<\/?.*?>/g, '');
                        if (req.body.leadin) {
                            blog.leadin = req.body.leadin.replace(/\n/g, "<br>").replace(/<\/?(?!(?:p|b|i|u|font|strong|br|s|ol|li)\b)[a-zA-Z0-9._\-%$*?].*?>/g, '');
                        } else if (req.body.leadin.length == 0) {
                            blog.leadin = '';
                        }
                        blog.body = req.body.body.replace(/<\/?(?!(?:p|b|i|u|font|strong|br|s|ol|li)\b)[a-zA-Z0-9._\-%$*?].*?>/g, '');
                        blog.save((err) => {
                            if (err) {
                                res.json({ success: false, message: err });
                            } else {
                                res.json({ success: true, message: 'blog updated' });
                            }
                        });
                    }
                }
            }
        });
    });

    router.delete('/deleteBlog/:blogId', checkAuth, (req, res) => {
        let blog = req.blog;
        User.findOne({ _id: req.decoded.userId }, (err, user) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!user) {
                    res.json({ success: false, message: 'Unable to authenticate user' });
                } else {
                    if (user.username !== blog.createdBy) {
                        res.json({ success: false, message: 'Not authorized' });
                    } else {
                        blog.remove((err) => {
                            if (err) {
                                res.json({ success: false, message: err });
                            } else {
                                res.json({ success: true, message: 'blog removed' });
                            }
                        })
                    }
                }
            }
        });
    });

    router.put('/likeBlog', checkAuth, (req, res) => {
        if (!req.body.id) {
            res.json({ success: false, message: 'No blog id provided' });
        } else {
            Blog.findOne({ _id: req.body.id }, (err, blog) => {
                if (err) {
                    res.json({ success: false, message: 'Invalid blog id' });
                } else {
                    if (!blog) {
                        res.json({ success: false, message: 'Blog id not found' });
                    } else {
                        User.findOne({ _id: req.decoded.userId }, (err, user) => {
                            if (err) {
                                res.json({ success: false, message: err });
                            } else {
                                if (!user) {
                                    res.json({ success: false, message: 'Unable to authenticate user' });
                                } else {
                                    if (user.username === blog.createdBy) {
                                        res.json({ success: false, message: 'Cannot like your own post' });
                                    } else {
                                        if (blog.likedBy.includes(user.username)) {
                                            res.json({ success: false, message: 'You already liked this post' });
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
                                                        res.json({ success: true, message: 'Blog liked' });
                                                    }
                                                });
                                            } else {
                                                blog.likes++;
                                                blog.likedBy.push(user.username);
                                                blog.save((err) => {
                                                    if (err) {
                                                        res.json({ success: false, message: err });
                                                    } else {
                                                        res.json({ success: true, message: 'Blog liked' });
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
        if (!req.body.id) {
            res.json({ success: false, message: 'No blog id provided' });
        } else {
            Blog.findOne({ _id: req.body.id }, (err, blog) => {
                if (err) {
                    res.json({ success: false, message: 'Invalid blog id' });
                } else {
                    if (!blog) {
                        res.json({ success: false, message: 'Blog id not found' });
                    } else {
                        User.findOne({ _id: req.decoded.userId }, (err, user) => {
                            if (err) {
                                res.json({ success: false, message: err });
                            } else {
                                if (!user) {
                                    res.json({ success: false, message: 'Unable to authenticate user' });
                                } else {
                                    if (user.username === blog.createdBy) {
                                        res.json({ success: false, message: 'Cannot dislike your own post' });
                                    } else {
                                        if (blog.dislikedBy.includes(user.username)) {
                                            res.json({ success: false, message: 'You already disliked this post' });
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
                                                        res.json({ success: true, message: 'Blog disliked' });
                                                    }
                                                });
                                            } else {
                                                blog.dislikes++;
                                                blog.dislikedBy.push(user.username);
                                                blog.save((err) => {
                                                    if (err) {
                                                        res.json({ success: false, message: err });
                                                    } else {
                                                        res.json({ success: true, message: 'Blog disliked' });
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

    router.post('/comment', checkAuth, (req, res) => {
        if (!req.body.comment) {
            res.json({ success: false, message: 'no comment provided' });
        } else {
            if (!req.body.id) {
                res.json({ success: false, message: 'no id provided' });
            } else {
                Blog.findOne({ _id: req.body.id }, (err, blog) => {
                    if (err) {
                        res.json({ success: false, message: 'Invalid blog id' });
                    } else {
                        if (!blog) {
                            res.json({ success: false, message: 'Blog id not found' });
                        } else {
                            User.findOne({ _id: req.decoded.userId }, (err, user) => {
                                if (err) {
                                    res.json({ success: false, message: err });
                                } else {
                                    if (!user) {
                                        res.json({ success: false, message: 'Unable to authenticate user' });
                                    } else {
                                        blog.comments.push({
                                            comment: req.body.comment,
                                            commentator: user.username
                                        });
                                        blog.save((err) => {
                                            if (err) {
                                                res.json({ success: false, message: err });
                                            } else {
                                                res.json({ success: true, message: 'comment saved' });
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });

    router.patch('/setting/:blogId', (req, res, next) => {
        let settingPatchObj = req.body.settingPatchObj;
        // console.log(settingPatchObj.blogId);
        // console.log(settingPatchObj.published);
        // console.log(settingPatchObj.publishedAt);

        Blog.bulkWrite([
            {
                updateOne: {
                    filter: {
                        _id: settingPatchObj.blogId,
                        publishedAt: { $exists: false }
                    },
                    update: {
                        publishedAt: settingPatchObj.publishedAt
                    }
                }
            },
            {
                updateOne: {
                    filter: {
                        _id: settingPatchObj.blogId
                    },
                    update: {
                        published: settingPatchObj.published
                    }
                }
            }
        ]).then(result => {
            // console.log(result.insertedCount, result.modifiedCount, result.deletedCount);

            let message;
            if (result.modifiedCount == 0) {
                message = 'no update';
            } else if (result.modifiedCount == 1) {
                message = 'updated blog visibility';
            } else if (result.modifiedCount == 2) {
                message = 'updated blog visibility and publish date';
            }

            if (message) {
                res.json({ success: true, message: message });
            } else {
                next(new Error('something wrong'));
            }
        }).catch((err) => {
            next(new Error(err));
        });
    });

    return router;
};
