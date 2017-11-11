var router = require('express').Router();
var Cart = require('../models/cart');
var Product = require('../models/products');
var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');
var mongoose = require('mongoose');



router.post('/tester', function(req, res, next){
    req.flash('info', 'You sent something');
    res.redirect('/about');
});

router.get('/about',  function(req, res, next){
    if(req.user){
            Product.findRandom().where('category').equals('Electronics').limit(2).exec(function (err, songs) {
            console.log(songs);
            res.render('about', { messages: req.flash('info') });
});
    
        }
    else{
        res.redirect('/');
    }
});

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

function counter(req, res, next){
    var counter = 0;
    counter++;
    console.log(counter);
    next();
}

function renderHomePage(req, res){
    res.render('home', {featured: featuredItems});
}

router.get('/', counter, featured, renderHomePage);


router.post('/contact', function(req, res, next){
    
    // username : fagmtf3ixy43ue72@ethereal.email
    // password: 8N5UJeEmShBxAYKjuu
    
    
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
           user: 'fagmtf3ixy43ue72@ethereal.email',
           pass: '8N5UJeEmShBxAYKjuu' 
        }
    });
    
    var mailOptions = {
        from: req.body.email,
        to: 'fagmtf3ixy43ue72@ethereal.email',
        subject: 'Question from website',
        text: req.body.message
        
    };
    
    var thankyou = {
        from: 'fagmtf3ixy43ue72@ethereal.email',
        to: req.body.email, 
        subject: 'Question from website',
        text: 'Thank you for sending us an e-mail. We will answer within 24h.'
    };
    
    transporter.sendMail(mailOptions, function(err, info){
        if(err){
            console.log(err);
        }
        else{
            console.log('Message Sent', info.messageId);
            transporter.sendMail(thankyou, function(err, info){
                if(err){
                    console.log(err);
                }
                else{
                    console.log('Auto Thank you message sent', info.messageId);
                    res.redirect('/');
                }
            });
        }
    });
    
});







module.exports = router;