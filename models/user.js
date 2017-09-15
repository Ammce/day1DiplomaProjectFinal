var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    
    local : {
        email: {type: String, unique: true, lowercase: true},
        password: String,
        name: String,
        address: String, 
        picture: {type: String, default: ''}
    },
    
    facebook         : {
        id           : String,
        token        : String,
        email        : {type: String, unique: true, lowercase: true},
        name         : String,
        picture: {type: String, default: ''}
    }
    
    
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);