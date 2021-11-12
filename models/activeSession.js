const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const activeSessionSchema = new Schema({
    userId: { type: String, required: true },
    sessions: [{
        sessionId: { type: String, required: true },
        ipaddress: { type: String, required: false },
        device: { type: String, required: false }
    }]
}, { usePushEach: true });

module.exports = mongoose.model('ActiveSession', activeSessionSchema);