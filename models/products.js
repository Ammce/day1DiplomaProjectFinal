var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    name: String,
    description: String,
    price: Number,
    category: String,
    image: String
    
});

ProductSchema.index({'$**': 'text'});

module.exports = mongoose.model('Product', ProductSchema);