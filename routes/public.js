const Blog = require('../models/blog');

module.exports = (router) => {
	router.get('/allBlogs', (req, res) => {
		// Blog.find({ published: true, publishedAt: { $lte: Date.now() } }, (err, blogs) => {
		// 	if (err) {
		// 		res.json({ success: false, message: err });
		// 	} else if (!blogs) {
		// 		res.json({ success: false, message: 'no blogs found' });
		// 	} else {
		// 		res.json({ success: true, blogs: blogs });
		// 	}
		// }).sort({ publishedAt: -1 });
		const agg = [
			{
				'$match': {
					$and: [
						{ 'published': { $eq: true } },
						{ 'publishedAt': { $exists: true } },
						{ 'publishedAt': { $lte: new Date() } }
					]
				}
			},
			{
				'$lookup': {
					'from': 'users',
					'localField': 'createdBy',
					'foreignField': '_id',
					'as': 'createdBy'
				}
			}, {
				'$unwind': {
					'path': '$createdBy'
				}
			}, {
				'$set': {
					createdBy: '$createdBy.username'
				}
			},
			{
				'$project': {
					_id: 1,
					likes: 1,
					likedBy: 1,
					dislikes: 1,
					dislikedBy: 1,
					title: 1,
					leadin: 1,
					createdBy: 1,
					createdAt: 1,
					publishedAt: 1,
					published: 1
				}
			}
		];

		Blog.aggregate(agg, (err, blogs) => {
			if (err) {
				res.json({ success: false, message: err });
			} else if (!blogs) {
				res.json({ success: false, message: 'no blogs found' });
			} else {
				res.json({ success: true, blogs: blogs });
			}
		}).sort({ publishedAt: -1 });
	});

	router.get('/user/:userId', (req, res) => {
		if (!req.params.userId) {
			res.json({ success: false, message: 'no userId provided' });
		} else {
			Blog.find({ createdBy: req.params.userId, published: true, publishedAt: { $lte: Date.now() } }, (err, blogs) => {
				if (err) {
					res.json({ success: false, message: err });
				} else if (!blogs) {
					res.json({ success: false, message: 'no blogs found' });
				} else {
					res.json({ success: true, blogs: blogs });
				}
			}).sort({ '_id': -1 });
		}
	});

	return router;
};