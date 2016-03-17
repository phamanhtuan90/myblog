var mongoose = require('mongoose');
var User = mongoose.model('User');
var local = require('./passport/local');
module.exports = function (passport, config) {
	passport.serializeUser(function(user, done) {
	    done(null, user._id);
	});
	  // used to deserialize the user
	passport.deserializeUser(function(id, done) {
	    User.findById(id, function(err, user) {
	        done(err, {_id:user.id,avatar:user.avatar,email:user.email});
	    });
	});

	// use these strategies
    passport.use(local);
}