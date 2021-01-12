const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const public = require('./routes/public')(router);
const authentication = require('./routes/authentication')(router);
const profile = require('./routes/profile')(router)
const blogs = require('./routes/blogs')(router);


const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 8080;

var server = app.listen(port, () => {
	console.log('Listening on port ' + port);
});
var io = require('socket.io').listen(server);

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
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

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));
app.use('/authentication', authentication);
app.use('/profile', profile);
app.use('/blogs', blogs);

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
	console.log('a new connection.');

	socket.on('notification', (data) => {
		console.log(data);
		io.emit('notification', data.msg);
	});

	socket.on('actionOther', (data) => {
		console.log(data);
		socket.broadcast.emit('actionOther', data.act);
	});

	socket.on('event3', (data) => {
		console.log(data.msg);
		socket.emit('event4', {
			msg: 'loud and clear'
		});
	});

});
