var Cart = require('../models/cart');

module.exports = function(req, res, next){
    var total = 0;
    var quantity = 0;
   if(req.user){
        Cart.findOne({owner: req.user._id}, function(err, cart){
        if(err){
            return next(err);
        }
        else{
            cartQ = cart;
            next();
            
            for(var i=0; i<cartQ.items.length; i++){
                total += cartQ.items[i].price * cartQ.items[i].quantity;
                quantity++;
            }
            
            cartQ.total = quantity;
            
          
            
        }
    });
    
   }
    else{
        next();
    }
}