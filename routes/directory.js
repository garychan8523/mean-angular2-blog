const express = require('express');
const router = express.Router();

var mongoose = require('mongoose');

const Directory = require('../models/directory');

const checkAuth = require('../middleware/auth');

module.exports = (app) => {

    router.get('/:userId', (req, res) => {
        if (!req.params.userId) {
            res.json({ success: false, message: 'missing user id' });
            return
        }
        Directory.findOne({ owner: new mongoose.Types.ObjectId(req.params.userId) })
            .populate('owner', '_id username')
            .populate({
                path: 'directory',
                populate: {
                    path: 'content',
                    model: 'Blog',
                    select: '_id title'
                }
            })
            .then((directory) => {
                console.log('directory: ' + directory);
                if (directory == undefined) {
                    let directory = new Directory(
                        {
                            owner: new mongoose.Types.ObjectId('5ffd9fa731db9a0354c8fe67'),
                            directory: [
                                {
                                    path: '/default',
                                    content: [
                                        { _id: new mongoose.Types.ObjectId('601f6284af50363868a03fa3') },
                                        { _id: new mongoose.Types.ObjectId('601f6284af50363868a03fae') }
                                    ]
                                }

                            ]
                        }
                    )
                    directory.save((err) => {
                        if (err) {
                            res.json({ success: false, message: err });
                        } else {
                            res.json({ success: true, message: 'directory initialized' });
                        }
                    });
                } else {
                    res.json({ success: true, directory: directory });
                }
            })
            .catch((err) => {
                console.error(err)
                res.json({ success: false });
            })
    });
    return router;
};
