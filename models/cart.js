var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CartSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref:'User' },
    total: { type: Number, default: 0 },
    items: [{
        item: { type: Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        quantity: { type: Number, default: 0 },
        price: {type: Number, default: 0},
        image: String,
        category: String,
        store: String
        
        
    }]
    
});

module.exports = mongoose.model('Cart', CartSchema);

