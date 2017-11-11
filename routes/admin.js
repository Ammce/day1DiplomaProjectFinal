var router = require('express').Router();
var User = require('../models/user');
var Product = require('../models/products');
var History = require('../models/history');
var Cart = require('../models/cart');
var cors = require('cors');
var mongoose = require('mongoose');
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


function findAdmins(req, res, next){
    User.find({'local.isAdmin': true}, function(err, admirs){
        if(err){
            return next(err);
        }
        else{
            req.admins = admirs;
            next();
        }
    });
}

function findUsers(req, res, next){
            User.find({}, function(err, users){
                if(err){
                    return next(err);
                }
                else{
                    req.users = users; 
                    next();
                }
            });
}

function findProducts(req, res, next){
    Product.find({}, function(err, product){
        if(err){
            return next(err);
        }
        else{
            req.products = product;
            next();
        }
    });
}

function findHistories(req, res, next){
    History.find({}, function(err, histories){
        if(err){
            return next(err);
        }
        else{
            req.histories = histories;
            next();
        }
    });
}





function renderAdminPage(req, res){
    
    
     if(req.user){
        if(req.user.local.isAdmin){
          res.render('admin', {users: req.users, products: req.products, admins: req.admins, histories: req.histories});
            
        }
        else {
            res.redirect("/profile")
        }
    }
    else{
        res.redirect('/login');
    }
}

router.get('/admin', cors(corsOptions), findUsers, findAdmins, findProducts, findHistories, renderAdminPage);



//Find all products and send them to the front end

router.get('/products', function(req, res, next){
    
    Product.find({}, function(err, result){
        if(err){
            return next(err);
        }
        else{
            if(req.user){
                res.render('products', {items: result});
            }
            else{
                res.redirect('/signup');
            }
            
        }
    });
      
});


router.get('/test', function(req, res, next){
    /*User.find({}).where('local.name').equals('Amel Muminovic').sort('-address').exec(function(err, user){
        if(err){
            return next(err);
        }
        else{
            res.json(user);
        }
    }); */
    
    Product.find({store: 'rolex'}, function(err, items){
        if(err){
            return next(err);
        }
        else{
            console.log(items);
        }
    });
});



router.get('/add-product', cors(corsOptions), function(req, res, next){
 
    if(req.user){
        if(req.user.local.isAdmin){
            res.render('add-product');
        }
        else {
            res.redirect('/');
        }
    }
    else{
        res.redirect('/');
    }
 
});

router.post('/add-product' ,cors(corsOptions), function(req, res, next){
    var product = new Product();
    
    product.name = req.body.name;
    product.description = req.body.description;
    product.price = req.body.price;
    product.category = req.body.category;
    product.image = req.body.image;
    product.store = req.body.store;
    
    product.save(function(err, product){
        if(err){
            return next(err);
        }
        else{
            res.redirect('/add-product');
        }
    });
});

router.get('/products/specify',cors(corsOptions), function(req, res, next){
    
 var options = {
     price: req.query.price,
     category: req.query.category,
     store: req.query.store
     
 };
    
  
    
    if(req.query.category !== undefined && req.query.store !== undefined){

    Product.find({$and: [{category: req.query.category}, {store: req.query.store}]}, function(err, products){
        if(err){
            return next(err);
        }
        else{
          res.render('specify', {items: products});  
        }
    });
        }
   else if(req.query.category !== undefined || req.query.store !== undefined){

    Product.find({$or: [{category: req.query.category}, {store: req.query.store}]}, function(err, products){
        if(err){
            return next(err);
        }
        else{
          res.render('specify', {items: products});  
        }
    });
        }
    else{
        res.redirect('/products');
    } 
    
/*    

Product.find({}).where("category").equals(req.query.category).exec(function(err, products){
    if(err){
        return next(err);
    }
    else{
      res.render('specify', {items: products});
      
    }
    
});
*/
/*    
    
Product.find({}).where("store").equals(req.query.store).exec(function(err, products){
    if(err){
        return next(err);
    }
    else{
      res.render('specify', {items: products});
      
    }
    
});

*/

/* Working for PRICE    
if(req.query.priceFrom !== '' && req.query.priceTo !== ''){
  Product.find({$and:[{price: { $gt: req.query.priceFrom }}, {price: { $lt: req.query.priceTo }}]}, function(err, products){
      if(err){
          return next(err);
      }
      else{
          next();
          console.log(products);
          console.log(req.query.category);
      }
  });  
  }
else if(req.query.priceFrom == ''){
  Product.find({price: {$lt: req.query.priceTo}}, function(err, products){
      if(err){
          return next(err);
      }
      else{
          next();
          console.log(products);
      }
  });  
  }
else if(req.query.priceTo == ''){
  Product.find({price: {$gt: req.query.priceFrom}}, function(err, products){
      if(err){
          return next(err);
      }
      else{
          next();
          console.log(products);
      }
  });  
  } */
      
 /*
    if(options.price !== '' && options.category !== undefined && options.store !== undefined){
         Product.find({$and:[{'price': req.query.price}, {'category': req.query.category}, {'store': req.query.store}]}, function(err, product){
     if(err){ return next(err);
            }
        else{    
        res.render('specify', {items: product});
           
        } 
    }); 
    }
    else if(options.price !== '' || options.category !== undefined || options.store !== undefined){
         Product.find({$or:[{'price': req.query.price}, {'category': req.query.category}, {'store': req.query.store}]}, function(err, product){
     if(err){ return next(err);
            }
        else{    
        res.render('specify', {items: product}); 
           
        }   
    }); 
    }
    else{
         Product.find({}, function(err, product){
     if(err){ return next(err);
            }
        else{     
        res.render('specify', {items: product});
            
        }    
    }); 
        

    } */
});
  




