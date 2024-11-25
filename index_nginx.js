const fs = require('fs');
const https = require('https');

const express = require('express');
const app = express();


const fileUpload = require('express-fileupload');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('./config/database');
const path = require('path');
// const public = require('./routes/public.js.bak')(app);
const authentication = require('./routes/authentication')(app);
const profile = require('./routes/profile')(app)
const blogs = require('./routes/blogs')(app);
const directory = require('./routes/directory')(app);
const upload = require('./routes/upload')(app);

const ActiveSession = require('./models/activeSession');

const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 8080;

let server;

if (process.env.ENV && process.env.ENV == 'PRD') {
	server = app.listen(port, () => {
		console.log('[PRD] Listening on port ' + port);
	});
} else {
	server = app.listen(port, () => {
		console.log('Listening on port ' + port);
	});
}

const io = require('socket.io')(server, {
	cors: {
		origin: (process.env.ENV && process.env.ENV == 'PRD') ? "https://blog.dedd.ca" : "http://localhost:4200",
		methods: ["GET", "POST"],
		transports: ['websocket', 'polling'],
		credentials: true
	},
	allowEIO3: true
});

mongoose.Promise = global.Promise;
mongoose.connect(config.uri)
	.then(() => {
		console.log('connected with mongodb');
	})
	.catch((err) => {
		console.log('error when connecting with mongodb: ', err)
	})

// middleware: start
if (process.env.ENV && process.env.ENV == 'PRD') {
} else {
	app.use(cors({
		origin: ['http://localhost:4200', 'http://192.168.8.35:4200'],
		credentials: true
	}));
}

app.use(fileUpload());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));
app.use('/authentication', authentication);
app.use('/profile', profile);
app.use('/blogs', blogs);
app.use('/directory', directory);
app.use('/upload', upload);

app.use((err, req, res, next) => {
	res.status(500).send({
		message: err.message,
	});
});

// moddileware: end

if (process.env.ENV && process.env.ENV == 'PRD') {
	app.get('*', (req, res) => {
		res.redirect(process.env.DN_SERVER);
	});
} else {
	app.get('*', (req, res) => {
		res.redirect('http://localhost:4200');
	});
}
// app.get('*', (req, res) => {
//   //res.send('<h1>Hello World</h1>');
//   res.sendFile(path.join(__dirname + '/public/index.html'));
// });

io.sockets.on('connection', (socket) => {
	function addSessionRecord(token) {
		jwt.verify(token, config.secret, (err, decoded) => {
			if (!err) {
				let agent = socket.request.headers['user-agent'];
				var device = "unknown";
				if (/mobile/i.test(agent)) {
					device = 'mobile';
				}
				if (/like Mac OS X/.test(agent)) {
					if (/CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/.exec(agent)[2].replace(/_/g, '.')) {
						device = 'ios';
					}
					if (/iPhone/.test(agent)) {
						device = 'iphone';
					}
					if (/iPad/.test(agent)) {
						device = 'ipad';
					}
				}
				if (/Android/.test(agent)) {
					device = 'android';
				}
				if (/webOS\//.test(agent)) {
					device = 'webos';
				}
				if (/(Intel|PPC) Mac OS X/.test(agent)) {
					device = 'mac';
				}
				if (/Windows NT/.test(agent)) {
					device = 'windows';
				}

				ActiveSession.findOneAndUpdate({ userId: decoded.userId }, {
					$push: {
						'sessions': {
							sessionId: socket.id,
							ipaddress: socket.request.connection.remoteAddress,
							device: device
						}
					}
				}, { upsert: true, new: true })
					.then(() => {
						console.log('socket addSessionRecordSuccess -', socket.id);
					})
					.catch((err) => {
						console.log('socket addSessionRecordError -', socket.id);
					});
			}
		});
	}

	function deleteSessionRecord(token) {
		jwt.verify(token, config.secret, (err, decoded) => {
			if (!err) {
				ActiveSession.updateMany({ userId: decoded.userId }, {
					$pull: {
						'sessions': { 'sessionId': { $in: [socket.id] } }
					}
				})
					.then(() => {
						console.log('socket deleteSessionRecordSuccess -', socket.id);
					})
					.catch((err) => {
						console.log('socket deleteSessionRecordError -', socket.id);
					});
			}
		});
	}

	console.log('socket connection -', socket.id);
	if (socket.handshake.query.token) {
		addSessionRecord(socket.handshake.query.token);
	}

	socket.on('disconnect', (reason) => {
		console.log('socket disconnect -', socket.id, reason)
		if (socket.handshake.query.token) {
			deleteSessionRecord(socket.handshake.query.token);
		}
	});

	socket.on('updateToken', (data) => {
		console.log('socket updateToken -', socket.id);
		socket.handshake.query.token = data;
		if (socket.handshake.query.token) {
			addSessionRecord(socket.handshake.query.token);
		}
	});

	socket.on('notification', (data) => {
		console.log('socket notification -', socket.id, data);
		io.emit('notification', data);
	});

	socket.on('actionOther', (data) => {
		console.log('actionOther', data);
		socket.broadcast.emit('actionOther', data);
	});

	socket.on('event3', (data) => {
		console.log('event3', data.msg);
		socket.emit('event4', {
			msg: 'loud and clear'
		});
	});

});

setInterval(async function () {
	var sockets = await io.fetchSockets()
	var activeSocketIds = []
	for (const socket of sockets) {
		activeSocketIds.push(socket.id)
	}
	console.log('activeSocketIds', activeSocketIds);
	ActiveSession.updateMany({}, {
		$pull: {
			'sessions': { 'sessionId': { $nin: activeSocketIds } }
		}
	})
		.then(() => {
			console.log('socket syncActiveSessionSuccess');
		})
		.catch((err) => {
			console.log('socket syncActiveSessionError', err);
		});
}, 60 * 60 * 1000);
