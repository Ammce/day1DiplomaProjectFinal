var router = require('express').Router();
var Product = require('../models/products');
var passport = require('passport');
var cors = require('cors');
var User = require('../models/user');
var Cart = require('../models/cart');
var History = require('../models/history');
var Secret = require('../config/secret');

var Simplify = require("simplify-commerce"),
    client = Simplify.getClient({
        publicKey: Secret.simplifyPublic,
        privateKey: Secret.simplifyPrivate
    });
var corsOptions = {
    origin: "http://localhost:3000",
    optionSuccessStatus: 200
    
}

router.use( function( req, res, next ) {
    // this middleware will call for each requested
    // and we checked for the requested query properties
    // if _method was existed
    // then we know, clients need to call DELETE request instead
    if ( req.query._method == 'DELETE' ) {
        // change the original METHOD
        // into DELETE method
        req.method = 'DELETE';
        // and set requested url to /user/12
        req.url = req.path;
    }       
    next(); 
});
//This is the logic that doesn't work yet

router.post('/view-product/:product_id', function(req, res, next){
    
    Cart.findOne({owner: req.user._id}, function(err, cart){
    
        cart.items.push({
            item: req.body.product_id,
            name: req.body.item,
            quantity: req.body.quantity, 
            price: req.body.price,
            image: req.body.imageURL,
            category: req.body.category,
            store: req.body.store
        });
        
        cart.total += parseInt(req.body.price);
        
        cart.save(function(err){
            if(err){
                return next(err);
            }
            else{
                res.redirect('/cart');
            }
        });
    });  
});

router.get('/cart', function(req, res, next){
     var CartQ;
     var productQ;
     if(req.user){
           Cart.findOne({owner: req.user._id}, function(err, cart){  
                if(err){
                    return next(err);
                    }
                else{
                    /*
                    for(var i=0; i<cart.items.length; i++){
                        
                        Product.findOne({_id: cart.items[i].item}, function(err, product){
                            if(err){
                                return next(err);
                            }
                            else{
                             productQ = product;
                            console.log(cart[0]);
                             
                            }
         
                        });
                        
                           
                    } */
                    
                    

                    cartQ = cart; 
                    
                res.render('cart', {cart: cartQ, messages: req.flash('itemRemove')});     
                    }});
     }
         else{
                 res.redirect('/login');
             }
});

//Not working, ahhh
router.get('/remove/:cart_item', cors(corsOptions), function(req, res, next){

    if(req.user){
        Cart.findOne({owner: req.user._id}, function(err, cart){
            if(err){
                return next(err);
            }
            else{
                for(var i=0; i<cart.items.length; i++){
                    if(cart.items[i].item == req.params.cart_item){
                        cart.total -= parseInt(cart.items[i].price);
                        cart.items.splice(i, 1);  
                    }
                } 
                cart.save(function(err){
                    if(err){
                        console.log(err);
                    }
                    else{
                        req.flash('itemRemove', 'Item removed from the cart!');
                        res.redirect('/cart');
                    }
                });
            }
            
         
        });
    }
    else{
        res.redirect('/login');
    }
    
});



router.get('/searchtext', function(req, res, next){
    Product.find(
      {$text: {$search: req.query.searchterm}
  }, function(err, found){
      if(err){
          return next(err);
      }
      else{
          if(!found){
              res.render('products', {items: 'Not found'});
          }
          else{
              res.render('products', {items: found});
          }
      }
  });
});

//Find one by id and send it back



function findProductz(req, res, next){
     Product.findOne({
        _id: req.params.product_id
    })
        .exec(function(err, product){
        if(err){ return next(err);
               }
        else{
            req.product = product;
            next();
            
            
        }
    });
}
function findSimilar(req, res, next){
   
       Product.findOne({
        _id: req.params.product_id
    })
        .exec(function(err, product){
        if(err){ return next(err);
               }
        else{
            Product.findRandom().where('category').equals(product.category).limit(5).exec(function (err, products) {
            req.similar = products;
            next();
});
            
            
        }
    });
    
}

router.get('/view-product/:product_id', isLoggedIn,  findProductz ,  cors(corsOptions), findSimilar, function(req, res, next){
   res.render('view-product', {single: req.product, similar: req.similar});

});




router.get('/thankyou', function(req, res, next){
    res.render('thankyou');
});





//LogIn and Singup routes will be bellow

router.get('/login', function(req, res, next){
    if(req.user){
        res.redirect('/profile');
    } 
    else if(req.facebook){
        res.redirect('/profile');
    }
    else{
        res.render('login.ejs', { message: req.flash('loginMessage') });
    }
});

