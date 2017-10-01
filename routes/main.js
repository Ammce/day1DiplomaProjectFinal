var router = require('express').Router();
var Cart = require('../models/cart');
var Product = require('../models/products');
//Getting home page:


function featured(req, res, next){
    
    Product.find({isFeatured: true}, function(err, featured){
        if(err){
            return next(err);
        }
        else{
           featuredItems = featured;
            next();
        }
    });
}

function commAboutSite(req, res, next){
    
}

function renderHomePage(req, res){
    res.render('home', {featured: featuredItems});
}

router.get('/', featured, renderHomePage);

router.get('/about',  function(req, res, next){
    
    res.render('about');
});





module.exports = router;