var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var User = mongoose.model('User');

module.exports =  new LocalStrategy({
	    // by default, local strategy uses username and password, we will override with email
	    usernameField : 'username',
	    passwordField : 'password',
	    passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
	},
	function(req, username, password, done) {
	     User.findOne({username : username},function(err,user){
	      // asynchronous
	       
	      process.nextTick(function() {
	        if (err) return done(err);
	        // if no user is found, return the message
	       if (!user)
	          return done(null, false, req.flash('loginMessage', 'No user found.'));
	        if (!user.validPassword(password))
	          return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
	        else          
	            done(null,user);         
	      });
	    });
	});