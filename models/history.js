var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HistorySchema = Schema({
    
    customer: {type: Schema.Types.ObjectId, ref: 'User'},
    bought: Object,
    date: { type: Date, default: Date.now },
    dateDelivered: { type: Date },
    address: String,
    telephone: Number,
    delivered: {type: Boolean, default: false},
    status: {type: String, default: 'Order accepted!'},
    paymentCash: {type: Boolean},
    store: String
});

module.exports = mongoose.model('History', HistorySchema);