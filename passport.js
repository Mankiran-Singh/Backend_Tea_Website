const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;

exports.googleLogin=passport.use(
	new GoogleStrategy({
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: "/auth/google/callback",
			scope: ["profile", "email"],
		},function (accessToken, refreshToken, profile, callback) {
			callback(null, profile);
		}
	));

exports.facebookLogin=passport.use(
	new FacebookStrategy({
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: "/auth/facebook/callback",
	  profileFields:['id','displayName','photos','email']
  }, function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));


exports.microsoftLogin=passport.use(
	new MicrosoftStrategy({
			clientID: process.env.MICROSOFT_CLIENT_ID,
			clientSecret: process.env.MICROSOFT_TENANT_ID,
			callbackURL: "/auth/microsoft/callback",
			scope: ['openid', 'profile', 'email']  ,
		},function (accessToken, refreshToken, profile, callback) {
			callback(null, profile);
		}
	));