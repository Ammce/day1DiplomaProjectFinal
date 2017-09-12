var express = require('express');
var Secret = require('./config/secret');
var morgan = require('morgan');
var ejs = require('ejs');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


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
app.use(bodyParser.urlencoded({ extended: true}));



//View Engine

app.set('view engine', 'ejs');


//Routes
var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');
var adminRoutes = require('./routes/admin');


//Use routes
app.use(mainRoutes);
app.use(userRoutes);
app.use(adminRoutes);


//Running the server
app.listen(Secret.port, function(err){
    if(err){
        console.log(err);
    }
    else {
        console.log('Server is running on 3000');
    }
});