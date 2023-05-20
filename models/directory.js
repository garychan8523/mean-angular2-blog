const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const directorySchema = new Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    directory: [{
        path: { type: String, required: true },
        content: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
    }]
}, { usePushEach: true });

module.exports = mongoose.model('Directory', directorySchema);