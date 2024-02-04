const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Blog = require('../models/blog');
const ActiveSession = require('../models/activeSession');
const LoginState = require('../models/loginState');
const checkAuth = require('../middleware/auth');

module.exports = (app) => {
    router.get('/activeSessions', checkAuth, (req, res) => {
        ActiveSession.find({ userId: req.decoded.userId })
            .then((records) => {
                if (records.length <= 0) {
                    throw 'session record not found';
                }
                res.json({ success: true, records: records[0].sessions });
            })
            .catch((err) => {
                res.json({ success: false, message: err });
            })
    });

    router.get('/loginstatus', checkAuth, (req, res) => {
        User.findOne({ _id: req.decoded.userId }).select('username')
            .then((user) => {
                if (!user) {
                    res.json({ success: false, message: 'user not found' });
                } else {
                    // var cursor = LoginState.aggregate()
                    //     .match({ username: user.username })
                    //     .unwind('$record')
                    //     .sort({ 'record.loginAt': -1 })
                    //     .group({ _id: '$username', record: { $push: '$record' } })
                    //     .project({ username: 0, _id: 0, 'record.token': 0, 'record._id': 0 })
                    //     .allowDiskUse(true)
                    //     .cursor({ batchSize: 1000000 }).exec();
                    try {
                        LoginState.find({ username: user.username }).exec((err, records) => {
                            if (err || records.length <= 0) {
                                throw err;
                            }
                            res.json({ success: true, data: records[0].sessions });
                        });
                        // cursor.each(function (err, records) {
                        //     if (cursor && (err || records)) {
                        //         if (err) {
                        //             res.json({ success: false, message: err });
                        //         }
                        //         else if (!records) {
                        //             res.json({ success: false, message: 'record not found' });
                        //         }
                        //         else {
                        //             res.json({ success: true, records: records.record });
                        //         }
                        //     }
                        // });
                    } catch (err) {
                        res.json({ success: false, message: err });
                    }
                    // LoginState.findOne({ username: user.username }, { _id: 0, username: 0, __v: 0, "record.token": 0 }, (err, records) => {
                    //     if (err) {
                    //         res.json({ success: false, message: err });
                    //     }
                    //     if (!records) {
                    //         res.json({ success: false, message: 'record not found' });
                    //     } else {
                    //         res.json({ success: true, records: records });
                    //     }
                    // }).sort({ "record.loginAt": -1 });
                }
            })
            .catch((err) => {
                res.json({ success: false, message: err });
            })
    });

    router.get('/:userId/blogs', (req, res) => {
        if (!req.params.userId) {
            res.json({ success: false, message: 'no userId provided' });
        } else {
            Blog.find({ createdBy: req.params.userId, published: true, publishedAt: { $lte: Date.now() } })
                .sort({ '_id': -1 })
                .then((blogs) => {
                    if (!blogs) {
                        res.json({ success: false, message: 'no blogs found' });
                    } else {
                        res.json({ success: true, blogs: blogs });
                    }
                })
                .catch((err) => {
                    res.json({ success: false, message: err });
                })
        }
    });

    router.get('/:username', (req, res) => {
        if (!req.params.username) {
            res.json({ success: false, message: 'no uesrname provided' });
        } else {
            User.findOne({ username: req.params.username }).select('username email')
                .then((user) => {
                    if (!user) {
                        res.json({ success: false, message: 'user not found' });
                    } else {
                        res.json({ success: true, user: user });
                    }
                })
                .catch((err) => {
                    res.json({ success: false, message: err });
                })
        }
    });

    router.get('/', checkAuth, (req, res) => {
        User.findOne({ _id: req.decoded.userId }).select('username email')
            .then((user) => {
                if (!user) {
                    res.json({ success: false, message: 'user not found' });
                } else {
                    res.json({ success: true, user: user });
                }
            })
            .catch((err) => {
                res.json({ success: false, message: err });
            })
    });

    return router;
};
