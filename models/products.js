var mongoose = require('mongoose');
var random = require('mongoose-random');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    name: String,
    description: String,
    price: Number,
    category: String,
    image: String,
    store: String,
    isFeatured: {type: Boolean, default: false}
    
});

ProductSchema.index({'$**': 'text'});
ProductSchema.plugin(random, { path: 'r' });
module.exports = mongoose.model('Product', ProductSchema);

