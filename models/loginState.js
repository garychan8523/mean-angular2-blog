const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const loginStateSchema = new Schema({
  username: { type: String, required: true },
  force_logout: { type: Date, required: false },
  record: [{
    token: { type: String, required: true },
    ipaddress: { type: String, required: false },
    device: { type: String, required: false },
    location: { type: String, required: false },
    loginAt: { type: Date, default: Date.now() },
    expireAt: { type: Date, required: true },
    loggedout: { type: Boolean, default: false },
  }]
}, { usePushEach: true });

module.exports = mongoose.model('LoginState', loginStateSchema);