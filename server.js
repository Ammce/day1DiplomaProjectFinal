var express = require('express');
var Secret = require('./config/secret');
var morgan = require('morgan');
var ejs = require('ejs');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var cors = require('cors');
var MongoStore = require('connect-mongo')(session);
var multer = require('multer');
var upload = multer({dest: 'public/images/' });
var cartFun = require('./custom/cartFun');

//Running the express
var app = express();


//Connect to the database :)

mongoose.connect(Secret.database, function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log('Connected to the db');
    }
});

//Middlwere 
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(session({
    secret: 'iwannabetheverybestlikenooneeverwas',
    resave: true, 
    saveUninitialized: false,
    store: new MongoStore({  mongooseConnection: mongoose.connection}),
    cookie: { maxAge: 60 * 60 * 1000} //Time of session expiration
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(cors());



//Teach express to use local variables everywhere for example in nav bar
app.use(function(req, res, next){
    res.locals.user = req.user;
    res.locals.session = req.session;
    next();
});


//View Engine

app.set('view engine', 'ejs');


//Routes
var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');
var adminRoutes = require('./routes/admin');
require('./config/passport')(passport); 

app.use(cartFun);

//Use routes
app.use(mainRoutes);
app.use(userRoutes);
app.use(adminRoutes);



//Testing uploads

app.get('/upload', function(req, res, next){
    res.render('upload');
});

app.post('/upload', upload.single('photo'), function(req, res, next){
    console.log(req.file);
    res.redirect('/upload');
});

//Testing

//404
app.get('*', function(req, res, next){

  res.render('404');

});

//Running the server
app.listen(Secret.port, function(err){
    if(err){
        console.log(err);
    }
    else {
        console.log('Server is running on 3000');
    }
});