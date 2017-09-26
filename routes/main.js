var router = require('express').Router();
var Cart = require('../models/cart');

//Getting home page:



router.get('/',  function(req, res, next){
    var studentName = 'Amel Amce Muminovic';
    var courses = ['javascript', 'c++', 'nodejs', 'express'];
    
    res.render('home', {name: studentName, subjects: courses} );
});

router.get('/about',  function(req, res, next){
    
    res.render('about');
    
});





module.exports = router;