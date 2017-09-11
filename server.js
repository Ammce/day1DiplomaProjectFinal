var express = require('express');
var Secret = require('./config/secret');
var morgan = require('morgan');
var ejs = require('ejs');

//Running the express
var app = express();





//Middlwere 
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));


//View Engine
app.set('view engine', 'ejs');


//Routes
var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');


//Use routes
app.use(mainRoutes);
app.use(userRoutes);


//Running the server
app.listen(Secret.port, function(err){
    if(err){
        console.log(err);
    }
    else {
        console.log('Server is running on 3000');
    }
});