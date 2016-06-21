var mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	User = mongoose.model('User'),
	utils = require('./utils');

module.exports = function(){
	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		User.findOne({ _id: id }, function(err, user){
			done(err, user);
		});
	});

	passport.use(new LocalStrategy({
		// by default local strategy uses username and password, will override with email
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback: true
	}, function(req, email, password, done){
		User.findOne({ email: email }, function(err, user){
			if(err){
				return done(err);
			}

			if(!user){
				return done(null, false, { message:  'Incorrect email.' });
			}

			if(!user.validPassword(password)){
				return done(null, false, { message : 'Incorrect password.' });
			}

			return done(null, user);
		});
	}));

	passport.use('local-signup', new LocalStrategy({
		// by default, local strategy uses username and password, will override with email
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	}, function(req, email, password, done){
		// asynchronous
		// User.findOne won't fire unless data is sent back
		
		process.nextTick(function(){

			// Determine if user trying to login exists
			User.findOne({ "email" : email }, function(err, user){
				if(err){
					return done(err);
				}

				// Check to see if their's a user with that email
				if(user){
					return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
				} else {
					var newUser = new User();

					newUser.email = email;
					newUser.password = utils.toMd5(password);
					newUser.save(function(err){
						if(err)
							throw err;
						return done(null, newUser);
					});
				}
			});
		});
	}));
};