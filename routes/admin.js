var router = require('express').Router();
var Product = require('../models/products');


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


router.get('/add-product', function(req, res, next){
    res.render('add-product');
});

router.post('/add-product', function(req, res, next){
    var product = new Product();
    
    product.name = req.body.name;
    product.description = req.body.description;
    product.price = req.body.price;
    product.category = req.body.category;
    
    product.save(function(err, product){
        if(err){
            return next(err);
        }
        else{
            res.redirect('/add-product');
        }
    });
});

router.get('/edit-product/:product_id', function(req, res, next){
    Product.findOne({_id: req.params.product_id}, function(err, product){
        if(err){
            return next(err);
        }
        else{   
            res.render('edit-product', {item: product});
        }
    });
});

router.post('/edit-product/:product_id', function(req, res, next){
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





router.delete('/delete-product/:product_id', function(req, res, next){
    
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

