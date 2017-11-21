var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    
    local : {
        email: String,
        password: String,
        name: String,
        address: String, 
        picture: {type: String, default: 'http://pngimages.net/sites/default/files/user-png-image-15189.png'},
        isAdmin: {type: Boolean, default: false}
        
    },
    
    facebook         : {
        id           : String,
        token        : String,
        address      : String,
        email        : String,
        name         : String,
        picture: {type: String, default: 'http://pngimages.net/sites/default/files/user-png-image-15189.png'},
        isAdmin: {type: Boolean, default: false}
        
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