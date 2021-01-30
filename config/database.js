const crypto = require('crypto').randomBytes(256).toString('hex');

if (process.env.ENV && process.env.ENV == 'PRD') {
	module.exports = {
		uri: process.env.MONGO_CONN,
		secret: crypto,
		db: process.env.MONGO_DB
	}
} else {
	module.exports = {
		uri: 'mongodb://localhost:27017/mean-angular2-blog',
		secret: crypto,
		db: 'mean-angular2-blog'
	}
}
