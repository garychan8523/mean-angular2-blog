const fs = require('fs');
const https = require('https');

const express = require('express');
const app = express();

const privateKey = (process.env.ENV && process.env.ENV == 'PRD') ? fs.readFileSync('./privkey.pem') : undefined;
const certificate = (process.env.ENV && process.env.ENV == 'PRD') ? fs.readFileSync('./cert.pem') : undefined;
const credentials = (process.env.ENV && process.env.ENV == 'PRD') ? { key: privateKey, cert: certificate } : undefined;

const fileUpload = require('express-fileupload');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('./config/database');
const path = require('path');
const public = require('./routes/public')(router);
const authentication = require('./routes/authentication')(router);
const profile = require('./routes/profile')(router)
const blogs = require('./routes/blogs')(router);
const upload = require('./routes/upload')(router);

const ActiveSession = require('./models/activeSession');

var requestIp = require('request-ip');

const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 8080;

let server;

if (process.env.ENV && process.env.ENV == 'PRD') {
	server = https.createServer(credentials, app);
	server.listen(port);
	console.log('Listening on port ' + port);
} else {
	server = app.listen(port, () => {
		console.log('Listening on port ' + port);
	});
}

var io = require('socket.io').listen(server);

mongoose.Promise = global.Promise;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(config.uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
	if (err) {
		console.log('Could NOT connect to databse: ', err);
	} else {
		console.log('Connected to database: ' + config.db);
	}
});

// middleware: start
if (process.env.ENV && process.env.ENV == 'PRD') {
	app.use(cors({
		origin: [process.env.CLOUD_SERVER, process.env.DN_SERVER],
		credentials: true
	}));
} else {
	app.use(cors({
		origin: ['http://localhost:4200'],
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
				ActiveSession.findOneAndUpdate({ userId: decoded.userId }, {
					$push: {
						'sessions': {
							sessionId: socket.id,
							ipaddress: 'ip-adress',
							device: 'device-name'
						}
					}
				}, { upsert: true },
					(err) => {
						if (err) {
							console.log('socket addSessionRecordError -', socket.id);
						} else {
							console.log('socket addSessionRecordSuccess -', socket.id);
						}
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
				}, (err) => {
					if (err) {
						console.log('socket deleteSessionRecordError -', socket.id);
					} else {
						console.log('socket deleteSessionRecordSuccess -', socket.id);
					}
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

setInterval(function () {
	let activeSocketIds = Object.keys(io.sockets.clients().connected);
	console.log('activeSocketIds', activeSocketIds);
	ActiveSession.updateMany({}, {
		$pull: {
			'sessions': { 'sessionId': { $nin: activeSocketIds } }
		}
	}, (err) => {
		if (err) {
			console.log('socket syncActiveSessionError', err);
		} else {
			console.log('socket syncActiveSessionSuccess');
		}
	});

}, 60 * 60 * 1000);
