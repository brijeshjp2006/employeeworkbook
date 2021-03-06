//routing app requests 
module.exports=function(app, passport){
	//homepage is login/signup page
	app.get('/', function(req, res){
		if (req.isAuthenticated()){
			res.render('profile.ejs', {
				user : req.user
			});
		}else{
			res.render('index.ejs');
		}
	});

	//login page with login form
	app.get('/login', function(req, res){
		//show page with flas data
		if (req.isAuthenticated()){
			res.render('profile.ejs', {
				user : req.user
			});
		}else{
			res.render('login.ejs', { message: req.flash('loginMessage') });
		}
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

    // show the signup form
	app.get('/signup', function(req, res) {
		//show page with flas data
		if (req.isAuthenticated()){
			res.render('profile.ejs', {
				user : req.user
			});
		}else{
			// render the page and pass in any flash data if it exists
			res.render('signup.ejs', { message: req.flash('signupMessage') });
		}
		
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});
 
	//logout
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/'); 
	});
};	


//routing middleware to check authentication
function isLoggedIn(req, res, next){
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}