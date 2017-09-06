const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const authentication = require('./routes/authentication')(router);
const bodyParser = require('body-parser');
const cors = require('cors');

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
	if (err) {
		console.log('Could NOT connect to databse: ', err);
	} else {
		console.log('Connected to databse: ' + config.db);
	}
});

// middleware: start
app.use(cors({
	origin: 'http://localhost:4200'
}));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(express.static(__dirname + '/client/dist/'));
app.use('/authentication', authentication);
// moddileware: end

app.get('*', (req, res) => {
  //res.send('<h1>Hello World</h1>');
  res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

app.listen(8080, () => {
	console.log('Listening on port 8080');
});