router.get('/edit-product/:product_id',cors(corsOptions), function(req, res, next){

     if(req.user){
        if(req.user.local.isAdmin){
              Product.findOne({_id: req.params.product_id}, function(err, product){
        if(err){
            return next(err);
        }
        else{   
            res.render('edit-product', {item: product});
        }
    });
            
        }
        else {
            res.redirect("/buy-product/" + req.params.product_id)
        }
    }
    else{
        res.redirect('/login');
    }
});

router.post('/edit-product/:product_id',cors(corsOptions), function(req, res, next){
 


if(req.user){
        if(req.user.local.isAdmin){
            Product.findOne({_id: req.params.product_id}, function(err, product){
        if(err){
            return next(err);
        }
        else{
            product.set({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                category: req.body.category,
                isFeatured: req.body.isFeatured,
                store: req.body.store,
                image: req.body.image
            });
        
        product.save(function(err){
            if(err){
                return next(err);
            }
            else{
                res.redirect('/products');
            }
        });
        }
    });
            
        }
        else {
            res.redirect("/profile")
        }
    }
    else{
        res.redirect('/login');
    }

});


router.delete('/delete-product/:product_id',cors(corsOptions), function(req, res, next){
    
    if(req.user){
        if(req.user.local.isAdmin){
            Product.findOneAndRemove({_id: req.params.product_id}, function(err, deleted){
     
                if(err){
                    return next(err);
                }
                else{
                    res.redirect('/products');
                }

            });
            
        }
        else {
            res.redirect("/profile")
        }
    }
    else{
        res.redirect('/login');
    }

});

router.delete('/delete-user/:user_id', cors(corsOptions), function(req, res, next){
    
    if(req.user){
        if(req.user.local.isAdmin){
            User.findOneAndRemove({_id: req.params.user_id}, function(err,deleted){
                if(err){
                    return next(err);
                }
                else{
                    res.redirect('/admin');
                }
            });
        }
        else{
            res.redirect('/profile');
        }
    }
    else{
        res.redirect('/login');
    }
    
});


router.get('/admin/:profile_id', function(req, res, next){
    
    User.findOne({_id : req.params.profile_id}, function(err, user){
        if(err){
            return next(err);
        }
        else{
            res.render('edit-profile', {user: user});
        }
    });
    
});

router.post('/admin/:profile_id', function(req, res, next){
    
    User.findOne({_id: req.params.profile_id}, function(err, user){
        
        if(err){
            return next(err);
        }
        else{
            
            user.set({
                'local.name': req.body.name,
                'local.isAdmin': req.body.isAdmin
                
            });
            
            user.save(function(err){
                if(err){
                    return next(err);
                }
                else{
                    res.redirect('/admin');
                }
            });
        }
        
    });
});


function findOrders(req, res, next){
    History.find({}, function(err, histories){
        if(err){
            return next(err);
        }
        else{
           req.histories = histories;
            next();
        }
    });
}

router.get('/orders', findOrders, function(req, res, next){
    
    if(req.user){
        if(req.user.local.isAdmin || req.user.facebook.isAdmin){
            
            res.render('orders', { histories: req.histories});
            
        }
        else{
            res.redirect('/');
        }
    }
    else{
        res.redirect('/');
    }
    
});


router.get('/order/:order_id', function(req, res, next){
    
    var user1;
    
    History.findOne({_id: req.params.order_id}, function(err, order){
        if(err){
            return next(err);
        }
        else{
           
            req.order = order;
            User.findOne({_id: order.customer}, function(err, user){
                if(err){
                    return next(err);
                }
                else{
                   
                    res.render('order', {order: req.order, user: user});
                    
                }
            });
            
        }
    });
});

router.post('/changeStatus/:order_id', function(req, res, next){
    History.findOne({_id: req.params.order_id}, function(err, order){
        if(err){
            return next(err);
        }
        else{
            if(req.body.status == 'buying'){
                order.status = "Buying in progress";
                order.delivered = false;
            }
            else if(req.body.status == 'orderAccepted'){
                order.status = "Order Accepted";
                order.delivered = false;
            }
            else if(req.body.status == 'onway'){
                order.status = "Shipping to Address";
                order.delivered = false;
            }
            else if(req.body.status == 'delivered'){
                order.status = "Order Delivered";
                order.delivered = true;
                order.dateDelivered = Date.now();
                
            }
            
            order.save(function(err){
                if(err){
                    return next(err);
                }
                else{
                    if(req.body.status == 'delivered'){
                        res.redirect('/orders');
                    }
                    else{
                        res.redirect('/order/' + req.params.order_id);
                    }
                }
            });
        }
        
    });
});

router.post("/searchOrder", isAdm, function(req, res, next){
    
    if(mongoose.Types.ObjectId.isValid(req.body.searchOrder)){
    History.findOne({_id: req.body.searchOrder}, function(err, order){
        if(err){
            return next(err);
        }
        else{
            if(order.address.length>0){
                res.redirect("/order/" + order._id);
            }
            else{
                res.redirect('/products');
            }
        }
    });
        }
    else{
        res.redirect('/orders');
    }
});

function isAdm(req, res, next){
    if(req.user){
        if(req.user.local.isAdmin){
            next();
        }
        else{
            res.redirect('/profile');
        }
    }
    else{
        res.redirect('/login');
    }
}


module.exports = router;

