var router = require('express').Router();
var Product = require('../models/products');



router.get('/profile/:name', function(req, res, next){
    if(req.params.name){
    res.render('users', {user: req.params.name});
        }
    else{
        res.render('users', {user: 'Not existing user'});
    }
});


//Find all products and send them to the front end

router.get('/products', function(req, res, next){
    
    Product.find({}, function(err, result){
        if(err){
            return next(err);
        }
        else{
          res.render('products', {items: result});  
        }
    });
      
});

//Find one by id and send it back

router.get('/buy-product/:product_id', function(req, res, next){
    Product.findOne({
        _id: req.params.product_id
    })
        .exec(function(err, product){
        if(err){ return next(err);
               }
        else{
            console.log(product);
            res.render('buy-product', {single: product});
        }
    });
});







module.exports = router;