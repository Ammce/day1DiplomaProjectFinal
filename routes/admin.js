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
            next();
        } 
    }); 
    }
    else if(options.price !== '' || options.category !== undefined){
         Product.find({$or:[{'price': req.query.price}, {'category': req.query.category}]}, function(err, product){
     if(err){ return next(err);
            }
        else{    
        res.render('specify', {items: product}); 
            next();
        }   
    }); 
    }
    else{
         Product.find({}, function(err, product){
     if(err){ return next(err);
            }
        else{     
        res.render('specify', {items: product});
            next();
        }    
    }); 
    }
});
  



router.get('/edit-product/:product_id',cors(corsOptions), function(req, res, next){
    Product.findOne({_id: req.params.product_id}, function(err, product){
        if(err){
            return next(err);
        }
        else{   
            res.render('edit-product', {item: product});
        }
    });
});

router.post('/edit-product/:product_id',cors(corsOptions), function(req, res, next){
    Product.findOne({_id: req.params.product_id}, function(err, product){
        if(err){
            return next(err);
        }
        else{
            product.set({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                category: req.body.category
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
});





router.delete('/delete-product/:product_id',cors(corsOptions), function(req, res, next){
    
    Product.findOneAndRemove({_id: req.params.product_id}, function(err, deleted){
     
        if(err){
            return next(err);
        }
        else{
            res.redirect('/products');
        }
        
    });
    
});





module.exports = router;

