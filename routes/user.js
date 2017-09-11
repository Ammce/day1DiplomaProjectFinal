var router = require('express').Router();

router.get('/profile', function(req, res, next){
    res.render('users', {user: 'Not existing user'});
});

router.get('/profile/:name', function(req, res, next){
    res.render('users', {user: req.params.name});
});

router.get('/products', function(req, res, next){
    var items = ['Smartphones','Cars', 'Bikes','Houses','Computers'];
    res.render('products', {items: items});
});



module.exports = router;