router.post('/login', passport.authenticate('local-login', {
        successRedirect : '/products', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));



router.get('/signup', function(req, res, next){
    
    if(req.user){
        res.redirect('/products');
    } 
    else if(req.facebook){
        res.redirect('/products');
    }
    else{
        res.render('signup.ejs', {message: req.flash('signupMessage')});
    }
    
});

router.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/products', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


//FACEBOOK ROUTES //
//              // 

router.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email' ] }));

	// handle the callback after facebook has authenticated the user
	router.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}));



function findUser(req, res, next){
    User.findOne({_id: req.user._id}, function(err, user){
        if(err){
            return next(err);
        }
        else{ 
            req.userrr = user;  
            next();
        }
    });
}

function findCart(req, res, next){
    Cart.findOne({owner: req.user._id}, function(err, founded){
        if(err){
            console.log(err);
        }
        else{
            req.dataCart = founded;  
            next();
         }
      });  
 }


function createHistory(req, res, next){
      var history = new History();
    history.customer = req.userrr;
    history.bought = req.dataCart;
    history.date = Date.now();
    history.address = req.body.address;
    history.telephone = req.body.telephone;
    history.paymentCash = true;
    history.store = req.body.store;
    
    history.save(function(err){
        if(err){
            return next(err);
        }
        else{
            
           next();
        }
    });
}

function createDebitHistory(req, res, next){
      var history = new History();
    history.customer = req.userrr;
    history.bought = req.dataCart;
    history.date = Date.now();
    history.address = req.body.address;
    history.telephone = req.body.telephone;
    history.paymentCash = false;
    history.store = req.body.store;
    
    history.save(function(err){
        if(err){
            return next(err);
        }
        else{
            
             client.payment.create({
        amount: req.dataCart.total*100,
        description: 'Paying for BuyTonight',
        currency: "USD", 
        card: {
            expMonth: req.body.mm,
            expYear:req.body.yy,
            name: req.body.name,
            cvc : req.body.cvc,
            number: req.body.card,
            
        }
    }, function(err, data){
        if(err){
            return next(err);
        }
        else{
            next();
        }
    });
        }
    });
  
}

function emptyCart(req, res, next){
    Cart.findOne({owner: req.user._id}, function(err, cart){
        if(err){
            return next(err);
        }
        else{
            cart.set({
                items: [],
                total: 0
            })
        }
        cart.save(function(err){
            if(err){
                return next(err);
            }
            else{
                return next();
            }
        });
    });
}


router.post('/chargeCash',findUser, findCart, createHistory,  emptyCart,  function(req, res, next){
  
    
  res.redirect('/profile');
    
    
});

router.post('/chargeCard',findUser, findCart, createDebitHistory, emptyCart,  function(req, res, next){
  
    
    
  res.redirect('/profile');
    
    
});


router.get("/seeOrderHistory/:order_id", function(req, res, next){
    if(req.user){
        
        History.findOne({_id: req.params.order_id}, function(err, history){
         if(err){
             return next(err);
         }   
            else{
                if(history.delivered == true){
                    res.render('sohistory', {history:history});
                }
                else{
                    res.render('stillhistory', {history:history});
                }
            }
        });
        
    }
    else{
        res.redirect('/login');
    }
});


router.post("/confirmDE", function(req, res, next){
    History.findOne({_id: req.body.zxcv}, function(err, history){
        if(err){
            return next(err);
        }
        else{
           history.set({
               delivered: true,
               dateDelivered: Date.now()
           });
            
            history.save(function(err){
                if(err){
                    return next(err);
                }
                else{
                    res.redirect('/profile');
                }
            });
        }
    });
});





function renderHistory(req, res, next){
      History.find({customer: req.user._id}, function(err, history){
          if(err){
              return next(err);
          }
          else{
              req.cartHistory = history;
              next();
              
          }
      });
}


router.get('/profile', isLoggedIn, renderHistory,  function(req, res, next){
    res.render('profile.ejs', {
        user: req.user || req.facebook,  cartHistory: req.cartHistory
    });
});

router.post("/edit-user-profile", function(req, res, next){
   
          User.findOne({_id: req.user._id}, function(err, user){
            if(err){
                return next(err);
            }
            else{
              if(user.local.name !== undefined && user.local.name !== ''){
                  user.set({
                      "local.name": req.body.name,
                      "local.address": req.body.address,
                      "local.picture": req.body.picture
                  });
                  user.save(function(err){
                      if(err){
                          return next(err);
                      }
                      else{
                          res.redirect('/profile');
                      }
                  });
              }
                else{
                    user.set({
                      "facebook.name": req.body.name,
                      "facebook.address": req.body.address,
                      "facebook.picture": req.body.picture
                  });
                  user.save(function(err){
                      if(err){
                          return next(err);
                      }
                      else{
                          res.redirect('/profile');
                      }
                  });
                    
                }
                  
              
            }
            
        });

        
   
});





router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated())
        return next();
    res.redirect('/signup');
}




module.exports = router;