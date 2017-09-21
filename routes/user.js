var router = require('express').Router();
var Product = require('../models/products');
var passport = require('passport');
var cors = require('cors');


var corsOptions = {
    origin: "http://localhost:3000",
    optionSuccessStatus: 200
    
}



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

router.get('/view-product/:product_id', cors(corsOptions), function(req, res, next){
    Product.findOne({
        _id: req.params.product_id
    })
        .exec(function(err, product){
        if(err){ return next(err);
               }
        else{
            console.log(product);
            res.render('view-product', {single: product});
        }
    });
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
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));



router.get('/signup', function(req, res, next){
    
    if(req.user){
        res.redirect('/profile');
    } 
    else if(req.facebook){
        res.redirect('/profile');
    }
    else{
        res.render('signup.ejs', {message: req.flash('signupMessage')});
    }
    
});

router.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
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


router.get('/profile', isLoggedIn, function(req, res, next){
    res.render('profile.ejs', {
        user: req.user || req.facebook
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