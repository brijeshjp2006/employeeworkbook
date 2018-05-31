//setup all requirements
var express=require('express');
var session=require('express-session');
var cookieParser=require('cookie-parser');
var bodyParser = require('body-parser');
var morgan=require('morgan');
var app=express();
var port=process.env.PORT || 8080;
var passport=require('passport');
var flash=require('connect-flash'); 

// passport config
require('./config/passport')(passport); // pass passport for configuration

// set up our express app
var path = require('path');
app.use(express.static(path.join(__dirname, 'views')))
// log every request to the console
app.use(morgan('dev')); 
// read cookies (needed for auth)
app.use(cookieParser()); 
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

// set up ejs for templating
app.set('view engine', 'ejs');

// required for passport
app.use(session({
	secret: 'developwithwebgensis',
	resave: true,
	saveUninitialized: true
 } )); // session secret

app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());
// use connect-flash for flash messages stored in session 
app.use(flash());

// load our routes and pass in our app and fully configured passport
require('./app/routes.js')(app, passport); 

// launch
app.listen(port);
console.log('Working on port ' + port);