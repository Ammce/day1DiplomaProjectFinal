var router = require('express').Router();
var User = require('../models/user');
var Product = require('../models/products');
var cors = require('cors');
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


function renderAdminPage(req, res){
    
    
     if(req.user){
        if(req.user.local.isAdmin){
          res.render('admin', {users: req.users, products: req.products, admins: req.admins});
            
        }
        else {
            res.redirect("/profile")
        }
    }
    else{
        res.redirect('/login');
    }
}

router.get('/admin', cors(corsOptions), findUsers, findAdmins, findProducts, renderAdminPage);



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
     category: req.query.category
 };

    if(options.price !== '' && options.category !== undefined){
         Product.find({$and:[{'price': req.query.price}, {'category': req.query.category}]}, function(err, product){
     if(err){ return next(err);
            }
        else{    
        res.render('specify', {items: product});
           
        } 
    }); 
    }
    else if(options.price !== '' || options.category !== undefined){
         Product.find({$or:[{'price': req.query.price}, {'category': req.query.category}]}, function(err, product){
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
        

    }
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
                isFeatured: req.body.isFeatured
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





module.exports = router;

