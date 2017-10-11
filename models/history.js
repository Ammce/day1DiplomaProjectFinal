var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HistorySchema = Schema({
    
    customer: {type: Schema.Types.ObjectId, ref: 'Use[r'},
    bought: Object,
    date: { type: Date, default: Date.now },
    status: {type: String, default: 'Request accepted! Refresh this page to get more info'}
});

module.exports = mongoose.model('History', HistorySchema);